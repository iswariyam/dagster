"""Facilities for running arbitrary commands in child processes."""


import os
import queue
import sys
from abc import ABC, abstractmethod
from typing import NamedTuple

from dagster import check
from dagster.core.errors import DagsterExecutionInterruptedError
from dagster.utils.error import SerializableErrorInfo, serializable_error_info_from_exc_info
from dagster.utils.interrupts import capture_interrupts


class ChildProcessEvent:
    pass


class ChildProcessStartEvent(
    NamedTuple("ChildProcessStartEvent", [("pid", int)]), ChildProcessEvent
):
    pass


class ChildProcessDoneEvent(NamedTuple("ChildProcessDoneEvent", [("pid", int)]), ChildProcessEvent):
    pass


class ChildProcessSystemErrorEvent(
    NamedTuple(
        "ChildProcessSystemErrorEvent", [("pid", int), ("error_info", SerializableErrorInfo)]
    ),
    ChildProcessEvent,
):
    pass


class ChildProcessCommand(ABC):  # pylint: disable=no-init
    """Inherit from this class in order to use this library.

    The object must be picklable; instantiate it and pass it to _execute_command_in_child_process."""

    @abstractmethod
    def execute(self):
        """This method is invoked in the child process.

        Yields a sequence of events to be handled by _execute_command_in_child_process."""


class ChildProcessCrashException(Exception):
    """Thrown when the child process crashes."""

    def __init__(self, exit_code=None):
        self.exit_code = exit_code
        super().__init__()


def _execute_command_in_child_process(event_queue, command):
    """Wraps the execution of a ChildProcessCommand.

    Handles errors and communicates across a queue with the parent process."""

    check.inst_param(command, "command", ChildProcessCommand)

    with capture_interrupts():
        pid = os.getpid()
        event_queue.put(ChildProcessStartEvent(pid=pid))
        try:
            for step_event in command.execute():
                event_queue.put(step_event)
            event_queue.put(ChildProcessDoneEvent(pid=pid))

        except (
            Exception,
            KeyboardInterrupt,
            DagsterExecutionInterruptedError,
        ):
            event_queue.put(
                ChildProcessSystemErrorEvent(
                    pid=pid, error_info=serializable_error_info_from_exc_info(sys.exc_info())
                )
            )


TICK = 20.0 * 1.0 / 1000.0
"""The minimum interval at which to check for child process liveness -- default 20ms."""

PROCESS_DEAD_AND_QUEUE_EMPTY = "PROCESS_DEAD_AND_QUEUE_EMPTY"
"""Sentinel value."""


def _poll_for_event(process, event_queue):
    try:
        return event_queue.get(block=True, timeout=TICK)
    except queue.Empty:
        if not process.is_alive():
            # There is a possibility that after the last queue.get the
            # process created another event and then died. In that case
            # we want to continue draining the queue.
            try:
                return event_queue.get(block=False)
            except queue.Empty:
                # If the queue empty we know that there are no more events
                # and that the process has died.
                return PROCESS_DEAD_AND_QUEUE_EMPTY

    return None


def execute_child_process_command(multiprocessing_ctx, command):
    """Execute a ChildProcessCommand in a new process.

    This function starts a new process whose execution target is a ChildProcessCommand wrapped by
    _execute_command_in_child_process; polls the queue for events yielded by the child process
    until the process dies and the queue is empty.

    This function yields a complex set of objects to enable having multiple child process
    executions in flight:
        * None - nothing has happened, yielded to enable cooperative multitasking other iterators

        * ChildProcessEvent - Family of objects that communicates state changes in the child process

        * KeyboardInterrupt - Yielded in the case that an interrupt was recieved while
            polling the child process. Yielded instead of raised to allow forwarding of the
            interrupt to the child and completion of the iterator for this child and
            any others that may be executing

        * The actual values yielded by the child process command

    Args:
        multiprocessing_ctx: The multiprocessing context to execute in (spawn, forkserver, fork)
        command (ChildProcessCommand): The command to execute in the child process.

    Warning: if the child process is in an infinite loop, this will
    also infinitely loop.
    """

    check.inst_param(command, "command", ChildProcessCommand)

    event_queue = multiprocessing_ctx.Queue()
    try:
        process = multiprocessing_ctx.Process(
            target=_execute_command_in_child_process, args=(event_queue, command)
        )
        process.start()

        completed_properly = False

        while not completed_properly:
            event = _poll_for_event(process, event_queue)

            if event == PROCESS_DEAD_AND_QUEUE_EMPTY:
                break

            yield event

            if isinstance(event, (ChildProcessDoneEvent, ChildProcessSystemErrorEvent)):
                completed_properly = True

        if not completed_properly:
            # TODO Figure out what to do about stderr/stdout
            raise ChildProcessCrashException(exit_code=process.exitcode)

        process.join()
    finally:
        event_queue.close()

import sys
import time
from abc import abstractmethod
from typing import Dict

from dagster import check
from dagster.core.errors import DagsterRepositoryLocationLoadError
from dagster.core.host_representation.grpc_server_registry import GrpcServerRegistry
from dagster.core.host_representation.origin import RepositoryLocationOrigin
from dagster.core.host_representation.repository_location import (
    GrpcServerRepositoryLocation,
    RepositoryLocation,
)
from dagster.core.workspace import IWorkspace, WorkspaceLocationEntry, WorkspaceLocationLoadStatus
from dagster.core.workspace.load_target import WorkspaceLoadTarget
from dagster.utils.error import serializable_error_info_from_exc_info


class BaseDaemonWorkspace(IWorkspace):
    """An IWorkspace that lazily loads the list of locations in the workspace. Each daemon in
    the `dagster-daemon` process has its own DaemonWorkspace for thread safety, with a shared
    (thread-safe) GrpcServerRegistry so that if the process spins up its own gRPC servers, they
    the server processes can be shared across multiple daemons.

    Both the list of locations and the RepositoryLocation objects are cached until the daemon
    code calls cleanup() on the DaemonWorkspace - daemons are responsible for doing this
    periodically whenever they might want to check for code updates and workspace.yaml updates.
    """

    def __init__(self):
        self._location_entries = None

    def __enter__(self):
        return self

    def get_workspace_snapshot(self) -> Dict[str, WorkspaceLocationEntry]:
        if self._location_entries == None:
            self._location_entries = self._load_workspace()
        return self._location_entries

    @abstractmethod
    def _load_workspace(self) -> Dict[str, WorkspaceLocationEntry]:
        pass

    def get_location(self, location_name: str) -> RepositoryLocation:
        if self._location_entries == None:
            self._location_entries = self._load_workspace()

        if location_name not in self._location_entries:
            raise DagsterRepositoryLocationLoadError(
                f"Location {location_name} does not exist in workspace",
                load_error_infos=[],
            )

        location_entry = self._location_entries[location_name]

        if location_entry.load_error:
            raise DagsterRepositoryLocationLoadError(
                f"Failure loading {location_name}: {location_entry.load_error}",
                load_error_infos=[location_entry.load_error],
            )

        if not location_entry.repository_location:
            raise DagsterRepositoryLocationLoadError(
                f"Location {location_name} is still loading",
                load_error_infos=[],
            )

        return location_entry.repository_location

    def cleanup(self) -> None:
        if self._location_entries != None:
            for location_entry in self._location_entries.values():
                if location_entry.repository_location:
                    location_entry.repository_location.cleanup()
            self._location_entries = None

    def __exit__(self, exception_type, exception_value, traceback):
        self.cleanup()


class DaemonWorkspace(BaseDaemonWorkspace):
    def __init__(
        self, grpc_server_registry: GrpcServerRegistry, workspace_load_target: WorkspaceLoadTarget
    ):
        self._grpc_server_registry = check.inst_param(
            grpc_server_registry, "grpc_server_registry", GrpcServerRegistry
        )

        self._workspace_load_target = check.inst_param(
            workspace_load_target, "workspace_load_target", WorkspaceLoadTarget
        )

        super().__init__()

    def _load_workspace(self) -> Dict[str, WorkspaceLocationEntry]:
        entries = {}
        origins = self._workspace_load_target.create_origins()
        for origin in origins:
            entries[origin.location_name] = self._load_location(origin)
        return entries

    def _load_location(self, origin) -> WorkspaceLocationEntry:
        location = None
        error = None
        try:
            location = self._create_location_from_origin(origin)
        except Exception:
            error = serializable_error_info_from_exc_info(sys.exc_info())

        return WorkspaceLocationEntry(
            origin=origin,
            repository_location=location,
            load_error=error,
            load_status=WorkspaceLocationLoadStatus.LOADED,
            display_metadata=location.get_display_metadata()
            if location
            else origin.get_display_metadata(),
            update_timestamp=time.time(),
        )

    def _create_location_from_origin(self, origin) -> RepositoryLocation:
        check.inst_param(origin, "origin", RepositoryLocationOrigin)

        if not self._grpc_server_registry.supports_origin(origin):
            return origin.create_location()
        else:
            endpoint = self._grpc_server_registry.get_grpc_endpoint(origin)
            return GrpcServerRepositoryLocation(
                origin=origin,
                server_id=endpoint.server_id,
                port=endpoint.port,
                socket=endpoint.socket,
                host=endpoint.host,
                heartbeat=True,
                watch_server=False,
                grpc_server_registry=self._grpc_server_registry,
            )

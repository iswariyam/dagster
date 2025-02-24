/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RepositorySelector, AssetKeyInput, RunStatus } from "./../../../types/globalTypes";

// ====================================================
// GraphQL query operation: AssetGraphLiveQuery
// ====================================================

export interface AssetGraphLiveQuery_repositoryOrError_PythonError {
  __typename: "PythonError" | "RepositoryNotFoundError";
}

export interface AssetGraphLiveQuery_repositoryOrError_Repository_inProgressRunsByStep_unstartedRuns {
  __typename: "Run";
  id: string;
}

export interface AssetGraphLiveQuery_repositoryOrError_Repository_inProgressRunsByStep_inProgressRuns {
  __typename: "Run";
  id: string;
}

export interface AssetGraphLiveQuery_repositoryOrError_Repository_inProgressRunsByStep {
  __typename: "InProgressRunsByStep";
  stepKey: string;
  unstartedRuns: AssetGraphLiveQuery_repositoryOrError_Repository_inProgressRunsByStep_unstartedRuns[];
  inProgressRuns: AssetGraphLiveQuery_repositoryOrError_Repository_inProgressRunsByStep_inProgressRuns[];
}

export interface AssetGraphLiveQuery_repositoryOrError_Repository {
  __typename: "Repository";
  id: string;
  name: string;
  inProgressRunsByStep: AssetGraphLiveQuery_repositoryOrError_Repository_inProgressRunsByStep[];
}

export type AssetGraphLiveQuery_repositoryOrError = AssetGraphLiveQuery_repositoryOrError_PythonError | AssetGraphLiveQuery_repositoryOrError_Repository;

export interface AssetGraphLiveQuery_assetNodes_assetKey {
  __typename: "AssetKey";
  path: string[];
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_runOrError_RunNotFoundError {
  __typename: "RunNotFoundError" | "PythonError";
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_runOrError_Run_repositoryOrigin {
  __typename: "RepositoryOrigin";
  id: string;
  repositoryName: string;
  repositoryLocationName: string;
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_runOrError_Run {
  __typename: "Run";
  id: string;
  runId: string;
  mode: string;
  pipelineName: string;
  pipelineSnapshotId: string | null;
  repositoryOrigin: AssetGraphLiveQuery_assetNodes_assetMaterializations_runOrError_Run_repositoryOrigin | null;
  status: RunStatus;
}

export type AssetGraphLiveQuery_assetNodes_assetMaterializations_runOrError = AssetGraphLiveQuery_assetNodes_assetMaterializations_runOrError_RunNotFoundError | AssetGraphLiveQuery_assetNodes_assetMaterializations_runOrError_Run;

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_PathMetadataEntry {
  __typename: "PathMetadataEntry";
  label: string;
  description: string | null;
  path: string;
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_JsonMetadataEntry {
  __typename: "JsonMetadataEntry";
  label: string;
  description: string | null;
  jsonString: string;
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_UrlMetadataEntry {
  __typename: "UrlMetadataEntry";
  label: string;
  description: string | null;
  url: string;
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_TextMetadataEntry {
  __typename: "TextMetadataEntry";
  label: string;
  description: string | null;
  text: string;
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_MarkdownMetadataEntry {
  __typename: "MarkdownMetadataEntry";
  label: string;
  description: string | null;
  mdStr: string;
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_PythonArtifactMetadataEntry {
  __typename: "PythonArtifactMetadataEntry";
  label: string;
  description: string | null;
  module: string;
  name: string;
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_FloatMetadataEntry {
  __typename: "FloatMetadataEntry";
  label: string;
  description: string | null;
  floatValue: number | null;
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_IntMetadataEntry {
  __typename: "IntMetadataEntry";
  label: string;
  description: string | null;
  intValue: number | null;
  intRepr: string;
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_PipelineRunMetadataEntry {
  __typename: "PipelineRunMetadataEntry";
  label: string;
  description: string | null;
  runId: string;
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_AssetMetadataEntry_assetKey {
  __typename: "AssetKey";
  path: string[];
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_AssetMetadataEntry {
  __typename: "AssetMetadataEntry";
  label: string;
  description: string | null;
  assetKey: AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_AssetMetadataEntry_assetKey;
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_TableMetadataEntry_table_schema_columns_constraints {
  __typename: "TableColumnConstraints";
  nullable: boolean;
  unique: boolean;
  other: string[];
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_TableMetadataEntry_table_schema_columns {
  __typename: "TableColumn";
  name: string;
  description: string | null;
  type: string;
  constraints: AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_TableMetadataEntry_table_schema_columns_constraints;
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_TableMetadataEntry_table_schema_constraints {
  __typename: "TableConstraints";
  other: string[];
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_TableMetadataEntry_table_schema {
  __typename: "TableSchema";
  columns: AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_TableMetadataEntry_table_schema_columns[];
  constraints: AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_TableMetadataEntry_table_schema_constraints | null;
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_TableMetadataEntry_table {
  __typename: "Table";
  records: string[];
  schema: AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_TableMetadataEntry_table_schema;
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_TableMetadataEntry {
  __typename: "TableMetadataEntry";
  label: string;
  description: string | null;
  table: AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_TableMetadataEntry_table;
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_TableSchemaMetadataEntry_schema_columns_constraints {
  __typename: "TableColumnConstraints";
  nullable: boolean;
  unique: boolean;
  other: string[];
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_TableSchemaMetadataEntry_schema_columns {
  __typename: "TableColumn";
  name: string;
  description: string | null;
  type: string;
  constraints: AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_TableSchemaMetadataEntry_schema_columns_constraints;
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_TableSchemaMetadataEntry_schema_constraints {
  __typename: "TableConstraints";
  other: string[];
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_TableSchemaMetadataEntry_schema {
  __typename: "TableSchema";
  columns: AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_TableSchemaMetadataEntry_schema_columns[];
  constraints: AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_TableSchemaMetadataEntry_schema_constraints | null;
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_TableSchemaMetadataEntry {
  __typename: "TableSchemaMetadataEntry";
  label: string;
  description: string | null;
  schema: AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_TableSchemaMetadataEntry_schema;
}

export type AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries = AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_PathMetadataEntry | AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_JsonMetadataEntry | AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_UrlMetadataEntry | AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_TextMetadataEntry | AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_MarkdownMetadataEntry | AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_PythonArtifactMetadataEntry | AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_FloatMetadataEntry | AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_IntMetadataEntry | AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_PipelineRunMetadataEntry | AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_AssetMetadataEntry | AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_TableMetadataEntry | AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries_TableSchemaMetadataEntry;

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_assetLineage_assetKey {
  __typename: "AssetKey";
  path: string[];
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_assetLineage {
  __typename: "AssetLineageInfo";
  assetKey: AssetGraphLiveQuery_assetNodes_assetMaterializations_assetLineage_assetKey;
  partitions: string[];
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations_stepStats {
  __typename: "RunStepStats";
  stepKey: string;
  startTime: number | null;
  endTime: number | null;
}

export interface AssetGraphLiveQuery_assetNodes_assetMaterializations {
  __typename: "MaterializationEvent";
  partition: string | null;
  runOrError: AssetGraphLiveQuery_assetNodes_assetMaterializations_runOrError;
  runId: string;
  timestamp: string;
  stepKey: string | null;
  metadataEntries: AssetGraphLiveQuery_assetNodes_assetMaterializations_metadataEntries[];
  assetLineage: AssetGraphLiveQuery_assetNodes_assetMaterializations_assetLineage[];
  stepStats: AssetGraphLiveQuery_assetNodes_assetMaterializations_stepStats;
}

export interface AssetGraphLiveQuery_assetNodes {
  __typename: "AssetNode";
  id: string;
  opName: string | null;
  assetKey: AssetGraphLiveQuery_assetNodes_assetKey;
  assetMaterializations: AssetGraphLiveQuery_assetNodes_assetMaterializations[];
}

export interface AssetGraphLiveQuery {
  repositoryOrError: AssetGraphLiveQuery_repositoryOrError;
  assetNodes: AssetGraphLiveQuery_assetNodes[];
}

export interface AssetGraphLiveQueryVariables {
  repositorySelector: RepositorySelector;
  assetKeys?: AssetKeyInput[] | null;
}

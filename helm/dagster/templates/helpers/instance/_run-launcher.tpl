{{- define "dagsterYaml.runLauncher.celery" }}
{{- $celeryK8sRunLauncherConfig := .Values.runLauncher.config.celeryK8sRunLauncher }}
module: dagster_celery_k8s
class: CeleryK8sRunLauncher
config:
  dagster_home:
    env: DAGSTER_HOME
  instance_config_map:
    env: DAGSTER_K8S_INSTANCE_CONFIG_MAP
  postgres_password_secret:
    env: DAGSTER_K8S_PG_PASSWORD_SECRET
  broker:
    env: DAGSTER_CELERY_BROKER_URL
  backend:
    env: DAGSTER_CELERY_BACKEND_URL
  {{- if $celeryK8sRunLauncherConfig.configSource }}
  config_source: {{- $celeryK8sRunLauncherConfig.configSource | toYaml | nindent 4 }}
  {{- end }}
  env_config_maps:
    - env: DAGSTER_K8S_PIPELINE_RUN_ENV_CONFIGMAP
    {{- range $envConfigMap := $celeryK8sRunLauncherConfig.envConfigMaps }}
    {{- if hasKey $envConfigMap "name" }}
    - {{ $envConfigMap.name }}
    {{- end }}
    {{- end }}
  {{- if or $celeryK8sRunLauncherConfig.envSecrets .Values.global.celeryConfigSecretName }}
  env_secrets:
    {{- range $envSecret := $celeryK8sRunLauncherConfig.envSecrets }}
    {{- if hasKey $envSecret "name" }}
    - {{ $envSecret.name }}
    {{- end }}
    {{- end }}
    - {{ .Values.global.celeryConfigSecretName }}
  {{- end }}
  {{- if $celeryK8sRunLauncherConfig.volumeMounts }}
  volume_mounts: {{- $celeryK8sRunLauncherConfig.volumeMounts | toYaml | nindent 4 }}
  {{- end }}

  {{- if $celeryK8sRunLauncherConfig.volumes }}
  volumes: {{- $celeryK8sRunLauncherConfig.volumes | toYaml | nindent 4 }}
  {{- end }}

  {{- if $celeryK8sRunLauncherConfig.labels }}
  labels: {{- $celeryK8sRunLauncherConfig.labels | toYaml | nindent 4 }}
  {{- end }}

  {{- if .Values.imagePullSecrets }}
  image_pull_secrets: {{- .Values.imagePullSecrets | toYaml | nindent 4 }}
  {{- end }}

  service_account_name: {{ include "dagster.serviceAccountName" . }}

  {{- if $celeryK8sRunLauncherConfig.imagePullPolicy }}
  image_pull_policy: {{ $celeryK8sRunLauncherConfig.imagePullPolicy }}
  {{- end }}

  {{- if $celeryK8sRunLauncherConfig.failPodOnRunFailure }}
  fail_pod_on_run_failure: true
  {{- end }}

{{- end }}

{{- define "dagsterYaml.runLauncher.k8s" }}
{{- $k8sRunLauncherConfig := .Values.runLauncher.config.k8sRunLauncher }}
module: dagster_k8s
class: K8sRunLauncher
config:
  load_incluster_config: {{ $k8sRunLauncherConfig.loadInclusterConfig }}

  {{- if $k8sRunLauncherConfig.kubeconfigFile }}
  kubeconfig_file: {{ $k8sRunLauncherConfig.kubeconfigFile }}
  {{- end }}
  job_namespace: {{ $k8sRunLauncherConfig.jobNamespace | default .Release.Namespace }}
  image_pull_policy: {{ $k8sRunLauncherConfig.imagePullPolicy }}

  {{- if .Values.imagePullSecrets }}
  image_pull_secrets: {{- .Values.imagePullSecrets | toYaml | nindent 4 }}
  {{- end }}
  service_account_name: {{ include "dagster.serviceAccountName" . }}

  {{- if (hasKey $k8sRunLauncherConfig "image") }}
  job_image: {{ include "dagster.externalImage.name" (list $ $k8sRunLauncherConfig.image) | quote }}
  {{- end }}
  dagster_home:
    env: DAGSTER_HOME
  instance_config_map:
    env: DAGSTER_K8S_INSTANCE_CONFIG_MAP
  postgres_password_secret:
    env: DAGSTER_K8S_PG_PASSWORD_SECRET
  env_config_maps:
    - env: DAGSTER_K8S_PIPELINE_RUN_ENV_CONFIGMAP
    {{- range $envConfigMap := $k8sRunLauncherConfig.envConfigMaps }}
    {{- if hasKey $envConfigMap "name" }}
    - {{ $envConfigMap.name }}
    {{- end }}
    {{- end }}

  {{- if $k8sRunLauncherConfig.envSecrets }}
  env_secrets:
    {{- range $envSecret := $k8sRunLauncherConfig.envSecrets }}
    {{- if hasKey $envSecret "name" }}
    - {{ $envSecret.name }}
    {{- end }}
    {{- end }}
  {{- end }}

  {{- if $k8sRunLauncherConfig.envVars }}
  env_vars: {{- $k8sRunLauncherConfig.envVars | toYaml | nindent 4 }}
  {{- end }}

  {{- if $k8sRunLauncherConfig.volumeMounts }}
  volume_mounts: {{- $k8sRunLauncherConfig.volumeMounts | toYaml | nindent 4 }}
  {{- end }}

  {{- if $k8sRunLauncherConfig.volumes }}
  volumes: {{- $k8sRunLauncherConfig.volumes | toYaml | nindent 4 }}
  {{- end }}

  {{- if $k8sRunLauncherConfig.labels }}
  labels: {{- $k8sRunLauncherConfig.labels | toYaml | nindent 4 }}
  {{- end }}

  {{- if $k8sRunLauncherConfig.failPodOnRunFailure }}
  fail_pod_on_run_failure: true
  {{- end }}


{{- end }}

{{- define "dagsterYaml.runLauncher.custom" }}
{{- $customRunLauncherConfig := .Values.runLauncher.config.customRunLauncher }}
module: {{ $customRunLauncherConfig.module | quote }}
class: {{ $customRunLauncherConfig.class | quote }}
config: {{ $customRunLauncherConfig.config | toYaml | nindent 2 }}
{{- end }}

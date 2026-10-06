---
sidebar_position: 1
uid: Pipelines.CommercialPlus
sidebar_label: Commercial Plus
description: "Authenticate private Prism package restores without committing feed credentials."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Restore from the Commercial Plus feed {#setting-up-the-commercial-plus-private-nuget-feed}

Commercial Plus packages use `https://nuget.prismlibrary.com/v3/index.json`. Authenticate with the licensed user's email and the feed/license key issued through the Prism account. Keep that key in the build system's secret store, never in source control, application configuration or a published artifact.

The examples assume the repository already has its required SDK/workloads and a NuGet source named `Prism` pointing to this endpoint. Keep ordinary package-source configuration credential-free. Source names matter: the environment credential name below must match `Prism` exactly.

<Tabs groupId="ci-cd">
<TabItem value="github" label="GitHub Actions">

## GitHub Actions

Create repository/environment secrets named `PRISM_NUGET_USER` and `PRISM_NUGET_API_KEY`. Limit access to the jobs and branches that need private restore. Pass them through the environment rather than interpolating secrets into shell commands:

```yaml
- name: Restore
  shell: pwsh
  env:
    NuGetPackageSourceCredentials_Prism: Username=${{ secrets.PRISM_NUGET_USER }};Password=${{ secrets.PRISM_NUGET_API_KEY }};ValidAuthenticationTypes=Basic
  run: dotnet restore
```

NuGet recognizes `NuGetPackageSourceCredentials_{sourceName}`. The credential exists in the job environment without writing a clear-text password into a checked-in configuration. Never echo it. Do not run untrusted pull-request code with private feed credentials; repository secrets are normally unavailable to fork pull requests for that reason.

See [GitHub's secret handling guidance](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets) and [NuGet authenticated feeds](https://learn.microsoft.com/en-us/nuget/consume-packages/consuming-packages-authenticated-feeds).

</TabItem>
<TabItem value="azure-pipelines" label="Azure Pipelines">

## Azure Pipelines

Create an authorized NuGet service connection for the Prism feed with Basic Authentication. Use the licensed email as username and the issued key as password. Grant pipeline access narrowly rather than making the connection available to every pipeline by default.

If the connection is named `Prism`, authenticate before the existing restore step:

```yaml
- task: NuGetAuthenticate@1
  inputs:
    nuGetServiceConnections: Prism

- pwsh: dotnet restore
  displayName: Restore
```

The source URL in NuGet configuration must match the service connection's feed. This task configures authentication; it does not add your package references or install the project's SDK/workloads. See the [NuGetAuthenticate task reference](https://learn.microsoft.com/en-us/azure/devops/pipelines/tasks/reference/nuget-authenticate-v1?view=azure-pipelines).

</TabItem>
</Tabs>

## Diagnose a failed restore

Check the source name and URL, whether secrets are available to that particular job, the account's entitlement, and the requested package/version. An environment credential with an old value can take precedence over a newly edited configuration; verify the job's secret configuration without printing its value.

Keep private package caches and diagnostic logs within the authorized build environment. Do not upload credentials or package contents to public artifacts. Successful restore does not verify startup, navigation or the application's deployment behavior; run the appropriate application checks afterward.

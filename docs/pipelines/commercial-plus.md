---
uid: Pipelines.CommercialPlus
---

# Setting up the Commercial Plus private NuGet Feed

## [GitHub Actions](#tab/github)

First be sure to add the Prism NuGet feed and your credentials as secrets in GitHub.

PRISM_NUGET_FEED: `https://nuget.prismlibrary.com/v3/index.json
PRISM_NUGET_USER: The email of the licensed user
PRISM_NUGET_API_KEY: The License Key you have generated on https://prismlibrary.com

```yml
- name: Add NuGet Feed
  shell: pwsh
  run: |
    dotnet nuget add source ${{ secrets.PRISM_NUGET_FEED }} -u ${{ secrets.PRISM_NUGET_USER }} -p ${{ secrets.PRISM_API_KEY }} -n InHouse --store-password-in-clear-text
```

## [Azure Pipelines](#tab/azure-pipelines)

Go to your project Settings -> Service connections. Then add a `New service connection` and select `NuGet` then click Next. Be sure to select `Basic Authentication`

Feed URL: `https://nuget.prismlibrary.com`
Username: The email of the licensed user
Password: The License Key you have generated on https://prismlibrary.com
Service connection name: This can be anything. For the sample below you will see we have set this to `Prism`

```yml
- task: NuGetAuthenticate@1
  inputs:
    nuGetServiceConnections: 'Prism'
```

---

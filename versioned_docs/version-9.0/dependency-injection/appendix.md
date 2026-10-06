---
sidebar_position: 7
description: "Migrate older container-extension recipes to the Prism 9.0 application composition model."
---

# Migrating older container setup {#prism-container-extensions}

Older Prism applications may reference `Prism.Container.Extensions`, `Prism.*.Forms.Extended`, `Shiny.Prism`, `IPlatformInitializer`, or factory-based `ContainerLocator` initialization. Those recipes describe earlier Xamarin.Forms-era composition and should not be copied into a new Prism application.

## Start from the Prism 9.0 host

1. Choose the supported application host and Prism container adapter.
2. Match packages to the target framework and dependency versions in the application project.
3. Move registrations into that host's normal startup and module registration paths.
4. Preserve a single application container, explicit scopes and platform services.
5. Re-test navigation, dialogs, module initialization and disposal before removing the old composition layer.

Factory and multi-contract registrations are part of the Prism 9.0 container abstractions. Use the [registration APIs](registering-types.md) rather than adding a historical extension package to obtain them.

## Integrating another library {#support-for-shiny-lib}

For a library such as Shiny, use that library's current host-specific documentation and supported package combination. Its registration and startup contract may differ from the former `ShinyStartup` examples. Importing registrations is only part of integration: validate platform permissions, lifecycle, background execution and service ownership too.

Prism's [IServiceCollection integration](servicecollection-supplement.md) explains the container boundary. [ContainerLocator](container-locator.md) documents the instance-based API in Containers 9.0.114. Neither requires reconstructing the old Xamarin.Forms startup pattern.

Source (Containers 9.0.114): [registration extensions](https://github.com/PrismLibrary/Prism.Containers/blob/3e2b38b767397b7595542369ab8e9e21e3c6cdcb/src/Prism.Container.Abstractions/IContainerRegistryExtensions.cs) and [ContainerLocator](https://github.com/PrismLibrary/Prism.Containers/blob/3e2b38b767397b7595542369ab8e9e21e3c6cdcb/src/Prism.Container.Abstractions/ContainerLocator.cs).

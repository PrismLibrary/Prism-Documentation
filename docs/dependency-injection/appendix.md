---
sidebar_position: 7
sidebar_label: Migrating older container setup
---

# Migrating older container setup

Older Prism applications may reference `Prism.Container.Extensions`, `Prism.*.Forms.Extended`, `Shiny.Prism`, `IPlatformInitializer`, or factory-based `ContainerLocator` initialization. Those recipes describe earlier Xamarin.Forms-era composition and should not be copied into a new Prism application.

## Start from the current host

1. Choose the supported application host and Prism container adapter.
2. Match packages to the target framework and dependency versions in the application project.
3. Move registrations into that host's normal startup and module registration paths.
4. Preserve a single application container, explicit scopes and platform services.
5. Re-test navigation, dialogs, module initialization and disposal before removing the old composition layer.

Factory and multi-contract registrations are now part of the Prism container abstractions. Use the [current registration APIs](registering-types.md) rather than adding a historical extension package to obtain them.

## Integrating another library

For a library such as Shiny, use that library's current host-specific documentation and supported package combination. Its registration and startup contract may differ from the former `ShinyStartup` examples. Importing registrations is only part of integration: validate platform permissions, lifecycle, background execution and service ownership too.

Prism's [IServiceCollection integration](servicecollection-supplement.md) explains the container boundary. [ContainerLocator](container-locator.md) documents the current instance-based API. Neither requires reconstructing the old Xamarin.Forms startup pattern.

## NativeAOT is a separate migration step

First establish correct behavior on the ordinary runtime, then publish and execute the actual NativeAOT target with the supported Microsoft container from Commercial Plus. A successful container migration or a generated registration file is not a substitute for that test. Follow the [NativeAOT checklist](native-aot.md).

---
sidebar_position: 1
description: "Choose a Prism 9.0 container and use the shared registration and resolution contracts."
---

# Dependency injection with Prism

Dependency injection makes a component's dependencies explicit and lets the application choose their implementations and lifetimes. Prism view models can depend on a service contract while each host supplies its own implementation, without placing UI-framework dependencies in shared business logic.

Prism 7 introduced common IoC abstractions so application registrations need not depend on one container's API. Prism 9 ships those contracts separately in `Prism.Container.Abstractions`, under the `Prism.Ioc` namespace:

- `IContainerRegistry` describes registrations.
- `IContainerProvider` resolves services and creates scopes.
- `IContainerExtension` combines those responsibilities for a container adapter.

Use the host's startup and module registration hooks for composition, and constructor injection for ordinary consumers. The same abstractions do not erase differences in platform lifecycles or adapter capabilities.

## Containers

The Prism team ships several DI container implementations for the Prism IoC abstractions. 

| Container | Availability | Notes |
|:---------:|:------------:|:-----:|
| DryIoc | NuGet.org | Use the package/integration for the selected Prism host |
| Grace | Commercial Plus | |
| Microsoft | Commercial Plus | Prism adapter for Microsoft service-provider integration |
| Unity | NuGet.org | Legacy support for WPF only |

:::note
While the DryIoc and Unity Container's are available on NuGet.org they are still subject to the Prism License. You should have a valid license for Prism.
:::

## Using Microsoft's IServiceCollection

Prism 9 adapters can integrate Microsoft registration extensions through `IServiceCollectionAware`. Importing a service collection does not change which container adapter the application selected. Use the MAUI/Uno host's existing composition path and avoid creating a second provider to obtain a service during registration. See [service-collection integration](servicecollection-supplement.md).

## Next Steps

- Learn how to [Register Services](registering-types.md)
- Learn how to [Register Platform Specific Services](platform-specific-services.md)
- [Microsoft.Extensions.DependencyInjection (Supplement)](servicecollection-supplement.md)
- [Implementing a container adapter](add-custom-container.md)
- [Migrate older container setup](appendix.md)

Source (Containers 9.0.114): [container contracts](https://github.com/PrismLibrary/Prism.Containers/tree/3e2b38b767397b7595542369ab8e9e21e3c6cdcb/src/Prism.Container.Abstractions) and [adapter projects](https://github.com/PrismLibrary/Prism.Containers/tree/3e2b38b767397b7595542369ab8e9e21e3c6cdcb/src). Repository access may require authorization.

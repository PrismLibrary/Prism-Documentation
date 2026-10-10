---
sidebar_position: 1
---

# Dependency injection with Prism

Dependency injection makes a component's dependencies explicit and lets the application choose their implementations and lifetimes. Prism view models can depend on a service contract while each host supplies its own implementation, without placing UI-framework dependencies in shared business logic.

Prism 9 ships its IoC contracts separately in `Prism.Container.Abstractions`, under the `Prism.Ioc` namespace:

- `IContainerRegistry` describes registrations.
- `IContainerProvider` resolves services and creates scopes.
- `IContainerExtension` combines those responsibilities for a container adapter.

Use the host's startup and module registration hooks for composition, and constructor injection for ordinary consumers. The same abstractions do not erase differences in platform lifecycles or adapter capabilities.

## Containers

The Prism team ships several DI container implementations for the Prism IoC abstractions. 

| Container | Availability | Notes |
|:---------:|:------------:|:-----:|
| DryIoc | NuGet.org | Normal application support; not the supported NativeAOT container |
| Grace | Commercial Plus | |
| Microsoft | Commercial Plus | Required for supported NativeAOT applications in Prism 10.0 |
| Unity | NuGet.org | Legacy support for WPF only |
| Castle Windsor | Verify availability in your authorized feed | Adapter measured by the container benchmark suite; verify the selected host/package integration |

:::note
While the DryIoc and Unity Container's are available on NuGet.org they are still subject to the Prism License. You should have a valid license for Prism.
:::

## NativeAOT in Prism 10.0

Prism 10.0 (vNext) is planned as the first NativeAOT-ready Prism release. Use the **Microsoft container** from the Commercial Plus feed for the supported NativeAOT path. Adding `IServiceCollection` registrations to another adapter does not select the Microsoft container.

The container generator preserves statically visible activation types while your registrations continue to define service names, lifetimes, and module boundaries. Trimming a small test with another container is not equivalent to NativeAOT support for a complete Prism application. Follow the [setup and validation guide](native-aot.md).

## Compare measured container behavior

The [container benchmarks](benchmarks.md) compare registration, first resolution, warm graphs, scopes and allocations through Prism's real adapter APIs. Use them alongside capability and lifecycle requirements, rather than as a universal ranking.

## Next Steps

- Learn how to [Register Services](registering-types.md)
- Learn how to [Register Platform Specific Services](platform-specific-services.md)
- [Microsoft.Extensions.DependencyInjection (Supplement)](servicecollection-supplement.md)
- [Implementing a container adapter](add-custom-container.md)
- [Migrate older container setup](appendix.md)


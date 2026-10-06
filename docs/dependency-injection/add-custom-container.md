---
sidebar_position: 8
---

# Implementing a container adapter

A custom adapter is infrastructure work, not a small wrapper around `Resolve`. Prefer a maintained Prism adapter unless a concrete requirement cannot be met. An adapter can support a chosen host without claiming every Prism platform or NativeAOT runtime is qualified.

Prism 9 moved the IoC abstractions into `Prism.Container.Abstractions`. An old adapter targeting `Prism.Core` with a handful of Prism 7/8 methods is not a complete implementation of the current contract.

## Contracts to implement

| Contract | Responsibility |
| --- | --- |
| `IContainerRegistry` | Transient, singleton, scoped, instance, named and factory registrations; registration checks; multi-contract registration |
| `IContainerProvider` | Typed/named resolution, explicit typed parameters, scope creation and current-scope access |
| `IContainerExtension` | Combines registry and provider |
| `IContainerExtension<T>` | Exposes the adapter's underlying container instance |
| `IScopedProvider` | Scope resolution, child scope creation, attachment state and disposal |
| `IServiceCollectionAware` | Optional service-collection import and provider creation used by host integration |

Prism infrastructure also uses registration metadata through `Prism.Ioc.Internals.IContainerInfo`. Treat that as an integration dependency to verify against the version you target, rather than inventing a permanently stable public adapter contract.

## Registration must survive real application behavior

An application may register a module after startup. Define how the adapter handles that without replacing already resolved application singletons or breaking existing scopes. Named view hosts and typed parameters must preserve their identity and intended scope. A container's stock immutable provider is not automatically sufficient for Prism's modular registration behavior.

Test the adapter with:

1. Two resolutions for each lifetime, across two scopes and a child scope.
2. A named service, an existing instance, factory registrations, and multi-contract singleton identity.
3. Missing dependencies, constructor failures and cyclical dependencies.
4. Registrations added by a module after initial composition.
5. Actual host navigation and dialogs, including MAUI page-scoped services where applicable.
6. Disposal and ownership of scopes, generated services and supplied instances.
7. Imported Microsoft descriptors and the exact advanced features your libraries use.

## Preserve diagnostic context

Wrap a resolution failure with its requested service type, optional name, underlying exception and the provider used for resolution. For example, inside an adapter's resolution implementation:

```csharp
try
{
    return ResolveUsingUnderlyingContainer(serviceType, serviceName);
}
catch (Exception exception)
{
    throw new ContainerResolutionException(
        serviceType, serviceName, exception, this);
}
```

`ResolveUsingUnderlyingContainer` is deliberately adapter-specific here. This excerpt illustrates error propagation; it is not a complete adapter implementation. See [resolution diagnostics](resolution-errors.md) before adding constructor-inspection diagnostics to production paths.

## Host integration and NativeAOT

Wire the adapter through the selected host's application/builder composition, not by swapping `ContainerLocator` after initialization. Keep the Prism contracts and host packages compatible through their actual dependency references.

A custom adapter does not acquire supported NativeAOT status by compiling with trimming enabled. Prism's supported NativeAOT path uses the Commercial Plus Microsoft adapter. Static activation, registration metadata, framework behavior and the published runtime must all be verified separately; see the [NativeAOT guide](native-aot.md).

Use the [current abstractions](https://github.com/PrismLibrary/Prism.Containers/tree/e59d1b2fb10a0a156305e214a1a5839f1e1f51ce/src/Prism.Container.Abstractions) and [shared adapter tests](https://github.com/PrismLibrary/Prism.Containers/tree/e59d1b2fb10a0a156305e214a1a5839f1e1f51ce/tests/Prism.Container.Shared/Tests) as the compatibility checklist. These source links require authorized repository access.

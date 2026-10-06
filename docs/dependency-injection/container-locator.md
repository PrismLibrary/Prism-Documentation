---
sidebar_position: 6
---

# ContainerLocator

`Prism.Ioc.ContainerLocator` holds the application's current `IContainerExtension`. Prism's startup and infrastructure use it where constructor injection is unavailable. Application services and view models should normally request their dependencies in constructors instead of reaching into this global locator.

## Current Prism 9.1 contract

```csharp
// Infrastructure/composition code; container is an existing IContainerExtension.
ContainerLocator.SetContainerExtension(container);

IContainerProvider provider = ContainerLocator.Container;
IContainerExtension extension = ContainerLocator.Current;
bool initialized = ContainerLocator.IsInitialized;
```

`SetContainerExtension` takes a **container instance**, not a factory delegate. It replaces the current reference. `TrySetContainerExtension(container)` returns false if a container is already set. Reading `Current` or `Container` before initialization throws.

Older examples with `SetContainerExtension(() => new ...)` and lazy creation do not describe this API. Use the host's normal Prism startup path; do not replace an initialized application container to add one registration.

## One application container

MAUI and Uno host composition integrate their service collection with the selected Prism container. Creating a second provider can duplicate singleton state and disconnect page-scoped navigation services from the view that owns them. See [IServiceCollection integration](servicecollection-supplement.md).

A global provider is not a substitute for the current page or operation scope. Code that needs a scope should receive the appropriate provider or an explicit service/factory from its owner.

## Isolated tests

Tests that deliberately initialize this static state can clear it in teardown:

```csharp
ContainerLocator.ResetContainer();
```

`ResetContainer` only clears the reference in the current implementation. It does **not** dispose the old container, resolved services or scopes. Tests must dispose what they own separately and avoid parallel tests competing for the same static locator. Prefer testing view models with constructor-injected fakes so most tests need no locator at all.

Source: [ContainerLocator](https://github.com/PrismLibrary/Prism.Containers/blob/e59d1b2fb10a0a156305e214a1a5839f1e1f51ce/src/Prism.Container.Abstractions/ContainerLocator.cs) and [shared tests](https://github.com/PrismLibrary/Prism.Containers/blob/e59d1b2fb10a0a156305e214a1a5839f1e1f51ce/tests/Prism.Container.Shared/Tests/ContainerLocatorFixture.cs). The Containers repository requires authorized access.

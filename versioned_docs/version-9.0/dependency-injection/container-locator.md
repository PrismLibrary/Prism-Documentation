---
sidebar_position: 6
description: "Understand instance-based ContainerLocator setup and reset behavior in Containers 9.0.114."
---

# ContainerLocator {#the-containerlocator}

`Prism.Ioc.ContainerLocator` holds the application's current `IContainerExtension`. Prism's startup and infrastructure use it where constructor injection is unavailable. Application services and view models should normally request their dependencies in constructors instead of reaching into this global locator.

`ContainerLocator` was introduced in Prism 8.0 to replace reliance on CommonServiceLocator. Its Prism 9.0 container contract below differs from older factory-based examples.

## Prism 9.0 container setup {#how-to-use-the-containerlocator}

```csharp
// Infrastructure/composition code; container is an existing IContainerExtension.
ContainerLocator.SetContainerExtension(container);

IContainerProvider provider = ContainerLocator.Container;
IContainerExtension extension = ContainerLocator.Current;
bool initialized = ContainerLocator.IsInitialized;
```

`SetContainerExtension` takes a **container instance**, not a factory delegate. It replaces the current reference. `TrySetContainerExtension(container)` returns false if a container is already set. Reading `Current` or `Container` before initialization throws.

Older examples with `SetContainerExtension(() => new ...)` and lazy creation do not describe this API. Use the host's normal Prism startup path; do not replace an initialized application container to add one registration.

## One application container {#advanced-usage}

MAUI and Uno host composition integrate their service collection with the selected Prism container. Creating a second provider can duplicate singleton state and disconnect page-scoped navigation services from the view that owns them. See [IServiceCollection integration](servicecollection-supplement.md).

A global provider is not a substitute for the current page or operation scope. Code that needs a scope should receive the appropriate provider or an explicit service/factory from its owner.

### Isolated tests {#testing}

Tests that deliberately initialize this static state can clear it in teardown:

```csharp
ContainerLocator.ResetContainer();
```

`ResetContainer` only clears the reference in Containers 9.0.114. It does **not** dispose the old container, resolved services or scopes. Tests must dispose what they own separately and avoid parallel tests competing for the same static locator. Prefer testing view models with constructor-injected fakes so most tests need no locator at all.

## Example Usage

For normal applications, use [WPF startup](../platforms/wpf/getting-started.md), the [MAUI builder](../platforms/maui/appbuilder.md), or [Uno startup](../platforms/uno/index.md). Those hosts initialize the locator with their chosen container. The direct setup above is for infrastructure and isolated tests that own that initialization.

Source: [ContainerLocator](https://github.com/PrismLibrary/Prism.Containers/blob/3e2b38b767397b7595542369ab8e9e21e3c6cdcb/src/Prism.Container.Abstractions/ContainerLocator.cs) and [shared tests](https://github.com/PrismLibrary/Prism.Containers/blob/3e2b38b767397b7595542369ab8e9e21e3c6cdcb/tests/Prism.Container.Shared/Tests/ContainerLocatorFixture.cs). The Containers repository requires authorized access.

---
sidebar_position: 3
uid: Plugins.ObservableRegions
title: Observable Regions
sidebar_label: Observable Regions
description: Observe Prism 9 region navigation with a shared event stream and an application-owned subscription.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Observable Regions

## Getting Started

`Prism.Plugin.ObservableRegions` combines the navigation events of regions on the injected `IRegionManager` into one observable stream. The plugin is available through the [Commercial Plus feed](../pipelines/commercial-plus.md). It observes region navigation; MAUI page navigation uses a [separate observer](../platforms/maui/navigation/global-navigation-observer.md).

Register the observer once with `AddObservableRegions()`. Subscribe before the navigation you want to monitor, and keep the subscription so you can dispose it when its owner shuts down. For example, use an application-owned diagnostics service:

```csharp
using System;
using System.Diagnostics;
using System.Reactive.Linq;
using Prism.Plugin.ObservableRegions;

public sealed class RegionDiagnostics : IDisposable
{
    private readonly IGlobalRegionNavigationObserver _observer;
    private IDisposable? _subscription;

    public RegionDiagnostics(IGlobalRegionNavigationObserver observer)
    {
        _observer = observer;
    }

    public void Start()
    {
        _subscription?.Dispose();
        _subscription = _observer.Navigation
            .Where(e => e.Event == RegionNavigationEventType.Failed)
            .Subscribe(e => Debug.WriteLine($"Region navigation failed: {e.Name}"));
    }

    public void Dispose()
    {
        _subscription?.Dispose();
        _subscription = null;
    }
}
```

Replace the diagnostic output with your application's handling. Keep callbacks brief and handle their errors. The observer does not select a UI scheduler, so marshal UI updates as required by your platform. Navigation parameters and URIs can contain application or user data; choose diagnostic fields deliberately.

<Tabs groupId="platform">
<TabItem value="maui" label=".NET MAUI">

Inside the existing Prism builder callback:

```csharp
using Prism.Ioc;

prism.RegisterTypes(registry =>
{
    registry.AddObservableRegions();
    registry.RegisterSingleton<RegionDiagnostics>();
});
prism.OnInitialized(container =>
    container.Resolve<RegionDiagnostics>().Start());
```

Keep your application's region registration and startup navigation. The observer does not create regions or replace `INavigationService` result handling.

</TabItem>
<TabItem value="wpf" label="WPF">

Add these registrations to your Prism application's existing `RegisterTypes` override:

```csharp
using Prism.Ioc;

containerRegistry.AddObservableRegions();
containerRegistry.RegisterSingleton<RegionDiagnostics>();
```

In `OnInitialized`, call `Container.Resolve<RegionDiagnostics>().Start()` before issuing the region navigation you want to observe. Retain the base initialization and your application's shell setup. Dispose the diagnostics service at application shutdown.

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

Register `AddObservableRegions()` and `RegisterSingleton<RegionDiagnostics>()` in the existing Prism application's `RegisterTypes` override. Start `Container.Resolve<RegionDiagnostics>()` during initialization, before your first observed region navigation. Retain the base initialization and existing window setup, and dispose the diagnostics service when its owning application is torn down.

</TabItem>
</Tabs>

`AddObservableRegions()` registers `IGlobalRegionNavigationObserver` as a singleton. A consumer disposes its own subscription, not the shared observer. Ensure the application's lifetime owner disposes `RegionDiagnostics`; calling its `Dispose()` stops only that subscription.

The convenience method `ObserveRegionNavigation` takes one callback argument and returns `void`:

```csharp
container.ObserveRegionNavigation(observer =>
{
    // Subscribe to observer.Navigation and retain the returned IDisposable.
});
```

Its callback receives the observer, not a container-and-observer pair. Capture the container if the callback needs it. The extension does not retain or dispose subscriptions created inside that callback.

## RegionNavigationEvent

This is an observable notification, not an `IEventAggregator` / `PubSubEvent` message. The contract contains the region, event type, navigation context, URI, registered view name, and an optional error:

```csharp
public record RegionNavigationEvent(
    IRegion Region,
    RegionNavigationEventType Event,
    NavigationContext Context,
    Uri Uri,
    string Name,
    Exception? Error = null);

public enum RegionNavigationEventType
{
    Navigating,
    Navigated,
    Failed
}
```

`Navigating` reports the beginning of navigation; it does not establish success. `Navigated` reports completion. `Failed` includes the error supplied by the region navigation service, which should still be checked for null. `Navigating` and `Navigated` leave `Error` null; the event type itself is never null.

## Observation scope and lifetime

The implementation watches existing regions and subsequent region additions/removals on the injected manager. Its stream is hot and does not replay past events. Start the subscription before triggering navigation, and avoid adding duplicate subscriptions whenever a view appears.

Independent scoped region managers are not discovered automatically. Although the concrete implementation contains scoped-manager methods, they are not exposed by this baseline's `IGlobalRegionNavigationObserver` interface. Do not assume that a subscription observes every nested region manager in an application.

## Source reference

These references describe the `release/stable/9.0` source baseline at commit `bbafa527`. The exact shipped package version for this plugin has not been independently matched to that commit. Select a package compatible with your Prism dependencies from the authorized feed; do not infer a package-version pin from this page. Source links require access to the private Prism.Plugins repository.

- [Registration and callback signature](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.ObservableRegions/GlobalRegionNavigationObserverExtensions.cs)
- [Public observer interface](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.ObservableRegions/IGlobalRegionNavigationObserver.cs)
- [Observation and disposal implementation](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.ObservableRegions/GlobalRegionNavigationObserver.cs)
- [Event record](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.ObservableRegions/RegionNavigationEvent.cs)

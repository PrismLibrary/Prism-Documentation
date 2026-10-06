---
sidebar_position: 3
uid: Plugins.ObservableRegions
title: Observable Regions
sidebar_label: Observable Regions
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Observable Regions

`Prism.Plugin.ObservableRegions` exposes navigation activity from the injected region manager as one observable stream. It is a Commercial Plus plugin. It watches region navigation, not MAUI page navigation, and does not use `IEventAggregator`.

## Register and own a subscription

Register the singleton observer and an application-owned subscription service:

```csharp
using Prism.Ioc;
using Prism.Plugin.ObservableRegions;
using System.Reactive.Linq;

public sealed class RegionDiagnostics(IGlobalRegionNavigationObserver observer) : IDisposable
{
    private IDisposable? _subscription;

    public void Start(Action<string> onFailure)
    {
        _subscription?.Dispose();
        _subscription = observer.Navigation
            .Where(e => e.Event == RegionNavigationEventType.Failed)
            .Subscribe(e => onFailure(e.Name));
    }

    public void Dispose()
    {
        _subscription?.Dispose();
        _subscription = null;
    }
}
```

`onFailure` is an application callback, for example a fixed diagnostic label or UI notification. Avoid serializing navigation parameters or complete URIs into telemetry; they can contain user data. Marshal bound UI updates to the UI thread when needed. Keep callbacks brief and handle their own errors.

<Tabs groupId="platform">
<TabItem value="maui" label=".NET MAUI">

Inside the existing Prism builder callback:

```csharp
prism.RegisterTypes(registry =>
{
    registry.AddObservableRegions();
    registry.RegisterSingleton<RegionDiagnostics>();
});
prism.OnInitialized(container =>
    container.Resolve<RegionDiagnostics>().Start(name =>
        System.Diagnostics.Debug.WriteLine($"Region navigation failed: {name}")));
```

This observes MAUI regions after startup. It does not replace page-navigation observation or navigation-result handling.

</TabItem>
<TabItem value="wpf" label="WPF">

In the existing Prism application's `RegisterTypes`, call `registry.AddObservableRegions()` and `registry.RegisterSingleton<RegionDiagnostics>()`. In `OnInitialized`, retain `base.OnInitialized()` and start `Container.Resolve<RegionDiagnostics>()` before issuing the region navigation you want to observe. Keep the application's existing shell startup.

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

Use the same registrations in the Prism application's `RegisterTypes`. Start the subscription in `OnInitialized`, retaining the base implementation and existing host/window setup. The injected manager determines which regions are observed; this is not a browser-wide navigation stream.

</TabItem>
<TabItem value="avalonia" label="Avalonia">

Register and start the observer in the existing Prism application lifecycle, retaining the base initialization and shell setup. The plugin depends on the shared Prism region contracts; it does not require Essentials or a MAUI popup host.

</TabItem>
</Tabs>

The application owns `RegionDiagnostics` and should dispose it at shutdown; a scoped UI consumer should dispose at its own teardown. Disposing a subscriber does not mean that consumer should dispose the singleton global observer. The container owns the observer's underlying region/event subscriptions.

## Event contract

`RegionNavigationEvent` includes `Region`, `Event`, `Context`, `Uri`, `Name`, and nullable `Error`. Event values are `Navigating`, `Navigated`, and `Failed`. Only a `Failed` event carries the failure supplied by the region service; inspect for null instead of assuming every failure contains an exception. `Navigating` is not evidence of completed navigation.

The observer subscribes to existing regions and region additions/removals on the injected manager. It is a hot notification stream with no history replay: subscribe before the operation to observe it. The public `IGlobalRegionNavigationObserver` does not expose the concrete implementation's scoped-manager watch methods. Do not promise automatic discovery of every independent scoped manager or code against a commented-out interface method.

`ObserveRegionNavigation` is a convenience extension taking `Action<IGlobalRegionNavigationObserver>` with one argument. It returns `void` and does not own the subscription created by the callback. Prefer the explicit owner shown above when teardown matters.

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.ObservableRegions/GlobalRegionNavigationObserverExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.ObservableRegions/GlobalRegionNavigationObserverExtensions.cs)
- [`src/Prism.Plugin.ObservableRegions/IGlobalRegionNavigationObserver.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.ObservableRegions/IGlobalRegionNavigationObserver.cs)
- [`src/Prism.Plugin.ObservableRegions/GlobalRegionNavigationObserver.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.ObservableRegions/GlobalRegionNavigationObserver.cs)
- [`src/Prism.Plugin.ObservableRegions/RegionNavigationEvent.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.ObservableRegions/RegionNavigationEvent.cs)

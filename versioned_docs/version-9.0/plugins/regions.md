---
sidebar_position: 3
uid: Plugins.ObservableRegions
title: Observable Regions
sidebar_label: Observable Regions
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Observable Regions

## Getting Started

While it has always been possible to respond to Region Navigation Events such as Navigating, Navigated and NavigationFailed through the IRegionNavigationService, this hasn't been something that is particularly easy to deal with from a global scope. This is in part due to the fact that each Region has it's own Navigation Service. `Prism.Plugin.ObservableRegions` is a new cross platform package from the Prism team exclusively available to Commercial Plus subscribers. For the first time you now have the ability to manage Region Navigation Events from a global context.

<Tabs groupId="platform">
<TabItem value="maui" label=".NET MAUI">

```cs
public static class PrismStartup
{
    public static void Configure(PrismAppBuilder builder) =>
        builder.RegisterTypes(RegisterTypes)
            .OnInitialized(container => container.ObserveRegionNavigation(RegionNavigationObserver));

    private static void RegisterTypes(IContainerRegistry containerRegistry)
    {
        containerRegistry.AddObservableRegions();
    }

    private static void RegionNavigationObserver(IContainerProvider container, IGlobalRegionNavigationObserver observer) =>
        observer.Navigation
            .Where(x => x.Event == RegionNavigationEventType.Failed)
            .Subscribe(regionEvent => {
                var logger = container.Resolve<ILogger>();
                logger.Report(regionEvent.Error!);
            });
}
```

</TabItem>
<TabItem value="wpf" label="WPF">

```cs
public partial class App : Application
{
    protected override void RegisterTypes(IContainerRegistry containerRegistry)
    {
        containerRegistry.AddObservableRegions();
    }

    protected override void OnInitialized()
    {
        Container.ObserveRegionNavigation(RegionNavigationObserver);
    }

    private static void RegionNavigationObserver(IContainerProvider container, IGlobalRegionNavigationObserver observer) =>
        observer.Navigation
            .Where(x => x.Event == RegionNavigationEventType.Failed)
            .Subscribe(regionEvent => {
                var logger = container.Resolve<ILogger>();
                logger.Report(regionEvent.Error!);
            });
}
```

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

```cs
public partial class App : Application
{
    protected override void RegisterTypes(IContainerRegistry containerRegistry)
    {
        containerRegistry.AddObservableRegions();
    }

    protected override void OnInitialized()
    {
        Container.ObserveRegionNavigation(RegionNavigationObserver);
    }

    private static void RegionNavigationObserver(IContainerProvider container, IGlobalRegionNavigationObserver observer) =>
        observer.Navigation
            .Where(x => x.Event == RegionNavigationEventType.Failed)
            .Subscribe(regionEvent => {
                var logger = container.Resolve<ILogger>();
                logger.Report(regionEvent.Error!);
            });
}
```

</TabItem>
</Tabs>

## RegionNavigationEvent

Note that this event does not inherit from PubSubEvent and is not fired from the `IEventAggregator`. The event will give you the following record with access to the Region that is being navigated, the event type, the NavigationContext, the Uri and the ViewName that was being navigated. When the Event Type is null you will also have an Error. The Error will always be null when Navigating and Navigated are the event types.

```cs
public record RegionNavigationEvent(IRegion Region, RegionNavigationEventType Event, NavigationContext Context, Uri Uri, string Name, Exception? Error = null);

public enum RegionNavigationEventType
{
    Navigating,
    Navigated,
    Failed
}
```

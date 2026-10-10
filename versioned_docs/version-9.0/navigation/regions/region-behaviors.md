---
sidebar_position: 4
uid: Navigation.Regions.RegionBehaviors
---

# Region Behaviors

A region behavior adds a policy to a region without embedding it in a particular control adapter. Adapters handle control synchronization; behaviors handle concerns such as automatic population, activation notifications and cleanup.

`IRegionBehavior` and `RegionBehavior` live in `Prism.Navigation.Regions`. Most built-in implementations are in `Prism.Navigation.Regions.Behaviors`.

## What Prism attaches for you

| Behavior | Responsibility |
| --- | --- |
| `AutoPopulateRegionBehavior` | Adds contributions registered through view discovery |
| `RegionManagerRegistrationBehavior` | Registers the region with a manager associated with its host |
| `RegionActiveAwareBehavior` | Updates `IActiveAware.IsActive` on participating views/view models |
| `RegionMemberLifetimeBehavior` | Removes deactivated views whose lifetime policy returns `KeepAlive == false` |
| `DestructibleRegionBehavior` | Calls `IDestructible.Destroy()` on participating views/view models when removed |
| `ClearChildViewsRegionBehavior` | Clears opted-in child-view manager associations when a region loses its manager |
| `SyncRegionContextWithHostBehavior` | Synchronizes region context with the host |
| Platform context binding behavior | Propagates region context to views using the platform's property system |

The context behavior is `BindRegionContextToDependencyObjectBehavior` on WPF/Uno and `BindRegionContextToVisualElementBehavior` on MAUI.

A control adapter may attach additional behavior. For example, the WPF/Uno selector adapter adds `SelectorItemsSourceSyncBehavior`; it is not a global behavior applied to every region.

## Example: observe one region's navigation

This behavior records region navigation outcomes without recording parameter values, which may contain private application data.

```csharp
using System.Diagnostics;
using Prism.Navigation.Regions;

public sealed class RegionTraceBehavior : RegionBehavior
{
    public const string BehaviorKey = "RegionTrace";

    protected override void OnAttach()
    {
        Region.NavigationService.Navigated += (_, args) =>
            Debug.WriteLine($"Region {Region.Name} navigated.");

        Region.NavigationService.NavigationFailed += (_, args) =>
            Debug.WriteLine($"Region {Region.Name} navigation did not complete.");
    }
}
```

To apply it to an already-created region:

```csharp
IRegion region = regionManager.Regions["MainRegion"];
if (!region.Behaviors.ContainsKey(RegionTraceBehavior.BehaviorKey))
    region.Behaviors.Add(RegionTraceBehavior.BehaviorKey, new RegionTraceBehavior());
```

Adding to `Behaviors` assigns the region and calls `Attach()`. Do not call `Attach()` again. Each region needs its own behavior instance.

## Apply a policy to newly created regions

Register `RegionTraceBehavior` with the container, then add its type to the default behavior factory before hosts are created.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="platform">
<TabItem value="wpf" label="WPF" default>

```csharp
protected override void ConfigureDefaultRegionBehaviors(IRegionBehaviorFactory behaviors)
{
    base.ConfigureDefaultRegionBehaviors(behaviors);
    behaviors.AddIfMissing<RegionTraceBehavior>(RegionTraceBehavior.BehaviorKey);
}
```

</TabItem>
<TabItem value="maui" label=".NET MAUI">

In the `UsePrism` configuration callback:

```csharp
prism.RegisterTypes(container => container.Register<RegionTraceBehavior>())
     .ConfigureRegionBehaviors(behaviors =>
         behaviors.AddIfMissing<RegionTraceBehavior>(RegionTraceBehavior.BehaviorKey));
```

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

```csharp
protected override void ConfigureDefaultRegionBehaviors(IRegionBehaviorFactory behaviors)
{
    base.ConfigureDefaultRegionBehaviors(behaviors);
    behaviors.AddIfMissing<RegionTraceBehavior>(RegionTraceBehavior.BehaviorKey);
}
```

</TabItem>
</Tabs>

For WPF and Uno, also add `containerRegistry.Register<RegionTraceBehavior>()` to `RegisterTypes`. With these transient registrations, the factory resolves a fresh instance for each region. Add `using Prism.Ioc;` for the container registration extensions.

`AddIfMissing` preserves an existing key. `AddOrReplace<T>(key)` changes the factory's mapping for future attachments; it does not replace a behavior already attached to an existing region. Use the built-in behavior's actual key if deliberately replacing it, and preserve its required semantics.

## Lifetime and testing

`RegionBehavior` has `OnAttach`, but no universal `OnDetach` override. Subscriptions to a singleton event publisher, timer or external service need an explicit cleanup design. The example subscribes only to the same region's navigation service; a telemetry integration with a longer-lived publisher needs more care.

Test behavior attachment once, duplicate-key handling, view removal, region teardown and repeated navigation. Test with the actual host adapter as well: a region's active set and a control's visible items are not always the same thing.

Source (Prism 9.0.537): [behavior collection attachment](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Navigation/Regions/RegionBehaviorCollection.cs), [behavior factory extensions](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Navigation/Regions/IRegionBehaviorFactoryExtensions.cs), [desktop defaults](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/PrismInitializationExtensions.cs), [MAUI defaults](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Ioc/RegionNavigationRegistrationExtensions.cs), [behavior base](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Navigation/Regions/RegionBehavior.cs), [behavior factory](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Navigation/Regions/RegionBehaviorFactory.cs).

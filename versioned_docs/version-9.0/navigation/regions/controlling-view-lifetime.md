---
sidebar_position: 10
uid: Navigation.Regions.ControllingViewLifetime
---

# Controlling View Lifetime

A view can be inactive and still remain in `region.Views`. Keeping it preserves local UI state and makes it available for [reuse](navigation-existing-views.md). Removing it releases the region's reference and triggers Prism's removal cleanup behavior.

## Keep or remove inactive views {#iregionmemberlifetime}

Implement `IRegionMemberLifetime` on the view or view model:

```csharp
using Prism.Navigation.Regions;

public sealed class CustomerDetailsViewModel : IRegionMemberLifetime
{
    public bool KeepAlive => false;
}
```

When this view is deactivated, `RegionMemberLifetimeBehavior` removes it from the region. With `KeepAlive == true`, it remains available. If there is no lifetime policy, the default is to keep it.

## A constant lifetime policy {#regionmemberlifetimeattribute}

A constant policy can also use an attribute:

```csharp
[RegionMemberLifetime(KeepAlive = false)]
public sealed class CustomerDetailsViewModel
{
}
```

The behavior checks, in order:

1. The view's `IRegionMemberLifetime`.
2. The view model's `IRegionMemberLifetime`.
3. The view's `RegionMemberLifetimeAttribute`.
4. The view model's `RegionMemberLifetimeAttribute`.

The view model comes from `DataContext` on WPF/Uno or `BindingContext` on MAUI. Avoid contradictory policies on both objects.

## Deactivation, removal and destruction are different

- **Deactivation:** removes the view from `ActiveViews`. The adapter decides what that means visually.
- **Removal:** removes it from `Views`; `KeepAlive` does not prevent an explicit `Remove`.
- **Destruction callback:** the default `DestructibleRegionBehavior` calls `Prism.Navigation.IDestructible.Destroy()` on participating removed views and view models.

A single-active content region deactivates the old view when another is activated. An all-active items region does not provide the same deactivation workflow. In a selector, inactive items can still be visible as tabs. Choose the host's [adapter](region-adapters.md) and lifetime policy together.

## Clean up resources the view model owns

```csharp
using System.Threading;
using Prism.Navigation;
using Prism.Navigation.Regions;

public sealed class SearchViewModel : IRegionMemberLifetime, IDestructible
{
    private readonly CancellationTokenSource _lifetime = new();
    private bool _destroyed;

    public bool KeepAlive => false;
    public CancellationToken LifetimeToken => _lifetime.Token;

    public void Destroy()
    {
        if (_destroyed)
            return;
        _destroyed = true;

        _lifetime.Cancel();
        _lifetime.Dispose();
        // Also release subscriptions and resources owned by this instance.
    }
}
```

Pass the token to the view model's cancellable work. Keep destruction idempotent, and do not dispose a shared service owned by the container.

`Destroy()` is not a promise that the object was garbage-collected or that arbitrary `IDisposable` dependencies were disposed. Event handlers, singletons, application caches and journal object parameters can still keep references alive. Container scopes have their own [lifetime rules](../../dependency-injection/registering-types.md).

## History and nested views

Removing a view does not remove its navigation journal entry. Going back can create a new instance and replay its parameters. If a workflow must not be revisited, choose an appropriate [journal policy](navigation-journal.md) instead of relying on `KeepAlive`.

For nested regions, test child-manager associations when the containing view is removed. The desktop `ClearChildViewsRegionBehavior` cleanup is opt-in through its `ClearChildViews` attached property; registering the behavior alone does not enable that policy on every view. Do not assume removing a region from the manager is equivalent to removing every contained view.

Source (Prism 9.0.537): [lifetime policy](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Navigation/Regions/Behaviors/RegionMemberLifetimeBehavior.cs), [destruction on removal](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Navigation/Regions/Behaviors/DestructibleRegionBehavior.cs), [nested-region cleanup](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Navigation/Regions/Behaviors/ClearChildViewsRegionBehavior.cs), [MAUI lifetime policy](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Navigation/Regions/Behaviors/RegionMemberLifetimeBehavior.cs).

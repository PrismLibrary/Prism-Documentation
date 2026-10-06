---
sidebar_position: 1
---

# Region Navigation {#getting-started}

A region is a named place in your interface that Prism can populate with views. The host might be a single content area, a list of independent panels or a selector such as a tab control. The region tracks its views; a platform-specific adapter connects that state to the actual control.

## The pieces

- **Host:** the XAML control with a `RegionName` attached property.
- **Region:** an `IRegion` with `Views`, `ActiveViews`, a navigation service and behaviors.
- **Region manager:** an `IRegionManager` that locates regions by name within its scope.
- **Navigation target:** a view registered with Prism's navigation registration API.
- **View model:** optional `IRegionAware`, `IConfirmNavigationRequest` and lifetime interfaces that participate in the workflow.

Shared contracts live in `Prism.Navigation.Regions`. Implementations connect to WPF, MAUI or Uno Platform controls. Reusing a view model does not imply that XAML, registration methods or host adapters are identical.

## Three ways to populate a region {#navigation-in-prism}

| Approach | Typical use | What initiates it |
| --- | --- | --- |
| View discovery | A module contributes a toolbar or a permanent panel | `RegisterViewWithRegion` creates content as a matching region becomes available |
| View injection | The caller owns the exact instance and its placement | `AddToRegion` or `IRegion.Add` |
| URI navigation | User-driven screens with parameters, confirmation and history | `RequestNavigate` |

Use URI navigation when you need navigation callbacks and a journal. Direct `Add`, `Activate` and `Remove` calls do not automatically run the region navigation pipeline. A selector changing its selected item is not automatically a confirmed `RequestNavigate` operation either.

## Build your first region workflow

1. [Region Manager](region-manager.md): define a host, understand names and scopes.
2. [Basic Region Navigation](basic-region-navigation.md): register a view and inspect the result.
3. [View and View Model Participation](view-viewmodel-participation.md): initialize the destination.
4. [Passing Parameters](passing-parameters.md): navigate to a particular record.
5. [Navigating to Existing Views](navigation-existing-views.md): decide which instance to reuse.
6. [Confirming Navigation](confirming-navigation.md): protect unfinished edits.
7. [Controlling View Lifetime](controlling-view-lifetime.md): retain or remove inactive views.
8. [Navigation Journal](navigation-journal.md): add Back and Forward.

For custom controls, continue with [Region Adapters](region-adapters.md). For reusable composition policies, use [Region Behaviors](region-behaviors.md). The optional [Global Region Observer](../../plugins/regions.md) provides an application-wide observation layer.

Source (Prism 9.0.537): [IRegion](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Navigation/Regions/IRegion.cs), [IRegionManager](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Navigation/Regions/IRegionManager.cs).

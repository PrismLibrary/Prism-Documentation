---
sidebar_position: 7
uid: Navigation.Regions.NavigationExistingViews
---

# Navigating to Existing Views

A navigation request does not always create a new view. Prism looks for an existing candidate in the target region, asks its `IRegionAware.IsNavigationTarget` participants whether it can handle the request, and reuses the first accepting candidate. Otherwise it creates a new view.

## Choose an instance policy

| Policy | `IsNavigationTarget` | Suitable workflow |
| --- | --- | --- |
| Reuse a matching view | Return `true` | One detail pane that updates for each selection |
| One instance per record | Compare the incoming ID with the instance's ID | Several open customer/document tabs |
| Always create a new instance | Return `false` | Independent editing sessions |

If both view and view model implement `IRegionAware`, the candidate must pass both checks. A matching candidate without the interface accepts by default. Reuse still invokes `OnNavigatedTo`, so refresh state from the incoming parameters.

## One view per customer

```csharp
using System;
using Prism.Mvvm;
using Prism.Navigation.Regions;

public sealed class CustomerEditorViewModel : BindableBase, IRegionAware
{
    private string _customerId = string.Empty;
    public string CustomerId
    {
        get => _customerId;
        private set => SetProperty(ref _customerId, value);
    }

    public bool IsNavigationTarget(NavigationContext context) =>
        context.Parameters.TryGetValue<string>("customerId", out var id)
        && string.Equals(CustomerId, id, StringComparison.Ordinal);

    public void OnNavigatedTo(NavigationContext context)
    {
        if (!context.Parameters.TryGetValue<string>("customerId", out var id)
            || string.IsNullOrWhiteSpace(id))
            throw new ArgumentException("A customerId is required.");
        CustomerId = id;
    }

    public void OnNavigatedFrom(NavigationContext context) { }
}
```

Navigate using `CustomerEditorView?customerId=C-104`, then `C-205`, then `C-104`. With retained views, the final request should reactivate the first instance. With `KeepAlive == false`, a deactivated instance may already have been removed, so Prism must create another one.

## Registration names and candidate matching

Use explicit navigation registration and keep route names stable. In Prism 9.0, the WPF/Uno loader first looks for views whose CLR short or full name matches the route. If there are no such candidates, it asks the container for the type registered under that name and looks for views of that type. New views are resolved using the named registration.

An alias can resolve a view, but do not use different aliases for the same CLR type as an instance-isolation policy. The 9.0 desktop fallback matches by type; use a record ID in `IsNavigationTarget` to choose the instance.

:::caution MAUI 9.0 alias reuse: static-source observation
The shipped MAUI loader first matches the view's CLR short or full name. Its fallback checks `registration is null` before accessing `registration.View`, and does not return the candidate sequence it computes. This source inspection identifies an alias-reuse and missing-registration risk; it is not a runtime reproduction. The walkthrough uses a registered view's default type-name route. If aliases are required, test initial navigation, repeated navigation to a retained instance and an unknown route against the exact package you ship.
:::

View identity, region instance names and navigation registration names are separate concepts. `region.GetView("editor-C104")` only finds an instance explicitly named when it was added; it does not ask `IsNavigationTarget`.

## Verify the full workflow

Test the same ID twice, a different ID, a return to an inactive ID, a rejected confirmation, and removal followed by another request. Inspect both `region.Views` and `region.ActiveViews`: a hidden retained view may still be a valid candidate.

Do not register a navigation view as a singleton to force reuse. The region should decide reuse, and visual instances cannot safely belong to multiple hosts. Keep shared data in services with a deliberately chosen [container lifetime](../../dependency-injection/registering-types.md).

Source (Prism 9.0.537): [desktop candidate matching](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Navigation/Regions/RegionNavigationContentLoader.cs), [MAUI candidate matching](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Navigation/Regions/Navigation/RegionNavigationContentLoader.cs).

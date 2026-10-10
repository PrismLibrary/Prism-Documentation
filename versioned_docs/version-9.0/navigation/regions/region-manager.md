---
sidebar_position: 2
uid: Navigation.Regions.RegionManager
---

# Region Manager

`IRegionManager` finds regions by name and coordinates view discovery, injection and navigation. Inject it into a view model or module; the static `RegionManager` attached properties connect a host control to that infrastructure.

## Declare an empty host

The host's content belongs to the region. Do not also bind its `Content` or populate an `ItemsSource` that the adapter will manage.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="platform">
<TabItem value="wpf" label="WPF" default>

Inside the shell created by `PrismApplication`:

```xml
<ContentControl xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
                xmlns:prism="http://prismlibrary.com/"
                prism:RegionManager.RegionName="MainRegion" />
```

Prism attaches the application's region manager to its shell. Hosts elsewhere, such as a separately created window, need an appropriate manager attached with `RegionManager.SetRegionManager`.

</TabItem>
<TabItem value="maui" label=".NET MAUI">

Inside a page created by Prism navigation:

```xml
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:regions="clr-namespace:Prism.Navigation.Regions.Xaml;assembly=Prism.Maui"
             regions:RegionManager.RegionName="MainRegion" />
```

The attached-property class is `Prism.Navigation.Regions.Xaml.RegionManager`. The service class is `Prism.Navigation.Regions.RegionManager`. In Prism 9.0, delayed creation waits until the host has a parent page, then copies that page's container provider to the host. Create the containing page through Prism navigation so that provider is available. The default accessor uses the application manager if no manager is explicitly set on the host, so names must be unique across pages sharing it.

Use a `ContentView` inside the page as the single-view host. The default Prism 9.0 mappings do not make the `ContentPage` itself a region host.

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

Inside the shell:

```xml
<ContentControl xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
                xmlns:regions="using:Prism.Navigation.Regions"
                regions:RegionManager.RegionName="MainRegion" />
```

Use the WinUI `using:` namespace form. Prism's application startup attaches the manager to the shell; initial navigation belongs after the shell and its regions are ready.

</TabItem>
</Tabs>

## Discover, inject or navigate

These fragments run with an injected `IRegionManager regionManager`. Register navigation targets as shown in [Basic Region Navigation](basic-region-navigation.md).

For the type-based discovery example, register the concrete `ToolbarView` with `containerRegistry.Register<ToolbarView>()` on WPF/Uno; register its view model and dependencies as needed. On MAUI, use `RegisterForRegionNavigation<ToolbarView, ToolbarViewModel>()` so the region registry knows the view and its binding context. The example types are application-defined.

```csharp
using Prism.Navigation.Regions;

// Discovery can be registered before the host exists.
regionManager.RegisterViewWithRegion("ToolbarRegion", typeof(ToolbarView));

// Navigation needs a region that has already been created and registered.
regionManager.RequestNavigate("MainRegion", "CustomerView", result =>
{
    if (!result.Success)
        System.Diagnostics.Debug.WriteLine(result.Exception?.Message
            ?? "Navigation did not complete.");
});
```

For injection, the caller owns the view instance and any view-model assignment:

```csharp
IRegion region = regionManager.Regions["MainRegion"];
region.Add(customerView, "customer-C104");
region.Activate(customerView);

object existing = region.GetView("customer-C104");
```

The instance name in `Add(view, "customer-C104")` is a lookup key for `GetView`, not a new navigation route. Removing a region from `Regions` is also different from removing its views. Plan view cleanup explicitly; see [lifetime](controlling-view-lifetime.md).

## Keep region names local to a scope

Two live hosts cannot register the same name in one manager. This matters when a document view contains its own `DetailsRegion` and several documents can be open at once.

On WPF and Uno, injection can give each document a region-manager scope:

```csharp
IRegion documents = regionManager.Regions["DocumentsRegion"];
IRegionManager documentRegions = documents.Add(
    documentView, "document-C104", createRegionManagerScope: true);
documents.Activate(documentView);

// Once the document's child host has been created:
documentRegions.RequestNavigate("DetailsRegion", "CustomerView");
```

Keep the returned manager with that document's coordinator. Resolving `IRegionManager` from the root container again gives the application manager, not automatically this document manager. A region-manager scope is a naming/composition scope; it does not by itself create a dependency-injection lifetime scope.

For MAUI, assign a dedicated manager directly to the region host when isolating repeated hosts, using `Prism.Navigation.Regions.Xaml.RegionManager.SetRegionManager(host, manager)`. Do not assume a manager attached only to an ancestor overrides MAUI's default host accessor. Keep page-container scope and region-manager scope distinct.

## Diagnose a missing region

1. Check the exact name and the `IRegionManager` instance receiving the request.
2. Confirm the host has entered its platform's visual/page lifecycle. Constructor-time navigation can be too early.
3. Check that an [adapter](region-adapters.md) exists for the control type.
4. Inspect the navigation result and its exception rather than using an overload that discards it.
5. For repeated views/pages, check duplicate names and whether the previous host remains alive.

Calling `UpdateRegions()` requests a registration update; it cannot create an absent visual tree or provide a missing MAUI page container.

Source (Prism 9.0.537): [shared manager contract](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Navigation/Regions/IRegionManager.cs), [desktop region implementation](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Navigation/Regions/Region.cs), [MAUI attached properties](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Navigation/Regions/Xaml/RegionManager.cs), [MAUI manager accessor](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Navigation/Regions/DefaultRegionManagerAccessor.cs), [MAUI delayed creation](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Navigation/Regions/Behaviors/DelayedRegionCreationBehavior.cs), [WPF/Uno type-based discovery](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Navigation/Regions/RegionViewRegistry.cs).

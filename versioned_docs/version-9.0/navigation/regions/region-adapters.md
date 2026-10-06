---
sidebar_position: 3
uid: Navigation.Regions.RegionAdapter
---

# Region Adapters {#region-adapter}

A region adapter connects a control to an `IRegion`. It chooses the region's activation model and synchronizes the region's views with the control. An adapter is needed only when an existing mapping does not provide the behavior your host requires.

## Built-in mappings differ by platform

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="platform">
<TabItem value="wpf" label="WPF" default>

| Host | Adapter | Region model |
| --- | --- | --- |
| `ContentControl` | `ContentControlRegionAdapter` | `SingleActiveRegion` |
| `ItemsControl` | `ItemsControlRegionAdapter` | `AllActiveRegion` |
| `Selector`, including `TabControl` | `SelectorRegionAdapter` | `Region`, with selection synchronization |

The first model replaces content; the second keeps all contributed items active. The selector adapter attaches `SelectorItemsSourceSyncBehavior` to coordinate selection and activation.

</TabItem>
<TabItem value="maui" label=".NET MAUI">

| Host | Adapter | Region model |
| --- | --- | --- |
| `ContentView` | `ContentViewRegionAdapter` | `SingleActiveRegion` |
| `CarouselView` | `CarouselViewRegionAdapter` | `SingleActiveRegion`, synchronized with the current item |
| `Layout` | `LayoutRegionAdapter` | `Region` |
| `ScrollView` | `ScrollViewRegionAdapter` | `Region` |

The legacy compatibility `Layout<View>` also has a mapping. Adapter classes and `RegionAdapterMappings` are in `Prism.Navigation.Regions.Adapters`.

`CollectionViewRegionAdapter` exists in the Prism 9.0 source but is not registered by default. Do not assume every MAUI items control is a supported default region host. For ordinary single-view navigation, prefer an empty `ContentView` inside a page: the `ScrollView` adapter uses a general region and displays the first active view, rather than enforcing single-active semantics. A `ContentPage` region adapter is not included in 9.0.

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

Uno uses the `ContentControl`, `ItemsControl` and `Selector` mappings, plus `NavigationViewRegionAdapter` for WinUI `NavigationView`. That adapter creates a `SingleActiveRegion`, navigates to the selected item's string `Tag`, and handles `BackRequested` with the region journal.

Use `Microsoft.UI.Xaml.Controls` controls. Region adapter types remain in `Prism.Navigation.Regions`.

</TabItem>
</Tabs>

Mappings search the exact host type, then its base classes. A custom control derived from `ContentControl` or `ContentView` may already work with its inherited mapping.

## Example: a WPF panel for permanent contributions

A toolbar composed of several independent views needs all its items active. This WPF example rebuilds an initially empty `StackPanel` from `region.Views`, covering both additions and removals.

```csharp
using System;
using System.Windows;
using System.Windows.Controls;
using Prism.Navigation.Regions;

public sealed class StackPanelRegionAdapter : RegionAdapterBase<StackPanel>
{
    public StackPanelRegionAdapter(IRegionBehaviorFactory behaviors)
        : base(behaviors) { }

    protected override IRegion CreateRegion() => new AllActiveRegion();

    protected override void Adapt(IRegion region, StackPanel host)
    {
        if (host.Children.Count != 0)
            throw new InvalidOperationException("The region host must be empty.");

        void Synchronize()
        {
            host.Children.Clear();
            foreach (object view in region.Views)
            {
                if (view is not UIElement element)
                    throw new InvalidOperationException("A WPF UIElement is required.");
                host.Children.Add(element);
            }
        }

        region.Views.CollectionChanged += (_, _) => Synchronize();
        Synchronize();
    }
}
```

In the WPF application's existing overrides:

```csharp
protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    containerRegistry.Register<StackPanelRegionAdapter>();
    // Keep the application's other registrations here.
}

protected override void ConfigureRegionAdapterMappings(RegionAdapterMappings mappings)
{
    base.ConfigureRegionAdapterMappings(mappings);
    mappings.RegisterMapping<StackPanel, StackPanelRegionAdapter>();
}
```

Use `Prism.Ioc` for the registration extension. The mapping resolves and retains an adapter instance, so transient registration does not create a new adapter for every host. Keep host-specific state in the `Adapt` call's local variables, as above, or in a separate behavior instance for each region. Do not store the current host in an adapter field that another host could overwrite.

This example is intentionally small: a production adapter may need incremental updates, selection, virtualization, sorting, host teardown or third-party control integration. Do not put the same visual instance into two controls.

## Port the contract, not the control code

WPF and Uno use `RegionAdapterBase<T>.CreateRegion()` and the application's `ConfigureRegionAdapterMappings` override. Use the relevant framework control and visual base types when porting an adapter.

MAUI uses `Prism.Navigation.Regions.Adapters.RegionAdapterBase<T>` where `T : VisualElement`. Its factory signature is `CreateRegion(IContainerProvider container)`; resolve the region from that supplied page container, for example `container.Resolve<SingleActiveRegion>()`. Configure mappings with the `PrismAppBuilder.ConfigureRegionAdapters` callback. MAUI also offers `RegisterOrReplaceMapping<TControl, TAdapter>()` for deliberate replacement; the desktop mappings do not offer that method.

Let the base adapter attach default [region behaviors](region-behaviors.md). Replacing those defaults without preserving registration, context and lifetime behavior can make a host display content while silently breaking navigation cleanup.

Source (Prism 9.0.537): [WPF/Uno default mappings](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/PrismInitializationExtensions.cs), [desktop mapping lifetime](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Navigation/Regions/RegionAdapterMappings.cs), [MAUI default mappings](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Ioc/RegionNavigationRegistrationExtensions.cs), [MAUI adapter base](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Navigation/Regions/Adapters/RegionAdapterBase.cs), [MAUI mappings](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Navigation/Regions/Adapters/RegionAdapterMappings.cs).

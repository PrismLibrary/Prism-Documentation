---
sidebar_position: 3
uid: Navigation.Regions.RegionAdapter
---

# Region Adapters

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
| `ContentPage` | `ContentPageRegionAdapter` | `SingleActiveRegion` |
| `CarouselView` | `CarouselViewRegionAdapter` | `SingleActiveRegion`, synchronized with the current item |
| `Layout` | `LayoutRegionAdapter` | `Region` |
| `ScrollView` | `ScrollViewRegionAdapter` | `Region` |

The legacy compatibility `Layout<View>` also has a mapping. Adapter classes and `RegionAdapterMappings` are in `Prism.Navigation.Regions.Adapters`.

`CollectionViewRegionAdapter` exists in source but is not registered by default. Do not assume every MAUI items control is a supported default region host. For ordinary single-view navigation, prefer `ContentView` or an empty `ContentPage`: the `ScrollView` adapter uses a general region and displays the first active view, rather than enforcing single-active semantics.

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

Uno uses the `ContentControl`, `ItemsControl` and `Selector` mappings, plus `NavigationViewRegionAdapter` for WinUI `NavigationView`. That adapter creates a `SingleActiveRegion`, navigates to the selected item's string `Tag`, and handles `BackRequested` with the region journal.

Use `Microsoft.UI.Xaml.Controls` controls. Region adapter types remain in `Prism.Navigation.Regions`.

</TabItem>
<TabItem value="avalonia" label="Avalonia">

Prism.Avalonia registers `ContentControlRegionAdapter` and `ItemsControlRegionAdapter`. It compiles the shared desktop adapter sources against Avalonia controls.

`SelectorRegionAdapter` is explicitly excluded from the Avalonia project. An Avalonia `TabControl` deriving from `ItemsControl` does not therefore acquire the WPF selector behavior. Add and test a custom adapter when you need tab selection to drive region activation.

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

Use `Prism.Ioc` for the registration extension. The mapping retains the adapter instance it resolves, even if its service registration is transient. Keep each host's state in the `Adapt` call's local variables or a behavior created for that region, rather than in shared adapter fields.

This example is intentionally small: a production adapter may need incremental updates, selection, virtualization, sorting, host teardown or third-party control integration. Do not put the same visual instance into two controls.

## Port the contract, not the control code

WPF, Uno and Avalonia use `RegionAdapterBase<T>.CreateRegion()` and the application's `ConfigureRegionAdapterMappings` override. Use the relevant framework control and visual base types when porting an adapter.

MAUI uses `Prism.Navigation.Regions.Adapters.RegionAdapterBase<T>` where `T : VisualElement`. Its factory signature is `CreateRegion(IContainerProvider container)`; resolve the region from that supplied page container, for example `container.Resolve<SingleActiveRegion>()`. Configure mappings with the `PrismAppBuilder.ConfigureRegionAdapters` callback. MAUI also offers `RegisterOrReplaceMapping<TControl, TAdapter>()` for deliberate replacement; the desktop mappings do not offer that method.

Let the base adapter attach default [region behaviors](region-behaviors.md). Replacing those defaults without preserving registration, context and lifetime behavior can make a host display content while silently breaking navigation cleanup.

Source: [desktop default mappings](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Wpf/Prism.Wpf/PrismInitializationExtensions.cs), [MAUI default mappings](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Ioc/RegionNavigationRegistrationExtensions.cs), [MAUI adapter base](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Navigation/Regions/Adapters/RegionAdapterBase.cs), [Avalonia source inclusions/exclusions](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Avalonia/Prism.Avalonia/Prism.Avalonia.csproj).

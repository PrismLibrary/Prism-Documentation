---
sidebar_position: 1
---

# Navigation

Choose navigation by the part of the interface that changes. A region replaces or activates content inside a named host. .NET MAUI page navigation changes the application's page stack. They can be used together, but they have different lifecycles and histories.

These Prism 9.0 walkthroughs cover WPF, .NET MAUI and Uno Platform. Source references are pinned to the commit recorded by the shipped 9.0.537 packages.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="platform">
<TabItem value="wpf" label="WPF" default>

Use `IRegionManager` for Prism navigation inside a shell, including content areas and document tabs. A WPF `Frame` and its native navigation journal are separate from Prism's region journal.

</TabItem>
<TabItem value="maui" label=".NET MAUI">

Use `INavigationService` for pages, navigation stacks, modal pages and tabs. Use `IRegionManager` for views inside a page. Register pages with `RegisterForNavigation` and region views with `RegisterForRegionNavigation`.

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

Use `IRegionManager` to compose and navigate the shell. Prism includes a `NavigationView` adapter, but does not expose MAUI's page-stack navigation service for Uno. Native WinUI/Uno `Frame` navigation is a different mechanism.

</TabItem>
</Tabs>

## Start here

1. [Understand regions](regions/index.md), then [declare a host](regions/region-manager.md).
2. [Register and navigate to a view](regions/basic-region-navigation.md).
3. [Pass parameters](navigation-parameters.md) and [handle the view lifecycle](regions/view-viewmodel-participation.md).
4. Add [confirmation](regions/confirming-navigation.md), [view reuse](regions/navigation-existing-views.md) and [Back/Forward history](regions/navigation-journal.md) when your workflow needs them.

For a MAUI page workflow, start with [Page Navigation](page-navigation.md). For feature packages that register navigation targets, see [Modularity](../modularity/index.md).

## Shared types, different contracts

`NavigationParameters`, `INavigationParameters`, `NavigationResult` and `INavigationResult` are in `Prism.Navigation`. Region services and lifecycle contracts are in `Prism.Navigation.Regions`.

Use `IRegionAware` for region lifecycle participation. MAUI's page `INavigationAware` takes `INavigationParameters`, whereas region callbacks take a `NavigationContext`. Shared parameter types do not make these interfaces interchangeable.

Source (Prism 9.0.537): [region lifecycle contract](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Navigation/Regions/IRegionAware.cs), [navigation result contract](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Navigation/INavigationResult.cs).

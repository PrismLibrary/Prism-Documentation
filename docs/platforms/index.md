---
sidebar_position: 0
title: Choose Your Platform
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Choose Your Platform

Prism shares commands, events, view-model patterns, and container abstractions across hosts. Startup, XAML namespaces, navigation ownership, and UI lifetime are platform-specific. Begin with the guide for the application you are building.

<Tabs groupId="platform">
<TabItem value="wpf" label="WPF" default>

Build a Windows desktop shell with `Prism.DryIoc` or `Prism.Unity`. The shell is `System.Windows.Window`; views use `DataContext`, and navigation generally composes `Prism.Navigation.Regions` within that shell.

1. [Create and run a WPF application](wpf/getting-started.md)
2. [Compose views into regions](wpf/view-composition.md)
3. [Show WPF dialogs](wpf/dialog-service.md)

WPF uses `xmlns:prism="http://prismlibrary.com/"`. WPF is not a NativeAOT target.

</TabItem>
<TabItem value="maui" label=".NET MAUI">

Start with a normal MAUI `Application` and configure Prism through `MauiAppBuilder.UsePrism`. Register pages, then use `PrismAppBuilder.CreateWindow` for initial navigation. Page navigation services are associated with their owning pages.

1. [Create and run a MAUI application](maui/index.md)
2. [Configure the builder](maui/appbuilder.md)
3. [Navigate pages](maui/navigation/page-navigation.md), [build tabs](maui/navigation/tabbed-navigation.md), and [use dialogs](maui/dialogs/index.md)

MAUI uses `xmlns:prism="http://prismlibrary.com"` without a trailing slash and binds through `BindingContext`. MAUI Shell is not a supported Prism navigation host.

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

Use `Prism.Uno.WinUI` with a compatible container integration such as `Prism.DryIoc.Uno.WinUI`. Uno.Extensions creates the window; Prism supplies a `Microsoft.UI.Xaml.UIElement` shell and finalizes the host after the shell loads.

1. [Create and run an Uno application](uno/index.md)
2. [Configure Uno.Extensions and service timing](uno/extensions.md)
3. [Navigate regions](../navigation/regions/index.md) and [use dialogs](../dialogs/index.md)

Use WinUI-compatible `using:` XAML namespaces, such as `using:Prism.Navigation.Regions`. The loaded window's `XamlRoot` matters for Uno dialogs.

</TabItem>
<TabItem value="avalonia" label="Avalonia">

Use `Prism.Avalonia` with a compatible container integration such as `Prism.DryIoc.Avalonia`. Return an Avalonia `Window` shell for a classic desktop lifetime or a `Control` for a single-view lifetime.

1. [Create and run an Avalonia application](avalonia/index.md)
2. [Compose Avalonia regions](avalonia/regions.md)
3. [Show desktop dialogs](avalonia/dialogs.md)

Avalonia uses `xmlns:prism="http://prismlibrary.com/"` and `DataContext`. Its default adapters and dialog lifetime behavior differ from WPF; use the Avalonia guide rather than copying WPF host code.

</TabItem>
</Tabs>

## Check compatibility before adding features

Use the target frameworks and package versions declared by the actual host you restore. The setup guides cite the audited source head and distinguish it from published package availability. A library targeting a framework is not proof that every operating-system head, third-party dependency, or deployment mode is qualified.

Prism 10.0 (vNext) is planned as the first NativeAOT-ready release. The supported container is `Prism.Container.Microsoft` from Commercial Plus; see the [NativeAOT guide](../dependency-injection/native-aot.md) for host-specific limits. Package/source access for commercial components is separate from access to the public Prism source.

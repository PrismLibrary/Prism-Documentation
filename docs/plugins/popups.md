---
sidebar_position: 4
title: Popups
sidebar_label: Popups
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Popup dialog hosts

Prism's MAUI popup plugins host [IDialogService](../dialogs/index.md) dialogs in an overlay provided by Mopups or the .NET MAUI Community Toolkit. Install one selected provider from the [authorized Commercial Plus feed](../pipelines/commercial-plus.md). Keep view models on Prism's dialog contract so the hosting choice stays in the composition root.

## Choose a MAUI provider

<Tabs groupId="popup-provider">
<TabItem value="mopups" label="Mopups">

Install `Prism.Plugin.Popups.Maui`. Inside the existing Prism builder callback:

```csharp
using Prism.Plugin.Popups;

prism.ConfigureMopupDialogs();
```

This also calls the Mopups host setup, registers its popup navigation singleton, replaces `IDialogContainer`, and selects `SingletonDialogService`. Account for that dialog-service lifetime when resolving application dependencies. Do not also configure the Community Toolkit provider in the same startup path.

</TabItem>
<TabItem value="community-toolkit" label="Community Toolkit">

Install `Prism.Plugin.Popups.CommunityToolkit.Maui`:

```csharp
using Prism.Plugin.Popups;

prism.ConfigureCommunityToolkitDialogs();
```

This calls `UseMauiCommunityToolkit()` and replaces `IDialogContainer`, retaining Prism's scoped dialog service. It does not use Mopups-specific attached properties. Match the installed Community Toolkit/MAUI versions and their actual supported platform assets.

</TabItem>
</Tabs>

Register content with Prism, for example in the same builder's `RegisterTypes` callback:

```csharp
registry.RegisterDialog<ConfirmExportView, ConfirmExportViewModel>();
```

`ConfirmExportView` is an application-defined MAUI `ContentView`; its view model implements the current `Prism.Dialogs.IDialogAware` contract. It is not a `ContentPage` or a directly managed third-party popup page. Keep its XAML initialization and dialog lifecycle under Prism.

## Shared dialog layout

Use Prism's `DialogLayout` properties for host-neutral layout, mask, and relative sizing:

```xml
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:prism="http://prismlibrary.com"
             x:Class="ExampleApp.Views.ConfirmExportView"
             prism:DialogLayout.RelativeWidthRequest="0.8">
    <VerticalStackLayout Padding="24" Spacing="12">
        <Label Text="Export this report?" />
        <Button Text="Export" Command="{Binding ConfirmCommand}" />
        <Button Text="Cancel" Command="{Binding CancelCommand}" />
    </VerticalStackLayout>
</ContentView>
```

Define the commands in the dialog view model and close through its Prism `RequestClose` listener. See [MAUI dialogs](../platforms/maui/dialogs/index.md) for the full view-model and result lifecycle. Relative width is a fraction of the host, not a guarantee of a readable layout on every window size; test small/resized windows and keyboard appearance.

## Mopups-only attached properties

`Prism.Plugin.Popups.Xaml.PopupDialogLayout` is exposed through the Prism XAML namespace. These settings apply to the Mopups container:

| Property | Default | Purpose |
| --- | --- | --- |
| `HasSystemPadding` | `true` | Apply native system padding |
| `SystemPadding` | default `Thickness` | Padding value bound into the Mopups host |
| `Animation` | `ScaleAnimation` | A Mopups `IPopupAnimation` |
| `IsAnimationEnabled` | `true` | Enable host animation |
| `SystemPaddingSides` | `PaddingSide.All` | Sides receiving system padding |
| `BackgroundInputTransparent` | `false` | Background hit-testing behavior |
| `HasKeyboardOffset` | `true` | Enable the host's keyboard offset behavior |
| `KeyboardOffset` | `0d` | Host keyboard offset attached value; its binding mode is `OneWayToSource` |

Disabling system padding does not, by itself, make content full-screen. `SystemPadding` and `KeyboardOffset` are wired to the host's read-only properties; do not treat a numeric assignment as a portable way to move a dialog. Avoid applying Mopups animation/layout options to the Community Toolkit host.

## Dismissal and lifecycle

Open the dialog through `IDialogService` from the active page context. Prism owns dismissal and the `CanCloseDialog` veto. Do not remove native popups directly to bypass it, or assume a background tap always closes the dialog. Provider implementations coordinate dismissal and repeated close requests, but the app must still verify cancel, veto, rapid repeated actions, background taps, Back, interrupted presentation, and stacked-dialog behavior on its target devices.

Dialog results and permission/cancellation semantics belong to the Prism dialog lifecycle; these registrations do not add an arbitrary cancellation-token overload or guarantee native rendering in a portable test.

<Tabs groupId="platform">
<TabItem value="maui" label=".NET MAUI">

Both packages are MAUI hosts. Select a provider after checking its package assets and native dependencies for your Android, Apple, and Windows heads.

</TabItem>
<TabItem value="wpf" label="WPF">

Use Prism's desktop dialog service/window contracts. These MAUI provider registrations do not apply to WPF.

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

Use Prism's Uno dialog integration. A shared `IDialogAware` view-model contract does not make the MAUI popup container a supported Uno host.

</TabItem>
<TabItem value="avalonia" label="Avalonia">

Use Prism's Avalonia dialog integration. Do not add MAUI provider packages to obtain an Avalonia popup host.

</TabItem>
</Tabs>

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Popups.Maui/MopupsRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Popups.Maui/MopupsRegistrationExtensions.cs)
- [`src/Prism.Plugin.Popups.Maui/Xaml/PopupDialogLayout.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Popups.Maui/Xaml/PopupDialogLayout.cs)
- [`src/Prism.Plugin.Popups.Maui/PopupDialogContainer.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Popups.Maui/PopupDialogContainer.cs)
- [`src/Prism.Plugin.Popups.CommunityToolkit.Maui/CommunityToolkitRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Popups.CommunityToolkit.Maui/CommunityToolkitRegistrationExtensions.cs)
- [`src/Prism.Plugin.Popups.CommunityToolkit.Maui/CommunityToolkitDialogContainer.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Popups.CommunityToolkit.Maui/CommunityToolkitDialogContainer.cs)

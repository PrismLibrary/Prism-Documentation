---
sidebar_position: 4
title: Popups
sidebar_label: Popups
description: Host Prism 9 MAUI dialogs with Mopups, register dialog views, and configure popup layout and closing.
---

# Popups

## Getting Started

`Prism.Plugin.Popups.Maui` hosts Prism [IDialogService](../dialogs/index.md) dialogs using Mopups. Obtain a compatible package from the [Commercial Plus feed](../pipelines/commercial-plus.md). The view model uses Prism's dialog contract while the plugin supplies the native popup host.

For applications migrating from Prism.Forms, popup navigation through `INavigationService` is no longer supported by this plugin. Convert popup content into a MAUI `ContentView`, register it as a dialog, and open it through `IDialogService`.

## Setup

Install `Prism.Plugin.Popups.Maui` in your MAUI project, selecting a version compatible with its Prism and Mopups dependencies. Inside your existing Prism builder callback, configure the host and register your dialog:

```csharp
using Prism.Ioc;
using Prism.Plugin.Popups;

prism.ConfigureMopupDialogs();
prism.RegisterTypes(registry =>
{
    registry.RegisterDialog<MyDialog, MyDialogViewModel>();
});
```

`MyDialog` and `MyDialogViewModel` are application-defined types. `ConfigureMopupDialogs()` also configures Mopups on the MAUI builder, registers its popup navigation singleton, replaces `IDialogContainer`, and selects `SingletonDialogService` as `IDialogService`. This changes the default MAUI dialog-service lifetime, so account for it when resolving dependencies and test calls against the active application window.

This package is a MAUI host. Use the platform's Prism dialog integration for WPF and Uno; the MAUI registration does not install a desktop dialog window.

## Creating a Dialog View

Create a MAUI `ContentView` with its usual code-behind constructor calling `InitializeComponent()`. Its view model implements [Prism 9's IDialogAware](../dialogs/dialog-aware.md), including the get-only `DialogCloseListener RequestClose` property. Prism initializes that listener.

```xml
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:prism="http://prismlibrary.com"
             x:Class="YourNamespace.MyDialog"
             prism:DialogLayout.CloseOnBackgroundTapped="False">
    <!-- Your dialog content and close-command bindings. -->
</ContentView>
```

Register this content view rather than deriving it from Mopups `PopupPage` or registering it for page navigation. See [MAUI dialogs](../platforms/maui/dialogs/index.md) for a complete view-model, close-command, and result example.

## Attached Properties

`Prism.Plugin.Popups.Xaml.PopupDialogLayout` is exposed through the Prism XAML namespace and supplies the following Mopups-specific settings. These are host settings; verify native behavior on the devices you support.

### `HasSystemPadding`

- **Type:** `bool`
- **Default:** `true`
- **Purpose:** Controls the host's use of system padding. Setting it to `false` removes that padding behavior; it does not set the dialog's width or height or make its content full-screen.

```xml
prism:PopupDialogLayout.HasSystemPadding="False"
```

### `SystemPadding`

- **Type:** `Thickness`
- **Default:** `default(Thickness)`
- **Purpose:** A value associated with Mopups' host-managed system padding. Use your content's `Padding` or `Margin` for application-owned spacing instead of assuming this value overrides native insets.

### `Animation`

- **Type:** Mopups `IPopupAnimation`
- **Default:** `ScaleAnimation`
- **Purpose:** Supplies the Mopups appearance/disappearance animation. Declare the Mopups animation XML namespace when using an animation in XAML.

```xml
<prism:PopupDialogLayout.Animation>
    <animation:MoveAnimation PositionIn="Top" PositionOut="Bottom" />
</prism:PopupDialogLayout.Animation>
```

### `IsAnimationEnabled`

- **Type:** `bool`
- **Default:** `true`
- **Purpose:** Enables the host's popup animations.

```xml
prism:PopupDialogLayout.IsAnimationEnabled="False"
```

### `SystemPaddingSides`

- **Type:** Mopups `PaddingSide`
- **Default:** `PaddingSide.All`
- **Purpose:** Selects which sides receive system padding.

```xml
prism:PopupDialogLayout.SystemPaddingSides="Top,Bottom"
```

### `BackgroundInputTransparent`

- **Type:** `bool`
- **Default:** `false`
- **Purpose:** Controls Mopups' background hit-testing behavior. It is separate from Prism's `DialogLayout.CloseOnBackgroundTapped`; allowing input through the background is not a dialog close request.

### `HasKeyboardOffset`

- **Type:** `bool`
- **Default:** `true`
- **Purpose:** Enables the host's keyboard-offset behavior.

```xml
prism:PopupDialogLayout.HasKeyboardOffset="False"
```

### `KeyboardOffset`

- **Type:** `double`
- **Default:** `0d`
- **Purpose:** An attached value associated with the host's keyboard offset, with `OneWayToSource` as its default binding mode. Use `HasKeyboardOffset` to select the host's offset behavior and test keyboard appearance and content visibility on each target platform.

## Example Dialog View

The following content combines a relative width, explicit background-tap behavior, and a Mopups animation. Define `CloseCommand` in the dialog view model to call `RequestClose.Invoke(ButtonResult.OK)`.

```xml
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:prism="http://prismlibrary.com"
             xmlns:animation="clr-namespace:Mopups.Animations;assembly=Mopups"
             x:Class="YourNamespace.MyDialog"
             prism:DialogLayout.RelativeWidthRequest="0.8"
             prism:DialogLayout.CloseOnBackgroundTapped="False"
             prism:PopupDialogLayout.IsAnimationEnabled="True">
    <prism:PopupDialogLayout.Animation>
        <animation:MoveAnimation PositionIn="Top" PositionOut="Bottom" />
    </prism:PopupDialogLayout.Animation>
    <VerticalStackLayout Padding="24" Spacing="12" BackgroundColor="White">
        <Label Text="Your changes are ready." TextColor="Black" />
        <Button Text="OK" Command="{Binding CloseCommand}" />
    </VerticalStackLayout>
</ContentView>
```

The host supports Prism's `DialogLayout.RelativeWidthRequest`, `RelativeHeightRequest`, and `LayoutBounds`. A relative width of `0.8` requests 80% of the popup host's width. Mask appearance belongs to the selected dialog host; do not assume the default Prism host's mask settings apply to Mopups. Configure and verify the popup's own background and content appearance on each target.

## Showing the Dialog

Inject `Prism.Dialogs.IDialogService` into the calling view model and open the registered name while the application has an active host page:

```csharp
using Prism.Dialogs;

var result = await dialogService.ShowDialogAsync("MyDialog");
if (result.Result == ButtonResult.OK)
{
    // Continue the application workflow after the dialog closes.
}
```

Call this from an awaited workflow such as an async command. Handle exceptions from `ShowDialogAsync`; the task reports completion through Prism's dialog result lifecycle. The dialog closes through `RequestClose`, and `CanCloseDialog()` controls whether Prism accepts that request.

Use the Prism close command for dismissal. Do not call Mopups navigation methods directly to remove a Prism-owned dialog. Verify background taps, device Back, a vetoed close, repeated close actions, and any overlapping dialogs on your target devices.

## Source reference

These references describe the `release/stable/9.0` source baseline at commit `bbafa527`. The exact shipped version of `Prism.Plugin.Popups.Maui` has not been independently matched to that commit. Check the package and dependency versions in your authorized feed rather than inferring a version pin from this page. The source links require private-repository access.

- [Mopups and Prism registrations](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Popups.Maui/MopupsRegistrationExtensions.cs)
- [Attached properties and defaults](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Popups.Maui/Xaml/PopupDialogLayout.cs)
- [Layout, presentation, and dismissal](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Popups.Maui/PopupDialogContainer.cs)
- [Relative-size conversion](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Popups.Maui/RelativeContentSizeConverter.cs)
- [Migration and setup notes](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Popups.Maui/ReadMe.md)

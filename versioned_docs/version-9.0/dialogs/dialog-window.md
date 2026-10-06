---
sidebar_position: 3
uid: Dialogs.DialogWindow
description: Customize Prism 9 WPF windows and Uno ContentDialog hosts without mixing their contracts.
---

# Dialog Window

A dialog's content is the registered view and its `IDialogAware` view model. The host presents that content and supplies the platform lifecycle. Prism 9.0.537 has different `Prism.Dialogs.IDialogWindow` interfaces for WPF and Uno. .NET MAUI uses `IDialogContainer` instead.

## WPF: a Window host

The WPF interface exposes content, data context, style, owner, result, `Loaded`, `Closing`, and `Closed`, plus `Show()`, `ShowDialog()`, and `Close()`. `System.Windows.Window` already implements most of these members. Add the result property:

```csharp
using System.Windows;
using Prism.Dialogs;

public sealed class AppDialogWindow : Window, IDialogWindow
{
    public AppDialogWindow()
    {
        Width = 520;
        SizeToContent = SizeToContent.Height;
        WindowStartupLocation = WindowStartupLocation.CenterOwner;
    }

    public IDialogResult Result { get; set; } = new DialogResult();
}
```

A XAML-defined window should have a matching code-behind base class and call `InitializeComponent()`. The default Prism host binds its title to `Title` on the view model, centers on its owner, and sizes to its content. `Title` is an optional presentation property, not part of `IDialogAware`.

Register a replacement default host, or a named host for selected dialogs:

```csharp
using Prism.Ioc;

containerRegistry.RegisterDialogWindow<AppDialogWindow>("AppDialog");
```

The host name and content name are separate:

```csharp
var parameters = new DialogParameters
{
    { KnownDialogParameters.WindowName, "AppDialog" },
    { "name", Name }
};
var result = await _dialogs.ShowDialogAsync("Rename", parameters);
```

Omit the registration name to replace the default host. WPF is modal by default; add `{ KnownDialogParameters.ShowNonModal, true }` to use `Window.Show()` instead. Awaiting a modeless dialog still waits for its reported result, not merely for the window to appear.

If the host has no owner, Prism selects the active window from `Application.Current.Windows`. Multi-window applications should define ownership deliberately through a custom host or dialog service. There is no shared owner parameter in this release.

See the [WPF walkthrough](../platforms/wpf/dialog-service.md) for content registration and `Dialog.WindowStyle`.

## Uno: a ContentDialog host

Uno's default `Prism.Dialogs.DialogWindow` derives from `Microsoft.UI.Xaml.Controls.ContentDialog`. Its interface uses `ShowAsync(ContentDialogPlacement)`, `Hide()`, and ContentDialog closing/closed events. It does not have the WPF `Owner`, `Show()`, or `Close()` members.

For simple shared presentation settings, derive from the existing host:

```csharp
public sealed class AppDialogWindow : Prism.Dialogs.DialogWindow
{
    public AppDialogWindow()
    {
        MinWidth = 320;
    }
}

// App.RegisterTypes; using Prism.Ioc;
containerRegistry.RegisterDialogWindow<AppDialogWindow>("AppDialog");
```

Use `KnownDialogParameters.WindowName` to select this host. Uno also accepts `KnownDialogParameters.DialogPlacement`, as a `ContentDialogPlacement` value or its enum name; the default is `Popup`. Uno does not expose WPF's `ShowNonModal` parameter.

For a ContentDialog host, Prism sets `XamlRoot` from the content of the application's registered `Microsoft.UI.Xaml.Window`. The shell must already be attached and loaded. This is not active-window selection for arbitrary multiple windows. Test sizing, focus, and dismissal on each Uno target you ship.

Use the dialog content's commands to call `RequestClose` with a Prism `ButtonResult`. The service tracks that result locally; it does not map the native `ContentDialogResult` returned by `ShowAsync` or the host's `Result` property into a Prism result. Native primary/secondary buttons therefore need an application-defined close/result policy.

## .NET MAUI: a dialog container

MAUI's built-in service presents custom content through `IDialogContainer` and `DialogContainerPage`, rather than either desktop host interface. Follow the [MAUI dialog guide](../platforms/maui/dialogs/index.md). Native alerts and action sheets use [IPageDialogService](../platforms/maui/dialogs/pagedialogs.md).

## Preserve the lifecycle

Prism wires the host's events, initializes `RequestClose` when the WPF or Uno host loads, consults `CanCloseDialog`, calls `OnDialogClosed`, and invokes the completion callback. Do not duplicate those operations in a host subclass.

Keep `OnDialogClosed` and callback handling exception-safe. In this release, clearing the host's content and data context occurs after callback completion and is not protected by a `finally` block. Test accept, cancel, system dismissal, rejected close, repeated opening, opening failure, and asynchronous callback failure. These checks must run on the intended platform; source inspection alone does not qualify a custom host.

## Source reference

- [WPF host interface](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Dialogs/IDialogWindow.cs), [default host XAML](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Dialogs/DialogWindow.xaml), and [service](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Dialogs/DialogService.cs)
- [Uno host interface](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Uno/Prism.Uno/Dialogs/IDialogWindow.cs), [default host](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Uno/Prism.Uno/Dialogs/DialogWindow.xaml.cs), and [service](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Uno/Prism.Uno/Dialogs/DialogService.cs)
- [Registration extensions shared by WPF and Uno](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Ioc/IContainerRegistryExtensions.cs)
- [Platform-specific dialog parameter keys](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Dialogs/KnownDialogParameters.cs)
- [MAUI container contract](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Dialogs/IDialogContainer.cs)

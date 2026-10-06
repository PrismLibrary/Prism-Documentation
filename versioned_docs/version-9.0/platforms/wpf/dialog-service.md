---
sidebar_position: 1
uid: Platforms.Wpf.DialogService
description: Create, register, show, and customize WPF dialogs with the Prism 9 API.
---

# Dialog Service

`Prism.Dialogs.IDialogService` presents a registered content view inside a WPF host window. Prism creates the content and view model through its container, supplies parameters, and reports the close result. This walkthrough uses the Prism 9.0.537 API.

## Create Your Dialog View

Create a WPF UserControl named `NotificationDialog`. Keep its generated constructor calling `InitializeComponent()` and use this XAML:

```xml
<UserControl x:Class="MyApp.Dialogs.NotificationDialog"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:prism="http://prismlibrary.com/"
    MinWidth="300">
    <StackPanel Margin="20">
        <TextBlock Text="{Binding Message}" TextWrapping="Wrap" />
        <Button Content="OK" Command="{Binding CloseCommand}"
                IsDefault="True" HorizontalAlignment="Right" Margin="0,16,0,0" />
    </StackPanel>
</UserControl>
```

The content must be a `FrameworkElement`; a UserControl is the usual choice. Its `DataContext` must implement `IDialogAware`. The dialog service invokes the ViewModelLocator if the data context is unset and automatic wiring has not explicitly been disabled.

## Create Your Dialog ViewModel

Prism 9 uses a get-only `DialogCloseListener` property, not the earlier `RequestClose` event. The service initializes the listener on the host's `Loaded` event. Do not invoke it in the constructor or `OnDialogOpened`.

```csharp
using Prism.Commands;
using Prism.Dialogs;
using Prism.Mvvm;

namespace MyApp.Dialogs;

public sealed class NotificationDialogViewModel : BindableBase, IDialogAware
{
    private string _message = string.Empty;

    public NotificationDialogViewModel()
    {
        CloseCommand = new DelegateCommand(() => RequestClose.Invoke(ButtonResult.OK));
    }

    public string Title => "Notification";
    public string Message
    {
        get => _message;
        set => SetProperty(ref _message, value);
    }

    public DelegateCommand CloseCommand { get; }
    public DialogCloseListener RequestClose { get; }
    public bool CanCloseDialog() => true;

    public void OnDialogOpened(IDialogParameters parameters)
    {
        if (parameters.TryGetValue<string>("message", out var message))
            Message = message;
    }

    public void OnDialogClosed()
    {
        // Release any subscriptions owned by this dialog.
    }
}
```

`Title` is optional. Prism's default WPF host binds to it, but the [IDialogAware contract](../../dialogs/dialog-aware.md) does not require it. For forms, validate acceptance in the accept command; requiring valid input in `CanCloseDialog` can also prevent cancellation.

## Register the Dialog

Register the pair in `App.RegisterTypes` or a module's `RegisterTypes`:

```csharp
using Prism.Ioc;

containerRegistry.RegisterDialog<NotificationDialog, NotificationDialogViewModel>();
```

The default name is `NotificationDialog`. To use a different name:

```csharp
containerRegistry.RegisterDialog<NotificationDialog, NotificationDialogViewModel>("Notice");
```

Use the same name when showing it. In this release, dialog registration uses the named-object navigation registration and a `ViewModelLocationProvider` mapping. Registering a pair does not change the data context of an already-created view.

## Using the Dialog Service

Inject `IDialogService` into the calling view model, then use an awaitable extension or a callback:

```csharp
using Prism.Dialogs;

_dialogs.ShowDialog("NotificationDialog",
    new DialogParameters { { "message", "The report is ready." } },
    new DialogCallback().OnClose(result =>
    {
        if (result.Result == ButtonResult.OK)
            System.Diagnostics.Debug.WriteLine("Acknowledged");
    }));
```

Here `_dialogs` is the injected service. Use `await _dialogs.ShowDialogAsync(...)` from an async method when the caller needs a task result. Keep input values in the parameter collection rather than interpolating unescaped text into a query string.

WPF is modal by default. For a modeless window, add `KnownDialogParameters.ShowNonModal` with the value `true`:

```csharp
_dialogs.ShowDialog("NotificationDialog", new DialogParameters
{
    { "message", "You can keep working while this notice is open." },
    { KnownDialogParameters.ShowNonModal, true }
});
```

Prism checks `CanCloseDialog` on the window's `Closing` event. A denied close leaves the dialog open. A system close normally reports `ButtonResult.None` if no result was requested. If a prior close request was vetoed, its result remains stored; use explicit accept/cancel commands and test that sequence when results drive important changes.

Handle opening failures around the call or await: WPF does not catch resolution/XAML/configuration exceptions and route them to `DialogCallback.OnError`. Keep completion handlers exception-safe, too; the service clears the host's content and data context after callback completion.

## Register a Custom Dialog Window

A host must implement WPF's `IDialogWindow`. Inherit from `Window` and add `IDialogResult Result`, or derive from Prism's `DialogWindow`. See the [complete custom-host example](../../dialogs/dialog-window.md#wpf-a-window-host).

```csharp
containerRegistry.RegisterDialogWindow<AppDialogWindow>("AppDialog");
```

Select it with the `WindowName` parameter:

```csharp
_dialogs.ShowDialog("NotificationDialog", new DialogParameters
{
    { KnownDialogParameters.WindowName, "AppDialog" },
    { "message", "This notice uses the custom host." }
});
```

Omit the name when registering to replace the default host for all dialogs. The service preserves an owner already set on the host; otherwise it selects the active application window. Choose ownership explicitly in multi-window applications.

WPF retains `Show` compatibility extensions for modeless dialogs. The shipped 9.0.537 API has no four-argument `ShowDialog(name, parameters, callback, windowName)` overload. Put the host name in `KnownDialogParameters.WindowName`.

## Style the DialogWindow

Set `Dialog.WindowStyle` on the dialog content to style its host:

```xml
<prism:Dialog.WindowStyle>
    <Style TargetType="Window">
        <Setter Property="Title" Value="Notification" />
        <Setter Property="prism:Dialog.WindowStartupLocation" Value="CenterOwner" />
        <Setter Property="ResizeMode" Value="NoResize" />
        <Setter Property="ShowInTaskbar" Value="False" />
        <Setter Property="SizeToContent" Value="WidthAndHeight" />
    </Style>
</prism:Dialog.WindowStyle>
```

Place this property element inside the UserControl before its content. This is WPF styling; Uno's host uses a different interface and control type.

## Simplify your Application Dialog APIs

Wrap common parameter names in an application extension:

```csharp
using Prism.Dialogs;

public static class AppDialogExtensions
{
    public static void ShowNotification(this IDialogService dialogs,
        string message, DialogCallback callback)
    {
        dialogs.ShowDialog("NotificationDialog",
            new DialogParameters { { "message", message } }, callback);
    }
}
```

The helper centralizes the registered name and parameter contract. It does not replace result checks or exception handling at the caller's boundary.

## Source reference

- [Prism 9 IDialogAware](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Dialogs/IDialogAware.cs)
- [WPF host lifecycle and ownership](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Dialogs/DialogService.cs)
- [Dialog registration](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Ioc/IContainerRegistryExtensions.cs)
- [Shared service extensions](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Dialogs/IDialogServiceExtensions.cs) and [WPF compatibility extensions](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Dialogs/IDialogServiceCompatExtensions.cs)
- [Window attached properties](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Dialogs/Dialog.cs)

---
sidebar_position: 1
uid: Platforms.Wpf.DialogService
---

# WPF Dialog Service

`Prism.Dialogs.IDialogService` creates a registered view and view model inside a WPF dialog window. Use it for an editor, confirmation form, or other custom UI without making the calling view model construct a `Window`.

## Create the view and view model

Add a WPF UserControl named `NotificationDialog`. Its code-behind only needs the generated `InitializeComponent()` constructor.

```xml
<UserControl x:Class="MyApp.Dialogs.NotificationDialog"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:prism="http://prismlibrary.com/">
    <prism:Dialog.WindowStyle>
        <Style TargetType="Window">
            <Setter Property="Title" Value="Notification" />
            <Setter Property="SizeToContent" Value="WidthAndHeight" />
            <Setter Property="ResizeMode" Value="NoResize" />
            <Setter Property="ShowInTaskbar" Value="False" />
        </Style>
    </prism:Dialog.WindowStyle>
    <StackPanel Margin="24" Width="320">
        <TextBlock Text="{Binding Message}" TextWrapping="Wrap" />
        <Button Content="OK" Command="{Binding CloseCommand}"
                Margin="0,16,0,0" IsDefault="True" />
    </StackPanel>
</UserControl>
```

```cs
using Prism.Commands;
using Prism.Dialogs;
using Prism.Mvvm;

namespace MyApp.Dialogs;

public class NotificationDialogViewModel : BindableBase, IDialogAware
{
    private string _message = string.Empty;

    public NotificationDialogViewModel()
    {
        CloseCommand = new DelegateCommand(() => RequestClose.Invoke(ButtonResult.OK));
    }

    public string Message
    {
        get => _message;
        private set => SetProperty(ref _message, value);
    }

    public DelegateCommand CloseCommand { get; }
    public DialogCloseListener RequestClose { get; }
    public bool CanCloseDialog() => true;
    public void OnDialogOpened(IDialogParameters parameters) =>
        Message = parameters.GetValue<string>("message");
    public void OnDialogClosed() { }
}
```

In Prism 9.1, `RequestClose` is a `DialogCloseListener`, not an event. Prism initializes it; do not replace it yourself. `Title` is not a member of `IDialogAware`. Set the window title through its style or a binding on a custom host. The listener is initialized when the WPF dialog window loads, so do not request closure from the view-model constructor or `OnDialogOpened`.

## Register and show

```cs
// Inside App.RegisterTypes; using Prism.Ioc;
containerRegistry.RegisterDialog<NotificationDialog, NotificationDialogViewModel>();
```

Inject `IDialogService` into the calling view model and invoke it on the UI thread:

```cs
var parameters = new DialogParameters
{
    { "message", "Your changes were saved." }
};

dialogService.ShowDialog("NotificationDialog", parameters,
    new DialogCallback()
        .OnClose(result => System.Diagnostics.Debug.WriteLine(result.Result))
        .OnError(error => System.Diagnostics.Debug.WriteLine(error)));
```

For task-based calling code, `await dialogService.ShowDialogAsync("NotificationDialog", parameters)` completes on close and throws if its callback receives an exception. Await it from an async command or another async UI flow. Window creation/configuration failures can also throw synchronously; don't assume every host failure is converted into a callback.

`CanCloseDialog()` is checked for both a listener-driven close and the window's close button. Returning `false` keeps the window open. `OnDialogClosed()` runs after the window closes and is the place to release subscriptions owned by that dialog. The default WPF service clears the host's content and data context after the callback; this alone does not imply that arbitrary container services were disposed.

## Modeless windows and named hosts

Use known parameters with the current core API:

```cs
var parameters = new DialogParameters
{
    { "message", "You can keep working while this window is open." },
    { KnownDialogParameters.ShowNonModal, true },
    { KnownDialogParameters.WindowName, "notificationWindow" }
};

dialogService.ShowDialog("NotificationDialog", parameters, DialogCallback.Empty);
```

The optional `WindowName` must match a registration:

```cs
containerRegistry.RegisterDialogWindow<NotificationWindow>("notificationWindow");
```

A custom host derives from `System.Windows.Window`, implements `Prism.Dialogs.IDialogWindow`, and adds its `IDialogResult Result { get; set; }` property. Keep its XAML root and code-behind base class consistent. WPF supplies the other required window members. Omit the name to use the default host. The default service selects the active application window as owner when the host has no owner.

Compatibility overloads such as `Show` and the four-argument `ShowDialog` are still available on WPF. Prefer the shared `ShowDialog` / `DialogCallback` form when sharing calling code across Prism hosts, while keeping host-specific parameters in the platform layer.

## Source reference

- [Current IDialogAware contract](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Prism.Core/Dialogs/IDialogAware.cs)
- [WPF dialog lifetime, owner, and window configuration](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Wpf/Prism.Wpf/Dialogs/DialogService.cs)
- [Task-based dialog extension](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Prism.Core/Dialogs/IDialogServiceExtensions.cs)

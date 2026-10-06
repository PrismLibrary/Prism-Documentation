---
sidebar_position: 1
title: Dialogs
description: "Build a custom Prism 9.0 MAUI dialog with IDialogAware, close commands, and the page-scoped dialog service."
---

# Dialogs

Prism.Maui implements two dialog services with different presentation roles:

- [`Prism.Services.IPageDialogService`](pagedialogs.md) wraps native alerts, action sheets, and prompts through `IWindowManager.Current`.
- [`Prism.Dialogs.IDialogService`](../../../dialogs/index.md) presents a custom MAUI `View` with a view model implementing `IDialogAware`.

Both services are implemented and registered by default in Prism 9.0.537.

## Register a custom dialog

Create a MAUI `ContentView` named `NoticeView` and a `NoticeViewModel` implementing the [Prism 9 dialog contract](../../../dialogs/dialog-aware.md), including `DialogCloseListener RequestClose { get; }`. Register the pair:

```cs
// Inside PrismAppBuilder.RegisterTypes; using Prism.Ioc;
container.RegisterDialog<NoticeView, NoticeViewModel>();
```

For example, the dialog view model can load a message and expose a close command:

```cs
using Prism.Commands;
using Prism.Dialogs;
using Prism.Mvvm;

namespace MyApp.ViewModels;

public class NoticeViewModel : BindableBase, IDialogAware
{
    private string _message = string.Empty;
    public string Message
    {
        get => _message;
        set => SetProperty(ref _message, value);
    }

    public NoticeViewModel() => CloseCommand =
        new DelegateCommand(() => RequestClose.Invoke(ButtonResult.OK));

    public DelegateCommand CloseCommand { get; }
    public DialogCloseListener RequestClose { get; }
    public bool CanCloseDialog() => true;
    public void OnDialogOpened(IDialogParameters parameters) =>
        Message = parameters.GetValue<string>("message");
    public void OnDialogClosed() { }
}
```

Prism initializes `RequestClose`; do not assign it yourself. A matching `NoticeView.xaml` can contain:

```xml
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:vm="clr-namespace:MyApp.ViewModels"
    x:Class="MyApp.Views.NoticeView"
    x:DataType="vm:NoticeViewModel">
    <VerticalStackLayout Padding="24" Spacing="12" BackgroundColor="White">
        <Label Text="{Binding Message}" TextColor="Black" />
        <Button Text="OK" Command="{Binding CloseCommand}" />
    </VerticalStackLayout>
</ContentView>
```

Keep the normal `ContentView` code-behind constructor calling `InitializeComponent()`. Import the view/view-model namespaces in the registration code.

Inject `IDialogService` into a page view model and invoke it from an async command:

```cs
using Prism.Dialogs;

var result = await dialogService.ShowDialogAsync("NoticeView",
    new DialogParameters { { "message", "Changes saved." } });
```

Handle failures around the awaited operation: `ShowDialogAsync` faults when the service reports an exception and completes normally when the dialog closes successfully. A `CanCloseDialog()` veto keeps the dialog open and the task pending. The dialog view binds its controls to the supplied view model; its close command calls `RequestClose.Invoke(...)`.

In 9.0, the service initializes the close listener and calls `OnDialogOpened` before configuring the host. Use `OnDialogOpened` to load state; avoid requesting immediate closure there. Request closure from the displayed dialog instead. Do not assume that opening-time callbacks mean native presentation has completed.

## Page context and container ownership

The default custom-dialog service is scoped and obtains its host page from `IPageAccessor.Page`. Resolve it through the page's view model, and show the dialog while that page is valid and displayed. This 9.0 implementation has no active-window fallback for a missing page. Do not keep a page-scoped dialog service in an application singleton.

The host is `Prism.Dialogs.IDialogContainer`; the default registration is `DialogContainerPage`. A custom host uses `RegisterDialogContainer<T>()`. This is separate from WPF's `IDialogWindow` and Uno's `ContentDialog` host. A MAUI dialog view must derive from `View`, such as `ContentView`, not `ContentPage`.

In Prism 9.0 the dialog view and container are resolved from the current page's provider. Do not assume showing a dialog automatically creates a separate DI scope or that closing it disposes the owning page scope. Release dialog-owned subscriptions in `OnDialogClosed` and keep page lifetime separate.

## Presentation options

The default host displays the view in a modal `DialogContainerPage`. MAUI dialog layout can be customized with `prism:DialogLayout` attached properties, including relative size, layout bounds, mask styling, and `CloseOnBackgroundTapped`. Background-tap closing is opt-in and still passes through `CanCloseDialog()`. Validate the layout and dismissal paths on the devices you ship.

## Source reference

- [Dialog registrations and View constraint](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Ioc/DialogRegistrationExtensions.cs)
- [Prism 9.0 dialog lifecycle and hosting order](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Dialogs/DialogServiceBase.cs)
- [Page-scoped dialog service](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Dialogs/DialogService.cs)
- [Prism 9 dialog contract and async helper](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Dialogs/IDialogServiceExtensions.cs)
- [MAUI dialog layout properties](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Dialogs/Xaml/DialogLayout.cs)

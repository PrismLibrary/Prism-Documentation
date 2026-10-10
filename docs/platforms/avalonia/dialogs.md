---
sidebar_position: 3
---

# Avalonia Desktop Dialogs

`Prism.Dialogs.IDialogService` hosts a registered Avalonia control in a dialog window. The implementation is window-based. The shared interface does not imply that the default desktop dialog host is suitable for a browser or mobile single-view lifetime.

## Register a dialog

Create an Avalonia `UserControl` named `NoticeView`, with an `IDialogAware` view model:

```cs
using Prism.Commands;
using Prism.Dialogs;
using Prism.Mvvm;

public class NoticeViewModel : BindableBase, IDialogAware
{
    private string _message = string.Empty;

    public NoticeViewModel()
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

Bind a `TextBlock.Text` to `Message` and a `Button.Command` to `CloseCommand` in `NoticeView`. Add the matching `x:DataType` if the project uses compiled bindings. Register the pair:

```cs
// App.RegisterTypes; using Prism.Ioc;
containerRegistry.RegisterDialog<NoticeView, NoticeViewModel>();
```

Inject `IDialogService` and call it from an async UI command:

```cs
using Prism.Dialogs;

var result = await dialogService.ShowDialogAsync("NoticeView",
    new DialogParameters { { "message", "Import completed." } });

if (result.Result == ButtonResult.OK)
{
    // The user closed the dialog using its OK command.
}
```

`RequestClose` is a listener initialized by Prism when the window opens. Leave the property for Prism to initialize, and invoke it from a subsequent user interaction. `OnDialogOpened` receives parameters before the window opens, so it is not a safe place to invoke this listener. `CanCloseDialog` can cancel closure, and `OnDialogClosed` runs after the window closes.

## Owner, modality, and custom hosts

For a classic desktop application, the service shows a modal dialog with the desktop lifetime's main window as owner unless you supply `KnownDialogParameters.ParentWindow`:

```cs
var parameters = new DialogParameters
{
    { "message", "This belongs to the current editor window." },
    { KnownDialogParameters.ParentWindow, editorWindow }
};

dialogService.ShowDialog("NoticeView", parameters, DialogCallback.Empty);
```

Here `editorWindow` is the existing `Avalonia.Controls.Window` chosen by your UI layer. For a modeless desktop window, add `{ KnownDialogParameters.ShowNonModal, true }`. To select a custom host, register `RegisterDialogWindow<NoticeWindow>("noticeWindow")` and add `{ KnownDialogParameters.WindowName, "noticeWindow" }`.

A custom host implements Avalonia's version of `Prism.Dialogs.IDialogWindow`: it uses `Opened`, `Closing`, `Closed`, and `ShowDialog(Window owner)`. Do not copy WPF's `Loaded` event or parameterless `ShowDialog()` implementation. Likewise, WPF's `Dialog.WindowStyle` example is not portable: the current Avalonia dialog service does not apply that WPF style path. Put Avalonia styles and title bindings on your Avalonia host.

:::warning Single-view hosts
The current service takes its modal-window branch only for `IClassicDesktopStyleApplicationLifetime`; otherwise it calls the host's `Show()`. This is not an in-view overlay implementation for single-view hosts. Use a host-specific dialog implementation that can present within that lifetime, and validate it on the actual target.
:::

The default service clears the window content and data context after the close callback. That does not establish a per-dialog DI scope or guarantee disposal of every resolved service. Own and release dialog subscriptions explicitly. Creation/configuration can throw before display, so handle errors around task-based calls as well as in callback-based flows.

## Source reference

- [Avalonia dialog implementation and lifetime branch](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Avalonia/Prism.Avalonia/Dialogs/DialogService.cs)
- [Avalonia IDialogWindow contract](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Avalonia/Prism.Avalonia/Dialogs/IDialogWindow.cs)
- [Shared dialog listener contract](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Prism.Core/Dialogs/IDialogAware.cs)

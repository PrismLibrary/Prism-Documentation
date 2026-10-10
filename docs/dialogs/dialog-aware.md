---
sidebar_position: 2
---

# IDialogAware

A Prism dialog view model implements `Prism.Dialogs.IDialogAware`. Its lifecycle is separate from region or page navigation: use dialog parameters and the dialog close result rather than assuming navigation callbacks run.

```csharp
public interface IDialogAware
{
    bool CanCloseDialog();
    void OnDialogClosed();
    void OnDialogOpened(IDialogParameters parameters);
    DialogCloseListener RequestClose { get; }
}
```

## A complete view-model example

```csharp
using Prism.Commands;
using Prism.Dialogs;
using Prism.Mvvm;

public sealed class RenameDialogViewModel : BindableBase, IDialogAware
{
    private string _name = string.Empty;
    private bool _isSaving;

    public RenameDialogViewModel()
    {
        AcceptCommand = new DelegateCommand(Accept,
                () => !string.IsNullOrWhiteSpace(Name) && !IsSaving)
            .ObservesProperty(() => Name)
            .ObservesProperty(() => IsSaving);
        CancelCommand = new DelegateCommand(
            () => RequestClose.Invoke(ButtonResult.Cancel),
            () => !IsSaving)
            .ObservesProperty(() => IsSaving);
    }

    public string Name
    {
        get => _name;
        set => SetProperty(ref _name, value);
    }

    public bool IsSaving
    {
        get => _isSaving;
        set => SetProperty(ref _isSaving, value);
    }

    public DelegateCommand AcceptCommand { get; }
    public DelegateCommand CancelCommand { get; }
    public DialogCloseListener RequestClose { get; }

    public void OnDialogOpened(IDialogParameters parameters)
    {
        if (parameters.TryGetValue<string>("name", out var name))
            Name = name;
    }

    public bool CanCloseDialog() => !IsSaving;

    public void OnDialogClosed()
    {
        // Release subscriptions or resources owned by this dialog.
    }

    private void Accept() => RequestClose.Invoke(
        new DialogParameters { { "name", Name.Trim() } }, ButtonResult.OK);
}
```

Bind the view's text editor and buttons to these properties. The caller owns the operation that commits the returned name. If a dialog saves internally instead, use an [async command](../commands/async-commands.md), manage `IsSaving` in `try` / `finally`, and decide whether cancellation should stop the save or only close the UI.

## CanCloseDialog

`CanCloseDialog` is a synchronous guard. Return false while closing would interrupt an unsafe operation. It applies to close attempts, including cancellation; requiring a valid form here can accidentally prevent the user from cancelling an invalid form. Put acceptance validation in the accept command instead.

Do not perform asynchronous confirmation inside this method. Initiate that workflow separately and request close when the result allows it.

## DialogCloseListener

In Prism 9, `RequestClose` is a `DialogCloseListener`, not an event. Implement the get-only property shown above. The dialog service initializes it; do not assign it yourself.

Call it only after the service has presented and initialized the dialog, such as from a user command. In WPF and Avalonia, initialization occurs on the host's loaded/opened event, after `OnDialogOpened`; invoking it from the constructor or `OnDialogOpened` is too early.

Supported forms include:

```csharp
RequestClose.Invoke();
RequestClose.Invoke(ButtonResult.Cancel);
RequestClose.Invoke(new DialogParameters { { "name", Name } }, ButtonResult.OK);
RequestClose.Invoke(new DialogResult(ButtonResult.OK));
```

`Invoke` requests closing; it does not bypass `CanCloseDialog` and it is not an awaitable “window fully closed” operation. Use the caller's callback or `ShowDialogAsync` result to continue after completion.

## Title and cleanup

`IDialogAware` does not require a `Title` property. A host can bind its title to an application property, but that is presentation behavior rather than part of this interface. Release dialog-owned event subscriptions, cancel owned work and detach handlers in an appropriate close/ownership path. Do not dispose a singleton service injected into the view model.

Sources: [IDialogAware](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Prism.Core/Dialogs/IDialogAware.cs), [DialogCloseListener](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Prism.Core/Dialogs/DialogCloseListener.cs), [WPF lifecycle](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Wpf/Prism.Wpf/Dialogs/DialogService.cs), and [Avalonia lifecycle](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Avalonia/Prism.Avalonia/Dialogs/DialogService.cs).

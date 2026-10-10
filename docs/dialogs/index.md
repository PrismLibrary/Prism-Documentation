---
sidebar_position: 1
---

# Dialogs

Use `Prism.Dialogs.IDialogService` to present custom dialog content from a view model. The shared contract carries input parameters and a result; the platform supplies the native presentation. A dialog view model implements [IDialogAware](dialog-aware.md), and the view remains a normal host-specific view.

## Register, show, inspect the result

Register the pair during application or module composition:

```csharp
containerRegistry.RegisterDialog<RenameDialog, RenameDialogViewModel>("Rename");
```

Inject `IDialogService` into the calling view model. The following method can be invoked by an [AsyncDelegateCommand](../commands/async-commands.md):

```csharp
using Prism.Dialogs;

private async Task RenameAsync()
{
    var result = await _dialogs.ShowDialogAsync("Rename",
        new DialogParameters { { "name", Name } });

    if (result.Result == ButtonResult.OK &&
        result.Parameters.TryGetValue<string>("name", out var name))
    {
        Name = name;
    }
}
```

The example expects `_dialogs` and the caller's `Name` property to exist. The [dialog view-model example](dialog-aware.md#a-complete-view-model-example) supplies the corresponding input/output contract. Prefer named constants or a shared contract for parameter keys in a larger application.

`ShowDialogAsync` completes when the result is reported. It faults for a reported dialog exception and ignores the special “cannot close” result while the dialog remains open. It has no cancellation-token overload; cancelling the caller's unrelated work does not automatically dismiss a dialog.

## Callbacks

Use `DialogCallback` when a callback fits the caller's lifecycle better:

```csharp
_dialogs.ShowDialog("Rename", new DialogParameters { { "name", Name } },
    new DialogCallback()
        .OnClose(result =>
        {
            if (result.Result == ButtonResult.OK &&
                result.Parameters.TryGetValue<string>("name", out var name))
                Name = name;
        })
        .OnError(exception => ShowDialogFailure()));
```

There are parameterless and result-taking `OnClose` overloads, and task-returning `OnCloseAsync` equivalents. Error callbacks have typed `OnError<TException>` and asynchronous `OnErrorAsync` variants. Use `new DialogCallback()` rather than a default-initialized struct.

## Error handling

A matching error handler runs instead of close callbacks when the result contains an exception. The most specific registered exception type wins. If no error handler matches, a close callback can receive a result containing an exception; do not assume every `OnClose` means success.

Registration, construction and XAML failures can also occur while opening a host-specific dialog. Handle opening failures at the caller's boundary and show a useful recovery path. Avoid logging full dialog parameters or raw exception text when they may contain application data.

A blocked `CanCloseDialog` is neither a successful close nor a commit. It leaves the dialog open and does not trigger normal completion callbacks.

## Choose the host deliberately

- **WPF:** a content view inside an `IDialogWindow`; modal and non-modal window behavior are available.
- **.NET MAUI:** custom content presented through an `IDialogContainer`; page-scoped services and UI lifecycle matter. Use `IPageDialogService` for native alerts/action sheets rather than custom forms.
- **Uno:** content is hosted in a `ContentDialog`-based `IDialogWindow` associated with the current window's XAML root.
- **Avalonia:** an `IDialogWindow` backed by an Avalonia window; the built-in modal path requires a classic desktop lifetime and an owner.

See [host-specific dialog windows and containers](dialog-window.md). Shared interfaces do not imply identical window behavior on desktop, phone and browser.

Sources: [IDialogService](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Prism.Core/Dialogs/IDialogService.cs), [awaitable extensions](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Prism.Core/Dialogs/IDialogServiceExtensions.cs), and [DialogCallback](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Prism.Core/Dialogs/DialogCallback.cs).

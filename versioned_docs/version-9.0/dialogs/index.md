---
sidebar_position: 1
description: Present custom dialogs with Prism 9 parameters, callbacks, and platform-specific hosts.
---

# Getting Started

Use `Prism.Dialogs.IDialogService` to present custom content from a view model. The shared API carries input parameters and a result; each platform supplies its own presentation and lifecycle. The content view model implements [IDialogAware](dialog-aware.md).

This guide describes Prism **9.0.537**. WPF uses a `Window` host, Uno uses a `ContentDialog` host, and .NET MAUI uses a dialog container. Their host APIs are not interchangeable.

## Register and show a dialog

Register the view and view model during application or module registration. Import `Prism.Ioc` for the registration extension:

```csharp
containerRegistry.RegisterDialog<RenameDialog, RenameDialogViewModel>("Rename");
```

Inject `IDialogService` into the caller. For example, a method invoked by an [async command](../commands/async-commands.md) can await the result:

```csharp
using System.Threading.Tasks;
using Prism.Dialogs;

// _dialogs is the injected IDialogService; Name is the caller's property.
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

The [view-model example](dialog-aware.md#a-complete-view-model-example) implements this input/output contract. Prefer a `DialogParameters` collection over constructing a query string from unescaped user input.

`ShowDialogAsync` completes when the service reports a result. A reported exception faults the task, except for the special `CanCloseIsFalse` result, which is ignored while the dialog remains open. There is no cancellation-token overload; cancelling unrelated work does not dismiss the dialog.

## Changes

Prism 9 introduces `DialogCallback` for synchronous or asynchronous completion and error handling. `IDialogAware.RequestClose` is now a `DialogCloseListener`; it is no longer an event. The interface also no longer requires `Title`.

### On Close

```csharp
_dialogs.ShowDialog("Rename", new DialogParameters { { "name", Name } },
    new DialogCallback()
        .OnClose(result =>
        {
            if (result.Result == ButtonResult.OK &&
                result.Parameters.TryGetValue<string>("name", out var name))
                Name = name;
        })
        .OnError(exception => System.Diagnostics.Debug.WriteLine(exception)));
```

`OnClose(Action)` and `OnClose(Action<IDialogResult>)` have task-returning `OnCloseAsync` equivalents:

```csharp
new DialogCallback().OnClose(() => System.Diagnostics.Debug.WriteLine("Closed"));
new DialogCallback().OnCloseAsync(result => Task.CompletedTask);
```

Construct callbacks with `new DialogCallback()`. The default-initialized struct does not initialize its callback collections. Use `DialogCallback.Empty` when no callback is needed, or a `ShowDialog` overload that supplies it for you.

### Error Handling

```csharp
new DialogCallback().OnError(exception => System.Diagnostics.Debug.WriteLine(exception));
new DialogCallback().OnError<System.InvalidOperationException>((exception, result) =>
{
    System.Diagnostics.Debug.WriteLine(exception.Message);
});
```

There are parameterless and typed error handlers, plus `OnErrorAsync` equivalents. The most specific matching exception type is selected. Register at most one handler per exception type on a callback. A matching error handler runs instead of the close callbacks; if none matches, an `OnClose` handler can receive a result whose `Exception` is non-null.

Handle opening failures at the caller's boundary too. WPF's service can throw synchronously while resolving or configuring the dialog; Uno catches opening errors and reports them through the callback. Do not assume `OnError` catches every exception from every platform, or an exception thrown by your own completion handler. Handle asynchronous work inside callbacks so an exception does not escape the UI event handler.

A denied `CanCloseDialog` does not mean the dialog closed and does not complete the awaitable operation. Update application state only after examining the final result.

## Next Steps

- [IDialogAware ViewModels](dialog-aware.md)
- [Dialog Window](dialog-window.md): WPF and Uno host contracts
- [WPF dialog walkthrough](../platforms/wpf/dialog-service.md)
- [.NET MAUI dialogs](../platforms/maui/dialogs/index.md)

## Source reference

- [Shared service and awaitable extensions](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Dialogs/IDialogServiceExtensions.cs)
- [DialogCallback dispatch](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Dialogs/DialogCallback.cs)
- [Exception-handler selection](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Common/MulticastExceptionHandler.cs)
- [WPF service](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Dialogs/DialogService.cs) and [Uno service](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Uno/Prism.Uno/Dialogs/DialogService.cs)

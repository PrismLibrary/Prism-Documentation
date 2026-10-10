---
sidebar_position: 4
description: "Handle expected command errors using the typed Catch APIs introduced in Prism 9.0."
---

# Command error handling {#error-handling}

`DelegateCommand`, `DelegateCommand<T>`, `AsyncDelegateCommand` and `AsyncDelegateCommand<T>` support typed `.Catch` handlers. They apply to exceptions raised by the command's execute delegate and its `CanExecute` delegate. An expected failure should produce an actionable state in the UI; do not use a catch-all merely to make errors disappear.

Prism 9 introduced these command error-handling APIs.

```csharp
LoadCommand = new AsyncDelegateCommand(LoadAsync)
    .Catch<OperationCanceledException>(_ => ShowCancelled())
    .Catch<IOException>(_ => ShowRetryMessage());
```

Here `LoadAsync` returns a `Task`; `ShowCancelled` and `ShowRetryMessage` are application methods. Keep handlers small and safe. Dispatch UI updates to your framework's UI thread when necessary.

## Which handler runs?

Prism looks for the exception's exact type, then walks its base types. The closest registered type wins; handlers are not all invoked in registration order. Register at most one handler for each exception type on a command. A generic `.Catch(exception => ...)` registers for `Exception` and acts as a fallback.

If a handled exception came from `CanExecute`, the result is `false`. An unhandled exception is rethrown. An exception from an asynchronous command reaches the caller of its awaited `Execute` task, or the application's unhandled-exception path when invoked through the `async void` `ICommand` bridge.

## Choose an async boundary deliberately

`DelegateCommand` also has task-returning error-handler overloads, but its synchronous command execution does not await that handler to finish. `AsyncDelegateCommand` exposes synchronous `Action` catch handlers. Do not pass an `async` lambda to one of those actions: it becomes `async void`.

When recovery needs asynchronous work, put a normal `try` / `catch` inside the task-returning operation and await recovery there. That makes completion, cancellation and failure visible to callers and tests.

```csharp
private async Task LoadAsync(CancellationToken token)
{
    try
    {
        await _documents.LoadAsync(token);
    }
    catch (IOException)
    {
        await _notifications.ShowLoadFailedAsync();
    }
}
```

Logging should record the operation and outcome without exposing document contents, identifiers or raw exception messages. Keep detailed diagnostics in an appropriately controlled development environment.

Source: [DelegateCommand](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Commands/DelegateCommand.cs), [AsyncDelegateCommand](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Commands/AsyncDelegateCommand.cs), and [exception-handler selection](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Common/MulticastExceptionHandler.cs).

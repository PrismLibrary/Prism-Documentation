---
sidebar_position: 3
---

# Async commands

Use `Prism.Commands.AsyncDelegateCommand` for work that returns a `Task`: loading a document, saving an edit, or asking a service for data. It implements `ICommand` for XAML and `IAsyncCommand` for callers that need to await completion. The same command types work in WPF, .NET MAUI, Uno and Avalonia view models.

## A cancellable operation

```csharp
using Prism.Commands;
using Prism.Mvvm;

public sealed class SearchViewModel : BindableBase, IDisposable
{
    private readonly ISearchService _search;
    private readonly CancellationTokenSource _lifetime = new();
    private string _query = string.Empty;

    public SearchViewModel(ISearchService search)
    {
        _search = search;
        SearchCommand = new AsyncDelegateCommand(SearchAsync,
                () => !string.IsNullOrWhiteSpace(Query))
            .ObservesProperty(() => Query)
            .CancellationTokenSourceFactory(() => _lifetime.Token)
            .Catch<OperationCanceledException>(_ => { });
    }

    public string Query
    {
        get => _query;
        set => SetProperty(ref _query, value);
    }

    public AsyncDelegateCommand SearchCommand { get; }

    private Task SearchAsync(CancellationToken token) =>
        _search.SearchAsync(Query, token);

    public void Dispose()
    {
        _lifetime.Cancel();
        _lifetime.Dispose();
    }
}

public interface ISearchService
{
    Task SearchAsync(string query, CancellationToken cancellationToken);
}
```

The owner must call `Dispose` when this view model is permanently finished; declaring `IDisposable` alone does not make every platform's navigation service call it. A cancelled lifetime token is intentionally not reusable. For user-initiated cancel-and-retry, create a new source for the next operation and dispose the previous source after its operation finishes.

## Execution and enabled state

By default, a running command reports `CanExecute == false` and ignores another execution while `IsExecuting` is true. Changes to `IsExecuting` raise `CanExecuteChanged`. `ObservesProperty` also re-evaluates the supplied predicate when the property changes.

A control normally checks `CanExecute` before invoking a command. A direct call to `Execute` does **not** evaluate your custom predicate, so application code should check it:

```csharp
if (viewModel.SearchCommand.CanExecute())
    await viewModel.SearchCommand.Execute(cancellationToken);

// Useful for a control or service that only knows IAsyncCommand:
IAsyncCommand command = viewModel.SearchCommand;
await command.ExecuteAsync(null, cancellationToken);
```

For a typed parameter, use `AsyncDelegateCommand<T>` and a matching delegate, for example `new AsyncDelegateCommand<string>((query, token) => search.SearchAsync(query, token))`. A XAML command parameter must match `T`.

## Cancellation and timeouts

- Pass a token to `Execute` / `IAsyncCommand.ExecuteAsync` when the caller owns cancellation.
- Use `.CancellationTokenSourceFactory(() => token)` to supply the default token used by a XAML invocation.
- Use `.CancelAfter(TimeSpan.FromSeconds(30))` for a per-execution timeout token.

Cancellation is cooperative. Prefer the `Func<CancellationToken, Task>` overload and pass the token through to the operation. Wrapping a parameterless task with a cancellation wait can stop waiting without stopping the underlying work. A cancellation exception still follows [command error handling](error-handling.md); it is not silently converted to success.

## Parallel work

`.EnableParallelExecution()` removes the normal running-command exclusion. Use it only when overlapping operations are safe. `IsExecuting` is a boolean, not a count of outstanding operations; with parallel execution, one completion can reset it while another operation remains active. This command is not a cross-thread lock or a transaction coordinator.

Create UI-bound commands on the UI thread so their captured synchronization context can dispatch `CanExecuteChanged`. The operation and its error handling must still marshal UI mutations appropriately. The `ICommand.Execute` bridge is `async void`; unhandled errors can reach the UI application's exception handler. Await `Execute` in tests and non-UI orchestration, and handle expected failures explicitly.

## Read the implementation

The [non-generic command](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Prism.Core/Commands/AsyncDelegateCommand.cs), [typed command](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Prism.Core/Commands/AsyncDelegateCommand%7BT%7D.cs) and [tests](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/tests/Prism.Core.Tests/Commands/AsyncDelegateCommandFixture.cs) define these semantics. For a real persistence workflow, follow the [Sales Desk walkthrough](../samples/sales-desk.md).

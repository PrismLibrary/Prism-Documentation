---
sidebar_position: 3
uid: Commands.AsyncDelegateCommand
---

# Async Command's

It is important to consider that Commands are effectively an EventHandler and as a result a Command could be invoked multiple times while the Command is still executing, particularly within the context of an Async Task. Prism 9.0 introduced the `AsyncDelegateCommand` and `AsyncDelegateCommand<T>`.

```cs
public interface IAsyncCommand : ICommand
{
    Task ExecuteAsync(object? parameter);

    Task ExecuteAsync(object? parameter, CancellationToken cancellationToken);
}
```

While no platform explicitly supports the concept of an AsyncCommand and any implementation of an Async Command is specific to the implementing library. This does however provide you an ability to create custom controls with their own Command implementation that does support the `IAsyncCommand`. One benefit to the `AsyncDelegateCommand` is that it supports delegates that may or may not accept a CancellationToken.

## Parallel Execution

By default the `AsyncDelegateCommand` does not allow parallel execution. To enable parallel execution you must call `EnableParallelExecution`. As part of this default behavior `CanExecute` will automatically return false while the Command is executing regardless of any other custom logic that you have provided for the `CanExecute` delegate.

```cs
new AsyncDelegateCommand(async () => Task.CompletedTask)
    .EnableParallelExecution()
```

## Configuring the CancellationTokenSource

There are two ways to configure the CancellationTokenSource for the Command.

1. Provide a `TimeSpan` to provide a default timeout for your Async Command.
2. Provide a `Func<CancellationToken>` to provide the `CancellationToken` to be used by the Command.


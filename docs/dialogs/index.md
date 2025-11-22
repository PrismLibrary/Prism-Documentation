---
sidebar_position: 1
uid: Dialogs.GettingStarted
---

# Getting Started

There are a variety of reasons you may want to create a Dialog in your application. This could be to display a message to your user, or present them with a form to enter some information, etc. Within the Prism.Core we have defined a central abstraction layer for presenting Dialogs across all Prism supported platforms. Dialogs within Prism use the native mechanisms for presenting your custom Views. This enables you to create Dialogs that have the same look and feel as the rest of your application while continuing to use the MVVM pattern.

## Changes

Prism 9.0 introduces some changes to the `IDialogService` with a goal of helping meet you with the callback code that meets your needs. At the heart of the changes is the introduction of the DialogCallback. The DialogCallback is designed to provide you more flexibility in responding to the `IDialogResult`. This allows you to provide an asynchronous or synchronous delegate. Finally rather than being explicitly prescriptive about what you might need to provide as an argument for your callback, it aims to better meet you.

### On Close

```cs
// Basic Callback
new DialogCallback().OnClose(() => Console.WriteLine("The Dialog Closed"));

// Callback with the Dialog Result
new DialogCallback().OnClose(result => Console.WriteLine($"The Dialog Button Result is: {result.Result}"));
```

In addition to the synchronous callbacks shown above each of these has an equivalent for handling asynchronous callbacks:

```cs
// Basic Callback
new DialogCallback().OnCloseAsync(() => Task.CompletedTask);

// Callback with the Dialog Result
new DialogCallback().OnCloseAsync(result => Task.CompletedTask);
```

### Error Handling

Additionally it will let you provide an error handler which will only be invoked in the case that an Exception is encountered.

```cs
// Basic Error Callback
new DialogCallback().OnError(() => Console.WriteLine("Whoops... something bad happened!"));

// Catch All Exception Handler
new DialogCallback().OnError(exception => Console.WriteLine(exception));

// Specific Catch Handler
new DialogCallback().OnError<NullReferenceException>(nre =>
{
    Console.WriteLine("This will only be executed when the Exception is a NullReferenceException.");
    Console.WriteLine("Plus our variable is correctly typed for our handler to work with!");
});

// Specific Catch with the IDialogResult
new DialogCallback().OnError<NullReferenceException>((nre, result) =>
{
    Console.WriteLine($"Button Result: {result.Result}");
    Console.WriteLine(nre);
});
```

:::note
Each of the `OnError` samples above also has an equivalent `OnErrorAsync` which accepts a delegate returning a Task as well.
:::

## Next Steps

- [IDialogAware ViewModels](xref:Dialogs.IDialogAware)
- [IDialogWindow](xref:Dialogs.DialogWindow) (WPF & Uno Platform Only)


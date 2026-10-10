---
sidebar_position: 1
uid: Plugins.Essentials.Threading.MainThread
description: "Dispatch UI work through IMainThread and await asynchronous operations in Prism 9.0."
---

# Main Thread

`Prism.Plugin.Essentials.Threading.IMainThread` dispatches work to the application's UI thread. Keep long-running CPU or I/O work outside UI callbacks so the application remains responsive.

## Registration

Register a host service that includes the shared platform dependencies, such as `RegisterAppContext()` from `Prism.Plugin.Essentials`. This registers `IMainThread` as a singleton on MAUI native, Uno, and WPF. The supported MAUI/Uno `UsePrismEssentials()` setup also includes it. Not every standalone Essentials registration adds the dispatcher; follow the [host setup](../index.md).

## Using IMainThread

```csharp
using Prism.Plugin.Essentials.Threading;

public sealed class StatusPresenter(IMainThread mainThread)
{
    public Task DisplayAsync(Action updateView) =>
        mainThread.InvokeOnMainThreadAsync(updateView);
}
```

`IsMainThread` reports whether the current thread is the UI thread. `BeginInvokeOnMainThread(Action)` posts a callback without a completion task. Use the asynchronous overloads when the caller needs completion, a return value, or exception propagation.

The async helpers support `Action`, `Func<T>`, `Func<Task>`, and `Func<Task<T>>`. Prefer the task-returning overload for asynchronous work rather than passing an `async void` callback. On older target contracts these helpers are extension methods in the same namespace; on newer targets they are interface members.

`GetMainThreadSynchronizationContextAsync()` retrieves the UI synchronization context. The API has no cancellation-token overload; cancellation of the caller does not remove an already posted callback. Avoid blocking waits such as `.Result` or `.Wait()` on UI work, and resolve native services only after the application/window is ready.

## Source reference

These pinned source links describe the Plugins 9.0 baseline and require authorized access to the Prism.Plugins repository.

- [`src/Prism.Plugin.Essentials/Threading/IMainThread.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Threading/IMainThread.cs)
- [`src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Wpf/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Wpf/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Wpf/Threading/MainThreadImplementation.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Wpf/Threading/MainThreadImplementation.cs)

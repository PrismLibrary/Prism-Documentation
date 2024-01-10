---
uid: Plugins.Essentials.MainThread
---

# Main Thread

There are a variety of reasons why you may need to force the execution of a block of code on the MainThread. Some care should be taken when executing on the MainThread as this is used by the UI and long running processes on the UI Thread may result in "Locking" the UI, leading to a poor user experience and bad app store reviews.

Prism.Essentials provides an abstraction layer for the Main Thread which works across all of Prism's primary supported platforms. `IMainThread` is a core service within Prism.Essentials. As a result any service that you register within Prism.Essentials will also automatically register `IMainThread`. For simplicity here we will register all of the Prism.Essentials Services.

# [.NET MAUI](#tab/maui)

```cs
builder.UseMauiApp<App>()
    .UsePrism(prism => prism.UsePrismEssentials())
```

# [WPF](#tab/wpf)

```cs
protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    containerRegistry.UsePrismEssentials();
}
```

# [Uno Platform](#tab/uno-platform)

```cs
protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    containerRegistry.UsePrismEssentials();
}
```

---

## Using IMainThread

Within your application you can make use of `IMainThread` similar to any other service with DependencyInjection.

```cs
public class ViewAViewModel : BindableBase
{
    private readonly IMainThread _mainThread;
    public ViewAViewModel(IMainThread mainThread)
    {
        _mainThread = mainThread;
    }

    private void OnSomethingHappened()
    {
        if (_mainThread.IsMainThread)
            DoSomething();
        else
            _mainThread.BeginInvokeOnMainThread(DoSomething);
    }

    private void DoSomething()
    {
        // Do Something....
    }
}
```

Additionally `IMainThread` has a number of overloads which will let you execute a Function with a return type or even asynchronous code.

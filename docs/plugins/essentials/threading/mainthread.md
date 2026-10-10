---
sidebar_position: 1
uid: Plugins.Essentials.Threading.MainThread
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Main Thread

There are a variety of reasons why you may need to force the execution of a block of code on the MainThread. Some care should be taken when executing on the MainThread as this is used by the UI and long running processes on the UI Thread may result in "Locking" the UI, leading to a poor user experience and bad app store reviews.

Prism Essentials provides `Prism.Plugin.Essentials.Threading.IMainThread` through the host integration. `UsePrismEssentials()` registers the required threading services. Configure the serializer first in every build; `AppJsonContext` is the generated context from the [stores guide](../io/stores.md). Retain [Uno host/window setup](../index.md) when using Uno.

<Tabs groupId="platform">
<TabItem value="maui" label=".NET MAUI">

```cs
using Prism.Plugin.Essentials;

builder.UseMauiApp<App>()
    .UsePrism(prism => prism.RegisterTypes(registry =>
    {
        registry.RegisterSerializer(AppJsonContext.Default);
        registry.UsePrismEssentials();
    }));
```

</TabItem>
<TabItem value="wpf" label="WPF">

```cs
using Prism.Ioc;
using Prism.Plugin.Essentials;

protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    containerRegistry.RegisterSerializer(AppJsonContext.Default);
    containerRegistry.UsePrismEssentials();
}
```

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

```cs
using Prism.Ioc;
using Prism.Plugin.Essentials;

protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    containerRegistry.RegisterSerializer(AppJsonContext.Default);
    containerRegistry.UsePrismEssentials();
}
```

</TabItem>
</Tabs>

## Using IMainThread

Within your application you can make use of `IMainThread` similar to any other service with DependencyInjection.

```cs
using Prism.Mvvm;
using Prism.Plugin.Essentials.Threading;

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

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Essentials/Threading/IMainThread.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials/Threading/IMainThread.cs)

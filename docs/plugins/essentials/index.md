---
sidebar_position: 1
uid: Plugins.Essentials.GettingStarted
title: Essentials
sidebar_label: Getting Started
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Essentials

## Getting Started

Prism.Plugin.Essentials is built around the idea that you should be able to have an abstraction layer for your applications that makes your code more portable with the ability to adapt over time. Whether you want to take code from your legacy WPF application and bring it across to .NET MAUI or Uno Platform or migrate from one platform to another.

The API is generally inspired by a combination of Xamarin/.NET MAUI Essentials and in the case of the [Stores](xref:Plugins.Essentials.Stores) is inspired by one of our favorite libraries [Shiny.NET](https://shinylib.net).

<Tabs groupId="platform">
<TabItem value="maui" label=".NET MAUI">

Be sure to install `Prism.Plugin.Essentials.Maui`

```cs
builder.UseMauiApp<App>()
    .UsePrism(prism => prism.UsePrismEssentials())
```

</TabItem>
<TabItem value="wpf" label="WPF">

Be sure to install `Prism.Plugin.Essentials.Wpf`

```cs
protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    containerRegistry.UsePrismEssentials();
}
```

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

Be sure to install `Prism.Plugin.Essentials.Uno.WinUI`

```cs
protected override void ConfigureApp(IApplicationBuilder builder)
{
    builder.ConfigurePrismEssentials();
}

protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    containerRegistry.UsePrismEssentials();
}
```

</TabItem>
</Tabs>

:::note
Prism.Plugins including Prism.Plugin.Essentials is only available for those with an active Commercial Plus license, and is available on the private Prism NuGet server.
:::

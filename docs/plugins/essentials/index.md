---
uid: Plugins.Essentials.GettingStarted
---

# Getting Started

Prism.Plugin.Essentials is built around the idea that you should be able to have an abstraction layer for your applications that makes your code more portable with the ability to adapt over time. Whether you want to take code from your legacy WPF application and bring it across to .NET MAUI or Uno Platform or migrate from one platform to another.

The API is generally inspired by a combination of Xamarin/.NET MAUI Essentials and in the case of the [Stores](xref:Plugins.Essentials.Stores) is inspired by one of our favorite libraries [Shiny.NET](https://shinylib.net).

# [.NET MAUI](#tab/maui)

Be sure to install `Prism.Plugin.Essentials.Maui`

```cs
builder.UseMauiApp<App>()
    .UsePrism(prism => prism.UsePrismEssentials())
```

# [WPF](#tab/wpf)

Be sure to install `Prism.Plugin.Essentials.Wpf`

```cs
protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    containerRegistry.UsePrismEssentials();
}
```

# [Uno Platform](#tab/uno-platform)

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

---

> [!NOTE]
> Prism.Plugins including Prism.Plugin.Essentials is only available for those with an active Commercial Plus license, and is available on the private Prism NuGet server. Prism.Essentials does NOT support Prism.Forms as Xamarin.Forms is considered to be End of Life and the Prism 9.0 release for Xamarin.Forms is provided only to better assist developers to first update to the Prism 9.0 API prior to migrating to .NET MAUI.

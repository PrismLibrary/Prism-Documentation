---
sidebar_position: 1
title: Essentials
sidebar_label: Getting Started
description: "Choose the Prism 9.0 Essentials host package and register portable application services."
---

# Essentials

## Getting Started

Prism Essentials provides injectable abstractions for application metadata, device information, storage, native UI, and related services. Put the contracts in shared code and register the implementations in the application host. Plugins require an active Commercial Plus license and the [authorized Prism NuGet feed](../../pipelines/commercial-plus.md).

These pages cover the shipped Essentials `9.0.345` package family. Use the dependency requirements declared by the selected package; matching a major version alone does not establish compatibility with every Prism 9.0 build.

## Select the host package

| Application | Package |
| --- | --- |
| Shared contracts and store interfaces | `Prism.Plugin.Essentials` |
| .NET MAUI | `Prism.Plugin.Essentials.Maui` |
| WPF | `Prism.Plugin.Essentials.Wpf` |
| Uno native integration | `Prism.Plugin.Essentials.Uno.WinUI` |
| Uno Skia integration | `Prism.Plugin.Essentials.Uno.Skia.WinUI` |

A package reference makes contracts available; it does not register every service on every target. In this baseline, many Uno registration methods run only on native Android, iOS, Mac Catalyst, or Windows builds. Do not infer desktop/browser support from a shared interface or a Skia package reference.

## Register the host

In the existing MAUI builder, after selecting the application's Prism container:

```csharp
using Prism;
using Prism.Plugin.Essentials;

builder.UseMauiApp<App>()
    .UsePrism(prism => prism.UsePrismEssentials());
```

For Uno, keep both application/window configuration and container registration:

```csharp
using Prism.Ioc;
using Prism.Plugin.Essentials;
using Uno.Extensions.Hosting;

protected override void ConfigureApp(IApplicationBuilder builder)
{
    builder.ConfigurePrismEssentials();
}

protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    containerRegistry.UsePrismEssentials();
}
```

For WPF, select and register the services needed by the application. This example registers application context, connectivity, and device information. `RegisterAppContext()` also registers the UI dispatcher and default serializer through its shared platform dependencies:

```csharp
using Prism.Ioc;
using Prism.Plugin.Essentials;

protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    containerRegistry.RegisterAppContext();
    containerRegistry.RegisterConnectivity();
    containerRegistry.RegisterDeviceInfo();
}
```

## Select services and respect lifetimes

MAUI and native Uno's `UsePrismEssentials()` registers application context, battery, browser, clipboard, connectivity, device information, email, file system, latest-version lookup, launcher, notifications, permissions, phone dialer, and version tracking where that target supplies them. Biometrics requires an additional `RegisterBiometrics()` call.

WPF has a smaller set. Its 9.0 host does not provide battery, clipboard, biometrics, launcher, or the Essentials notification registration used by mobile heads. Use a verified application-owned adapter when a required contract has no host implementation.

Most registrations are singletons. Clipboard, biometrics, and native notification services use transient registrations. Keep observable subscriptions owned by the screen or service that created them, dispose them when that owner ends, and marshal bound UI updates with [IMainThread](threading/mainthread.md). Native UI operations need a ready Activity/window and the relevant manifest declarations.

Start with [application context](applicationmodel/appcontext.md), [stores](io/stores.md), [permissions](permissions/permissions-manager.md), or [notifications](notifications/index.md). Examples in these pages use Prism's interfaces, which are distinct from similarly named .NET MAUI interfaces.

## Source reference

The shipped `9.0.345` package artifacts identify source commit `bbafa527`. That source depends on Prism `9.0.539` and container packages `9.0.107`; this does not establish compatibility with the public Prism `9.0.537` baseline used by the core documentation. These versions identify the reviewed baseline, not a universal installation recommendation. Source links require authorized access to the Prism.Plugins repository.

- [`src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Wpf/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Wpf/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials/Prism.Plugin.Essentials.csproj`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Prism.Plugin.Essentials.csproj)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/Uno.Shared.props`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Uno.WinUI/Uno.Shared.props)
- [Dependency versions](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/Directory.Packages.props)

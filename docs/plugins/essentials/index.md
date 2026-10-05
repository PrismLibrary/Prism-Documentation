---
sidebar_position: 1
title: Essentials
sidebar_label: Getting Started
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Essentials

Prism Essentials provides injectable application-service abstractions so shared view models can use platform services without depending directly on a UI framework. The shared contracts and the host integration have separate responsibilities: compiling against an interface does not guarantee that every operating system implements the capability.

Prism Plugins require an active Commercial Plus license and are distributed through the [authorized Prism feed](../../pipelines/commercial-plus.md). These pages describe the 9.1 line; install compatible package assets for your application and check availability before adopting a recently added API.

## Select the host package

| Application head | Integration package |
| --- | --- |
| .NET MAUI | `Prism.Plugin.Essentials.Maui` |
| WPF | `Prism.Plugin.Essentials.Wpf` |
| Uno WinUI | `Prism.Plugin.Essentials.Uno.WinUI` |
| Uno Skia | `Prism.Plugin.Essentials.Uno.Skia.WinUI` |
| Shared contracts library | `Prism.Plugin.Essentials` |
| Avalonia | No dedicated Essentials integration package in the current source; provide application-owned adapters for the services you need. |

The current Essentials source targets .NET 10 and .NET 11. The exact operating-system TFMs differ across packages. Use the NuGet assets for the installed package, with a compatible Prism/Uno/MAUI SDK; do not infer support from a plain `net` reference assembly. Xamarin.Forms Essentials is not part of the current package set.

See [host capabilities and lifetimes](platform-support.md) before selecting APIs.

## Register Essentials

Registration extensions are in `Prism.Plugin.Essentials`. Configure Essentials once through your chosen host composition path.

<Tabs groupId="platform">
<TabItem value="maui" label=".NET MAUI">

Inside your existing Prism builder callback:

```csharp
using Prism.Plugin.Essentials;

prism.UsePrismEssentials();
```

Or use `prism.RegisterTypes(registry => registry.UsePrismEssentials())` when other registrations need to be ordered together. For NativeAOT, register generated serializer metadata first, as shown below.

</TabItem>
<TabItem value="wpf" label="WPF">

```csharp
using Prism.Ioc;
using Prism.Plugin.Essentials;

protected override void RegisterTypes(IContainerRegistry registry)
{
    registry.UsePrismEssentials();
}
```

If using a custom WPF settings identity, configure it before this call; see [stores](io/stores.md).

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

Keep both the host/window integration and the service registration:

```csharp
using Prism.Ioc;
using Prism.Plugin.Essentials;
using Uno.Extensions.Hosting;

protected override void ConfigureApp(IApplicationBuilder builder)
{
    builder.ConfigurePrismEssentials();
}

protected override void RegisterTypes(IContainerRegistry registry)
{
    registry.UsePrismEssentials();
}
```

`ConfigurePrismEssentials` captures the application and window; it does not replace `UsePrismEssentials`. Retain any other configuration your application already performs in these callbacks.

</TabItem>
</Tabs>

## Baseline and optional services

`UsePrismEssentials()` registers the host's baseline application context, battery, browser, clipboard, connectivity, device information, email, file system, latest-version lookup, launcher, notifications, permissions, phone dialer, and version tracking. Required threading and store services are added by the corresponding registration methods.

The baseline differs by host. WPF also includes biometrics; MAUI and Uno require an explicit `RegisterBiometrics()` when needed. To use a smaller set of services, use the granular registration methods and their required dependencies.

These features require additional setup:

- [Generated application stores](io/stores.md): declare a store interface and call `RegisterStore<T>()`.
- [Geolocation](devices/sensors/geolocation.md) and [geofencing](devices/sensors/geofencing.md): add the matching optional Geolocation package and registration.
- [Background tasks](applicationmodel/background-tasks.md): add the matching optional package, scheduler registration, and lifecycle configuration.
- [Logging](../logging/index.md): select and configure logging providers separately.

## NativeAOT and serializer order

Prism 9.1's supported NativeAOT path uses the Microsoft container with Commercial Plus. Essentials' generated store mapping and JSON serialization need their own configuration. In an existing registration callback:

```csharp
using Prism.Plugin.Essentials;

registry.RegisterSerializer(AppJsonContext.Default);
registry.UsePrismEssentials();
```

`AppJsonContext` is an application-defined `JsonSerializerContext` containing every data shape actually serialized by the enabled services. The [stores guide](io/stores.md) includes a concrete example. Registration preserves an already registered application serializer. If JSON reflection is disabled and no compatible serializer is registered, Essentials deliberately reports an error.

Do not treat registering JSON metadata as proof that every optional plugin supports NativeAOT. In particular, review the [background-task persistence limitation](applicationmodel/background-tasks.md). See the complete [NativeAOT checklist](../../dependency-injection/native-aot.md).

## Use services within the host lifecycle

Resolve native services after their application/window/activity is ready. Constructor injection should establish dependencies; avoid opening dialogs, requesting permissions, or eagerly reading platform stores before native startup has completed.

Keep cancellation tokens and observable subscriptions owned by the screen or operation using them. Dispose subscriptions when their owner ends, and marshal UI updates through `IMainThread`. See [permissions](permissions/permissions-manager.md), [toasts](notifications/toasts.md), and [file ownership](io/filesystem.md) for concrete contracts.

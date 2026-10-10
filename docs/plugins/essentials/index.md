---
sidebar_position: 1
title: Essentials
sidebar_label: Getting Started
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Essentials

Prism Essentials provides injectable application-service abstractions so shared view models can use platform services without depending directly on a UI framework. The shared contracts and the host integration have separate responsibilities: compiling against an interface does not guarantee that every operating system implements the capability.

Prism Plugins require an active Commercial Plus license and are distributed through the [authorized Prism feed](../../pipelines/commercial-plus.md). These pages describe the source being prepared for Prism 10.0 vNext. The 10.0 package rollout is not complete; install only compatible assets that exist in your feed. See [migration and readiness](../../migrating-to-10.md).

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

prism.RegisterTypes(registry =>
{
    registry.RegisterSerializer(AppJsonContext.Default);
    registry.UsePrismEssentials();
});
```

`AppJsonContext` is your application-defined generated context; the [stores guide](io/stores.md) includes its declaration. Order the serializer and platform registrations together in this callback in every build.

</TabItem>
<TabItem value="wpf" label="WPF">

```csharp
using Prism.Ioc;
using Prism.Plugin.Essentials;

protected override void RegisterTypes(IContainerRegistry registry)
{
    registry.RegisterSerializer(AppJsonContext.Default);
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
    registry.RegisterSerializer(AppJsonContext.Default);
    registry.UsePrismEssentials();
}
```

`ConfigurePrismEssentials` captures the application and window; it does not replace `UsePrismEssentials`. Retain any other configuration your application already performs in these callbacks.

</TabItem>
</Tabs>

## Baseline and optional services

`UsePrismEssentials()` registers the host's baseline application context, battery, browser, clipboard, connectivity, device information, device display, email, file system, latest-version lookup, launcher, notifications, permissions, phone dialer, and version tracking. Required threading and store services are added by the corresponding registration methods.

For display-only use, call [RegisterDeviceDisplay](devices/display.md); its granular registration has no serializer dependency.

The baseline differs by host. WPF also includes biometrics; MAUI and Uno require an explicit `RegisterBiometrics()` when needed. To use a smaller set of services, use the granular registration methods and their required dependencies.

Choose the optional services your application needs:

- [Media picking/capture](media/index.md) and [sharing](applicationmodel/datatransfer/share.md): opt in with `RegisterMedia()` and `RegisterShare()` independently.
- [Generated application stores](io/stores.md): declare a store interface and call `RegisterStore<T>()`.
- [Geolocation](devices/sensors/geolocation.md) and [geofencing](devices/sensors/geofencing.md): add the matching optional Geolocation package and registration.
- [Background tasks](applicationmodel/background-tasks.md): add the matching optional package, scheduler registration, and lifecycle configuration.
- [Logging](../logging/index.md): select and configure logging providers separately.

## NativeAOT and serializer order

Prism 10.0's supported NativeAOT path uses the Microsoft container with Commercial Plus. Essentials' generated store mapping and JSON serialization need their own configuration. In an existing registration callback:

```csharp
using Prism.Plugin.Essentials;

registry.RegisterSerializer(AppJsonContext.Default);
registry.UsePrismEssentials();
```

`AppJsonContext` is an application-defined `JsonSerializerContext` containing every data shape actually serialized by the enabled services. The [stores guide](io/stores.md) includes a concrete example. Registration preserves an already registered application serializer. Platform services now call `EnsureSerializerRegistered`: if no serializer is registered, registration throws `InvalidOperationException`, whether AOT is enabled or disabled. Configure metadata or a custom `ISerializer` before `UsePrismEssentials()` and other services that require serialization.

For background tasks, compose the application context with `BackgroundTaskStore.SerializationContext` in this first registration. See [background-task persistence and startup](applicationmodel/background-tasks.md). The explicit parameterless `RegisterSerializer()` remains available for reflection-based applications and declares trimming/dynamic-code requirements; it is never implicitly selected by platform startup. Use the same application registration path in ordinary and NativeAOT builds. See the complete [NativeAOT checklist](../../dependency-injection/native-aot.md).

## Use services within the host lifecycle

Resolve native services after their application/window/activity is ready. Constructor injection should establish dependencies; avoid opening dialogs, requesting permissions, or eagerly reading platform stores before native startup has completed.

Keep cancellation tokens and observable subscriptions owned by the screen or operation using them. Dispose subscriptions when their owner ends, and marshal UI updates through `IMainThread`. See [permissions](permissions/permissions-manager.md), [toasts](notifications/toasts.md), and [file ownership](io/file-references.md) for concrete contracts.

## Documented source baseline

The serializer, startup, and lifecycle guidance incorporates merged [Plugins #184](https://github.com/PrismLibrary/Prism.Plugins/pull/184), at master `22bf2ff`. Media/Share pages separately identify the open #167 source baseline at `154cd86`. These contracts do not require alternate AOT initialization or experimental startup paths. Publication and per-device acceptance are distinct from source/API availability; confirm the package assets in your feed and validate the native behavior you ship.

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Wpf/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials.Wpf/EssentialRegistrationExtensions.cs)

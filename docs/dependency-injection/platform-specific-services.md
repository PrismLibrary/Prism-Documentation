---
sidebar_position: 4
uid: DependencyInjection.IPlatformInitializer
sidebar_label: Platform-specific services
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Platform-specific services

Keep an application contract in a UI-free shared project, then register the implementation that belongs to the host or operating system. Prefer [Prism Essentials](../plugins/essentials/index.md) when it already provides the capability and an integration for your target.

```csharp
public interface IExportLocation
{
    string GetExportDirectory();
}
```

The example contract is synchronous because it only supplies an application-owned directory. A real picker, permission request or share operation needs its own asynchronous result/cancellation contract; do not hide interactive work in a property or constructor.

<Tabs groupId="platform" queryString="platform">
<TabItem value="wpf" label="WPF">

Register the Windows implementation in the application's `RegisterTypes` override or a statically linked module:

```csharp
containerRegistry.RegisterSingleton<IExportLocation, WindowsExportLocation>();
```

Keep Windows APIs in the WPF project or its platform service assembly. Scope a service to a window/document when its state belongs there instead of making it an application singleton automatically.

</TabItem>
<TabItem value="maui" label=".NET MAUI">

Use the host's `RegisterTypes` callback and the single-project platform compile symbols:

```csharp
#if ANDROID
containerRegistry.RegisterSingleton<IExportLocation, AndroidExportLocation>();
#elif IOS || MACCATALYST
containerRegistry.RegisterSingleton<IExportLocation, AppleExportLocation>();
#elif WINDOWS
containerRegistry.RegisterSingleton<IExportLocation, WindowsExportLocation>();
#endif
```

These implementation classes belong to the application. MAUI platform folders can contain the native API code; shared view models only see the interface. Registration does not grant runtime permissions or change the operating system's storage rules.

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

Use the Uno application's composition path and the target-specific code included by its project. A renderer is not an operating system: a Skia desktop implementation and a browser implementation may have very different filesystem and sharing capabilities.

Register one concrete implementation for each enabled head, and make unsupported behavior explicit in the service result. Do not register a Windows-only implementation into every Uno target just because it compiles in a shared namespace.

</TabItem>
<TabItem value="avalonia" label="Avalonia">

Register a host service through the Avalonia application's `RegisterTypes`. Keep desktop-window assumptions separate from a single-view lifetime. Avalonia API support does not imply a Prism Essentials integration package exists for it; where one is unavailable, the application owns the implementation and its tests.

See [Prism for Avalonia](../platforms/avalonia/index.md).

</TabItem>
</Tabs>

## Legacy IPlatformInitializer

`IPlatformInitializer` was a Xamarin.Forms-era hook. It is not the setup contract for these modern hosts. This page retains its address for incoming links; use host composition rather than creating a Xamarin.Forms initializer in a MAUI or Uno application.

Test each real implementation's availability, permissions, cancellation and cleanup on its operating system. The shared interface can be unit-tested with a fake, but that does not qualify native behavior.

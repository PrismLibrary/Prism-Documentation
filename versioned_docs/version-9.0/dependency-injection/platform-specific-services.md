---
sidebar_position: 4
uid: DependencyInjection.IPlatformInitializer
description: "Register host-specific services while keeping shared Prism view models independent of native APIs."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Platform-specific services {#using-iplatforminitializer}

Keep an application contract in a UI-free shared project, then register the implementation that belongs to the host or operating system. If using a plugin, verify that its installed version provides the capability for the selected host rather than assuming every platform has the same native APIs.

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
</Tabs>

## Legacy IPlatformInitializer

`IPlatformInitializer` is a Xamarin.Forms hook that still exists in the Prism 9.0 Forms source. It is not the setup contract for the WPF, MAUI and Uno hosts covered here. This page retains its address for incoming links; use host composition rather than creating a Xamarin.Forms initializer in a MAUI or Uno application.

Test each real implementation's availability, permissions, cancellation and cleanup on its operating system. The shared interface can be unit-tested with a fake, but that does not qualify native behavior.

Source (Prism 9.0.537): [Forms initializer contract](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Forms/Prism.Forms/IPlatformInitializer.cs), [MAUI registration callback](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/PrismAppBuilder.cs), and [WPF application composition](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/PrismApplicationBase.cs).

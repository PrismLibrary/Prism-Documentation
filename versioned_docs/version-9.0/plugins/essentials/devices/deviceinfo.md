---
sidebar_position: 2
uid: Plugins.Essentials.Devices.DeviceInfo
description: "Read device metadata without treating platform labels as capability or identity guarantees."
---

# DeviceInfo

`IDeviceInfo` exposes descriptive device and operating-system metadata. Use `RegisterDeviceInfo()` where supported by the [application host](../index.md), then inject the singleton from `Prism.Plugin.Essentials.Devices`.

```csharp
using Prism.Plugin.Essentials.Devices;

public sealed class EnvironmentSummary(IDeviceInfo device)
{
    public string Describe() =>
        $"{device.Platform} {device.OSVersion} ({device.Idiom})";
}
```

| Property | Meaning |
| --- | --- |
| `Name` | Host/device name supplied by the platform |
| `Platform` | `DevicePlatform` value |
| `Idiom` | `DeviceIdiom` form-factor value |
| `Manufacturer`, `Model` | Descriptive manufacturer/model information |
| `IsVirtualDevice` | Emulator/simulator indication |
| `OSVersion` | OS version as `System.Version` |

`DevicePlatform` and `DeviceIdiom` are value types with named values and `Create(string)` for custom values. Treat unknown or coarse values as valid. The precision of these fields differs across native and desktop hosts.

## Use the right signal

Use window measurements for layout and a feature's capability checks for optional services. Neither an OS label nor `IsVirtualDevice` is a security/integrity check. The device name may identify a person; include it in telemetry only when appropriate to the application's data policy.

This contract does not expose a stable hardware identifier, display size/density, orientation, or keep-awake control. [Essentials logging enrichment](../../logging/interop/essentials.md) can add metadata to logs; review the included properties before enabling it.

## Source reference

These pinned source links describe the Plugins 9.0 baseline and require authorized access to the Prism.Plugins repository.

- [`src/Prism.Plugin.Essentials/Devices/DeviceInfo/IDeviceInfo.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Devices/DeviceInfo/IDeviceInfo.cs)
- [`src/Prism.Plugin.Essentials/Devices/DeviceInfo/DevicePlatform.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Devices/DeviceInfo/DevicePlatform.cs)
- [`src/Prism.Plugin.Essentials/Devices/DeviceInfo/DeviceIdiom.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Devices/DeviceInfo/DeviceIdiom.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Wpf/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Wpf/EssentialRegistrationExtensions.cs)

---
sidebar_position: 2
uid: Plugins.Essentials.Devices.DeviceInfo
---

# Device information

`IDeviceInfo` exposes descriptive information about the current device/host. `UsePrismEssentials()` includes the singleton, or use `RegisterDeviceInfo()` from `Prism.Plugin.Essentials`.

```csharp
using Prism.Plugin.Essentials.Devices;

public sealed class EnvironmentSummary(IDeviceInfo device)
{
    public string Describe() =>
        $"{device.Platform} {device.OSVersion} ({device.Idiom})";
}
```

The interface provides:

| Property | Meaning |
| --- | --- |
| `Name` | Host/device name as exposed by the platform |
| `Platform` | `DevicePlatform` identifying the host platform |
| `Idiom` | `DeviceIdiom` describing its form factor |
| `Manufacturer`, `Model` | Platform-provided manufacturer/model descriptions |
| `IsVirtualDevice` | The implementation's emulator/simulator indication |
| `OSVersion` | Operating-system version as a `System.Version` |

`DevicePlatform` and `DeviceIdiom` are value types with named values and `Create(string)` for custom values, not closed enums. Treat unknown or coarse information as valid. Browser, desktop, emulator, and physical-device implementations do not supply identical precision. Do not use `IsVirtualDevice` as a security or integrity check.

## Use the right signal

- Prefer layout measurement to assuming that a phone/tablet/desktop label determines the available window size.
- Use a service's capability check for biometrics, launch handlers, and other optional features. An OS label alone does not establish support or permission.
- `Name` can contain a person's name. Keep it out of telemetry unless your data policy explicitly includes it; [Essentials logging enrichment](../../logging/interop/essentials.md) includes it by default.
- This interface does not expose a stable hardware identifier, advertising identifier, display size/density, orientation, or keep-awake control.

The Device Display proposal is separate from `IDeviceInfo` and is not part of the merged API covered here. See [host capabilities](../platform-support.md) for package and availability boundaries. Avalonia applications need their own verified adapter because no Essentials Avalonia host package is available in the reviewed source.

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Essentials/Devices/DeviceInfo/IDeviceInfo.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials/Devices/DeviceInfo/IDeviceInfo.cs)
- [`src/Prism.Plugin.Essentials/Devices/DeviceInfo/DevicePlatform.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials/Devices/DeviceInfo/DevicePlatform.cs)
- [`src/Prism.Plugin.Essentials/Devices/DeviceInfo/DeviceIdiom.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials/Devices/DeviceInfo/DeviceIdiom.cs)

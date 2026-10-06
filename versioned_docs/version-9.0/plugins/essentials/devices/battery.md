---
sidebar_position: 1
uid: Plugins.Essentials.Devices.Battery
description: "Read battery state and own observable subscriptions on supported Prism 9.0 hosts."
---

# Battery

`IBattery` exposes charge level, battery state, power source, energy-saver status, and `IObservable<BatteryInfo>` readings. Native MAUI and supported native Uno heads register it as a singleton through `UsePrismEssentials()` or `RegisterBattery()`. WPF's 9.0 host has no battery registration.

```csharp
using Prism.Plugin.Essentials.Devices;

public sealed class BatterySummary(IBattery battery)
{
    public string Read()
    {
        var charge = battery.ChargeLevel;
        return charge < 0
            ? "Battery level unavailable"
            : $"{charge:P0} ({battery.State})";
    }
}
```

Charge is normally from zero to one; minus one means no battery reading. Handle `Unknown` and `NotPresent` states. Use readings to adapt optional work, without assuming they guarantee enough power to finish an operation.

## Observe a snapshot

```csharp
using System.Reactive.Linq;
using Prism.Plugin.Essentials.Devices;
using Prism.Plugin.Essentials.Threading;

public static IDisposable ObserveBattery(
    IBattery battery, IMainThread mainThread, Action<string> updateLabel)
{
    return battery.BatteryInfo.Subscribe(info =>
        mainThread.BeginInvokeOnMainThread(() => updateLabel(
            info.ChargeLevel < 0 ? "Unavailable" : $"{info.ChargeLevel:P0}")));
}
```

The caller owns the returned subscription and disposes it at teardown. Do not assume callbacks arrive on the UI thread or at a fixed polling interval. `BatteryInfo` includes charge, state, power source, and energy-saver status together.

Android requires the `android.permission.BATTERY_STATS` manifest declaration; the API documentation treats this as a declaration requirement. iOS simulator readings are not a replacement for a physical-device test. Complete [host setup](../index.md) before accessing native services, and verify the target's actual implementation rather than inferring support from a package reference.

## Source reference

These pinned source links describe the Plugins 9.0 baseline and require authorized access to the Prism.Plugins repository.

- [`src/Prism.Plugin.Essentials/Devices/Battery/IBattery.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Devices/Battery/IBattery.cs)
- [`src/Prism.Plugin.Essentials/Devices/Battery/BatteryInfo.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Devices/Battery/BatteryInfo.cs)
- [`src/Prism.Plugin.Essentials/Devices/Battery/BatteryImplementation.android.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Devices/Battery/BatteryImplementation.android.cs)
- [`src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Wpf/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Wpf/EssentialRegistrationExtensions.cs)

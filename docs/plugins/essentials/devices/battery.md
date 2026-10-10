---
sidebar_position: 1
uid: Plugins.Essentials.Devices.Battery
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Battery

`IBattery` exposes charge level, charging state, power source, energy-saver status, and `IObservable<BatteryInfo>` updates. It is a singleton included by `UsePrismEssentials()` or registered individually with `RegisterBattery()`.

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

`ChargeLevel` is normally between `0.0` and `1.0`; `-1` means no reading/no battery. Do not display it as a negative percentage. `Unknown` and `NotPresent` are meaningful states. A desktop can run without a battery, and virtual devices may not produce useful readings.

## Observe a snapshot

With System.Reactive available, subscribe after the host is initialized:

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

The caller owns the returned subscription and must dispose it at teardown. Each reconnect reads a fresh snapshot while sharing native observers. Identical seed/native readings are deduplicated per subscriber; `Take(1)` does not return a disconnected session's cached seed. `BatteryInfo` carries one coherent charge/state/power/energy-saver snapshot. Do not assume callbacks arrive on the UI thread or at a fixed polling rate. There is no cancellation-token overload; observation ends by disposal.

<Tabs groupId="platform">
<TabItem value="maui" label=".NET MAUI">

Android checks the battery permission declaration and needs an initialized Activity. Include this in the Android manifest's `manifest` element:

```xml
<uses-permission android:name="android.permission.BATTERY_STATS" />
```

This is a declaration requirement, not a user-facing runtime prompt. See [Microsoft's battery setup guidance](https://learn.microsoft.com/en-us/dotnet/maui/platform-integration/device/battery?view=net-maui-10.0). Test Apple readings on a physical device; simulator values are not device qualification.

</TabItem>
<TabItem value="wpf" label="WPF">

The Windows desktop backend reports the machine's power status. Handle a machine without a battery and unavailable energy-saver information; a percentage is not always present.

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

Mobile heads share the native setup. Skia Desktop selects a Windows, macOS, or Linux backend. BrowserWasm initializes Uno's battery support asynchronously; until available, or when unsupported, it reports `-1`, `NotPresent`, and unknown power/energy-saver status. Its browser backend targets Chromium battery support, not all browsers.

</TabItem>
</Tabs>

Use these readings to adapt optional work, not as a guarantee that an operation can finish before power loss. See [background task constraints](../applicationmodel/background-tasks.md) for scheduled work.

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Essentials/Devices/Battery/IBattery.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials/Devices/Battery/IBattery.cs)
- [`src/Prism.Plugin.Essentials/Devices/Battery/BatteryInfo.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials/Devices/Battery/BatteryInfo.cs)
- [`src/Prism.Plugin.Essentials/Devices/Battery/BatteryImplementation.android.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials/Devices/Battery/BatteryImplementation.android.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/Wasm/Devices/BatteryImplementation.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials.Uno.WinUI/Wasm/Devices/BatteryImplementation.cs)
- [`src/Prism.Plugin.Essentials/Devices/Battery/BatteryObservable.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials/Devices/Battery/BatteryObservable.cs)

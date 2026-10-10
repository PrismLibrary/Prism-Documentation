---
sidebar_position: 3
title: Device display
---

# Device display

Inject `Prism.Plugin.Essentials.Devices.IDeviceDisplay` after `UsePrismEssentials()`. Display-only applications can call `RegisterDeviceDisplay()` from their host's Essentials package without configuring serialization or media/share services. Registration preserves an application-provided implementation.

## Read and observe the main display

Run all property access and event add/remove on the host UI thread:

```csharp
using System;
using Prism.Plugin.Essentials.Devices;

public static class DisplayObserver
{
    public static IDisposable ObserveDisplay(IDeviceDisplay display, Action<DisplayInfo> update)
    {
        update(display.MainDisplayInfo);
        EventHandler<DisplayInfoChangedEventArgs> handler = (_, e) => update(e.DisplayInfo);
        display.MainDisplayInfoChanged += handler;
        return System.Reactive.Disposables.Disposable.Create(() =>
            display.MainDisplayInfoChanged -= handler);
    }
}
```

This example uses System.Reactive. The caller disposes the subscription on the UI thread when its screen ends. Subscribing does not raise an initial event; read the snapshot first. Events contain a complete snapshot on the UI thread; intermediate changes may be coalesced. The first subscriber starts native observation and the last removal stops it.

`Width` and `Height` are display pixels in the displayed orientation, not window/viewport/safe-area bounds or a guarantee of physical panel resolution. Divide each by `Density` for logical dimensions; density is not physical DPI/PPI. `RefreshRate` is platform-reported Hz, not measured app FPS; zero means unavailable. iOS reports the display's maximum frame rate. `Orientation` is displayed orientation and `Rotation` is platform display/interface rotation; unavailable values stay `Unknown`.

The five-argument `DisplayInfo` constructor sets refresh rate to zero. Constructors validate finite positive dimensions/density, nonnegative refresh rate, and defined enum values. `default(DisplayInfo)` is an uninitialized zero snapshot. Equality and duplicate suppression include all six fields.

## Keep the screen awake for an operation

```csharp
display.KeepScreenOn = true;
try
{
    await RunForegroundOperationAsync();
}
finally
{
    display.KeepScreenOn = false;
}
```

`RunForegroundOperationAsync` is application-owned work. Resume on the UI thread for cleanup. `KeepScreenOn` is one shared Boolean request, not a reference-counted lease; coordinate concurrent consumers. It starts false, applies while the relevant host is active, and neither wakes the display nor grants background execution or overrides OS policy.

Setting true requires a current host. Reading the requested Boolean and setting false allow cleanup after host destruction. Android releases its owned window flag on pause/replacement and reapplies the active request on resume. iOS similarly releases/reapplies its owned idle-timer request across activation. Pre-existing native flags are left alone. The container owns backend disposal; a consumer resets its request and unsubscribes.

## Platform boundary

Android and iOS share Prism-owned native backends across MAUI/Uno. Android reads the default display, not current-window metrics. iOS reads the main screen; moving a window to another display does not change that definition. MAUI Windows/Mac Catalyst, Uno WinUI/desktop/browser/Mac Catalyst, and WPF resolve an unsupported service whose members throw `FeatureNotSupportedException`. Avalonia has no registration here. Wrong-thread access on a native host throws `InvalidOperationException`.

Desktop monitor enumeration, browser wake locks, orientation locking, folding regions, and per-window display selection are outside the API. The normal **Display Info** samples demonstrate snapshots and lifecycle cleanup. Fresh rotation/host replacement and keep-awake acceptance remain device-validation work; the source contract is the merged #184 baseline at `22bf2ff`.

## Source reference

Pinned links require access to the Prism.Plugins repository. Check package availability in your authorized feed.

- [`docs/Prism.Plugin.Essentials.DeviceDisplay.md`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/docs/Prism.Plugin.Essentials.DeviceDisplay.md)
- [`src/Prism.Plugin.Essentials/Devices/Display/IDeviceDisplay.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials/Devices/Display/IDeviceDisplay.cs)
- [`src/Prism.Plugin.Essentials/Devices/Display/DisplayInfo.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials/Devices/Display/DisplayInfo.cs)
- [`src/Prism.Plugin.Essentials.Maui/DeviceDisplayRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials.Maui/DeviceDisplayRegistrationExtensions.cs)

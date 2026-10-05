---
sidebar_position: 5
title: Geofencing
---

# Geofencing

Geofencing is part of the optional [Geolocation package family](geolocation.md). After registering the required Essentials services, call `RegisterGeofencing()` from `Prism.Plugin.Essentials` and inject `Prism.Plugin.Essentials.Devices.Sensors.IGeofenceManager`.

```csharp
registry.UsePrismEssentials();
registry.RegisterGeolocation();
registry.RegisterGeofencing();
```

`GeofenceRegion` is the contract accepted by the manager; `GeofenceCircularRegion` is the current concrete shape. Give regions stable identifiers, a center, and a positive radius. Configure entry, exit, and single-use behavior for the application's purpose.

## Query and monitor

For a region supplied by your application:

```csharp
using Prism.Plugin.Essentials.Devices.Sensors;

public sealed class RegionStatus(IGeofenceManager geofences)
{
    public Task<GeofenceState> CheckAsync(
        GeofenceRegion region, CancellationToken token) =>
        geofences.RequestState(region, token);
}
```

`RequestState` can return `Unknown` when a current position cannot be determined. Do not turn it into an inside/outside decision without handling that case.

- `StartMonitoring(region)` starts monitoring the identified region.
- `GetMonitoredRegions()` returns requested regions, not the plugin's reserved horizon fence.
- `WhenTransition()` is a foreground transition stream. Dispose each subscription when its owner ends.
- `StopMonitoring(identifier)` removes one region; `StopAllMonitoring()` affects every region owned by that manager.

Background work requires a registered `IGeofenceDelegate` and the target's permission and lifecycle setup. Foreground subscriptions do not substitute for it. Native OS limits affect how many regions can be watched at once; the plugin selects a nearby watch set rather than guaranteeing every persisted region is simultaneously registered with the OS.

WPF uses an in-process geofencing implementation. Do not promise transitions while a WPF application is closed, or browser delivery when its tab cannot run. Test boundary crossings, denied/revoked location access, restarts, and removal on each actual target. Keep tracking limited to the user's enabled feature.

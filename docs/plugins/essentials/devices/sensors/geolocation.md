---
sidebar_position: 4
uid: Plugins.Essentials.Devices.Senors.Geolocation
---

# Geolocation

GPS is an opt-in Essentials add-on. Reference the package matching your host:

| Host | Package |
| --- | --- |
| Shared contracts | `Prism.Plugin.Essentials.Geolocation` |
| MAUI | `Prism.Plugin.Essentials.Geolocation.Maui` |
| WPF | `Prism.Plugin.Essentials.Geolocation.Wpf` |
| Uno WinUI | `Prism.Plugin.Essentials.Geolocation.Uno.WinUI` |
| Uno Skia | `Prism.Plugin.Essentials.Geolocation.Uno.Skia.WinUI` |

Register the service after the required Essentials host services:

```csharp
using Prism.Plugin.Essentials;

registry.RegisterSerializer(AppJsonContext.Default);
registry.UsePrismEssentials();
registry.RegisterGeolocation();
```

`UsePrismEssentials()` does not register GPS by itself. `RegisterGeolocation()` registers `IGpsManager` as a singleton; `RegisterGeoManager()` is an alias.

## Read the last known position

The API is observable-based. To await a cached reading from an injected manager:

```csharp
using Prism.Plugin.Essentials.Devices.Sensors;
using System.Reactive.Threading.Tasks;

public sealed class LocationReader(IGpsManager gps)
{
    public Task<GpsReading?> ReadLastAsync(CancellationToken token) =>
        gps.GetLastReading().ToTask(token);
}
```

A last reading may be null or stale. Inspect its timestamp and accuracy before using it. Permission failures and unavailable location services must be handled by the application. `ToTask(token)` cancels the subscription; it does not grant permission or promise to dismiss a native prompt.

For a fresh one-shot reading, `GetCurrentPosition()` returns an observable and manages a foreground listener when one was not already active. Canceled waiters do not release another request's acquisition gate. Its cancellation and listener cleanup should still be tested on the target used by your application.

## Continuous tracking and ownership

`StartListener(GpsRequest.Foreground)` starts foreground tracking. Subscribe to `WhenReading()` to receive updates, retain the returned subscription, and marshal any bound-property updates through `IMainThread`.

Dispose the subscription when its screen or operation ends. Separately call `StopListener()` when the application component that owns the listener no longer needs tracking. Because the manager is shared, a temporary screen should not stop a listener owned by another feature. `CurrentListener` describes the current request.

`GpsRequest` specifies background mode, accuracy, and a distance filter. Higher accuracy and background tracking have power and privacy costs; do not enable them unless the feature needs them.

## Permissions and host limits

| Host | Setup and limits |
| --- | --- |
| Android | Declare the required location permissions and configure background/service behavior separately when needed. Respect approximate location, denial, and later revocation. |
| iOS / Mac Catalyst | Provide usage descriptions and the required background mode for the requested operation. Foreground access does not authorize continuous background tracking. |
| WPF | Uses a Windows desktop location backend; OS location settings, sensors, and policy can make it unavailable. |
| Uno | Behavior follows the selected native, desktop, or browser backend. Browser geolocation depends on browser support and permission and does not provide durable background execution. |

Request access in the context of the user's feature and handle cancellation, errors, and app resume. Background callbacks require the plugin's delegate/lifecycle configuration; a foreground observable alone is not background-delivery support. Validate declarations and actual behavior for each selected host. See [permissions](../../permissions/permissions-manager.md) and [geofencing](geofencing.md).

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Essentials.Geolocation/IGpsManager.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials.Geolocation/IGpsManager.cs)
- [`src/Prism.Plugin.Essentials.Geolocation/IGpsManagerExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials.Geolocation/IGpsManagerExtensions.cs)
- [`src/Prism.Plugin.Essentials.Geolocation.Maui/EssentialsGeolocationRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials.Geolocation.Maui/EssentialsGeolocationRegistrationExtensions.cs)

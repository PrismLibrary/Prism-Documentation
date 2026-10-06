---
sidebar_position: 2
uid: Plugins.Essentials.Devices.Sensors.Geocoding
---

# Geocoding

The merged 9.1 source does not currently expose a Prism `IGeocoding` service, a `RegisterGeocoding()` extension, or a geocoding provider package. Installing the optional Geolocation package does not add address lookup.

Geocoding translates an address to coordinates; reverse geocoding translates coordinates to an address. [Geolocation](geolocation.md) supplies position readings and [geofencing](geofencing.md) monitors regions. Neither contract promises address resolution.

## Integrate an application-owned provider

If your feature needs address search now, define a small interface in your shared application layer and register a host or server-backed implementation explicitly. Keep these decisions in the implementation:

- Whether user addresses or coordinates leave the device, and which service receives them
- Required credentials, quotas, rate limits, attribution, and permitted caching
- Cancellation, timeouts, offline behavior, and empty or ambiguous results
- A user confirmation step before selecting among multiple matching places

Request device-location permission only if you actually obtain the device's location. A typed address lookup and a GPS reading are separate operations. Keep provider-specific location types out of shared view models where possible, and do not label an application adapter as a shipped Prism API.

The [Essentials package guide](../../index.md) lists the current integrations. Future Prism geocoding guidance should be based on a merged contract and available package, rather than the presence of this documentation category.

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Essentials.Geolocation/IGpsManager.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials.Geolocation/IGpsManager.cs)
- [`src/Prism.Plugin.Essentials.Geolocation/IGeofenceManager.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials.Geolocation/IGeofenceManager.cs)

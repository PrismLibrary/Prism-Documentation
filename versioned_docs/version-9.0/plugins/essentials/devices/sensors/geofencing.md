---
sidebar_position: 3
uid: Plugins.Essentials.Devices.Sensors.Geofencing
description: "Plan application-owned geofence integration for the Prism 9.0 baseline."
---

# Geofencing

Prism Essentials 9.0 does not contain a geofencing contract, registration extension, or monitoring implementation. A reference to Essentials does not install an operating-system geofence monitor.

A geofence feature needs an application-owned adapter to the selected native location provider. Define how a region is identified, its center/radius, entry/exit handling, and how monitoring is started and stopped. Persist only the state needed to restore the user's requested monitoring.

Request location access in the context of the feature. Background authorization, platform limits on region counts, process suspension, reboot, and delayed or duplicate events all belong in the application design. Avoid promising exact boundary timing or uninterrupted monitoring.

See [geolocation](geolocation.md) and [permissions](../../permissions/permissions-manager.md) before adding a platform-specific provider.

## Source reference

These pinned source links describe the Plugins 9.0 baseline and require authorized access to the Prism.Plugins repository.

- [`src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs)

---
sidebar_position: 4
uid: Plugins.Essentials.Devices.Senors.Geolocation
description: "Integrate location behind an application-owned service in a Prism 9.0 application."
---

# Geolocation

The Prism Essentials 9.0 baseline does not contain an `IGeolocation` contract or a `RegisterGeolocation()` extension. Location permission types are available, but they do not provide a position-reading service.

Choose a native or framework location provider for each supported head and put it behind an application-owned interface. Register that adapter with Prism, then inject it into the view model. Let the interface represent unavailable data, cancellation, accuracy, and the age of a reading rather than returning an unconditional coordinate.

Request foreground location only when the user invokes the feature. Continuous tracking and background access require separate lifecycle and platform declarations. Stop tracking when its owner ends, and avoid storing or logging coordinates without a deliberate application policy.

See [permissions](../../permissions/permissions-manager.md) for Prism's permission-manager contract and [geofencing](geofencing.md) for boundary monitoring considerations.

## Source reference

These pinned source links describe the Plugins 9.0 baseline and require authorized access to the Prism.Plugins repository.

- [`src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials/Permissions/LocationWhenInUse.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Permissions/LocationWhenInUse.cs)
- [`src/Prism.Plugin.Essentials/Permissions/LocationAlways.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Permissions/LocationAlways.cs)

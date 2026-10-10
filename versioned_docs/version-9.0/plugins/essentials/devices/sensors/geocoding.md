---
sidebar_position: 2
uid: Plugins.Essentials.Devices.Sensors.Geocoding
description: "Add an explicit geocoding provider to a Prism 9.0 application."
---

# Geocoding

Prism Essentials 9.0 has no geocoding or reverse-geocoding contract or registration method. Converting an address to coordinates, or coordinates to an address, requires an application-owned service backed by a provider you choose.

Keep the provider's request/response types behind an injectable interface. Return multiple candidates where appropriate, and distinguish no match from a network or quota failure. Geocoding a typed address does not itself require access to the device's current location.

Account for the provider's accuracy, country/language behavior, attribution, rate limits, and data-handling requirements. A geocoding result is not proof that a postal address is deliverable or that a person is present there.

For device positioning see [geolocation](geolocation.md); for dependency registration see [registering types](../../../../dependency-injection/registering-types.md).

## Source reference

These pinned source links describe the Plugins 9.0 baseline and require authorized access to the Prism.Plugins repository.

- [`src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs)

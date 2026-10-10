---
sidebar_position: 1
uid: Plugins.Essentials.Media.Camera
description: "Integrate a camera provider explicitly in a Prism 9.0 application."
---

# Camera

Prism Essentials 9.0 does not expose a camera capture or media-picker contract. Its camera permission type checks/request access where supported; permission alone does not create a capture service.

Wrap the selected host's camera or media-picker API in an application-owned service and register that service with Prism. Initiate capture from the active UI, handle cancellation and denied access, and keep native media objects inside the adapter.

Define who owns the captured file, when it may be deleted, and which metadata is retained before passing it to another feature. Test on a physical device as well as the intended packaging configuration.

See [permissions](../permissions/permissions-manager.md), [file system](../io/filesystem.md), and [media overview](index.md).

## Source reference

These pinned source links describe the Plugins 9.0 baseline and require authorized access to the Prism.Plugins repository.

- [`src/Prism.Plugin.Essentials/Permissions/Camera.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Permissions/Camera.cs)
- [`src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs)

---
sidebar_position: 1
uid: Plugins.Essentials.Media.GettingStarted
title: Getting Started
description: "Understand which media features require application-owned providers in Prism 9.0."
---

# Getting Started

The Prism Essentials 9.0 baseline supplies file-system and permission abstractions, but it does not supply camera capture, a media picker, or video playback/capture contracts.

Use the application host's supported media API behind an injectable service. Keep native file handles, capture UI, and platform lifecycle concerns inside the adapter so the shared view model can work with application-owned results.

- [Camera](camera.md): capture/picker integration and ownership of output files.
- [Video](video.md): capture/playback lifecycle and cancellation.
- [File system](../io/filesystem.md): directories and asset streams.
- [Permissions](../permissions/permissions-manager.md): declarations, status checks, and requests.

Handle denied access, unavailable hardware, canceled capture, and storage exhaustion as normal application outcomes.

## Source reference

These pinned source links describe the Plugins 9.0 baseline and require authorized access to the Prism.Plugins repository.

- [`src/Prism.Plugin.Essentials/IO/FileSystem/IFileSystem.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/IO/FileSystem/IFileSystem.cs)
- [`src/Prism.Plugin.Essentials/Permissions/IPermissionsManager.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Permissions/IPermissionsManager.cs)
- [`src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs)

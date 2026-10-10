---
sidebar_position: 2
uid: Plugins.Essentials.Media.Video
description: "Keep video capture and playback behind host-specific services in Prism 9.0."
---

# Video

The Prism Essentials 9.0 baseline has no video capture, playback, or recording service. Use the controls and native APIs supported by the application host, and expose only the operations needed by shared code through an application-owned interface.

For capture, account for camera and microphone permissions, cancellation, file size, and the lifetime of the output file. For playback, release media resources when the view closes, handle background/suspend transitions, and expose loading/error states to the UI.

Do not assume that camera permission grants microphone access or that a media path is readable by another application. See [camera](camera.md), [permissions](../permissions/permissions-manager.md), and [file system](../io/filesystem.md).

## Source reference

These pinned source links describe the Plugins 9.0 baseline and require authorized access to the Prism.Plugins repository.

- [`src/Prism.Plugin.Essentials/Permissions/Camera.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Permissions/Camera.cs)
- [`src/Prism.Plugin.Essentials/Permissions/Microphone.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Permissions/Microphone.cs)
- [`src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs)

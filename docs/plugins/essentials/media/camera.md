---
sidebar_position: 2
uid: Plugins.Essentials.Media.Camera
title: System capture
---

# System capture

Use `IMedia.CaptureAsync` to open system capture for one photo or video. This is the Prism 10.0 vNext contract at Plugins #167's `154cd86`; see [registration and availability](index.md). Capture returns an app-private, caller-owned [file reference](../io/file-references.md), or `null` on user dismissal. It does not save to the public gallery.

## Capture and read a photo

Run from a foreground UI command with an injected `IMedia`:

```csharp
using System;
using System.Threading.Tasks;
using Prism.Plugin.Essentials.Media;

public static class CaptureReader
{
    public static async Task ReadPhotoAsync(IMedia media)
    {
        if ((media.Capabilities & MediaCapabilities.CapturePhoto) == 0)
            return; // Present an unavailable state in the UI.

        await using var photo = await media.CaptureAsync(new MediaCaptureOptions
        {
            MediaType = MediaType.Photo,
            CameraFacing = CameraFacing.SystemDefault,
            Title = "Capture photo"
        });
        if (photo is null)
            return;

        await using var stream = await photo.OpenReadAsync();
        var prefix = new byte[512];
        _ = await stream.ReadAsync(prefix.AsMemory());
        // Consume the stream while the reference is alive; do not assume JPEG encoding.
    }
}
```

`MediaCaptureOptions.MediaType` defaults to `Photo`; `Video` is the other valid value. `PhotoOrVideo` is only for selection and fails before host access or prompting. `Title` is advisory. Handle [operation failures](index.md#results-and-failures), even after checking capabilities.

## Camera direction and permissions

`CameraFacing` defaults to `SystemDefault`. Explicit `Front` or `Rear` requires the `SelectCameraFacing` capability, currently implemented by UIKit system capture. An unavailable direction fails before prompting. Android delegated camera intents support only `SystemDefault` and reject explicit selection.

Capture requests its required permissions internally. Optional `CheckPermissionsAsync(MediaCapabilities.CapturePhoto)` and `RequestPermissionsAsync(MediaCapabilities.CapturePhoto)` support preflight. Combine `CapturePhoto`, `CaptureVideo`, and picker operation flags when your UI needs their access union; do not pass `SelectCameraFacing` to permission methods.

| Route | Required access |
| --- | --- |
| Android delegated capture | Requests `CAMERA` only if the app declares it. The camera app owns microphone access. |
| iOS photo capture | Camera access and `NSCameraUsageDescription`. No microphone request. |
| iOS video with audio | Camera and microphone access, with both usage descriptions. |

For iOS capture, add meaningful entries to the host's `Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>Capture a photo or video when you choose to use the camera.</string>
<key>NSMicrophoneUsageDescription</key>
<string>Record audio with the video you choose to capture.</string>
```

Photo-only capture needs only the camera description. Missing required entries fail declaration validation before a prompt. These private capture and system-picker routes do not need photo-library read/add descriptions; features that separately access or save to the library have their own requirements. There is no portable silent-video option.

For Android handler discovery, add these inside `queries` alongside the [picker queries](index.md#android-handler-discovery):

```xml
<intent><action android:name="android.media.action.IMAGE_CAPTURE" /></intent>
<intent><action android:name="android.media.action.VIDEO_CAPTURE" /></intent>
```

Android capture uses provider-bound output in the native `Context.CacheDir`. Its filename/MIME describe the detected encoded container; unrecognized output becomes `capture.bin` / `application/octet-stream`. No format conversion is performed.

## Presentation and supported scope

On UIKit, the default window manager accepts a unique foreground normal window. Apps with multiple eligible windows must supply the initiating controller through `WindowManagerImplementation.Init` or a scoped `IWindowManager.GetPresentationUIViewController` implementation. Follow the command's originating window. Multi-scene runtime validation remains pending.

Android and iOS implement system capture where hardware and handlers are available. No-camera devices remain valid application hosts; available picker routes can still work. WPF, MAUI Windows/Mac Catalyst, and Uno desktop/browser/WinUI/Mac Catalyst have no media backend in this source. Desktop/webcam capture, camera enumeration, external cameras, logical/physical lens selection, simultaneous cameras, zoom, exposure, focus, aperture, recording-format controls, and owned preview/recording sessions are unsupported. There is no `ICameraService` registration to add.

Fresh photo/video preview, recording, dismissal, permissions, and host-replacement checks in the normal samples remain device-validation work. The public contract and startup path can be used as documented; opening native capture UI alone is not a camera-preview pass.

## Source reference

Pinned links require access to the Prism.Plugins repository. Check package availability in your authorized feed.

- [`src/Prism.Plugin.Essentials/Media/MediaCaptureOptions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/src/Prism.Plugin.Essentials/Media/MediaCaptureOptions.cs)
- [`src/Prism.Plugin.Essentials/Media/CameraFacing.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/src/Prism.Plugin.Essentials/Media/CameraFacing.cs)
- [`src/Prism.Plugin.Essentials/Media/MediaPermissionRequirements.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/src/Prism.Plugin.Essentials/Media/MediaPermissionRequirements.cs)
- [`src/Prism.Plugin.Essentials/Media/MediaImplementation.android.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/src/Prism.Plugin.Essentials/Media/MediaImplementation.android.cs)
- [`src/Prism.Plugin.Essentials/Media/MediaImplementation.ios.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/src/Prism.Plugin.Essentials/Media/MediaImplementation.ios.cs)
- [`src/Prism.Plugin.Essentials/Platform/WindowManagerImplementation.apple.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/src/Prism.Plugin.Essentials/Platform/WindowManagerImplementation.apple.cs)

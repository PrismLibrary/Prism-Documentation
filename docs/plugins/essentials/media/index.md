---
sidebar_position: 1
uid: Plugins.Essentials.Media.GettingStarted
title: Media selection
---

# Media selection

`Prism.Plugin.Essentials.Media.IMedia` opens the native system picker and capture UI. Use `PickAsync` for photos, videos, or a mixed selection, and `CaptureAsync` for one photo or video. Both return portable, caller-owned [file references](../io/file-references.md).

:::note Source and availability
These guides describe the current Prism 10.0 vNext contract in [Plugins #167](https://github.com/PrismLibrary/Prism.Plugins/pull/167), at `154cd86`. The API and normal initialization path are the documented baseline; the PR is still open and package publication and device qualification remain pending. Install a compatible package containing these contracts before using the examples.
:::

## Register the services

In your MAUI, Uno, or WPF head's existing Prism registration callback:

```csharp
using Prism.Plugin.Essentials;

registry.RegisterSerializer(AppJsonContext.Default);
registry.UsePrismEssentials();
registry.RegisterMedia();
```

`AppJsonContext` is your generated context; see [serializer setup](../io/stores.md). `RegisterMedia()` includes `RegisterFileReferences()` and, on Android/iOS, permission services. [Sharing](../applicationmodel/datatransfer/share.md) is independent: add `RegisterShare()` only when needed. Neither Media nor Share is included in `UsePrismEssentials()`. Keep the [Uno host/window configuration](../index.md) when using Uno.

Call native operations from the foreground host's UI thread after startup, in response to a user action. `Capabilities` is a prompt-free route/hardware hint, not permission status or a success guarantee. Android and iOS have picker/capture backends. Other MAUI/Uno targets and WPF resolve an unsupported implementation with `MediaCapabilities.None`; attached webcams do not change that.

## Pick one or several items

With an injected `IMedia media`, this method reads a bounded prefix of each result and disposes every reference, even when reading or cleanup fails:

```csharp
using System;
using System.Linq;
using System.Threading.Tasks;
using Prism.Plugin.Essentials.IO;
using Prism.Plugin.Essentials.Media;

public static class MediaReader
{
    public static async Task ReadSelectionAsync(IMedia media)
    {
        var selected = await media.PickAsync(new MediaPickerOptions
        {
            MediaType = MediaType.PhotoOrVideo,
            SelectionLimit = 5,
            Title = "Select media"
        });
        var failed = false;
        try
        {
            foreach (var file in selected)
            {
                await using var stream = await file.OpenReadAsync();
                var prefix = new byte[512];
                _ = await stream.ReadAsync(prefix.AsMemory());
                // file.FileName and file.ContentType describe this representation.
            }
        }
        catch
        {
            failed = true;
            throw;
        }
        finally
        {
            try { await Task.WhenAll(selected.Select(DisposeFileAsync)); }
            catch (Exception) when (failed) { /* Preserve the read failure. */ }
        }
    }

    // An async wrapper also captures synchronous disposal failures, so all files are tried.
    static async Task DisposeFileAsync(IFileReference file) => await file.DisposeAsync();
}
```

`MediaPickerOptions.MediaType` defaults to `Photo`. Use `Video` for videos or `PhotoOrVideo` for mixed results. `SelectionLimit` defaults to `1`; larger values request multiple items and `0` requests the native maximum. Negative values are rejected. The title and limit are advisory; document-picker routes may not enforce a limit, and returned items are never silently discarded.

Android uses the visual picker where available and an open-document fallback. iOS uses ordered PHPicker selection and selects a compatible representation for each provider. Results retain native selection order. A temporary provider file is copied before its callback ends. Do not infer JPEG/MP4 encoding from the requested type, or a durable filesystem path from selection.

## Optional permission preflight

Picking and capture request the required access internally. Use preflight only when your UI needs a rationale or an explicit check/request action:

```csharp
using Prism.Plugin.Essentials.Media;
using Prism.Plugin.Essentials.Permissions;

var requested = MediaCapabilities.PickMixedMedia | MediaCapabilities.CaptureVideo;
var status = await media.CheckPermissionsAsync(requested);
if (status != PermissionStatus.Granted && status != PermissionStatus.NotSupported)
{
    // Present your rationale, then continue from the user's action.
    status = await media.RequestPermissionsAsync(requested);
}
```

These methods accept `MediaCapabilities` flags directly, covering both picking and capture. They do not accept option objects. Accepted operations are `PickPhotos`, `PickVideos`, `PickMixedMedia`, `CapturePhoto`, and `CaptureVideo`; combinations check/request their deduplicated permission union. `None` is granted without host access. Any unavailable requested operation returns `NotSupported` before prompting. Unknown flags and `SelectCameraFacing` are rejected: direction selection is a configuration capability, not an access operation.

The current visual/document/PHPicker backends use selected-item access and do not request broad library/storage permission. Capability hints and a granted preflight can become stale; still handle the actual operation's result. [Capture](camera.md) explains camera/microphone requirements.

## Android handler discovery

For Android 11+, include visibility queries for the routes your app uses, inside the manifest's `queries` element:

```xml
<intent><action android:name="android.provider.action.PICK_IMAGES" /></intent>
<intent>
    <action android:name="android.provider.action.PICK_IMAGES" />
    <data android:mimeType="image/*" />
</intent>
<intent>
    <action android:name="android.provider.action.PICK_IMAGES" />
    <data android:mimeType="video/*" />
</intent>
<intent>
    <action android:name="android.intent.action.OPEN_DOCUMENT" />
    <category android:name="android.intent.category.OPENABLE" />
    <data android:mimeType="*/*" />
</intent>
<intent>
    <action android:name="android.intent.action.OPEN_DOCUMENT" />
    <category android:name="android.intent.category.OPENABLE" />
    <data android:mimeType="image/*" />
</intent>
<intent>
    <action android:name="android.intent.action.OPEN_DOCUMENT" />
    <category android:name="android.intent.category.OPENABLE" />
    <data android:mimeType="video/*" />
</intent>
```

Keep `xmlns:android="http://schemas.android.com/apk/res/android"` on the manifest root. Mixed fallback intents restrict the offered MIME types to images/videos. Queries expose handlers; they do not grant data access. Retain the integration's Activity result forwarding and plugin file-provider configuration; see the existing MAUI/Uno platform entry points in the source references.

## Results and failures

| Outcome | Contract |
| --- | --- |
| User dismisses picker / capture | Empty read-only list / `null` |
| Permission denied or required declaration missing | `PermissionException` |
| Operation unsupported | `FeatureNotSupportedException` |
| Required native handler missing | `FeatureNotEnabledException` |
| Foreground host interrupted | `InvalidOperationException` |
| Invalid options/permission flags | Argument error before presentation |

There are no cancellation-token overloads on `IMedia`; do not promise programmatic dismissal of its system UI. A failed acquisition cleans up earlier results. On Android, return waits for the initiating Activity to regain window focus; an interrupted return cleans up instead of returning files to an unusable host.

## Normal samples and validation

The existing MAUI and Uno samples expose separate **Media** and **Share** pages. Media demonstrates filters, selection count, ordered filename/MIME details, direct capture, optional operation-flag checks, bounded reads, and disposal. Share demonstrates text/link and synthetic files without a picker or camera permission prerequisite.

Source and managed tests establish the documented contract. Fresh NativeAOT publication and device acceptance of these pages remain pending. An opened controller does not establish a visible camera preview or delivered file. Validate mixed/cloud representations, native-limit fallback, dismissal and partial failures, permission denial/host replacement, Android provider reads, and two UIKit scenes on the targets you ship. Desktop cameras, device discovery, external/logical lens selection, manual controls, and owned camera sessions are unsupported; see [capture boundaries](camera.md).

## Source reference

Pinned links require access to the Prism.Plugins repository. Check package availability in your authorized feed.

- [`src/Prism.Plugin.Essentials/Media/IMedia.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/src/Prism.Plugin.Essentials/Media/IMedia.cs)
- [`src/Prism.Plugin.Essentials/Media/MediaBase.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/src/Prism.Plugin.Essentials/Media/MediaBase.cs)
- [`src/Prism.Plugin.Essentials/Media/MediaCapabilities.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/src/Prism.Plugin.Essentials/Media/MediaCapabilities.cs)
- [`src/Prism.Plugin.Essentials/Media/MediaPickerOptions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/src/Prism.Plugin.Essentials/Media/MediaPickerOptions.cs)
- [`src/Prism.Plugin.Essentials.Maui/MediaRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/src/Prism.Plugin.Essentials.Maui/MediaRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/MediaRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/src/Prism.Plugin.Essentials.Uno.WinUI/MediaRegistrationExtensions.cs)
- [`samples/Samples.Maui/Platforms/Android/MainActivity.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/samples/Samples.Maui/Platforms/Android/MainActivity.cs)
- [`samples/Samples.UnoWinUI/Platforms/Android/MainActivity.Android.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/samples/Samples.UnoWinUI/Platforms/Android/MainActivity.Android.cs)
- [`samples/Samples.Shared/ViewModels/MediaViewModel.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/samples/Samples.Shared/ViewModels/MediaViewModel.cs)

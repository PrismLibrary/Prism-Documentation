---
sidebar_position: 3
uid: Plugins.Essentials.Media.Video
---

# Video

Use the same `IMedia` service for photos and videos. The examples below use the Prism 10.0 vNext contract at Plugins #167's `154cd86`; see [registration and availability](index.md). There is no separate `IVideo` registration.

## Select or capture

With an injected `IMedia media`, select existing videos:

```csharp
using Prism.Plugin.Essentials.Media;

var selected = await media.PickAsync(new MediaPickerOptions
{
    MediaType = MediaType.Video,
    SelectionLimit = 3
});
```

Dispose every result after its streams; use the complete [selection cleanup example](index.md#pick-one-or-several-items). For mixed photos/videos use `PhotoOrVideo` with the same method.

Record one video through system UI:

```csharp
await using var video = await media.CaptureAsync(new MediaCaptureOptions
{
    MediaType = MediaType.Video,
    CameraFacing = CameraFacing.SystemDefault
});
if (video is not null)
{
    await using var stream = await video.OpenReadAsync();
    // Read or copy the video before the stream and reference are disposed.
}
```

Capture does its own operation-specific permission request. Optional preflight takes `MediaCapabilities.CaptureVideo`, not an options object. iOS system video capture includes audio and requires camera/microphone descriptions. Android delegates audio access to the camera app. See [capture setup](camera.md).

## Representation and playback

Filename and MIME describe the returned representation, which can vary by provider and device. Neither selection nor capture guarantees MP4, a codec, transcoding, or public-gallery storage. Native limits and picker titles are advisory; cloud retrieval and large media can fail.

Playback is application/framework-owned. If a player requires a path, use [explicit local materialization](../io/file-references.md#when-a-native-consumer-needs-a-path) and keep the lease alive for the player's entire read lifetime. A file reference does not grant access after restart. NativeAOT compilation does not establish playback or recording support on a target; validate the codecs and actual device flows your application uses.

## Source reference

Pinned links require access to the Prism.Plugins repository. Check package availability in your authorized feed.

- [`src/Prism.Plugin.Essentials/Media/MediaType.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/src/Prism.Plugin.Essentials/Media/MediaType.cs)
- [`src/Prism.Plugin.Essentials/Media/MediaPickerOptions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/src/Prism.Plugin.Essentials/Media/MediaPickerOptions.cs)
- [`src/Prism.Plugin.Essentials/Media/MediaCaptureOptions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/src/Prism.Plugin.Essentials/Media/MediaCaptureOptions.cs)

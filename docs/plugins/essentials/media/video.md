---
sidebar_position: 2
uid: Plugins.Essentials.Media.Video
---

# Video

The merged 9.1 Essentials source does not expose a video picker, video recorder, or playback service. There is no current `IVideo` registration to add. The media category is not a package-availability guarantee.

For application-package assets and app directories, use [IFileSystem](../io/filesystem.md). It provides file access, not a native picker or media player. The proposed portable media-selection/capture work remains under review; see the [camera availability boundary](camera.md).

## Keep host media behavior explicit

For an application-owned implementation, separate picking an existing video, recording a new one, and playback. Each has different requirements:

- Picking may return a provider-owned reference rather than a durable local path. Define who opens and closes streams and whether the app needs its own copy.
- Recording can require camera/microphone declarations and runtime permission. A canceled recording is not a saved video.
- Playback depends on the selected platform control, codecs, network policy, and media lifetime.

Register a verified adapter for each supported head and expose unavailable capabilities to the UI. Avoid passing framework-specific file objects into a supposedly portable Prism contract, and do not infer NativeAOT support from the existence of an adapter.

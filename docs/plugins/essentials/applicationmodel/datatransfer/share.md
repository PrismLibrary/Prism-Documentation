---
sidebar_position: 2
uid: Plugins.Essentials.ApplicationModel.DataTransfer.Share
---

# Share

`Prism.Plugin.Essentials.ApplicationModel.DataTransfer.IShare` opens native sharing for text, HTTP(S) links, or portable files. This guide uses the Prism 10.0 vNext contract at Plugins #167's `154cd86`; see [source availability and validation](../../media/index.md). Sharing works independently of media picking and camera permissions.

## Register and share text

In your host's existing Prism registration callback:

```csharp
using Prism.Plugin.Essentials;

registry.RegisterSerializer(AppJsonContext.Default);
registry.UsePrismEssentials();
registry.RegisterShare();
```

`AppJsonContext` is your [generated context](../../io/stores.md). `RegisterShare()` includes [portable file services](../../io/file-references.md); it does not require `RegisterMedia()`. Invoke requests from the current foreground UI thread with an injected `IShare share`:

```csharp
using System;
using Prism.Plugin.Essentials.ApplicationModel.DataTransfer;

if ((share.Capabilities & ShareCapabilities.Text) != 0)
{
    await share.RequestAsync(new ShareTextRequest
    {
        Text = "Sample text",
        Title = "Share text"
    });
}

if ((share.Capabilities & ShareCapabilities.Uri) != 0)
{
    await share.RequestAsync(new ShareTextRequest
    {
        Uri = new Uri("https://prismlibrary.com/"),
        Title = "Share link"
    });
}
```

A text request needs nonblank text and/or an absolute HTTP(S) URI; linked resources are not downloaded. `Title` is an advisory chooser caption. `Subject` is separate advisory metadata, principally used by Android; targets may ignore either. `Capabilities` is a route hint, not recipient acceptance.

## Share files

With an injected `IFileReferenceFactory files`, this method creates and shares one synthetic file without a picker:

```csharp
using System.IO;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Prism.Plugin.Essentials.ApplicationModel.DataTransfer;
using Prism.Plugin.Essentials.IO;

public static class ShareExamples
{
    public static async Task ShareSampleAsync(
        IShare share, IFileReferenceFactory files, CancellationToken token)
    {
        if ((share.Capabilities & ShareCapabilities.Files) == 0)
            return; // Present an unavailable state in the UI.

        await using var source = new MemoryStream(Encoding.UTF8.GetBytes("Sample text"));
        await using var file = await files.FromStreamAsync(
            source, "sample.txt", "text/plain", token);
        await share.RequestAsync(new ShareFileRequest
        {
            File = file,
            Title = "Share file"
        }, token);
    }
}
```

For multiple already-created, live references, use the distinct request type:

```csharp
await share.RequestAsync(new ShareMultipleFilesRequest
{
    Files = new[] { firstFile, secondFile },
    Title = "Share files"
}, token);
```

The caller owns `firstFile` and `secondFile` and disposes each after the request settles and all its own streams close. The list must be nonempty and contain no null entries. Check `MultipleFiles` for that route. These requests borrow their inputs while preparing independent staged copies. Failure to prepare any file rolls back staging before presentation; disposing an input never deletes another caller's original local file.

## Completion and host boundaries

The cancellation token stops preparation before native handoff. After handoff it cannot retract shared data or stop recipient reads. Once `RequestAsync` settles, the caller can dispose its inputs; sharing retains its independent staging for the native session as needed. Successful task completion does not confirm target selection, transmission, or delivery. Treat user dismissal as completion of the presentation, not a sent message.

Android and iOS have native backends. WPF and other MAUI/Uno targets resolve `ShareCapabilities.None` and unsupported requests fail. Android stages provider-bound files in native private cache; keep the integration's file provider and Activity callbacks. iOS needs an unambiguous foreground presenter; [multi-window setup](../../media/camera.md#presentation-and-supported-scope) follows the initiating command's scene.

The normal MAUI and Uno **Share** pages exercise text/link and synthetic single/multiple files separately from **Media**. Current source/managed checks do not qualify device delivery, dismissal, cross-process provider reads, or multi-scene presentation. Those remain manual validation work for the targets you ship.

## Source reference

Pinned links require access to the Prism.Plugins repository. Check package availability in your authorized feed.

- [`src/Prism.Plugin.Essentials/ApplicationModel/DataTransfer/Share/IShare.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/src/Prism.Plugin.Essentials/ApplicationModel/DataTransfer/Share/IShare.cs)
- [`src/Prism.Plugin.Essentials/ApplicationModel/DataTransfer/Share/ShareCapabilities.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/src/Prism.Plugin.Essentials/ApplicationModel/DataTransfer/Share/ShareCapabilities.cs)
- [`src/Prism.Plugin.Essentials/ApplicationModel/DataTransfer/Share/ShareTextRequest.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/src/Prism.Plugin.Essentials/ApplicationModel/DataTransfer/Share/ShareTextRequest.cs)
- [`src/Prism.Plugin.Essentials/ApplicationModel/DataTransfer/Share/ShareFileRequest.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/src/Prism.Plugin.Essentials/ApplicationModel/DataTransfer/Share/ShareFileRequest.cs)
- [`src/Prism.Plugin.Essentials/ApplicationModel/DataTransfer/Share/ShareMultipleFilesRequest.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/src/Prism.Plugin.Essentials/ApplicationModel/DataTransfer/Share/ShareMultipleFilesRequest.cs)
- [`samples/Samples.Shared/ViewModels/ShareViewModel.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/samples/Samples.Shared/ViewModels/ShareViewModel.cs)

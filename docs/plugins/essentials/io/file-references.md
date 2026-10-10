---
sidebar_position: 3
title: Portable file references
---

# Portable file references

`IFileReference` represents a caller-owned readable file without requiring a local path. These Prism 10.0 vNext contracts are documented at Plugins #167's `154cd86`; [publication and device qualification](../media/index.md) remain pending. Their namespace is `Prism.Plugin.Essentials.IO`.

In the host's existing Prism registration callback, after [serializer/host setup](../index.md), use `registry.RegisterFileReferences()`. `RegisterMedia()` and `RegisterShare()` each include that registration. The factory and materializer are singletons.

## Create and read a reference

With an injected `IFileReferenceFactory files`, create a snapshot of synthetic content:

```csharp
using System.IO;
using System.Text;
using Prism.Plugin.Essentials.IO;

await using var source = new MemoryStream(Encoding.UTF8.GetBytes("Sample text"));
await using var file = await files.FromStreamAsync(source, "sample.txt", "text/plain");
await using var input = await file.OpenReadAsync();
// Consume input here. Disposal closes input, then file, then source.
```

`FromStreamAsync` copies from the source's current position to EOF. It neither seeks nor disposes the source, including on failure/cancellation. The caller owns the returned private snapshot. For an existing absolute path, `files.FromPath(fullPath, contentType)` borrows the original lazily and never deletes it on reference disposal.

`FileName` is an untrusted display name; do not use it directly as a destination path. `ContentType` can be null. Each `OpenReadAsync(token)` creates a readable stream at its beginning with an independent cursor. The token applies to opening; pass tokens separately to later reads/copies. Streams need not be seekable, and a reference does not promise stable bytes or access after restart.

Dispose every opened stream before its reference. Concurrent reading and disposal are unsupported. An OS/provider cache can be evicted, so copy data to application-owned durable storage when persistence is required. [IFileSystem](filesystem.md) remains the service for app directories and packaged assets.

## When a native consumer needs a path

Use an injected `IFileMaterializer materializer` explicitly:

```csharp
await using var local = await materializer.CreateLocalCopyAsync(file, token);
await ConsumeLocalAsync(local.FullPath, token);
```

`ConsumeLocalAsync` represents your application-owned native operation. Await its complete read lifetime before disposing the `ILocalFileLease`. Materialization creates an independent private copy, leaves the input alive, and deletes its own copy on disposal. Do not persist the temporary path. Browser materialization is unsupported; a browser virtual path is not a native filesystem path.

Owned cache directories keep an exclusive liveness lease until reference disposal or the end of a retained share session. Pruning attempts that lease before deleting expired directories; process exit releases it. Windows cross-process lease behavior still needs runtime validation. Cache retention is not durable storage.

## Source reference

Pinned links require access to the Prism.Plugins repository. Check package availability in your authorized feed.

- [`src/Prism.Plugin.Essentials/IO/FileReferences/IFileReference.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/src/Prism.Plugin.Essentials/IO/FileReferences/IFileReference.cs)
- [`src/Prism.Plugin.Essentials/IO/FileReferences/IFileReferenceFactory.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/src/Prism.Plugin.Essentials/IO/FileReferences/IFileReferenceFactory.cs)
- [`src/Prism.Plugin.Essentials/IO/FileReferences/IFileMaterializer.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/src/Prism.Plugin.Essentials/IO/FileReferences/IFileMaterializer.cs)
- [`src/Prism.Plugin.Essentials/IO/FileReferences/ILocalFileLease.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/154cd86774b5c33ad9911c046ab57c5975698da7/src/Prism.Plugin.Essentials/IO/FileReferences/ILocalFileLease.cs)

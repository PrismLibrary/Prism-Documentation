---
sidebar_position: 1
uid: Plugins.Essentials.FileSystem
description: "Use Prism 9.0 file-system directories and streams with explicit ownership and host-specific paths."
---

# File System

Inject `Prism.Plugin.Essentials.IO.IFileSystem` after the host's `RegisterFileSystem()` or supported [Essentials setup](../index.md).

The contract exposes `DirectoryInfo` properties for `AppData`, `Cache`, and `Public`, and asynchronous methods to test for and open a file. It is not a file picker.

## Copy a known asset

```csharp
using Prism.Plugin.Essentials.IO;

public sealed class HelpExporter(IFileSystem fileSystem)
{
    public async Task<FileInfo?> CopyToCacheAsync(CancellationToken token)
    {
        if (!await fileSystem.FileExistsAsync("help.txt"))
            return null;

        token.ThrowIfCancellationRequested();
        var appCache = fileSystem.Cache.CreateSubdirectory("ExampleApp");
        var destination = new FileInfo(Path.Combine(
            appCache.FullName, $"help-{Guid.NewGuid():N}.txt"));
        try
        {
            using var source = await fileSystem.OpenFileAsync("help.txt");
            using var target = destination.Open(FileMode.CreateNew, FileAccess.Write);
            await source.CopyToAsync(target, token);
            return destination;
        }
        catch
        {
            destination.Delete();
            throw;
        }
    }
}
```

The application owns cleanup of the returned cache file after all consumers finish. The cancellation token controls the stream copy; `IFileSystem` itself has no cancellation-token overload. Handle storage exhaustion, missing files, and I/O failures in the caller.

## Host paths and file ownership

On native mobile heads, package the file with the appropriate platform asset build action. WPF's implementation searches the supplied filename and the AppData, Cache, and Public directories; do not assume that its lookup is a MAUI packaged-asset lookup.

The directory roots are host-specific. In particular, WPF returns roaming ApplicationData, a LocalApplicationData/Cache directory, and CommonDocuments. Create an application-specific subdirectory before writing your own files. A returned path is not permission to read arbitrary user files, and cache files may be removed by the OS or application.

Dispose every opened stream, validate externally supplied filenames, and bound the amount of data copied. See [stores](stores.md) for typed preferences rather than file content.

## Source reference

These pinned source links describe the Plugins 9.0 baseline and require authorized access to the Prism.Plugins repository.

- [`src/Prism.Plugin.Essentials/IO/FileSystem/IFileSystem.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/IO/FileSystem/IFileSystem.cs)
- [`src/Prism.Plugin.Essentials.Wpf/IO/Filesystem/FileSystemImplementation.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Wpf/IO/Filesystem/FileSystemImplementation.cs)
- [`src/Prism.Plugin.Essentials/IO/FileSystem/FileSystemImplementation.android.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/IO/FileSystem/FileSystemImplementation.android.cs)

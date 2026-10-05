---
sidebar_position: 1
uid: Plugins.Essentials.FileSystem
---

# File System

Inject `Prism.Plugin.Essentials.IO.IFileSystem` after calling the host's `UsePrismEssentials()` or `RegisterFileSystem()` extension.

The service exposes `DirectoryInfo` properties for `AppData`, `Cache`, and `Public`, plus `FileExistsAsync(string)` and `OpenFileAsync(string)` for application-package assets. `OpenFileAsync` is not a native file picker and does not accept an arbitrary content URI.

## Copy an application asset

```csharp
using Prism.Plugin.Essentials.IO;

public sealed class HelpExporter(IFileSystem fileSystem)
{
    public async Task<FileInfo?> CopyToCacheAsync(CancellationToken token)
    {
        if (!await fileSystem.FileExistsAsync("help.txt"))
            return null;

        token.ThrowIfCancellationRequested();
        fileSystem.Cache.Create();
        var destination = new FileInfo(Path.Combine(
            fileSystem.Cache.FullName, $"help-{Guid.NewGuid():N}.txt"));

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

Package `help.txt` with the application's platform-specific asset build action. The copy methods on `IFileSystem` itself have no cancellation-token overload; the example cancels the subsequent stream copy. The caller owns cleanup of the returned cache file after all consumers have finished using it. Handle missing assets, I/O errors, and storage exhaustion in the application UI.

## Directory and lifetime rules

- Use `AppData` for durable app-private files and `Cache` for data that can be recreated. The OS may clear cache data.
- The meaning and availability of `Public` are host-specific; a directory property is not permission to access arbitrary user files.
- Dispose streams when work ends. Do not return a stream after disposing it or a path after deleting the underlying file.
- Bound file sizes and validate externally supplied filenames before writing.

Portable picked-file references and the new native camera/share APIs are not part of this merged baseline. See the [camera](../media/camera.md) and [share](../applicationmodel/datatransfer/share.md) availability notes.

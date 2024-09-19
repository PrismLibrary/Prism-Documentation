---
uid: Plugins.Essentials.FileSystem
---

# File System

The `IFileSystem` interface from Prism Essentials provides a simple to use `DirectoryInfo` object for the AppData, Cache and Public file storage directories. From there is becomes a simple matter of normal File IO to locate, open and save files.

You can additionally check if a file exists within an App Package:

```cs
if (await fileSystem.FileExistsAsync("myFile.txt"))
{
    using var stream = await fileSystem.OpenFileAsync("myFile.txt");
    // Do something with the file stream.
}
```
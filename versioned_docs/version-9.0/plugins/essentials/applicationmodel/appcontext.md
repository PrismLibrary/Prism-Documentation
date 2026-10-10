---
sidebar_position: 1
uid: Plugins.Essentials.ApplicationModel.AppContext
description: "Read application identity, version, packaging, and appearance through IAppContext."
---

# AppContext

`Prism.Plugin.Essentials.ApplicationModel.IAppContext` exposes application metadata and a request to open settings. Register it with `RegisterAppContext()` after the [host setup](../index.md), then inject the singleton.

## API

| Member | Meaning |
| --- | --- |
| `PackageName`, `Name` | Application identifier and display name |
| `VersionString`, `Version` | Version as text and `System.Version` |
| `BuildString` | Build identifier |
| `RequestedTheme` | Light, dark, or unspecified appearance |
| `PackagingModel` | Packaged or unpackaged application |
| `RequestedLayoutDirection` | Requested left-to-right or right-to-left layout |
| `ShowSettingsUI()` | Requests the platform's settings surface |

## Read the app information

```csharp
using Prism.Plugin.Essentials.ApplicationModel;

public sealed class AboutApplication(IAppContext app)
{
    public string VersionLabel =>
        $"{app.Name} {app.VersionString} ({app.BuildString})";

    public void OpenSettings() => app.ShowSettingsUI();
}
```

Configure these values through the platform's manifests and project/assembly metadata. WPF reads metadata from the current application assembly, so resolve it after a WPF Application exists. Different heads need not use the same source for their identifier or build number.

Call settings from an intentional foreground UI action. The method has no completion result and does not grant permissions; recheck required access when the application resumes. The interface has property reads, not theme-change notifications.

Use [device information](../devices/deviceinfo.md) for OS details, [version tracking](versiontracking.md) for launch-history flags, and [latest version](latestversion.md) for store-version checks.

## Source reference

These pinned source links describe the Plugins 9.0 baseline and require authorized access to the Prism.Plugins repository.

- [`src/Prism.Plugin.Essentials/ApplicationModel/AppContext/IAppContext.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/ApplicationModel/AppContext/IAppContext.cs)
- [`src/Prism.Plugin.Essentials.Wpf/ApplicationModel/AppContextImplementation.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Wpf/ApplicationModel/AppContextImplementation.cs)
- [`src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs)

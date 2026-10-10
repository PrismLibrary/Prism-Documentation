---
sidebar_position: 1
uid: Plugins.Essentials.ApplicationModel.AppContext
---

# Application context

`Prism.Plugin.Essentials.ApplicationModel.IAppContext` provides application identity, version, packaging, and requested appearance. It is registered by `UsePrismEssentials()` or `RegisterAppContext()` from `Prism.Plugin.Essentials`. Complete the [host setup](../index.md) before resolving native information.

```csharp
using Prism.Plugin.Essentials.ApplicationModel;

public sealed class AboutApplication(IAppContext app)
{
    public string VersionLabel => $"{app.Name} {app.VersionString} ({app.BuildString})";

    public void OpenSettings() => app.ShowSettingsUI();
}
```

Call `OpenSettings` from a user action on the active UI. The platform decides which settings surface is available; the method has no completion/cancellation result and is not a permission grant. Recheck the required permission after the app resumes.

## Metadata

| Property | Meaning |
| --- | --- |
| `PackageName` | Package/application identifier reported by the head |
| `Name` | Application display name |
| `VersionString`, `Version` | Application version in string and `System.Version` form |
| `BuildString` | Build identifier |
| `RequestedTheme` | Requested/detected light, dark, or unspecified appearance |
| `PackagingModel` | The host's packaged/unpackaged model |
| `RequestedLayoutDirection` | Requested left-to-right or right-to-left layout direction |

Configure application metadata in the head's manifests/project settings. Platform defaults differ: desktop, browser, and store-packaged apps need not expose the same identifier/version source. Do not use a display name as a stable storage identity; [WPF store configuration](../io/stores.md) has its own explicit rules.

The interface exposes property reads, not theme-change events. Query at the point your feature needs the value and use the host's normal appearance lifecycle for live UI changes. Use [device information](../devices/deviceinfo.md) for OS/device metadata, [version tracking](versiontracking.md) for local launch history, and [latest version](latestversion.md) for store checks.

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Essentials/ApplicationModel/AppContext/IAppContext.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials/ApplicationModel/AppContext/IAppContext.cs)
- [`src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Wpf/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials.Wpf/EssentialRegistrationExtensions.cs)

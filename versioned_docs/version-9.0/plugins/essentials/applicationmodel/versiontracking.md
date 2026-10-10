---
sidebar_position: 5
uid: Plugins.Essentials.ApplicationModel.VersionTracking
description: "Use Prism version-tracking metadata as launch-history hints and validate persistence."
---

# Version Tracking

`IVersionTracking` is the contract for application launch-history metadata. Register it through `RegisterVersionTracking()`, which also registers application context and store services. It is included in supported [Essentials host setup](../index.md).

```csharp
using Prism.Plugin.Essentials.ApplicationModel;

public sealed class VersionSummary(IVersionTracking versions)
{
    public string Label =>
        $"Version {versions.CurrentVersion}, build {versions.CurrentBuild}";
}
```

The implementation initializes lazily when a property is first read. No `Track()` call is required, and the interface has no reset method.

## Available history

The contract exposes `IsFirstLaunchEver`, `IsFirstLaunchForCurrentVersion`, and `IsFirstLaunchForCurrentBuild`, along with current, previous, and first-installed version/build values. `VersionHistory` and `BuildHistory` are read-only lists. Version and build metadata come from `IAppContext`; history uses the settings store.

Treat these flags as UI hints. Before depending on history, test first launch, a second process launch, an upgrade, a downgrade, and cleared/restored settings with the actual installed package and host. A launch flag does not prove that a data migration completed.

For migrations or a dismissible welcome screen, keep an application-owned completion marker and write it only after the operation succeeds. Use [stores](../io/stores.md) for that state and [latest version](latestversion.md) when checking the remote store rather than local history.

## Source reference

These pinned source links describe the Plugins 9.0 baseline and require authorized access to the Prism.Plugins repository.

- [`src/Prism.Plugin.Essentials/ApplicationModel/VersionTracking/IVersionTracking.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/ApplicationModel/VersionTracking/IVersionTracking.cs)
- [`src/Prism.Plugin.Essentials/ApplicationModel/VersionTracking/VersionTrackingImplementation.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/ApplicationModel/VersionTracking/VersionTrackingImplementation.cs)
- [`src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Wpf/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Wpf/EssentialRegistrationExtensions.cs)

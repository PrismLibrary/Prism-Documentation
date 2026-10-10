---
sidebar_position: 5
uid: Plugins.Essentials.ApplicationModel.VersionTracking
---

# Version tracking

`IVersionTracking` records which application versions and builds have run against the current settings store. It is a singleton included by `UsePrismEssentials()`. `RegisterVersionTracking()` also registers application context and store dependencies.

```csharp
using Prism.Plugin.Essentials.ApplicationModel;

public sealed class WelcomeState(IVersionTracking versions)
{
    public string GetMessage()
    {
        if (versions.IsFirstLaunchEver)
            return "Welcome!";

        return versions.IsFirstLaunchForCurrentVersion
            ? $"Updated to {versions.CurrentVersion}"
            : $"Version {versions.CurrentVersion}";
    }
}
```

Read this after native startup and settings configuration. The implementation initializes lazily on first property access. It reads `IAppContext.VersionString` and `BuildString`, loads its history from the `settings` store, and records previously unseen values. There is no required `Track()` call and no reset method on the interface.

## Available history

- `IsFirstLaunchEver`: no first-launch marker existed in this store.
- `IsFirstLaunchForCurrentVersion` / `IsFirstLaunchForCurrentBuild`: the current value was not already in the corresponding history.
- `CurrentVersion` / `CurrentBuild`: values supplied by the application context.
- `PreviousVersion` / `PreviousBuild`: the last recorded different value, or `null` if none exists.
- `FirstInstalledVersion` / `FirstInstalledBuild`: the first recorded value, using the current value when history is initially empty.
- `VersionHistory` / `BuildHistory`: read-only lists of unique recorded values in observation order, not semantically sorted versions.

These values describe the initialization snapshot. Reading `IsFirstLaunchEver` does not consume it or change it to `false` later in the same process. A cleared store, a changed settings identity, or restored application data changes what history can be observed. This is not an installation inventory, an account-wide history, or proof that a migration succeeded.

For schema migrations or a dismissible welcome screen, persist an explicit application-owned completion marker only after the work succeeds. Do not use these flags as a transaction or exactly-once mechanism.

## Store and NativeAOT setup

On WPF, configure a stable application settings identity before registration. Follow [stores](../io/stores.md) for serialization and retention. Register serializer metadata in every build before `UsePrismEssentials()`. The application JSON context must include the shapes used by version tracking, including `string` and `List<string>`; an explicit reflection serializer is a separate opt-in. This does not independently qualify a platform for NativeAOT.

For the current installed version without history, use [application context](appcontext.md). For remote store-version lookup, use [latest version](latestversion.md).

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Essentials/ApplicationModel/VersionTracking/IVersionTracking.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials/ApplicationModel/VersionTracking/IVersionTracking.cs)
- [`src/Prism.Plugin.Essentials/ApplicationModel/VersionTracking/VersionTrackingImplementation.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials/ApplicationModel/VersionTracking/VersionTrackingImplementation.cs)

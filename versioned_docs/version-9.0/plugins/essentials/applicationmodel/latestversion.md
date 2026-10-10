---
sidebar_position: 4
uid: Plugins.Essentials.ApplicationModel.LatestVersion
description: "Check store-version availability with ILatestVersion and handle unsupported hosts."
---

# Latest Version

`ILatestVersion` provides the installed version, a store-support flag, and asynchronous store lookup/opening methods. Use the host's `RegisterLatestVersion()` or supported `UsePrismEssentials()` registration, then inject `Prism.Plugin.Essentials.ApplicationModel.ILatestVersion`.

```csharp
using Prism.Plugin.Essentials.ApplicationModel;

public sealed class UpdateCheck(ILatestVersion versions)
{
    public async Task<bool?> IsCurrentAsync()
    {
        if (!versions.SupportsAppStore)
            return null;

        return await versions.IsUsingLatestVersion();
    }
}
```

In this example `null` means the host has no supported store check. Catch lookup/network errors in the caller and present them separately from an up-to-date result.

## Available operations

- `InstalledVersionNumber` reads the installed application's version.
- `GetLatestVersionNumber()` retrieves a store version string.
- `IsUsingLatestVersion()` checks the installed version against the platform's store/update mechanism.
- `OpenAppInStore()` opens the application's listing; it does not install an update.
- `CountryCode` selects the storefront used by the Apple lookup and defaults to `"us"`. Configure it before concurrent requests to the singleton.

Android uses Google Play listing content, Apple looks up the bundle identifier, and Windows uses Store update APIs. Store publication, network access, packaging, and parsing failures can affect a check. A support flag does not prove that the application is published in that store.

The non-store fallback, including WPF, reports `SupportsAppStore == false`. Check that flag before asking to open a listing. These methods have no cancellation token.

For local metadata use [application context](appcontext.md); for local launch-history flags use [version tracking](versiontracking.md).

## Source reference

These pinned source links describe the Plugins 9.0 baseline and require authorized access to the Prism.Plugins repository.

- [`src/Prism.Plugin.Essentials/ApplicationModel/LatestVersion/ILatestVersion.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/ApplicationModel/LatestVersion/ILatestVersion.cs)
- [`src/Prism.Plugin.Essentials/ApplicationModel/LatestVersion/LatestVersion.android.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/ApplicationModel/LatestVersion/LatestVersion.android.cs)
- [`src/Prism.Plugin.Essentials/ApplicationModel/LatestVersion/LatestVersion.apple.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/ApplicationModel/LatestVersion/LatestVersion.apple.cs)
- [`src/Prism.Plugin.Essentials/ApplicationModel/LatestVersion/LatestVersion.windows.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/ApplicationModel/LatestVersion/LatestVersion.windows.cs)
- [`src/Prism.Plugin.Essentials/ApplicationModel/LatestVersion/LatestVersion.netcore.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/ApplicationModel/LatestVersion/LatestVersion.netcore.cs)

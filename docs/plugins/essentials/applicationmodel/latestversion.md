---
sidebar_position: 4
uid: Plugins.Essentials.ApplicationModel.LatestVersion
---

# Latest version

`ILatestVersion` checks the application's store listing/update availability. `UsePrismEssentials()` includes this singleton, or use `RegisterLatestVersion()` from `Prism.Plugin.Essentials` with the required host setup. The interface is in `Prism.Plugin.Essentials.ApplicationModel`.

```csharp
using Prism.Plugin.Essentials.ApplicationModel;

public sealed class UpdateCheck(ILatestVersion latestVersion)
{
    public async Task<string?> FindUpdateAsync()
    {
        if (!latestVersion.SupportsAppStore)
            return null;

        return await latestVersion.IsUsingLatestVersion()
            ? null
            : await latestVersion.GetLatestVersionNumber();
    }
}
```

The caller should catch lookup/network failures and present an unavailable check separately from an up-to-date result. This example performs a second lookup when an update exists; cache/display results according to your application's needs instead of polling on every navigation.

## Contract and platform behavior

- `InstalledVersionNumber` returns the current app version.
- `CountryCode` defaults to `"us"`; the Apple lookup uses it to choose a storefront. It is shared mutable configuration on the singleton, so configure it deliberately before concurrent requests.
- `SupportsAppStore` describes the implementation's supported route, not proof that the app is listed, the store is reachable, or an update is available to this account/device.
- `GetLatestVersionNumber()` retrieves a version, while `IsUsingLatestVersion()` performs the backend's comparison/update check.
- `OpenAppInStore()` opens the listing; it does not install an update.

Android uses Google Play page content, so parser failures and store changes must be handled. The current parser does not require JavaScript execution. Apple uses an HTTPS bundle-ID lookup with the plugin's generated `AppStoreJsonContext`; the application does not need to describe its private response DTOs. Test storefront availability, network failure, and actual app listings. Windows uses Store update APIs, which depend on the app's store/packaging context.

WPF and unsupported Uno targets use a fallback: `SupportsAppStore` is `false`, the latest version is the installed version, `IsUsingLatestVersion()` returns `true`, and `OpenAppInStore()` throws `PlatformNotSupportedException`. Always check support before interpreting those values.

None of these methods accepts a cancellation token. Cancelling an outer UI operation does not cancel the internal lookup. These platform/store integrations need separate trimming/NativeAOT verification; baseline Essentials registration is not blanket qualification.

For local launch history use [version tracking](versiontracking.md). For current application metadata use [application context](appcontext.md).

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Essentials/ApplicationModel/LatestVersion/ILatestVersion.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials/ApplicationModel/LatestVersion/ILatestVersion.cs)
- [`src/Prism.Plugin.Essentials/ApplicationModel/LatestVersion/LatestVersion.android.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials/ApplicationModel/LatestVersion/LatestVersion.android.cs)
- [`src/Prism.Plugin.Essentials/ApplicationModel/LatestVersion/LatestVersion.apple.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials/ApplicationModel/LatestVersion/LatestVersion.apple.cs)
- [`src/Prism.Plugin.Essentials/ApplicationModel/LatestVersion/LatestVersion.netcore.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials/ApplicationModel/LatestVersion/LatestVersion.netcore.cs)

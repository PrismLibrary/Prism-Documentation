---
sidebar_position: 1
uid: Plugins.Essentials.Permissions
description: "Check and request mapped native permissions with Prism Essentials 9.0."
---

# App Permissions

`IPermissionsManager` exposes generic permission checks and requests in `Prism.Plugin.Essentials.Permissions`. Register it through `RegisterPermissions()` or the supported [Essentials setup](../index.md).

## Getting Started

Request permission in response to the feature the user is trying to use, after the native UI is ready. Use Prism's permission types:

```csharp
using Prism.Plugin.Essentials.Permissions;

public sealed class LocationAccess(IPermissionsManager permissions)
{
    public async Task<PermissionStatus> RequestForegroundAsync()
    {
        var status = await permissions.CheckStatusAsync<LocationWhenInUse>();
        if (status == PermissionStatus.Granted ||
            status == PermissionStatus.NotSupported)
            return status;

        return await permissions.RequestAsync<LocationWhenInUse>();
    }
}
```

Handle denied, restricted, unsupported, and unknown results. `NotSupported` is not a grant and does not prove the underlying operation is available. The non-native fallback, including WPF's registration, returns `NotSupported` rather than providing mobile permission dialogs.

`EnsureDeclared<T>()` validates required declarations. Missing manifest or usage-description entries may throw `PermissionException`; this is distinct from user denial. `ShouldShowRationale<T>()` provides Android rationale guidance. A check may itself invoke a native access API on some targets, so keep checks tied to the feature's foreground UI flow.

There is no cancellation-token overload. Avoid overlapping requests, recheck after resume or revocation, and do not repeatedly prompt on every navigation.

## Supported Permissions

The table records the built-in native mappings in this baseline. A check mark means a mapping exists, not that access is granted or every host package supplies that target. Follow the operating system's declarations, capabilities, and usage-description requirements.

| Permission | Android | iOS | MacCatalyst | WinUI |
|------------|:-------:|:---:|:-----------:|:-----:|
| Battery | ✅ | ❌ | ❌ | ❌ |
| Bluetooth | ✅ | ❌ | ❌ | ❌ |
| CalendarRead | ✅ | ✅ | ✅ | ❌ |
| CalendarWrite | ✅ | ✅ | ✅ | ❌ |
| Camera | ✅ | ✅ | ✅ | ❌ |
| ContactsRead | ✅ | ✅ | ✅ | ✅ |
| ContactsWrite | ✅ | ✅ | ✅ | ✅ |
| Flashlight | ✅ | ❌ | ❌ | ❌ |
| LaunchApp | ❌ | ❌ | ❌ | ❌ |
| LocationAlways | ✅ | ✅ | ✅ | ✅ |
| LocationWhenInUse | ✅ | ✅ | ✅ | ✅ |
| Maps | ❌ | ❌ | ❌ | ❌ |
| Media | ❌ | ✅ | ✅ | ❌ |
| Microphone | ✅ | ✅ | ✅ | ❌ |
| NearbyWifiDevices | ✅ | ❌ | ❌ | ❌ |
| NetworkState | ✅ | ❌ | ❌ | ❌ |
| Phone | ✅ | ❌ | ❌ | ❌ |
| Photos | ❌ | ✅ | ✅ | ❌ |
| PhotosAddOnly | ❌ | ✅ | ✅ | ❌ |
| PostNotifications | ✅ | ❌ | ❌ | ❌ |
| Reminders | ❌ | ✅ | ✅ | ❌ |
| Sensors | ✅ | ✅ | ✅ | ✅ |
| Sms | ✅ | ❌ | ❌ | ❌ |
| Speech | ✅ | ✅ | ✅ | ❌ |
| StorageRead | ✅ | ❌ | ❌ | ❌ |
| StorageWrite | ✅ | ❌ | ❌ | ❌ |
| Vibrate | ✅ | ❌ | ❌ | ❌ |

Foreground and background location are separate access decisions. A permission contract does not supply a camera, geolocation, microphone, or other feature implementation; register the application service separately.

## Source reference

These pinned source links describe the Plugins 9.0 baseline and require authorized access to the Prism.Plugins repository.

- [`src/Prism.Plugin.Essentials/Permissions/IPermissionsManager.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Permissions/IPermissionsManager.cs)
- [`src/Prism.Plugin.Essentials/Permissions/PermissionsMapper.android.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Permissions/PermissionsMapper.android.cs)
- [`src/Prism.Plugin.Essentials/Permissions/PermissionsMapper.apple.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Permissions/PermissionsMapper.apple.cs)
- [`src/Prism.Plugin.Essentials/Permissions/PermissionsMapper.windows.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Permissions/PermissionsMapper.windows.cs)
- [`src/Prism.Plugin.Essentials/Permissions/PermissionManager.netcore.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Permissions/PermissionManager.netcore.cs)

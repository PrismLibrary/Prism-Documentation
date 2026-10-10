---
sidebar_position: 1
uid: Plugins.Essentials.Permissions
---

# App Permissions

Inject `Prism.Plugin.Essentials.Permissions.IPermissionsManager` after the host registers `UsePrismEssentials()` or `RegisterPermissions()`. Each host maps Prism's permission types to its operating-system behavior.

## Check and request a permission

Request a permission in response to the feature the user is trying to use, after the native activity/window is ready. Use Prism's permission types rather than similarly named MAUI types:

```csharp
using Prism.Plugin.Essentials.Permissions;
using LocationPermission = Prism.Plugin.Essentials.Permissions.LocationWhenInUse;

public sealed class LocationAccess(IPermissionsManager permissions)
{
    public async Task<PermissionStatus> RequestForegroundAsync()
    {
        var status = await permissions.CheckStatusAsync<LocationPermission>();
        if (status == PermissionStatus.Granted ||
            status == PermissionStatus.NotSupported)
            return status;

        return await permissions.RequestAsync<LocationPermission>();
    }
}
```

Call this method from an intentional user action, not repeatedly from navigation or a polling timer. The application must handle denied, restricted, unsupported, and other returned statuses instead of treating every completed request as granted. A `NotSupported` result is not proof that the underlying operation is available.

## Declarations and rationale

`EnsureDeclared<T>()` checks declarations required by that permission. `CheckStatusAsync<T>()` and `RequestAsync<T>()` may also throw `PermissionException` when required manifest or usage-description entries are missing. That is an application-configuration error, separate from user denial.

`ShouldShowRationale<T>()` is Android-specific; other platforms return false. If it is true, explain why the feature needs access before requesting it again. It is not a cross-platform instruction to open Settings.

The interface has no cancellation-token overload. Cancelling a screen's work does not guarantee that an operating-system prompt can be dismissed. Avoid overlapping requests, recheck relevant permissions after resume, and support later revocation.

## Platform-specific setup

| Target | What the application must verify |
| --- | --- |
| Android | Required manifest declarations, OS/API-specific permission behavior, and current activity availability. Foreground and background location are separate access decisions. |
| iOS / Mac Catalyst | Required usage descriptions and any applicable entitlements/background modes. Request only the access needed by the feature. |
| Windows / WPF | The chosen backend, packaging/capability requirements, OS settings, and hardware availability. A mobile permission assumption is not a Windows capability check. |
| Uno desktop / browser | The host backend and browser/OS permission support for the actual operation. Not every mobile permission maps to a meaningful desktop/browser prompt. |

The API includes location, camera, microphone, photos, contacts, calendar, sensors, network, and other permission types. Availability depends on the target implementation and OS version. Use operation-level capability checks and handle native failures as well as checking permission status. See [geolocation setup](../devices/sensors/geolocation.md) and [host capabilities](../platform-support.md).

## Permission metadata and custom permissions

Built-in Android/Apple mapper entries retain the platform implementation's constructor metadata. Keep required Activity permission-result forwarding and Apple usage descriptions. Face ID requires `NSFaceIDUsageDescription`; see [biometrics](../devices/sensors/biometrics.md). These fixes do not grant permissions or qualify a native prompt on every target.

A supported custom developer-defined permission how-to remains tracked in [Plugins #185](https://github.com/PrismLibrary/Prism.Plugins/issues/185). Android/Apple expose `BasePermission`, `BasePlatformPermission`, and `PermissionsMapper.Map<TPermission, TPlatformPermission>()`, but mapping alone neither registers dependencies nor establishes native behavior or AOT preservation. The current `ConfigurePermissionsMapper` helper recursively resolves its own registration; do not use it as a working consumer recipe. An unmapped mobile marker can fall through to no-op/granted behavior, which is not evidence that an OS permission was checked.

The Windows-targeted manager's four operations throw `NotImplementedException`. WPF, Uno desktop, and BrowserWasm use fixed managers and return `NotSupported` for unknown custom markers. Keep those gaps explicit rather than assuming generic permission calls are implemented everywhere. App-defined implementation registration, source-generator roots, declaration/result forwarding, and actual native behavior still need the consumer validation tracked by #185.

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Essentials/Permissions/IPermissionsManager.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials/Permissions/IPermissionsManager.cs)
- [`src/Prism.Plugin.Essentials/Permissions/PermissionsMapper.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials/Permissions/PermissionsMapper.cs)
- [`src/Prism.Plugin.Essentials.Maui/PermissionsMapperRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials.Maui/PermissionsMapperRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials/Permissions/PermissionManager.windows.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials/Permissions/PermissionManager.windows.cs)

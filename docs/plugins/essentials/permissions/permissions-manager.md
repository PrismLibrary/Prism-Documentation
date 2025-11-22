---
sidebar_position: 1
uid: Plugins.Essentials.Permissions
---

# App Permissions

The Permissions API in Prism.Plugin.Essentials allows you to request and check permissions across Android, iOS, MacCatalyst and WinUI on both .NET MAUI and Uno Platform. As with other API's in Prism.Essentials this is automatically registered when Registering Prism Essentials.

## Getting Started

To use the Permissions Manager you can inject the `IPermissionsManager` into your services or ViewModels.

```cs
public class MyViewModel(IPermissionsManager permissions) : BindableBase
{
}
```

To check the state of a given permission you simply need to pass the permission type to the Permission Manager's Check or Request method like:

```cs
var status = await permissions.CheckStatusAsync<LocationAlways>();

if (status != PermissionStatus.NotSupported && status != PermissionStatus.Granted)
{
    status = await permissions.RequestAsync<LocationAlways>();
}
```

A permission status of `NotSupported` may be returned when the underlying platform does not require authorization for a specific permission.

## Supported Permissions

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


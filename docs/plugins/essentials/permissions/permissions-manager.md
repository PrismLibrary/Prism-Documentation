---
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
| Battery | ![Supported](../../../images/circle_green_checkmark.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) |
| Bluetooth | ![Supported](../../../images/circle_green_checkmark.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) |
| CalendarRead | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Not Supported](../../../images/cross_red_circle.png) |
| CalendarWrite | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Not Supported](../../../images/cross_red_circle.png) |
| Camera | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Not Supported](../../../images/cross_red_circle.png) |
| ContactsRead | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) |
| ContactsWrite | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) |
| Flashlight | ![Supported](../../../images/circle_green_checkmark.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) |
| LaunchApp | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) |
| LocationAlways | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) |
| LocationWhenInUse | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) |
| Maps | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) |
| Media | ![Not Supported](../../../images/cross_red_circle.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Not Supported](../../../images/cross_red_circle.png) |
| Microphone | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Not Supported](../../../images/cross_red_circle.png) |
| NearbyWifiDevices | ![Supported](../../../images/circle_green_checkmark.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) |
| NetworkState | ![Supported](../../../images/circle_green_checkmark.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) |
| Phone | ![Supported](../../../images/circle_green_checkmark.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) |
| Photos | ![Not Supported](../../../images/cross_red_circle.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Not Supported](../../../images/cross_red_circle.png) |
| PhotosAddOnly | ![Not Supported](../../../images/cross_red_circle.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Not Supported](../../../images/cross_red_circle.png) |
| PostNotifications | ![Supported](../../../images/circle_green_checkmark.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) |
| Reminders | ![Not Supported](../../../images/cross_red_circle.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Not Supported](../../../images/cross_red_circle.png) |
| Sensors | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) |
| Sms | ![Supported](../../../images/circle_green_checkmark.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) |
| Speech | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Supported](../../../images/circle_green_checkmark.png) | ![Not Supported](../../../images/cross_red_circle.png) |
| StorageRead | ![Supported](../../../images/circle_green_checkmark.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) |
| StorageWrite | ![Supported](../../../images/circle_green_checkmark.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) |
| Vibrate | ![Supported](../../../images/circle_green_checkmark.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) | ![Not Supported](../../../images/cross_red_circle.png) |

---
sidebar_position: 1
title: Notifications
---

# Notifications

Displaying an alert, asking a user to make a choice, or displaying a prompt is a common UI task. The Notifications API from Prism Essentials is designed as a cross platform replacement API for the PageDialogService in Prism.Forms and Prism.Maui. For those migrating from Prism.Forms it is recommended to migrate to this API as this will better help you to migrate your code to a more future proof API which will work well into the future without the need to change your code should you choose to switch between Uno Platform and .NET MAUI. Additionally this API will be providing support with WPF making your WPF apps easier to migrate to mobile in the future.

## Getting Started

To use the Notifications API you must either call `UsePrismEssentials` or `RegisterNotifications`.

```cs
public class MyViewModel(INotifications notifications)
```

## Next Steps

- [ActionSheets](actionsheets.md)
- [Alerts](alerts.md)
- [Prompts](prompts.md)

:::note
This is currently only supported on Android, iOS, MacCatalyst, & WinUI for .NET MAUI and Uno Platform. This feature is planned for future expansion to all Uno Platform platforms and WPF.
:::


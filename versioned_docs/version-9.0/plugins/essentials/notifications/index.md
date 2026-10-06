---
sidebar_position: 1
title: Notifications
description: "Register native alerts, action sheets, and prompts supported by Prism Essentials 9.0."
---

# Notifications

The Essentials notification contracts cover alerts, action sheets, and text prompts. They can replace simple page-dialog interactions in shared application logic while the host supplies the native presentation.

## Getting Started

Use `UsePrismEssentials()` or `RegisterNotifications()` from `Prism.Plugin.Essentials` on a supported native MAUI/Uno target. These services are transient and require an initialized Activity/window. WPF and Uno desktop/browser do not get notification services from this 9.0 registration path.

```csharp
using Prism.Plugin.Essentials.Notifications;

public sealed class ReportFeedback(INotifications notifications)
{
    public Task SavedAsync() =>
        notifications.Alert.DisplayAsync("Saved", "Your report is ready.", "OK");
}
```

`INotifications` groups `Alert`, `ActionSheet`, and `Prompt`. The 9.0 property is singular `Prompt`, while its type is `IPrompts`. You can inject any of the individual contracts directly.

Present from the active UI, avoid overlapping native dialogs, and handle returned decisions before performing the application operation. These contracts have no cancellation-token overload and do not promise that unrelated work cancellation dismisses a native dialog.

## Next Steps

- [ActionSheets](actionsheets.md): named choices and callbacks.
- [Alerts](alerts.md): acknowledgments and Boolean decisions.
- [Prompts](prompts.md): text input with a distinct cancellation result.

For a custom view and lifecycle use [Prism dialogs](../../../dialogs/index.md). The 9.0 Essentials contract has no toast API.

## Source reference

These pinned source links describe the Plugins 9.0 baseline and require authorized access to the Prism.Plugins repository.

- [`src/Prism.Plugin.Essentials/Notifications/INotifications.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Notifications/INotifications.cs)
- [`src/Prism.Plugin.Essentials/Notifications/NotificationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Notifications/NotificationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Wpf/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Wpf/EssentialRegistrationExtensions.cs)

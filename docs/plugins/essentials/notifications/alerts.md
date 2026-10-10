---
sidebar_position: 2
uid: Plugins.Essentials.Notifications.Alerts
---

# Alerts

Use `IAlerts` directly or `INotifications.Alert` after [notification registration](index.md). Both interfaces are in `Prism.Plugin.Essentials.Notifications`.

For an acknowledgment, extension overloads provide a single button:

```csharp
using Prism.Plugin.Essentials.Notifications;

await notifications.Alert.DisplayAsync("Export complete", "The report is ready.", "OK");
```

![Simple Alert](./images/simple-alert.png)

For a decision, inspect the Boolean result rather than proceeding whenever the task completes:

```csharp
bool confirmed = await notifications.Alert.DisplayAsync(
    "Discard changes?", "Unsaved edits will be lost.", "Discard", "Keep editing");

if (confirmed)
{
    // Run the application's discard action here.
}
```

The four-string interface method returns `true` for the accept button and `false` for the cancel choice. The application owns the consequential operation after that decision; displaying the message does not perform it.

![Two Button Alert](./images/two-button-alert.png)

Present on the active UI after host startup, and avoid overlapping alerts. Alerts are transient and do not expose a cancellation token. Do not infer that canceling unrelated application work dismisses a native prompt. Use a [toast](toasts.md) for non-modal transient feedback, or [Prism dialogs](../../../dialogs/index.md) when the interaction needs a custom view and lifecycle.

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Essentials/Notifications/IAlerts.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials/Notifications/IAlerts.cs)
- [`src/Prism.Plugin.Essentials/Notifications/NotificationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials/Notifications/NotificationExtensions.cs)

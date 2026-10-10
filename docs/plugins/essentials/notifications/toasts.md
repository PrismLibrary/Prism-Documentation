---
sidebar_position: 4
title: Toasts
---

# Toasts

`Prism.Plugin.Essentials.Notifications.IToasts` shows a non-modal in-app message. It is registered as a singleton by the host's `RegisterNotifications()` and `UsePrismEssentials()` methods.

One toast is visible at a time. A new request replaces the current toast. This is an application UI surface, not a system push-notification service, and it needs an initialized window or activity.

## Display and await a toast

```csharp
using Prism.Plugin.Essentials.Notifications;

public sealed class SaveFeedback(IToasts toasts)
{
    public Task<ToastResult> ShowSavedAsync(CancellationToken token) =>
        toasts.DisplayAsync(
            "Changes saved",
            new ToastOptions
            {
                Duration = TimeSpan.FromSeconds(3),
                Theme = ToastTheme.Success,
                Action = new ToastAction { Text = "View" }
            },
            token);
}
```

Inspect the result to decide what the application does next:

| Result | Meaning |
| --- | --- |
| `TimedOut` | The display duration elapsed. |
| `ActionSelected` | The user selected the action. |
| `Cancelled` | The supplied cancellation token cancelled the toast. |
| `Replaced` | Another toast replaced this one. |

Tie the token to the operation or screen that owns the message. Cancellation returns `Cancelled` for this API; do not assume that every async Essentials operation has the same cancellation contract.

## Options and actions

`ToastOptions` must not be null. Individual options can be null to use defaults: duration, position, theme, and background/text/action colors. Explicit colors override the corresponding theme colors.

`ToastAction.Text` is required. Its optional `Callback` starts after dismissal begins, and the toast does not await that callback's completion. When follow-on work must be awaited or errors handled in sequence, use the returned `ActionSelected` result and run that work in your own async method instead. Avoid attaching a callback and then executing the same action again from the result.

Implementations exist for the MAUI, WPF, and Uno integrations, including Uno desktop/browser UI paths. Rendering and resource lookup are host-specific. Cleanup also handles presentation registered after the session has already completed, so a canceled/replaced toast does not leave late UI attached. Test replacement, action selection, cancellation, window closure, and accessibility on the actual target. There is no Avalonia Essentials host registration.

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Essentials/Notifications/IToasts.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials/Notifications/IToasts.cs)
- [`src/Prism.Plugin.Essentials/Notifications/ToastOptions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials/Notifications/ToastOptions.cs)
- [`src/Prism.Plugin.Essentials/Notifications/ToastAction.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials/Notifications/ToastAction.cs)
- [`src/Prism.Plugin.Essentials/Notifications/ToastHost.Session.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials/Notifications/ToastHost.Session.cs)

---
sidebar_position: 1
title: Notifications
---

# Notifications

Essentials notifications provide injectable action sheets, alerts, prompts, and in-app toasts for the MAUI, WPF, and Uno integrations. They let shared application code request UI feedback through platform implementations.

Register them with `UsePrismEssentials()` or `RegisterNotifications()` and inject `INotifications`, a specific dialog interface, or `IToasts` as appropriate. Native UI operations require an initialized activity/window and the host's UI thread integration.

- [Action sheets](actionsheets.md)
- [Alerts](alerts.md)
- [Prompts](prompts.md)
- [Toasts](toasts.md)

Dialogs and the composite notifications service use transient registrations; toasts are singleton so replacement is coordinated across callers. Platform behavior and availability differ. See [host capabilities](../platform-support.md).

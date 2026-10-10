---
sidebar_position: 1
title: Dialogs
---

# MAUI Dialogs

Prism.Maui implements two dialog services with different presentation roles:

- [`Prism.Services.IPageDialogService`](pagedialogs.md) wraps native alerts, action sheets, and prompts on the current Prism window's page.
- [`Prism.Dialogs.IDialogService`](../../../dialogs/index.md) presents a custom MAUI `View` with a view model implementing `IDialogAware`.

Custom dialogs are implemented in the inspected Prism.Maui source. Older guidance describing them as unavailable is obsolete.

## Register a custom dialog

Create a MAUI `ContentView` named `NoticeView` and a `NoticeViewModel` implementing the [current dialog contract](../../../dialogs/dialog-aware.md), including `DialogCloseListener RequestClose { get; }`. Register the pair:

```cs
// Inside PrismAppBuilder.RegisterTypes; using Prism.Ioc;
container.RegisterDialog<NoticeView, NoticeViewModel>();
```

Inject `IDialogService` into a page view model and invoke it from an async command:

```cs
using Prism.Dialogs;

var result = await dialogService.ShowDialogAsync("NoticeView",
    new DialogParameters { { "message", "Changes saved." } });
```

Handle failures around the awaited operation. The dialog view binds its controls to the supplied view model; its close command calls `RequestClose.Invoke(...)`. MAUI initializes this listener before calling `OnDialogOpened` and coordinates early close requests with hosting completion. Other Prism hosts initialize the listener at different points, so avoid assuming identical ordering in shared dialog implementations.

## Page context and container ownership

The default custom-dialog service is scoped and obtains its host context from the page accessor. If that page was detached, the current implementation can fall back to the active Prism window. This fallback is not a reason to keep stale page services in application singletons.

The host is `Prism.Dialogs.IDialogContainer`; the default registration is `DialogContainerPage`. A custom host uses `RegisterDialogContainer<T>()`. This is separate from WPF/Avalonia's `IDialogWindow` and Uno's `ContentDialog` host. A MAUI dialog view must derive from `View`, such as `ContentView`, not `ContentPage`.

At this source head the dialog view and container are resolved from the current page's provider. Do not assume showing a dialog automatically creates a separate DI scope or that closing it disposes the owning page scope. Release dialog-owned subscriptions in `OnDialogClosed` and keep page lifetime separate.

## Source reference

- [Dialog registrations and View constraint](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Ioc/DialogRegistrationExtensions.cs)
- [MAUI dialog lifecycle and hosting coordination](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Dialogs/DialogServiceBase.cs)
- [Scoped service and active-window fallback](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Dialogs/DialogService.cs)

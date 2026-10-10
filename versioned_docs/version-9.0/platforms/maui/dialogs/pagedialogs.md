---
sidebar_position: 2
uid: Platforms.Maui.Dialogs.PageDialogs
description: "Show native alerts, action sheets, and prompts through the Prism 9.0 MAUI page dialog service."
---

# Using the Page Dialog Service

`Prism.Services.IPageDialogService` presents platform-native alerts, action sheets, and prompts without making a view model depend on a MAUI `Page`. Prism registers it by default. Inject the interface into your view model, then await its methods from an async UI command.

```cs
using Prism.Services;

public class MainPageViewModel
{
    private readonly IPageDialogService _dialogs;

    public MainPageViewModel(IPageDialogService dialogs) => _dialogs = dialogs;

    public Task ShowSavedAsync() =>
        _dialogs.DisplayAlertAsync("Saved", "Your changes were saved.", "OK");
}
```

Prism 9.0 uses `IWindowManager.Current` and that `PrismWindow`'s current page. The 9.0 window manager falls back to its initial window; do not assume this API follows whichever window has focus in a multi-window app. Call it after the Prism window exists, from a UI interaction. It is not an owner-selection API for an arbitrary page or a background service.

## DisplayAlertAsync

```cs
await dialogs.DisplayAlertAsync("Saved", "Your changes were saved.", "OK");

bool discard = await dialogs.DisplayAlertAsync(
    "Discard changes?", "Your unsaved edits will be lost.", "Discard", "Keep editing");

if (discard)
{
    // Perform the application action that was confirmed.
}
```

The four-string overload returns `true` for the accept button and `false` for cancellation. These are service calls, not direct `Page.DisplayAlertAsync` calls. Presentation and dismissal behavior follow the native target, so test keyboard Back/Escape and outside-tap behavior where applicable.

## DisplayActionSheetAsync

```cs
string choice = await dialogs.DisplayActionSheetAsync(
    "Export", "Cancel", null, "CSV", "PDF");

if (choice == "CSV")
{
    // Export CSV.
}
```

The third argument is the optional destructive action label. Treat cancellation separately and use distinct labels.

Prism also supports `IActionSheetButton` callbacks:

```cs
using Prism.Services;

IActionSheetButton csv = ActionSheetButton.CreateButton(
    "CSV", () => System.Diagnostics.Debug.WriteLine("CSV selected"));
IActionSheetButton cancel = ActionSheetButton.CreateCancelButton("Cancel");

await dialogs.DisplayActionSheetAsync("Export", csv, cancel);
```

The service identifies cancel/destructive buttons by their flags rather than their position in the array. It dispatches matching labels, so avoid duplicate button text. `ActionSheetButton` also has `Func<Task>` overloads that the service awaits. Use those, or await work after the string-returning overload, rather than passing an async-void action.

## DisplayPromptAsync

```cs
using Prism.AppModel;

string? name = await dialogs.DisplayPromptAsync(
    "Rename", "Enter a display name", accept: "Save", cancel: "Cancel",
    maxLength: 80, keyboardType: KeyboardType.Default, initialValue: "Untitled");

if (name is not null)
{
    // Validate and apply the response.
}
```

A cancelled prompt returns `null`; an accepted empty string is a different result. Validate user input before acting on it. The optional keyboard type is `Prism.AppModel.KeyboardType`, not MAUI's `Keyboard` object. Flow-direction overloads for alerts/action sheets use `Prism.AppModel.FlowDirection`.

For a styled form, custom layout, or richer validation, use the [custom dialog service](index.md) rather than expanding a native prompt beyond its purpose.

## Source reference

- [Page dialog interface and overloads](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Services/PageDialogs/IPageDialogService.cs)
- [Window selection and native calls](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Services/PageDialogs/PageDialogService.cs)
- [9.0 window-manager selection](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Navigation/PrismWindowManager.cs)
- [Action-sheet callback overloads](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Services/PageDialogs/ActionSheetButton.cs)

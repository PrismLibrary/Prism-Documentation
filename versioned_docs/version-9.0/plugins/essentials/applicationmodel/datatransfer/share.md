---
sidebar_position: 2
uid: Plugins.Essentials.ApplicationModel.DataTransfer.Share
description: "Choose a platform sharing implementation for a Prism 9.0 application."
---

# Share

Prism Essentials 9.0 does not expose a sharing service or registration method in this baseline. Installing the Essentials host package does not add a share-sheet API.

For a MAUI application, place the platform sharing implementation behind an application-owned interface and inject it into the view model. A desktop or Uno application needs an implementation suited to its own head. Keep native file/URI types inside that adapter.

Before handing a file to another application, ensure it is readable for the lifetime of the share operation and follow the platform's temporary-file/content-URI rules. Handle an unavailable share UI, user cancellation, and a missing receiver. Showing a share sheet does not prove delivery.

Use [Clipboard](clipboard.md) for the supported text clipboard contract or [Email](../communication/email.md) for mail composition.

## Source reference

These pinned source links describe the Plugins 9.0 baseline and require authorized access to the Prism.Plugins repository.

- [`src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs)

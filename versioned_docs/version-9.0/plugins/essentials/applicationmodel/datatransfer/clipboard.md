---
sidebar_position: 1
uid: Plugins.Essentials.ApplicationModel.DataTransfer.Clipboard
description: "Read and write text through the Prism 9.0 clipboard contract on supported native hosts."
---

# Clipboard

`IClipboard` provides text clipboard access and a text-change observable. Native MAUI and supported native Uno heads register it as transient through `UsePrismEssentials()` or `RegisterClipboard()`. WPF's 9.0 host does not provide a clipboard registration.

```csharp
using Prism.Plugin.Essentials.ApplicationModel.DataTransfer;
using Prism.Plugin.Essentials.Threading;

public sealed class ClipboardActions(IClipboard clipboard, IMainThread mainThread)
{
    public Task CopyAsync(string text) =>
        mainThread.InvokeOnMainThreadAsync(() => clipboard.SetTextAsync(text));

    public Task<string?> PasteAsync() =>
        mainThread.InvokeOnMainThreadAsync(() => clipboard.GetTextAsync());
}
```

Call these methods from explicit Copy/Paste actions after native startup. `HasText` is a snapshot; the clipboard may change before a read completes. `GetTextAsync()` can return null. `SetTextAsync(string?)` accepts nullable text and does not guarantee the text is visible to every other application when it returns.

## Observe changes

`Text` is an `IObservable<string?>`. Keep and dispose the subscription when its owner ends, and use [IMainThread](../../threading/mainthread.md) before updating bound UI. Read the clipboard explicitly for a Paste action rather than assuming an observable emits the current value immediately.

The contract does not cover images, rich text, files, or persistent clipboard history. Neither asynchronous method has a cancellation-token overload. Treat pasted content as untrusted input and avoid logging it or polling for another application's clipboard contents.

See [host setup](../../index.md) for registration boundaries.

## Source reference

These pinned source links describe the Plugins 9.0 baseline and require authorized access to the Prism.Plugins repository.

- [`src/Prism.Plugin.Essentials/ApplicationModel/DataTransfer/Clipboard/IClipboard.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/ApplicationModel/DataTransfer/Clipboard/IClipboard.cs)
- [`src/Prism.Plugin.Essentials/Threading/IMainThread.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Threading/IMainThread.cs)
- [`src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Wpf/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Wpf/EssentialRegistrationExtensions.cs)

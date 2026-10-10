---
sidebar_position: 1
uid: Plugins.Essentials.ApplicationModel.DataTransfer.Clipboard
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Clipboard

`IClipboard` provides text clipboard access and a text-change observable. `UsePrismEssentials()` includes it, or use `RegisterClipboard()`. It is registered as transient, unlike most Essentials services.

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

Invoke these methods from explicit Copy/Paste actions. `HasText` is a snapshot, not a lock; the clipboard can change before `GetTextAsync()` completes. Reads may return `null`. `SetTextAsync(string?)` accepts nullable text, but applications should use an intentional clear action rather than treating all empty input as a request to erase another app's clipboard.

The contract does not promise that a completed write is already visible to every other application. Neither async method accepts a cancellation token. Rich text, images, files, and persistent clipboard history are outside this interface.

## Observe changes

`clipboard.Text` is an `IObservable<string?>`. Store the subscription and dispose it when its screen/owner ends. Do not assume every platform emits the current value immediately; explicitly read when a user requests Paste. Use [IMainThread](../../threading/mainthread.md) before changing bound UI state from a callback.

<Tabs groupId="platform">
<TabItem value="wpf" label="WPF">

Resolve and use the clipboard service on the WPF UI/STA thread. Its implementation owns a hidden native window and a clipboard listener. Disposing a subscription only detaches that subscription; the owning DI scope/container must also release the transient service and its native resources. Clipboard contention can still cause a read or write to fail.

</TabItem>
<TabItem value="maui" label=".NET MAUI">

Use the active UI lifecycle for native clipboard operations. OS privacy controls can affect reads; avoid polling for clipboard contents or reading them as part of view-model construction.

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

Uno uses the underlying clipboard integration for the selected head. Browser restrictions on user gestures, access, and secure contexts still apply; a registered service is not permission to inspect the system clipboard silently.

</TabItem>
</Tabs>

Never treat clipboard content as trusted input or send it to logs. See [host setup](../../index.md) and [service lifetimes](../../platform-support.md).

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Essentials/ApplicationModel/DataTransfer/Clipboard/IClipboard.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials/ApplicationModel/DataTransfer/Clipboard/IClipboard.cs)
- [`src/Prism.Plugin.Essentials.Wpf/ApplicationModel/ClipboardImplementation.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials.Wpf/ApplicationModel/ClipboardImplementation.cs)

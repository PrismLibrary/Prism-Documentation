---
sidebar_position: 2
uid: Plugins.Essentials.ApplicationModel.Browser
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Browser

`IBrowser` opens a web page using the host's browser integration. It is a singleton included by `UsePrismEssentials()`; granular registration is `registry.RegisterBrowser()` in the `Prism.Plugin.Essentials` namespace. Complete the [host setup](../index.md) first.

## Open a page

Use the Prism contract from `Prism.Plugin.Essentials.ApplicationModel`, rather than the similarly named MAUI interface:

```csharp
using Prism.Plugin.Essentials.ApplicationModel;

public sealed class HelpService(IBrowser browser)
{
    public Task<bool> OpenHelpAsync() => browser.OpenAsync(
        new Uri("https://prismlibrary.com/"),
        new BrowserLaunchOptions
        {
            LaunchMode = BrowserLaunchMode.SystemPreferred
        });
}
```

Call from a foreground UI action after native startup. Check the returned `bool` and give the user an alternative if launching fails. Completion means a launch was attempted successfully, not that the page loaded or the browser was closed. This API has no cancellation token, navigation events, or OAuth callback contract.

`BrowserExtensions` also supplies string and `Uri` overloads with default options or a `BrowserLaunchMode`. Validate external input and restrict it to the web schemes your application intends to open. Use [Launcher](launcher.md) for another app's custom scheme.

## Host differences

<Tabs groupId="platform">
<TabItem value="maui" label=".NET MAUI">

Android's system-preferred route uses Custom Tabs where available; Apple's uses the native browser presentation. `External` requests an external browser. `PreferredToolbarColor` applies to Android and Apple, `PreferredControlColor` to Apple, and `TitleMode` to Android. These colors use `System.Drawing.Color`. Windows launches through the OS and does not provide the same in-app appearance options.

</TabItem>
<TabItem value="wpf" label="WPF">

The implementation uses `Process.Start` with shell execution. It opens the registered browser and ignores in-app appearance options. A failed shell launch returns `false`.

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

Keep `ConfigurePrismEssentials()` in the host's application/window setup. Native Android and Apple use the matching native implementations. WinUI, Skia Desktop, and BrowserWasm use the Windows/Uno URI-launching path; browser and desktop restrictions still apply. In-app appearance settings are not portable to those heads.

</TabItem>
<TabItem value="avalonia" label="Avalonia">

There is no Essentials Avalonia host package. Supply an application-owned browser adapter if needed; referencing Prism.Avalonia alone does not register `IBrowser`.

</TabItem>
</Tabs>

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Essentials/ApplicationModel/Browser/IBrowser.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials/ApplicationModel/Browser/IBrowser.cs)
- [`src/Prism.Plugin.Essentials/ApplicationModel/Browser/BrowserLaunchOptions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials/ApplicationModel/Browser/BrowserLaunchOptions.cs)
- [`src/Prism.Plugin.Essentials.Wpf/ApplicationModel/BrowserImplementation.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials.Wpf/ApplicationModel/BrowserImplementation.cs)

---
sidebar_position: 2
uid: Plugins.Essentials.ApplicationModel.Browser
description: "Open a web page with the Prism 9.0 browser contract and handle launch results."
---

# Browser

`IBrowser` opens a web page using the host's browser integration. Its namespace is `Prism.Plugin.Essentials.ApplicationModel`. MAUI and native Uno register it as a singleton through `UsePrismEssentials()` or `RegisterBrowser()`; follow the [host setup](../index.md).

## Open a page

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

Call from foreground UI after native startup. Inspect the returned Boolean and handle launch exceptions. Completion does not mean that the page has finished loading or the browser has closed. The interface has no cancellation token, navigation events, or authentication callback contract.

`BrowserExtensions` supplies string and `Uri` overloads with default options or an explicit `BrowserLaunchMode`. Validate outside input and allow only the web schemes your application needs. For custom application schemes, use [Launcher](launcher.md).

## Host differences

Android uses Custom Tabs for the system-preferred route; Apple uses native browser presentation. `External` requests an external browser. The toolbar/control colors use `System.Drawing.Color`, and their availability differs by host. Windows uses the OS launcher rather than the mobile in-app appearance model.

The shared interface is suitable for an application-owned desktop adapter. A browser implementation or interface in a package is not, on its own, a verified startup recipe for that host; use the host registration guidance above and test the installed package on the intended target.

## Source reference

These pinned source links describe the Plugins 9.0 baseline and require authorized access to the Prism.Plugins repository.

- [`src/Prism.Plugin.Essentials/ApplicationModel/Browser/IBrowser.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/ApplicationModel/Browser/IBrowser.cs)
- [`src/Prism.Plugin.Essentials/ApplicationModel/Browser/BrowserExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/ApplicationModel/Browser/BrowserExtensions.cs)
- [`src/Prism.Plugin.Essentials/ApplicationModel/Browser/BrowserLaunchOptions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/ApplicationModel/Browser/BrowserLaunchOptions.cs)
- [`src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs)

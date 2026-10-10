---
sidebar_position: 3
uid: Plugins.Essentials.ApplicationModel.Launcher
description: "Query and launch URI handlers with ILauncher on supported Prism Essentials hosts."
---

# Launcher

`ILauncher` opens a URI through the operating system, including another application's custom scheme. MAUI and supported native Uno heads register it through `UsePrismEssentials()` or `RegisterLauncher()`. WPF's 9.0 host has no launcher registration.

```csharp
using Prism.Plugin.Essentials.ApplicationModel;

public sealed class MapLink(ILauncher launcher)
{
    public Task<bool> OpenAsync(Uri uri) => launcher.TryOpenAsync(uri);
}
```

`CanOpenAsync(Uri)` checks for a handler, `OpenAsync(Uri)` attempts launch, and `TryOpenAsync(Uri)` combines the check and launch. String extension overloads convert the input to `Uri`; malformed input may throw. Always handle a `false` result and native launch exceptions. A successful preflight does not guarantee a later launch.

## Platform setup

On iOS and Mac Catalyst, declare custom schemes queried by the application in `LSApplicationQueriesSchemes`. On Android, handler discovery can require a matching manifest package-visibility query. Request only the schemes needed by the feature and launch from an intentional UI action.

Use [Browser](browser.md) for web browsing. The Prism 9.0 interface does not expose a file-opening overload, even though an `OpenFileRequest` type exists in the source. It also has no cancellation token or result describing what the other application did after launch.

## Source reference

These pinned source links describe the Plugins 9.0 baseline and require authorized access to the Prism.Plugins repository.

- [`src/Prism.Plugin.Essentials/ApplicationModel/Launcher/ILauncher.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/ApplicationModel/Launcher/ILauncher.cs)
- [`src/Prism.Plugin.Essentials/ApplicationModel/Launcher/LauncherExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/ApplicationModel/Launcher/LauncherExtensions.cs)
- [`src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Wpf/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Wpf/EssentialRegistrationExtensions.cs)

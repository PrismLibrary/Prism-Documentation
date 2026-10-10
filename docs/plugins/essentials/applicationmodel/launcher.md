---
sidebar_position: 3
uid: Plugins.Essentials.ApplicationModel.Launcher
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Launcher

`ILauncher` opens URIs handled by another application. `UsePrismEssentials()` includes this singleton; use `RegisterLauncher()` for granular registration. Both the interface and its string overload extensions are in `Prism.Plugin.Essentials.ApplicationModel`.

```csharp
using Prism.Plugin.Essentials.ApplicationModel;

public sealed class ExternalAppService(ILauncher launcher)
{
    public Task<bool> OpenAsync(Uri destination) =>
        launcher.TryOpenAsync(destination);
}
```

Only pass a validated, allowlisted scheme and destination from your UI. For ordinary websites, use [Browser](browser.md). `TryOpenAsync` checks support and then attempts the launch; the result does not confirm completion of an action in the other app. Handle `false` and platform launch failures. None of the methods takes a cancellation token.

## Capability checks

- `CanOpenAsync(Uri)` queries support, subject to the host limitations below.
- `OpenAsync(Uri)` attempts the launch directly.
- `TryOpenAsync(Uri)` combines both steps.

A successful preflight is not a guarantee that the handler remains installed or accepts the request. The current public interface has no `OpenAsync(OpenFileRequest)` overload; file-related declarations commented out in source are not callable APIs.

<Tabs groupId="platform">
<TabItem value="maui" label=".NET MAUI">

On Android, package visibility can hide URI handlers from a query. Add the specific intent/scheme to your manifest's `queries` element where required; do not request visibility of every installed app. See [Android's package-visibility guidance](https://developer.android.com/training/package-visibility/declaring).

On iOS and Mac Catalyst, declare queried custom schemes in `LSApplicationQueriesSchemes` in the head's Info.plist. Use the OS declaration guidance in [Microsoft's launcher documentation](https://learn.microsoft.com/en-us/dotnet/maui/platform-integration/appmodel/launcher?view=net-maui-10.0); its MAUI file-launch overloads are not Prism overloads.

</TabItem>
<TabItem value="wpf" label="WPF">

`CanOpenAsync` checks only `Uri.IsAbsoluteUri`. It does not verify a registered application. `OpenAsync` attempts shell execution and returns `false` on failure, so always inspect the final result.

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

Mobile heads share the native declaration requirements. WinUI and Skia use Uno's URI-launch support. BrowserWasm's preflight recognizes only `http`, `https`, `mailto`, `tel`, and `sms`; it does not inspect the user's installed apps. A browser gesture or permission may still be needed to open the handler.

</TabItem>
</Tabs>

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Essentials/ApplicationModel/Launcher/ILauncher.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials/ApplicationModel/Launcher/ILauncher.cs)
- [`src/Prism.Plugin.Essentials.Wpf/ApplicationModel/LauncherImplementation.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials.Wpf/ApplicationModel/LauncherImplementation.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/Wasm/ApplicationModel/LauncherImplementation.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials.Uno.WinUI/Wasm/ApplicationModel/LauncherImplementation.cs)

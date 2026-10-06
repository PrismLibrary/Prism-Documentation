---
sidebar_position: 3
uid: Dialogs.DialogWindow
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Dialog hosts

A dialog's **content** is the registered view and `IDialogAware` view model. Its **host** supplies the window, overlay or native dialog that presents that content. Customize the host when you need common chrome, ownership or sizing; keep application decisions in the content view model.

<Tabs groupId="platform" queryString="platform">
<TabItem value="wpf" label="WPF">

## WPF: IDialogWindow

`Prism.Dialogs.IDialogWindow` mirrors the relevant `System.Windows.Window` members and adds an `IDialogResult Result` property. A custom host can be a normal WPF window:

```csharp
using System.Windows;
using Prism.Dialogs;

public sealed class AppDialogWindow : Window, IDialogWindow
{
    public AppDialogWindow()
    {
        Width = 520;
        SizeToContent = SizeToContent.Height;
        WindowStartupLocation = WindowStartupLocation.CenterOwner;
    }

    public IDialogResult Result { get; set; } = new DialogResult();
}
```

Register it as the default host, or give it a name when only some dialogs should use it:

```csharp
containerRegistry.RegisterDialogWindow<AppDialogWindow>("AppDialog");

// At the calling view model:
var parameters = new DialogParameters
{
    { KnownDialogParameters.WindowName, "AppDialog" },
    { "name", Name }
};
var result = await _dialogs.ShowDialogAsync("Rename", parameters);
```

Prism configures content and data context, hooks closing/closed events and checks `CanCloseDialog`. Do not duplicate that lifecycle in the host. For non-modal behavior use the platform's `KnownDialogParameters.ShowNonModal`; choose an owner intentionally in multi-window applications. See the [WPF dialog guide](../platforms/wpf/dialog-service.md).

[WPF host contract](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Wpf/Prism.Wpf/Dialogs/IDialogWindow.cs) · [registration extensions](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Wpf/Prism.Wpf/Ioc/IContainerRegistryExtensions.cs)

</TabItem>
<TabItem value="maui" label=".NET MAUI">

## .NET MAUI: IDialogContainer

MAUI uses `IDialogContainer`, not the desktop `IDialogWindow` contract. The built-in dialog service coordinates the current page, custom dialog `View`, background-tap dismissal and navigation lifecycle.

The container contract exposes `DialogView`, a dismiss command, `ConfigureLayout(...)`, and `DoPop(...)`. A custom implementation must keep `IDialogContainer.DialogStack` aligned with when its overlay is actually shown and removed. It must also preserve the dialog service's close guard, callbacks and cleanup.

Start with the built-in container unless a real presentation requirement demands a replacement. For supported popup integration see the [Popup plugin](../plugins/popups.md); do not copy a WPF window class into a MAUI application. Native alert/action-sheet use is covered by the platform's page-dialog service.

[Container contract](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Dialogs/IDialogContainer.cs) · [built-in container page](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Dialogs/DialogContainerPage.cs) · [dialog service](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Dialogs/DialogService.cs)

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

## Uno: a ContentDialog host

Uno's `IDialogWindow` is implemented by Prism's `DialogWindow`, which derives from `Microsoft.UI.Xaml.Controls.ContentDialog`. Its lifecycle uses `ShowAsync`, `Hide`, and ContentDialog closing/closed events; it is not the WPF window interface.

For simple shared styling, derive from the existing host and register it:

```csharp
public sealed class AppDialogWindow : Prism.Dialogs.DialogWindow
{
    public AppDialogWindow()
    {
        MinWidth = 320;
    }
}

// During composition:
containerRegistry.RegisterDialogWindow<AppDialogWindow>();
```

Prism assigns the host's XAML root from its registered application window. Test the actual Uno renderer and form factor, especially dialog sizing, focus and dismissal. Browser and Android presentation must be captured and qualified on those hosts; a WPF dialog render does not establish their behavior.

[Uno host contract](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Uno/Prism.Uno/Dialogs/IDialogWindow.cs) · [default host](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Uno/Prism.Uno/Dialogs/DialogWindow.xaml.cs) · [service](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Uno/Prism.Uno/Dialogs/DialogService.cs)

</TabItem>
<TabItem value="avalonia" label="Avalonia">

## Avalonia: a desktop window host

Prism.Avalonia provides `IDialogWindow` and a default `DialogWindow`. Its contract includes `Opened`, a read-only owner, and `Task ShowDialog(Window owner)` rather than the WPF `bool? ShowDialog()` signature.

```csharp
public sealed class AppDialogWindow : Prism.Dialogs.DialogWindow
{
    public AppDialogWindow()
    {
        Width = 520;
        SizeToContent = Avalonia.Controls.SizeToContent.Height;
    }
}

// During composition:
containerRegistry.RegisterDialogWindow<AppDialogWindow>();
```

The built-in service uses modal presentation only with `IClassicDesktopStyleApplicationLifetime`, choosing an explicitly supplied parent window or the main window. Its other path calls `Show()`. Do not treat that fallback as a qualified single-view mobile/browser dialog implementation. See the [Avalonia dialog guide](../platforms/avalonia/dialogs.md) for ownership and lifetime details.

[Avalonia host contract](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Avalonia/Prism.Avalonia/Dialogs/IDialogWindow.cs) · [default host](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Avalonia/Prism.Avalonia/Dialogs/DialogWindow.axaml.cs) · [service](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Avalonia/Prism.Avalonia/Dialogs/DialogService.cs)

</TabItem>
</Tabs>

## Validate a custom host

Exercise accept, cancel, system close, a rejected close, owner/window shutdown, repeated opening, keyboard focus and an opening failure. Confirm that the result is delivered once and that dialog-owned subscriptions/resources are released. Include the actual target host in [NativeAOT publication checks](../dependency-injection/native-aot.md) where applicable; WPF is not a NativeAOT target.

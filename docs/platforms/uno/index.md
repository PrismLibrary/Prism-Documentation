---
sidebar_position: 1
uid: Platforms.UnoPlatform.GettingStarted
---

# Getting Started with Uno Platform

:::caution 10.0 package rollout
This guide targets Prism 10.0 vNext APIs. Its package rollout is not complete. Set any version variable below to an exact compatible version that actually exists in your feed; do not substitute an assumed 10.0 version. Existing 9.1 prerelease evidence is not a published 10.0 package. See [migration and readiness](../../migrating-to-10.md).
:::

Prism's Uno integration uses WinUI controls, a Prism application base, region navigation, and Uno.Extensions hosting. It does not use MAUI page navigation, and its shell is a `Microsoft.UI.Xaml.UIElement`, not a WPF `Window`.

## Create the project and choose packages

Prepare the tools for your intended targets using Uno's [Quick Start](https://platform.uno/docs/articles/get-started.html). Start with a blank Uno Platform project and its platform entry points. Let Prism own application startup and navigation rather than retaining a second Uno.Extensions navigation startup pipeline.

Install a compatible version of `Prism.DryIoc.Uno.WinUI`. It references `Prism.Uno.WinUI` and the DryIoc container. For another container, use `Prism.Uno.WinUI` with `Prism.PrismApplicationBase` and implement `CreateContainerExtension`. The `.WinUI` suffix is part of the package name; the platform assemblies use names such as `Prism.Uno` and `Prism.DryIoc.Uno`.

At the audited source head, Uno libraries target .NET 9 and .NET 10 base, Android, iOS, tvOS, desktop, and browserwasm frameworks. Windows builds additionally include the corresponding `windows10.0.19041` targets. Your app's SDK, workload, platform entry point, and restored package assets must agree; a library target does not establish an end-to-end runtime or NativeAOT qualification for every device.

## Replace application startup

Update the root of `App.xaml` while retaining any resources your chosen Uno template needs:

```xml title="App.xaml"
<prism:PrismApplication x:Class="PrismUnoDemo.App"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:prism="using:Prism.DryIoc">
    <Application.Resources>
        <ResourceDictionary>
            <XamlControlsResources xmlns="using:Microsoft.UI.Xaml.Controls" />
        </ResourceDictionary>
    </Application.Resources>
</prism:PrismApplication>
```

Create a `Shell` UserControl in `Views`, with its generated constructor calling `InitializeComponent()`. Register it and a region view:

```cs title="App.xaml.cs"
using Microsoft.UI.Xaml;
using Prism.DryIoc;
using Prism.Ioc;
using Prism.Navigation.Regions;
using PrismUnoDemo.Views;
using PrismUnoDemo.ViewModels;

namespace PrismUnoDemo;

public partial class App : PrismApplication
{
    public App() => InitializeComponent();

    protected override UIElement CreateShell() => Container.Resolve<Shell>();

    protected override void RegisterTypes(IContainerRegistry containerRegistry)
    {
        containerRegistry.Register<Shell>();
        containerRegistry.RegisterForNavigation<HomeView, HomeViewModel>();
    }

    protected override void OnInitialized()
    {
        RegionManager.RequestNavigate("MainRegion", "HomeView");
    }

    protected override void ConfigureWindow(Window window)
    {
        window.Title = "Prism Uno";
    }
}
```

`OnLaunched` is sealed in Prism's base class. Remove the template's override rather than attempting to create a second host or window there.

```xml title="Views/Shell.xaml"
<UserControl x:Class="PrismUnoDemo.Views.Shell"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:regions="using:Prism.Navigation.Regions">
    <ContentControl regions:RegionManager.RegionName="MainRegion" />
</UserControl>
```

Use `using:` namespace mappings for WinUI-compatible XAML. Uno's non-Windows builds also carry Prism XML namespace metadata, but the Microsoft WinUI compiler does not consume that mapping in the same way. An explicit `using:Prism.Navigation.Regions` works across this distinction.

Add a `HomeView` UserControl and bind its `TextBlock.Text` to a public `Message` property on `HomeViewModel`. The explicit registration connects the two. Use `{Binding Message}` for runtime `DataContext` binding; `{x:Bind}` has different source semantics and is not a drop-in replacement.

## Window and initialization lifetime

Uno.Extensions creates the application window. `ConfigureWindow(Window)` runs before Prism creates and attaches the shell. Configure window properties there, but do not assume its content or `XamlRoot` is ready yet.

Prism assigns the shell to `Window.Content`, activates the window, and waits for a `FrameworkElement` shell to load before finalizing startup. It then attaches/updates regions, builds the host, initializes modules, and calls `OnInitialized`. This is the appropriate point for initial region navigation and services that depend on the built host. The `Host` property throws if accessed before host creation.

Services registered through `ConfigureServices` become available to the Prism container when the host is built, after shell creation/loading. If a shell constructor needs a service, register it through `RegisterTypes` instead. See [Uno.Extensions integration](extensions.md) for examples.

## Optional plugin loading shell and Essentials startup

`Prism.Plugin.Toolkit.Uno.WinUI` supplies a loading wrapper around your registered feature shell. Add a compatible package, then use its extension in the existing Prism application:

```csharp
using Prism.Plugin.Toolkit;

protected override UIElement CreateShell() =>
    this.CreateLoadingShell(PrismShell.DefaultRegionName, "Main");
```

Register the inner shell for navigation under that name, for example `registry.RegisterForNavigation<Shell, MainViewModel>("Main")`. This replaces the earlier direct `CreateShell` example. The wrapper keeps its loading indicator while Prism initializes, then displays the registered shell in `PrismShellContent`; retain your inner shell's own region and menu navigation. In the normal Essentials sample, the inner shell selects Welcome after loading through the same menu-selection path used by other pages. Do not bypass region attachment with a separate startup navigation pipeline.

Keep `XamlControlsResources` and your selected toolkit/theme resources in `App.xaml`. The wrapper and normal sample shell use `{ThemeResource ApplicationPageBackgroundThemeBrush}`. Put application colors in Light/Dark theme dictionaries under application-owned keys and consume them with `ThemeResource`; do not override framework background keys solely to style feature cards. The normal samples retain separate card/text/logo styles.

When using [Essentials](../../plugins/essentials/index.md), call `builder.ConfigurePrismEssentials()` in `ConfigureApp`, and register the generated serializer before `UsePrismEssentials()` in `RegisterTypes`. If enabling [background tasks](../../plugins/essentials/applicationmodel/background-tasks.md), compose `BackgroundTaskStore.SerializationContext` in that first serializer registration and call `this.StartPrismBackgroundTasks()` from `OnInitialized`, after the host exists. These callbacks and shell configuration are the same in ordinary and NativeAOT builds. There is no alternate diagnostic or AOT-only application path to configure.

The normal sample and Toolkit source establish this initialization path; fresh theme rendering and per-device runtime acceptance are separate validation work. Select actual package assets from the authorized feed.

## Build and run a head

Select a framework actually present in your app's `TargetFrameworks`. For an Uno single-project desktop target:

```sh
dotnet restore PrismUnoDemo.csproj
dotnet run --project PrismUnoDemo.csproj --framework net10.0-desktop
```

For browser, Android, iOS, or WinUI, use the matching Uno template launch profile and its platform prerequisites. Verify shell loading, initial navigation, Back/Forward behavior if you expose a journal, and dialogs on every target you ship. A desktop run does not test browser or mobile behavior.

Prism 10.0 (vNext) is planned as the first NativeAOT-ready release; supported NativeAOT applications require `Prism.Container.Microsoft` from Commercial Plus and a qualified target/dependency set. Use the [NativeAOT guide](../../dependency-injection/native-aot.md) rather than applying `PublishAot` to every Uno head.

## Continue learning

- [Uno.Extensions and shared hosting](extensions.md)
- [Region navigation](../../navigation/regions/index.md) and [modules](../../modularity/index.md)
- [Dialog service](../../dialogs/index.md): Uno uses a `ContentDialog`-based host and requires a loaded window's `XamlRoot`

## Source reference

- [Uno startup, shell loading, and host construction](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Uno/Prism.Uno/PrismApplicationBase.cs)
- [Uno target framework definitions](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Directory.Build.props)
- [DryIoc package ID and references](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Uno/Prism.DryIoc.Uno/Prism.DryIoc.Uno.WinUI.csproj)
- [Framework-owned Uno application](https://github.com/PrismLibrary/Prism/tree/b8f00b5091063feea127a2417fc72d6b299ee16c/e2e/Uno/HelloWorld)
- [Toolkit loading-shell overloads](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Toolkit.Uno.WinUI/CreateAppShellExtensions.cs)
- [Loading wrapper and theme resource](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Toolkit.Uno.WinUI/PrismShell.xaml)
- [Normal Essentials Uno startup](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/samples/Samples.UnoWinUI/App.xaml.cs)
- [Sample menu startup](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/samples/Samples.UnoWinUI/Views/Shell.xaml.cs)
- [Sample Light/Dark resources](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/samples/Samples.UnoWinUI/App.xaml)

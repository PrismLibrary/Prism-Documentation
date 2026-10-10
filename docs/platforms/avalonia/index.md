---
sidebar_position: 1
---

# Getting Started with Avalonia

:::caution 10.0 package rollout
This guide targets Prism 10.0 vNext APIs. Its package rollout is not complete. Set any version variable below to an exact compatible version that actually exists in your feed; do not substitute an assumed 10.0 version. Existing 9.1 prerelease evidence is not a published 10.0 package. See [migration and readiness](../../migrating-to-10.md).
:::

The Prism 10.0 documentation covers `Prism.Avalonia` for application initialization, MVVM, modules, regions, and desktop dialogs. It is a supported Prism platform even where the separate [sample gallery](../../samples/index.md) has no Avalonia showcase yet.

## Packages and prerequisites

Start with an Avalonia application using the official [setup guide](https://docs.avaloniaui.net/docs/get-started). Install a compatible version of `Prism.DryIoc.Avalonia`; it references `Prism.Avalonia` and `Prism.Container.DryIoc`. The platform-only package is `Prism.Avalonia` when supplying another container through `PrismApplicationBase`.

The audited source builds `net9.0` and `net10.0` assets and pins Avalonia `12.1.1`. Match your Avalonia packages and Prism package assets rather than combining an arbitrary current Avalonia template with an older Prism binary. These are source-head boundaries, not a guarantee that every published prerelease has identical dependencies.

For an existing project named `PrismAvaloniaDemo`, use your feed's exact available version:

```sh
# Set PRISM_VERSION to a version available from your configured feed first.
dotnet add PrismAvaloniaDemo.csproj package Prism.DryIoc.Avalonia --version "$PRISM_VERSION"
```

## Application startup

Keep the Avalonia template's `Program.BuildAvaloniaApp()` and platform-detection configuration. Change the code-behind to derive from `Prism.DryIoc.PrismApplication`, load application XAML, and call `base.Initialize()`:

```cs title="App.axaml.cs"
using Avalonia;
using Avalonia.Markup.Xaml;
using Prism.DryIoc;
using Prism.Ioc;
using Prism.Mvvm;
using PrismAvaloniaDemo.ViewModels;
using PrismAvaloniaDemo.Views;

namespace PrismAvaloniaDemo;

public partial class App : PrismApplication
{
    public override void Initialize()
    {
        AvaloniaXamlLoader.Load(this);
        base.Initialize();
    }

    protected override AvaloniaObject CreateShell() => Container.Resolve<MainWindow>();

    protected override void RegisterTypes(IContainerRegistry containerRegistry)
    {
        containerRegistry.Register<MainWindow>();
        containerRegistry.Register<MainWindowViewModel>();
        ViewModelLocationProvider.Register<MainWindow, MainWindowViewModel>();
    }
}
```

Application styles still live in ordinary Avalonia XAML:

```xml title="App.axaml"
<Application xmlns="https://github.com/avaloniaui"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    x:Class="PrismAvaloniaDemo.App"
    RequestedThemeVariant="Default">
    <Application.Styles>
        <FluentTheme />
    </Application.Styles>
</Application>
```

Retain the template's `Avalonia.Themes.Fluent` reference for `FluentTheme`. Remove its manual `desktop.MainWindow = new MainWindow()` assignment from `OnFrameworkInitializationCompleted`; Prism now supplies the shell. If you override that method for other setup, call its base implementation.

Create `Views/MainWindow.axaml` and its generated `Window` code-behind with the matching namespace. For this first screen:

```xml
<Window xmlns="https://github.com/avaloniaui"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:vm="using:PrismAvaloniaDemo.ViewModels"
    x:Class="PrismAvaloniaDemo.Views.MainWindow"
    x:DataType="vm:MainWindowViewModel"
    Width="800" Height="450" Title="Prism Avalonia">
    <TextBlock Text="{Binding Message}" Margin="24" />
</Window>
```

```cs title="ViewModels/MainWindowViewModel.cs"
namespace PrismAvaloniaDemo.ViewModels;

public class MainWindowViewModel
{
    public string Message => "Prism created this Avalonia view model.";
}
```

The `x:DataType` supplies compile-time binding information; Prism supplies the runtime `DataContext`. Remove template code that sets a runtime data context or an unrelated template ViewLocator if it conflicts with your Prism mappings.

## Desktop and single-view lifetimes

`CreateShell()` returns `AvaloniaObject`, not WPF's `Window` type. Return an Avalonia `Window` for `IClassicDesktopStyleApplicationLifetime`. For `ISingleViewApplicationLifetime`, return an Avalonia `Control`, such as a `UserControl`.

Prism stores this object in its `MainWindow` property during initialization, then assigns it to the appropriate lifetime's `MainWindow` or `MainView` in `OnFrameworkInitializationCompleted`. The property name does not mean the shell is always a window. The default `OnInitialized()` calls `Show()` only when the shell is a window; preserve that behavior with `base.OnInitialized()` when appropriate. See Avalonia's [application lifetime reference](https://docs.avaloniaui.net/docs/fundamentals/application-lifetimes) for the host-level distinction.

```cs
// A shared App can choose a shell that fits the lifetime.
protected override AvaloniaObject CreateShell() =>
    ApplicationLifetime is Avalonia.Controls.ApplicationLifetimes.IClassicDesktopStyleApplicationLifetime
        ? Container.Resolve<MainWindow>()
        : Container.Resolve<MainView>();
```

Register both shell types when using this variant. Also provide the appropriate platform entry point and Avalonia packages; the branch alone does not create a mobile or browser application.

## Run and continue

```sh
dotnet run --project PrismAvaloniaDemo.csproj --framework net10.0
```

Use the target actually declared by your project. Confirm that the window appears once, the message is bound, and closing the application shuts down its desktop lifetime as expected.

Continue with [regions and navigation](regions.md), [desktop dialogs](dialogs.md), [commands](../../commands/commanding.md), and [modularity](../../modularity/index.md).

Prism 10.0 (vNext) is planned as the first NativeAOT-ready release. The supported container for NativeAOT is `Prism.Container.Microsoft` from Commercial Plus, not the DryIoc setup above. Check the [NativeAOT guide](../../dependency-injection/native-aot.md), your Avalonia target, and all application dependencies before publishing; a successful JIT desktop run does not validate a NativeAOT build.

## Source reference

- [Avalonia project and target frameworks](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Avalonia/Prism.Avalonia/Prism.Avalonia.csproj)
- [Pinned framework dependencies](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/Directory.Packages.props)
- [Application initialization and lifetime assignment](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Avalonia/Prism.Avalonia/PrismApplicationBase.cs)
- [Framework-owned Avalonia test application](https://github.com/PrismLibrary/Prism/tree/b8f00b5091063feea127a2417fc72d6b299ee16c/e2e/Avalonia/PrismAvaloniaDemo)

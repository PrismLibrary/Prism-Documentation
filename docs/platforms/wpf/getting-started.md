---
sidebar_position: 1
---

# Getting Started with WPF

This walkthrough creates a Windows desktop application with Prism 10.0, DryIoc, a view model, and a region. Start with a normal WPF Application project. If you need the Windows SDK or Visual Studio workload, follow Microsoft's [WPF setup tutorial](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/get-started/create-app-visual-studio).

:::caution 10.0 package rollout
This walkthrough targets Prism 10.0 vNext APIs. The package rollout is not complete. Use an exact compatible version that exists in your feed, and follow the [migration/readiness checklist](../../migrating-to-10.md) before adopting the 10.0 package set.
:::

## Choose compatible packages

Install `Prism.DryIoc` for the DryIoc application base, or `Prism.Unity` for Unity. These WPF packages bring in `Prism.Wpf`, `Prism.Core`, and their container dependencies. Choose one application container, and use compatible available package versions from your configured feed. The package name is `Prism.DryIoc`, even though its source project is named `Prism.DryIoc.Wpf`.

The inspected prerelease source targets `net462`, `net47`, `net8.0-windows`, `net9.0-windows`, and `net10.0-windows`. A target in source is not a promise that every preview package contains the same assets; check the package you restore. New projects should use a supported .NET Windows target and matching SDK.

For example, in PowerShell on a Windows development machine with the .NET 10 SDK:

```powershell
 dotnet new wpf -n PrismWpfDemo -f net10.0
 cd PrismWpfDemo
 $PrismVersion = Read-Host 'Exact available Prism package version from your feed'
 dotnet add package Prism.DryIoc --version $PrismVersion
```

Prism 10.0 (vNext) is planned as the first NativeAOT-ready Prism release, but WPF is not a NativeAOT target. Do not add `PublishAot` to this application. See the [NativeAOT guide](../../dependency-injection/native-aot.md) for supported hosts and the Commercial Plus Microsoft container requirement.

## Let Prism create the shell

Change `App.xaml` to use the Prism application class. Remove `StartupUri`; otherwise WPF also tries to create the window independently of Prism.

```xml title="App.xaml"
<prism:PrismApplication x:Class="PrismWpfDemo.App"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:prism="http://prismlibrary.com/">
    <Application.Resources />
</prism:PrismApplication>
```

Move the template's main window into `Views`, updating its C# namespace and XAML `x:Class` to `PrismWpfDemo.Views.MainWindow`. Then replace the application code-behind:

```cs title="App.xaml.cs"
using System.Windows;
using Prism.DryIoc;
using Prism.Ioc;
using Prism.Mvvm;
using PrismWpfDemo.ViewModels;
using PrismWpfDemo.Views;

namespace PrismWpfDemo;

public partial class App : PrismApplication
{
    protected override Window CreateShell() => Container.Resolve<MainWindow>();

    protected override void RegisterTypes(IContainerRegistry containerRegistry)
    {
        containerRegistry.Register<MainWindow>();
        containerRegistry.Register<MainWindowViewModel>();
        ViewModelLocationProvider.Register<MainWindow, MainWindowViewModel>();
        containerRegistry.RegisterForNavigation<HomeView, HomeViewModel>();
    }
}
```

For Unity, install `Prism.Unity` and use `Prism.Unity.PrismApplication` instead. Keep the base class in XAML and code-behind consistent. For a container supplied separately, derive from `Prism.PrismApplicationBase` and implement `CreateContainerExtension` as described in the [container guide](../../dependency-injection/index.md).

The shell is a `System.Windows.Window`. Prism registers its infrastructure and your services, creates the shell, wires its view model, attaches the region manager, and initializes modules. Its default `OnInitialized` shows the shell. Call `base.OnInitialized()` if you override that method and still want this behavior.

## Add a view model and a region

The following window provides a navigation command and an empty `ContentControl` for Prism to populate:

```xml title="Views/MainWindow.xaml"
<Window x:Class="PrismWpfDemo.Views.MainWindow"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:prism="http://prismlibrary.com/"
    Title="Prism WPF" Width="800" Height="450">
    <DockPanel>
        <Button DockPanel.Dock="Top" Content="Open home"
                Command="{Binding OpenHomeCommand}" />
        <ContentControl prism:RegionManager.RegionName="MainRegion" />
    </DockPanel>
</Window>
```

```cs title="ViewModels/MainWindowViewModel.cs"
using Prism.Commands;
using Prism.Mvvm;
using Prism.Navigation.Regions;

namespace PrismWpfDemo.ViewModels;

public class MainWindowViewModel : BindableBase
{
    public MainWindowViewModel(IRegionManager regionManager)
    {
        OpenHomeCommand = new DelegateCommand(() =>
            regionManager.RequestNavigate("MainRegion", "HomeView"));
    }

    public DelegateCommand OpenHomeCommand { get; }
}
```

Add a WPF UserControl named `HomeView` to `Views` and keep its generated constructor calling `InitializeComponent()`. Replace its XAML with:

```xml title="Views/HomeView.xaml"
<UserControl x:Class="PrismWpfDemo.Views.HomeView"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">
    <TextBlock Text="{Binding Message}" Margin="24" />
</UserControl>
```

```cs title="ViewModels/HomeViewModel.cs"
namespace PrismWpfDemo.ViewModels;

public class HomeViewModel
{
    public string Message => "Your first Prism region is ready.";
}
```

The explicit view/view-model registrations avoid reliance on naming conventions. Convention-based [ViewModelLocator](../../mvvm/viewmodel-locator.md) is also available. A standalone view created outside Prism's shell, navigation, or dialog flow may need `prism:ViewModelLocator.AutoWireViewModel="True"`.

## Run and check

```powershell
 dotnet run --project PrismWpfDemo.csproj
```

Select **Open home**. The message should appear in `MainRegion`. If the view is blank, check `x:Class`, namespaces, registration names, and binding errors in the debugger. If the region is missing, verify the host has loaded and that the attached property uses the WPF URI with its trailing slash.

## Continue learning

1. [UI composition](view-composition.md): discovery, injection, and scoped regions
2. [Region navigation](../../navigation/regions/index.md): parameters, reuse, confirmation, and lifetime
3. [WPF dialogs](dialog-service.md): modal and modeless windows
4. [Commands](../../commands/commanding.md) and [modules](../../modularity/index.md)

## Source reference

- [WPF target frameworks](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Wpf/Prism.Wpf/Prism.Wpf.csproj)
- [WPF startup sequence](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Wpf/Prism.Wpf/PrismApplicationBase.cs)
- [DryIoc application base](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Wpf/Prism.DryIoc.Wpf/PrismApplication.cs)

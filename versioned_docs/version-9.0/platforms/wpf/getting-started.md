---
sidebar_position: 1
description: Build a Prism 9 WPF application with a container, shell, view models, and region navigation.
---

# Getting Started

This walkthrough creates a Windows desktop application with Prism 9.0.537, DryIoc, a view model, and a region. Start with a normal WPF Application project. If you need the Windows SDK or Visual Studio workload, follow Microsoft's [WPF setup tutorial](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/get-started/create-app-visual-studio).

## Install the Nuget Packages

Install `Prism.DryIoc` **9.0.537** for the DryIoc application base, or `Prism.Unity` **9.0.537** for Unity. Choose one application container. These packages bring in `Prism.Wpf`, `Prism.Core`, and their container dependencies; the WPF package is named `Prism.DryIoc`, even though its source project is `Prism.DryIoc.Wpf`.

The shipped WPF source targets `net462`, `net47`, and `net6.0-windows`. These are package asset targets, not a recommendation to start a new application on an unsupported .NET runtime. Use a supported Windows SDK/runtime compatible with the package assets and test the application on its deployment target.

For example, from a Windows development machine with the WPF workload:

```powershell
dotnet new wpf -n PrismWpfDemo
cd PrismWpfDemo
dotnet add package Prism.DryIoc --version 9.0.537
```

Do not mix the 9.0 platform packages with 10.0 prerelease container contracts. WPF is not a NativeAOT target.

## Override the Existing Application Object

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

### RegisterTypes

`RegisterTypes` runs before the shell is created. Register the shell dependencies here. `RegisterForNavigation<HomeView, HomeViewModel>()` creates a named `object` registration for `HomeView` and records its view-model type in `ViewModelLocationProvider`; it does not instantiate either immediately.

### CreateShell

The shell is a `System.Windows.Window`. Prism registers its infrastructure and your services, creates the shell, wires its view model, attaches the region manager, and initializes modules. Its default `OnInitialized` shows the shell. Call `base.OnInitialized()` if you override that method and still want this behavior.

## View Models

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

## Creating the View Model

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

### Using the ViewModelLocator

The explicit view/view-model registrations avoid reliance on naming conventions. In Prism 9, the convention replaces `.Views.` with `.ViewModels.` in the same assembly and appends `Model` to a view name ending in `View`, or `ViewModel` otherwise. For example, `HomeView` maps to `HomeViewModel`, and `MainWindow` maps to `MainWindowViewModel`. Convention-based [ViewModelLocator](../../mvvm/viewmodel-locator.md) is also available. A standalone view created outside Prism's shell, navigation, or dialog flow may need `prism:ViewModelLocator.AutoWireViewModel="True"`.

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

- [WPF target frameworks](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Prism.Wpf.csproj)
- [WPF startup sequence](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/PrismApplicationBase.cs)
- [DryIoc application base](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.DryIoc.Wpf/PrismApplication.cs)
- [Named registrations and view-model mappings](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Ioc/IContainerRegistryExtensions.cs)
- [Prism 9 ViewModelLocationProvider](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Mvvm/ViewModelLocationProvider.cs)

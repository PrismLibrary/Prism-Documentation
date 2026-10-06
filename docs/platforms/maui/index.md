---
sidebar_position: 1
---

# Getting Started with .NET MAUI

Prism.Maui provides page navigation, regions, dialogs, dependency injection, commands, and view-model lifecycle hooks on top of .NET MAUI. Startup uses `MauiAppBuilder`; your `App` remains a MAUI `Application`.

## Prepare the project

Install the SDK and platform workloads using Microsoft's [MAUI installation guide](https://learn.microsoft.com/en-us/dotnet/maui/get-started/installation?view=net-maui-10.0), then create a .NET MAUI project. Use an SDK, MAUI version, platform workload, and Prism package version that agree.

The audited Prism 9.1 source targets .NET 10 and .NET 11 base, Android, and iOS frameworks; Windows targets are added on Windows builds. It does not declare a Mac Catalyst target at this head. Do not equate MAUI's overall platform list with the assets and tested hosts in a particular Prism package. Check the package you restore, particularly for preview frameworks.

Install `Prism.DryIoc.Maui` for the convenience startup overload below. It references `Prism.Maui` and the DryIoc container. Choose a matching 9.1 package from your configured feed. With `Prism.Maui` alone, supply an `IContainerExtension` explicitly as shown in [App Builder](appbuilder.md).

## Configure startup

```cs title="MauiProgram.cs"
using Microsoft.Maui;
using Microsoft.Maui.Hosting;
using Prism;
using Prism.Ioc;
using PrismMauiDemo.ViewModels;
using PrismMauiDemo.Views;

namespace PrismMauiDemo;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        return MauiApp.CreateBuilder()
            .UseMauiApp<App>()
            .UsePrism(prism => prism
                .RegisterTypes(container =>
                {
                    container.RegisterForNavigation<MainPage, MainPageViewModel>();
                })
                .CreateWindow("/NavigationPage/MainPage"))
            .Build();
    }
}
```

The one-argument `UsePrism` extension above comes from `Prism.DryIoc.Maui` in the `Microsoft.Maui` namespace. It is not an overload supplied by `Prism.Maui` alone.

Keep `App.xaml` rooted in MAUI `Application`, retain its resources, and simplify its code-behind:

```cs title="App.xaml.cs"
using Microsoft.Maui.Controls;

namespace PrismMauiDemo;

public partial class App : Application
{
    public App() => InitializeComponent();
}
```

Remove the template's `MainPage` assignment or `CreateWindow` override that returns `new Window(new AppShell())`. Prism's registered window creator and initial navigation now create the root. MAUI Shell is not supported by Prism page navigation.

## Add the first page

Create a MAUI ContentPage in `Views/MainPage.xaml`, with matching namespace and generated `InitializeComponent()` constructor:

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:vm="clr-namespace:PrismMauiDemo.ViewModels"
    x:Class="PrismMauiDemo.Views.MainPage"
    x:DataType="vm:MainPageViewModel"
    Title="Home">
    <Label Text="{Binding Message}" Margin="24" />
</ContentPage>
```

```cs title="ViewModels/MainPageViewModel.cs"
namespace PrismMauiDemo.ViewModels;

public class MainPageViewModel
{
    public string Message => "Prism created this page and view model.";
}
```

The explicit pair registration wires `BindingContext` after Prism prepares the page's scope. No forced ViewModelLocator attached property is needed. For Prism markup extensions, add `xmlns:prism="http://prismlibrary.com"` without a trailing slash.

## Run on the target you ship

Use Visual Studio or VS Code to select a configured device/emulator. For an Android project that declares `net10.0-android`, a command-line run is:

```sh
dotnet build PrismMauiDemo.csproj -t:Run -f net10.0-android
```

A suitable Android device/emulator and its SDK are required. Use the platform launch target for Windows or iOS; iOS requires the matching Apple toolchain and host. Confirm that the home page appears within a navigation page, then test forward/back navigation and dialogs on each shipping platform.

Prism 9.1 is the first NativeAOT-ready release. The supported NativeAOT container is `Prism.Container.Microsoft` from Commercial Plus. The DryIoc example here is a normal setup, not a NativeAOT recipe. Follow the [NativeAOT guide](../../dependency-injection/native-aot.md) for target-specific support and generated registration requirements.

## Learning path

1. [App Builder](appbuilder.md): container, services, modules, and initial window
2. [Page navigation](navigation/page-navigation.md): page-scoped services and routes
3. [Navigation Builder](navigation/navigation-builder.md) and [tabs](navigation/tabbed-navigation.md)
4. [Page lifecycle](appmodel/pagelifecycleaware.md) and [dialogs](dialogs/index.md)
5. [Regions](../../navigation/regions/index.md) for composing views inside pages

Migrating an existing application? Start with [Prism.Forms migration](migrating.md).

## Source reference

- [Current MAUI target frameworks](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Prism.Maui.csproj)
- [DryIoc convenience overload](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.DryIoc.Maui/PrismAppExtensions.cs)
- [Prism window creator](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Navigation/PrismWindowManager.cs)

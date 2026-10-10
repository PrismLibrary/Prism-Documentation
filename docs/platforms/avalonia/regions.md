---
sidebar_position: 2
---

# Avalonia Regions and Navigation

Prism regions compose Avalonia controls inside a shell. The region navigation API is in `Prism.Navigation.Regions`; it does not use MAUI's page-navigation `INavigationService` or page URI stack.

## Declare a region

The Avalonia XAML namespace for Prism is `http://prismlibrary.com/`, including the trailing slash. Add an empty host to a window or control created by Prism:

```xml
<Window xmlns="https://github.com/avaloniaui"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:prism="http://prismlibrary.com/"
    x:Class="PrismAvaloniaDemo.Views.MainWindow"
    Width="800" Height="450">
    <ContentControl prism:RegionManager.RegionName="MainRegion" />
</Window>
```

The current Avalonia implementation registers adapters for `Avalonia.Controls.ContentControl` and `ItemsControl`. It does not register WPF's `SelectorRegionAdapter`. Do not assume a `TabControl` has WPF's selection/activation behavior simply because both controls have the same short name. A control that needs specialized selection semantics needs an appropriate Avalonia adapter and tests.

## Register views and request navigation

Create `CustomersView` as an Avalonia `UserControl` with a corresponding view model. Register the pair in `App.RegisterTypes` or a module:

```cs
using Prism.Ioc;

containerRegistry.RegisterForNavigation<CustomersView, CustomersViewModel>();
```

Inject `IRegionManager` into the calling view model. Invoke navigation after the host region exists, such as from a user command:

```cs
using Prism.Navigation.Regions;

regionManager.RequestNavigate("MainRegion", "CustomersView", result =>
{
    if (!result.Success)
        System.Diagnostics.Debug.WriteLine(result.Exception);
});
```

The callback uses `Prism.Navigation.NavigationResult.Success` and `Exception`; region requests also populate `Context`. Do not copy older `Result`/`Error` result-property names. Choose one registered route name consistently in registration and navigation.

For startup composition that should populate a region when it becomes available, register discovery in `OnInitialized`:

```cs
protected override void OnInitialized()
{
    Container.Resolve<IRegionManager>()
        .RegisterViewWithRegion("MainRegion", typeof(CustomersView));
    base.OnInitialized();
}
```

Discovery is different from navigation: it populates a region when created and does not represent a `RequestNavigate` call with navigation parameters or a journal entry. Choose the approach to match the workflow.

## View models, reuse, and cleanup

Explicit `RegisterForNavigation<TView, TViewModel>` registration maps the view model to the view. Prism's shell and navigation flows perform autowiring. A standalone control created outside those flows can opt in with `prism:ViewModelLocator.AutoWireViewModel="True"`. Avalonia binds to `DataContext`; do not copy MAUI's `BindingContext` or enum-valued `AutowireViewModel` property into Avalonia XAML.

Use the shared region contracts for these decisions:

- `IRegionAware` observes navigation and uses `IsNavigationTarget` to decide whether an existing view is a suitable target.
- `IConfirmNavigationRequest` asks whether an outgoing region view can be left.
- `IRegionMemberLifetime.KeepAlive` controls retention after deactivation. It is separate from choosing a DI singleton or a scoped service.
- `IActiveAware` observes region activation. It is not Avalonia window activation or a MAUI page-appearing event.

A nested region-manager scope isolates region names. It is not, by itself, a DI scope or a new desktop window. Follow the [region lifetime and navigation guides](../../navigation/regions/index.md) for these separate responsibilities. Do not dispose services merely because a view is temporarily inactive.

## Source reference

- [Avalonia XAML namespace mappings](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Avalonia/Prism.Avalonia/Properties/AssemblyInfo.cs)
- [Default adapters and behaviors, including Avalonia conditionals](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Wpf/Prism.Wpf/PrismInitializationExtensions.cs)
- [Shared view registration compiled for Avalonia](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Wpf/Prism.Wpf/Ioc/ViewRegistrationExtensions.cs)

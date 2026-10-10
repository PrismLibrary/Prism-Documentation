---
sidebar_position: 2
---

# Migrating from Prism.Forms

A Prism.Forms migration changes both the UI framework and Prism startup. Keep reusable commands, models, and service abstractions where possible, but validate page construction, navigation, dialogs, and lifecycle behavior on MAUI.

## Replace legacy startup

Prism 10.0 MAUI applications use a normal MAUI `Application` with `UsePrism` on `MauiAppBuilder`. The old Prism.Forms `PrismApplication.RegisterTypes`, `OnInitialized`, and `IPlatformInitializer` startup pattern is not the current API. Do not follow historical .NET 6/7 compatibility examples.

Move registration and initialization to the builder:

```cs
// Requires Prism.DryIoc.Maui and using Microsoft.Maui; using Prism;
MauiApp.CreateBuilder()
    .UseMauiApp<App>()
    .UsePrism(prism => prism
        .RegisterTypes(container =>
        {
            container.RegisterForNavigation<MainPage, MainPageViewModel>();
            PlatformRegistrations.RegisterTypes(container);
        })
        .OnInitialized(container =>
        {
            // Synchronous initialization after configured modules run.
        })
        .CreateWindow("/NavigationPage/MainPage"))
    .Build();
```

Define `PlatformRegistrations.RegisterTypes(IContainerRegistry)` in the selected platform folders, or use compiler conditions in shared registration code. Use `Prism.Ioc` for the registry/navigation registration extensions. See [App Builder](appbuilder.md) for container-specific overloads and a complete setup.

Remove `AppShell` startup, direct `MainPage` assignment, and template window creation that bypasses Prism. Register every page route and put initial navigation in `CreateWindow`.

## Update XAML and view-model wiring

Use MAUI's `http://schemas.microsoft.com/dotnet/2021/maui` namespace and Prism's `http://prismlibrary.com` namespace, without a trailing slash.

MAUI's attached property is `ViewModelLocator.AutowireViewModel`, with an enum value:

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:prism="http://prismlibrary.com"
    x:Class="MyApp.Views.MainPage"
    prism:ViewModelLocator.AutowireViewModel="Automatic">
    <!-- Page content -->
</ContentPage>
```

- `Automatic` is the default: Prism wires the view model after preparing the page, region, or dialog context. Usually omit the property.
- `Disabled` opts out when the application supplies its own binding context.
- `Forced` resolves immediately and can bypass the intended scope. It is not the normal migration equivalent of `true`.

Prefer `RegisterForNavigation<MainPage, MainPageViewModel>()` and let Prism create the page. Do not resolve a page's `INavigationService` from the root container and share it globally.

## Revisit the platform-specific behavior

- Page navigation remains URI-based, but it is scoped to the calling page and its window. Test absolute resets, relative navigation, hardware Back, modal dismissal, and tabs.
- The [XAML navigation](navigation/xaml-navigation.md) extension is `prism:NavigateTo` at the current source head.
- Native alerts use `Prism.Services.IPageDialogService`; custom dialogs are implemented by `Prism.Dialogs.IDialogService` and use the `DialogCloseListener` contract introduced in Prism 9.
- Page appearing/disappearing, navigation callbacks, destruction, and application/window lifecycle are separate events. Do not put permanent disposal in a temporary disappearing callback.
- Current source/package target boundaries differ from older Prism.Forms platforms. Start with [the MAUI package guide](index.md), and verify each deployment target.

## Source reference

- [Current MAUI builder](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/PrismAppBuilder.cs)
- [MAUI ViewModelLocator property](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Mvvm/ViewModelLocator.cs)
- [ViewModelLocatorBehavior enum](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Mvvm/ViewModelLocatorBehavior.cs)

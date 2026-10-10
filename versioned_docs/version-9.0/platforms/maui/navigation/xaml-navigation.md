---
sidebar_position: 7
uid: Platforms.Maui.Navigation.XamlNavigation
description: "Use Prism 9.0 MAUI NavigateTo and GoBack markup extensions or async view-model navigation commands."
---

# XAML Navigation

Use Prism's MAUI navigation markup extensions for simple view-owned actions. They obtain the navigation service from the target's page context, so the page should be created through Prism navigation.

## Using XAML Navigation

In Prism 9.0.537 the extension is `NavigateTo`, not the old `Navigate` spelling. Its content property is `Name` and can contain a relative or absolute route.

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:prism="http://prismlibrary.com"
    x:Class="MyApp.Views.HomePage">
    <VerticalStackLayout>
        <Button Text="Details" Command="{prism:NavigateTo 'DetailsPage'}" />
        <Button Text="Back" Command="{prism:GoBack}" />
    </VerticalStackLayout>
</ContentPage>
```

Register `DetailsPage` for navigation first. The Prism XML namespace has no trailing slash on MAUI. The markup extension produces the command; do not put it in `CommandParameter`.

## Flyout navigation

A menu in a Prism-created `FlyoutPage` can request a new detail hierarchy:

```xml
<FlyoutPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:prism="http://prismlibrary.com"
    x:Class="MyApp.Views.MenuPage">
    <FlyoutPage.Flyout>
        <ContentPage Title="Menu">
            <VerticalStackLayout>
                <Button Text="Home"
                    Command="{prism:NavigateTo 'NavigationPage/HomePage'}" />
                <Button Text="Orders"
                    Command="{prism:NavigateTo 'NavigationPage/OrdersPage'}" />
            </VerticalStackLayout>
        </ContentPage>
    </FlyoutPage.Flyout>
</FlyoutPage>
```

Let Prism assign `FlyoutPage.Detail`. Do not combine this with direct detail assignments or Shell navigation.

## Typical Navigation Setup

Use an async view-model command when navigation depends on validation, data loading, authorization, or result handling:

```cs
using Prism.Commands;
using Prism.Navigation;

public class HomePageViewModel
{
    private readonly INavigationService _navigation;

    public HomePageViewModel(INavigationService navigation)
    {
        _navigation = navigation;
        NavigateCommand = new AsyncDelegateCommand<string>(NavigateAsync);
    }

    public AsyncDelegateCommand<string> NavigateCommand { get; }

    private async Task NavigateAsync(string route)
    {
        var result = await _navigation.NavigateAsync(route);
        if (!result.Success && !result.Cancelled)
            System.Diagnostics.Debug.WriteLine(result.Exception);
    }
}
```

Bind `Command="{Binding NavigateCommand}"` with `CommandParameter="DetailsPage"`. XAML navigation does not expose an awaited result to the calling view model. In 9.0.537, `NavigateToExtension` overrides the logging hook with an empty implementation, so do not rely on it to log failed requests. Use the async command above for caller-owned handling, or the [global observer](global-navigation-observer.md) for page-service result notifications.

## Source reference

- [NavigateToExtension and Name property](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Navigation/Xaml/NavigateToExtension.cs)
- [Navigation service lookup and command implementation](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Navigation/Xaml/NavigationExtensionBase.cs)
- [MAUI XML namespace mappings](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Properties/AssemblyInfo.cs)

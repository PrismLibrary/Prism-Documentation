---
sidebar_position: 7
uid: Platforms.Maui.Navigation.XamlNavigation
---

# XAML Navigation

Use Prism's MAUI navigation markup extensions for simple view-owned actions. They obtain the navigation service from the target's page context, so the page should be created through Prism navigation.

At the inspected prerelease source checkpoint the extension is `NavigateTo`, not `Navigate`. Its content property is `Name` and can contain a relative or absolute route.

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

## When a command belongs in the view model

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

Bind `Command="{Binding NavigateCommand}"` with `CommandParameter="DetailsPage"`. XAML navigation itself logs navigation errors through its logger; it does not expose an awaited result to the calling view model. The [global observer](global-navigation-observer.md) can provide application-wide diagnostics.

## Source reference

- [NavigateToExtension and Name property](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Navigation/Xaml/NavigateToExtension.cs)
- [Navigation service lookup and command implementation](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Navigation/Xaml/NavigationExtensionBase.cs)
- [MAUI XML namespace mappings](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Properties/AssemblyInfo.cs)

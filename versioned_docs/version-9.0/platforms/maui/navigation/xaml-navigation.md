---
sidebar_position: 7
uid: Platforms.Maui.Navigation.XamlNavigation
---

# XAML Navigation

XAML Navigation is a favorite feature for many Prism developers. This gives you the ability to reduce the amount of code you need to write in your ViewModel and focus on simplifying your code by simply enabling Navigation on an as needed basis.

## Typical Navigation Setup

First we need to be sure we have a ViewModel like:

```cs
public class MainPageViewModel : BindableBase
{
    private readonly INavigationService _navigationService;

    public MainPageViewModel(INavigationService navigationService)
    {
        _navigationService = navigationService;
        NavigateCommand = new DelegateCommand(OnNavigateCommandExecuted);
    }

    public DelegateCommand<string> NavigateCommand { get; }

    private async void OnNavigateCommandExecuted(string uri)
    {
        await _navigationService.NavigateAsync(uri);
    }
}
```

Then of course we need to set up our View:

```xml
<FlyoutPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
            xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
            x:Class="AwesomeApp.MainPage">
  <FlyoutPage.Flyout>
    <ContentPage Title="Menu">
      <VerticalStackLayout>
        <Button Text="View A"
                Command="{Binding NavigateCommand}"
                CommandParameter="NavigationPage/ViewA" />
        <Button Text="View B"
                Command="{Binding NavigateCommand}"
                CommandParameter="NavigationPage/ViewB" />
        <Button Text="View C"
                Command="{Binding NavigateCommand}"
                CommandParameter="NavigationPage/ViewC" />
      </VerticalStackLayout>
    </ContentPage>
  </FlyoutPage.Flyout>
</FlyoutPage>
```

## Using XAML Navigation

When we use XAML Navigation we can get rid of 100% of the C# code that we had to write in the sample above, and we simply update the XAML for a significantly cleaner approach.

```xml
<FlyoutPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
            xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
            xmlns:prism="http://prismlibrary.com"
            x:Class="AwesomeApp.MainPage">
  <FlyoutPage.Flyout>
    <ContentPage Title="Menu">
      <VerticalStackLayout>
        <Button Text="View A"
                Command="{prism:Navigate 'NavigationPage/ViewA'}" />
        <Button Text="View B"
                Command="{prism:Navigate 'NavigationPage/ViewB'}" />
        <Button Text="View C"
                Command="{prism:Navigate 'NavigationPage/ViewC'}" />
      </VerticalStackLayout>
    </ContentPage>
  </FlyoutPage.Flyout>
</FlyoutPage>
```


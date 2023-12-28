# Xaml Navigation

Prism allows you to declare your navigation directly inside your Xaml via a [Markup Extension](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/xaml/markup-extensions/). This approach really helps with basic navigation scenarios, and can also help clean up your ViewModels.

## Defining your navigation path in Xaml

To define navigation from within your Xaml, simply add the prism namespace to your Page

```xml
<Page xmlns:prism="http://prismlibrary.com">
```

And then add the Markup Extension to any `Command` property (buttons, tap gesture recognizers, etc.)

```xml
<!-- normal navigation -->
<Button Command="{prism:NavigateTo 'path/to/navigate'}" />

<!-- replace a page on the stack -->
<Button Command="{prism:NavigateTo '../navigate'}" />
```

Navigating back OR back to the root page will be done via the GoBack extension

```xml
<!-- go back one -->
<Button Command="{prism:GoBack}" />

<!-- go back to the root -->
<Button Command="{prism:GoBack ToRoot}" />
```

## Adding NavigationParameters via Xaml

You can also define NavigationParameters to your Xaml in one of three ways.

#### 1: Directly as a CommandParameter Binding.
*Note: in order to access it, you need to lookup `xamlParam` from your NavigationParameters property. This is also statically defined in `KnownNavigationParameters.XamlParam`*

```xml
<Button Command="{prism:NavigateTo 'path/to/navigate'}"
        CommandParameter="{Binding Foo}" />
```

```csharp
public override void OnNavigatingTo(INavigationParameters parameters)
{
    if(parameters.TryGetValue(KnownNavigationParameters.XamlParam, out object fooObject))
    {
        // do something with fooObject
    }
}
```

#### 2: As a single navigation parameter

```xml
<Button Command="{prism:NavigateTo 'path/to/navigate'}">
    <Button.CommandParameter>
        <prism:NavigationParameter Key="Foo" Value="Some Value" />
    </Button.CommandParameter>
</Button>
```

#### 3: As a collection of navigation parameters

```xml
<Button Command="{prism:NavigateTo 'path/to/navigate'}">
    <Button.CommandParameter>
        <prism:NavigationParameters>
            <prism:NavigationParameter Key="Foo" Value="{Binding SomeBarValue}" />
            <prism:NavigationParameter Key="Fizz" Value="Some Buzz Value" />
        </prism:NavigationParameters>
    </Button.CommandParameter>
</Button>
```

*note: you can also optionally specify a BindingContext on either your `NavigationParameters` or `NavigationParameter`.*

## Controlling `CanNavigate`

You can control whether or not the user `CanNavigate` via an [attached property](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/xaml/attached-properties). This attached property can be set on any parent object, and Prism will walk the tree until it finds the value. If Prism cannot find a `CanNavigate` property, it simply assumes `true` with a single caviat. In order to prevent double-tap issues, Prism's Xaml Navigation tracks if the user has already initiated navigation, if they have, then it prevents them from initiating it again.

```xml
<Page>
    <StackLayout prism:Navigation.CanNavigate="{Binding MyCanNavigateProperty}">
        <ContentView>
            <Button Command="{prism:NavigateTo 'path/to/navigate'}"
                    CommandParameter="{Binding Foo}" />
        </ContentView>
    </StackLayout>
</Page>
```

## Defining your Source Page

In the rare case that you need to tell the `NavigationService` to use a different Page from the one that Xamarin Forms passes into the Markup Extension, you can override the `SourcePage`

```xml
<Button Command="{prism:NavigateTo 'path/to/navigate', SourcePage={x:Reference SomeOtherPage}}" />
```

One possible scenario is one which you want your Master to use a NavigationPage for the aesthetics of having a title bar, and want to make sure that your Navigation references are navigating from the MasterDetailPage rather than inside of the NavigationPage. In order to achieve this, you'll give your `MasterDetailPage` an `x:Name` and supply that to the `SourcePage` property of the `NavigateTo` extension.

```xml
<MasterDetailPage x:Name="mdp">
  <MasterDetailPage.Master>
    <NavigationPage Title="Menu">
      <x:Arguments>
        <ContentPage Title="Foo">
          <Button Text="ClickMe"
                  Command="{prism:NavigateTo 'NavigationPage/ViewA', SourcePage={x:Reference mdp}}" />
        </ContentPage>
      <x:Arguments>
    </NavigationPage>
  </MasterDetailPage.Master>
</MasterDetailPage>
```

## Extending the markup extensions

If you wish to add additional functionality to your xaml navigation, Prism has made it easy for you to extend both the `NavigateTo` and `GoBack` extensions. Some reasons you might want to do this would be to add additional options or simply add debug logging.

```csharp
public class ExNavigateToExtension : NavigateToExtension
{
    protected override async Task HandleNavigation(INavigationParameters parameters, INavigationService navigationService)
    {
        Debug.WriteLine($"Navigating to: {Name}");
        await base.HandleNavigation(parameters, navigationService);
    }
}
```

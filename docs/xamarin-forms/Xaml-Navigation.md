# Xaml Navigation

Prism allows you to declare your navigation directly inside your Xaml via a Markup Extensions. 

## Defining your navigation path in Xaml

To define navigation from within your Xaml, simply add the prism namespace to your Page

```xml
<Page xmlns:prism="clr-namespace:Prism.Navigation.Xaml;assembly=Prism.Forms">
```

And then define a button command

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
public override void OnNavigatingTo(NavigationParameters parameters)
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
        <prism:NavigationParameter Key="Foo" Value="Some Value">
    </Button.CommandParameter>
</Button>
```

#### 3: As a collection of navigation parameters

```xml
<Button Command="{prism:NavigateTo 'path/to/navigate'}">
    <Button.CommandParameter>
        <prism:NavigationParameters>
            <prism:NavigationParameter Key="Foo" Value="Some Bar Value">
            <prism:NavigationParameter Key="Fizz" Value="Some Buzz Value">
        </prism:NavigationParameters>
    </Button.CommandParameter>
</Button>
```

*note: you can also optionally specify a BindingContext on either your `NavigationParameters` or `NavigationParameter`.*

## Controlling `CanNavigate`

You can control whether or not the user `CanNavigate` via an attached property. This attached property can be set on any parent object, and Prism will walk the tree until it finds the value.

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
---
sidebar_position: 2
---

# Page Navigation

For those who may be familiar with Prism.Forms this is perhaps one of the most beloved features of Prism. Prism's INavigationService provides us the ability to easily navigate between pages with a powerful understanding of URI's. This allows us to inject parameters into the URI's that will be passed to specific Pages, overload query parameters, and even control the behavior of the navigation such as whether or not to animate the transition or navigate modally at a specific URI segment.

:::note
Page based navigation in .NET MAUI is specific to the individual page you want to navigate from. This is NOT a concept unique to Prism, but is actually a fundamental part of how navigation within .NET MAUI works. As a result, Prism relies on Dependency Injection Container Scoping around the creation of Each Page to ensure that we inject an instance of the Navigation Service that has the ability to navigate from the corresponding Page for the current scope.
:::

## What the heck is a Navigation Segment?

You may see the term `Navigation Segment` used several times throughout the docs, but what is it? Given that you have a URI that looks like `ViewA/ViewB/ViewC`, we will split the URI into 3 segments, `ViewA`, `ViewB`, and `ViewC`. Each segment may contain it's own query parameters which are only passed to that specific Page during the navigation. An example of this would be `ViewA?color=Red/ViewB?color=Blue/ViewC?color=Green`. In this example `ViewA` will have a query parameter of `color=Red` and `ViewB` will have a query parameter of `color=Blue` and `ViewC` will have a query parameter of `color=Green`.

## Known Navigation Parameters

Prism.Maui has a number of "KnownNavigationParameters" that you can use to control the behavior of the navigation. Each of these parameter names can be accessed from the KnownNavigationParameters class.

| Property | Value | Description |
| -------- | ---- | ----------- |
| `CreateTab` | `createTab` | This parameter will be evaluated by the Navigation Service when the parameter exists on a TabbedPage. This parameter is commonly overloaded like `TabbedPage?createTab=ViewA&createTab=ViewB`. This will create a new TabbedPage with 2 tabs, one for ViewA and one for ViewB. |
| `SelectedTab` | `selectedTab` | This parameter will be evaluated by the Navigation Service when the parameter exists on a TabbedPage. This parameter should not be overloaded. Most commonly you would use the name of the tab you want to select like `TabbedPage?selectedTab=ViewA`. This will select the tab with the name of ViewA. In the event that you have a NavigationPage on the tab, you may want to use the alternate syntax like `TabbedPage?selectedTab=NavigationPage|ViewB` where ViewB is the CurrentPage of the NavigationPage. |
| `UseModalNavigation` | `useModalNavigation` | When this parameter is present on any navigation segment, the page will be pushed modally if the value is true, and we will not push modally if it is false. Note that this may cause a Navigation failure if we cannot navigate the way you want from the current context. This parameter can be used when invoking `NavigateAsync` or `GoBackAsync`. |
| `Animated` | `animated` | When this parameter is present we will override the default behavior to animate the navigation. If you do not want to animate the entire navigation you may want to pass this in the NavigationParameters rather than the URI as the URI would require you to pass this on each segment. |

## Navigation Parameters

As has already been mentioned Prism allows you to easily pass parameters to specific Pages with query parameters. These are added to the Navigation Parameter that you may pass into various Navigation methods. The Navigation Parameters are passed to all pages that may be created during the navigation process. NavigationParameters are vary similar to an IDictionary but are not limited to a single entry of a key/value pair.

```cs
var parameters = new NavigationParameters
{
    { "color", "Red" },
    { "color", "Blue" },
    { "color", "Green" },
    { "size", "Large" }
}
```

This allows you to pass parameters one at a time to the NavigationParameters if you need to. NavigationParameter are implemented as an `IEnumerable<KeyValuePair<string, object>>`, so as a result you can pass any value type that you require and overload Keys.

```cs
var parameters = new NavigationParameters
{
    { "color", new [] { "Red", "Blue", "Green" } },
    { "size", "Large" }
}
```

## Navigation Methods

The actual `INavigationService` interface is kept as clean as possible with 3 core methods. Everything else you see in Intellisense is an extension method which is meant to help you just provide the parameters you need.

### NavigateAsync

The `NavigateAsync` method is one of most critical core concepts to building apps with Prism. This is where we accomplish setting the Page on our Application Window and updating the Navigation Stack by pushing pages Modally or non-Modally within our app. We can also use this method to dynamically set the FlyoutPage's Detail, add a page to a brand new NavigationPage, or even create an entire TabbedPage on the fly. We do this all through the requested Navigation URI. As has been already discussed the Navigation Service break apart the Navigation URI and process each segment. It is extremely intelligent in figuring out the context it needs to navigate. As a result, when Navigating from a FlyoutPage the Navigation Service understands that the next page will set the Detail of the FlyoutPage. When navigating within the context of a NavigationPage, the Navigation Service understands that the next page will be added to the NavigationPage and will not be pushed Modally.

#### FlyoutPages

FlyoutPages in .NET MAUI are a special page that commonly provides the "Hamburger Menu" in the upper left hand corner of the app. You may swipe left to right to reveal or hide the menu or you may tap the Hamburger Menu depending on the platform and settings. Understanding how the FlyoutPage works though is critical to ensure that you use it correctly. The FlyoutPage has two primary properties that you should understand, both of which are a Page.

- `FlyoutPage.Flyout`
- `FlyoutPage.Detail`

Within the context of a Prism Application you should NEVER directly set Detail as this should be set dynamically by the NavigationService.

The Flyout itself may be a bit tricker for some to understand. The reality is that this never should have been a Page type, the best way to think of this is that you have a ContentView that we've decided to call ContentPage instead. The ContentPage that we're using for the Flyout should NOT have it's own ViewModel.

```xml
<FlyoutPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
            xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
            x:Class="AwesomeApp.MainPage">
  <FlyoutPage.Flyout>
    <ContentPage Title="Menu">
        <!-- Your Content Here -->
    </ContentPage>
  </FlyoutPage.Flyout>
</FlyoutPage>
```

:::note
In some cases you may find that you do not even need a ViewModel for the FlyoutPage if simply have a static view with a Menu that uses the [Xaml Navigation Extensions](xaml-navigation.md)
:::

If we were building a .NET MAUI application without the benefit of Prism, we would expect to set a NavigationPage as the Detail of the FlyoutPage, and then push our ContentPage into the NavigationPage. From code this might look something like:

```cs
var mainPage = new FlyoutPage()
{
    Flyout = new ContentPage()
    {
        Title = "Menu",
        Content = new StackLayout()
        {
            Children =
            {
                new Label()
                {
                    Text = "Hello World"
                }
            }
        }
    },
    Detail = new NavigationPage(new ContentPage()
    {
        Title = "Content Page",
        Content = new StackLayout()
        {
            Children =
            {
                new Label()
                {
                    Text = "Hello World"
                }
            }
        }
    })
};
```

As already mentioned you should never set the Detail property of the FlyoutPage. Instead we will do this with the Navigation URI. Our Navigation might look something like:

```cs
Navigation.NavigateAsync("MyFlyoutPage/NavigationPage/ViewA");
```

#### Deep Linking

#### Absolute vs Relative Navigation

A URI has two basic states, absolute and relative. Absolute URIs are URIs that start with a `/`, relative URIs do not. A relative URI may simply start with a ViewName, or it may start with `../` to go back a level.

When navigating with an Absolute URI, the Navigation Service will set a new Page on the Application Window. When navigating with a Relative URI, the Navigation Service will push a new Page onto the Navigation Stack.

Better yet when using the shorthand syntax `../` you can use this to both Navigate Back and Navigate Forward at the same time. Conceptually you might consider the example where your current Navigation Stack looks like `NavigationPage/ViewA/ViewB` and you are navigating from the ViewBViewModel. You can pass instead of first calling GoBack and then having to navigate forward again, you can instead pass a URI like `../ViewC` and the Navigation Service will pop ViewB from the NavigationPage and push ViewC onto the NavigationStack.

### GoBackAsync

### GoBackToRootAsync


---
sidebar_position: 2
description: "Use page-scoped Prism 9.0 navigation for URI routes, parameters, flyouts, deep links, and back navigation."
---

# Page Navigation

`Prism.Navigation.INavigationService` navigates from a particular MAUI page. Prism creates a container scope when it constructs a page and supplies the navigation service associated with that page to its view model. Inject it there; do not cache a root-resolved service in a singleton or reuse another page's service after that page is removed.

## Register pages and navigate

```cs
// In PrismAppBuilder.RegisterTypes; using Prism.Ioc;
container.RegisterForNavigation<HomePage, HomePageViewModel>();
container.RegisterForNavigation<DetailsPage, DetailsPageViewModel>();

// The initial route is configured on PrismAppBuilder.
prism.CreateWindow("/NavigationPage/HomePage");
```

From the home page's view model:

```cs
using Prism.Commands;
using Prism.Navigation;

public class HomePageViewModel
{
    private readonly INavigationService _navigation;

    public HomePageViewModel(INavigationService navigation)
    {
        _navigation = navigation;
        OpenDetailsCommand = new AsyncDelegateCommand(OpenDetailsAsync);
    }

    public AsyncDelegateCommand OpenDetailsCommand { get; }

    private async Task OpenDetailsAsync()
    {
        var result = await _navigation.NavigateAsync("DetailsPage",
            new NavigationParameters { { "customerId", 42 } });
        if (!result.Success && !result.Cancelled)
            System.Diagnostics.Debug.WriteLine(result.Exception);
    }
}
```

## What the heck is a Navigation Segment?

A route such as `HomePage/DetailsPage` has two page segments. A segment can have its own query parameters, for example `HomePage?section=recent/DetailsPage?customerId=42`. The query parameters for each segment are delivered to that segment's page. An `INavigationParameters` object passed with the request is available throughout that navigation.

## Navigation Parameters

```cs
var parameters = new NavigationParameters
{
    { "color", "Red" },
    { "color", "Blue" },
    { "customer", customer }
};

var result = await navigation.NavigateAsync("DetailsPage", parameters);
```

`NavigationParameters` can contain repeated keys and object values. Use `GetValues<T>` for repeated keys. Values in URI query strings are textual; do not assume they have the same runtime type as an object parameter. Use the [Navigation Builder](navigation-builder.md) to compose complex routes and segment parameters, and avoid placing secrets in routes or logs.

## Known Navigation Parameters

Useful controls in `KnownNavigationParameters` include:

| Member | URI key | Purpose |
| --- | --- | --- |
| `UseModalNavigation` | `useModalNavigation` | Request modal/non-modal navigation where the current page hierarchy supports it |
| `Animated` | `animated` | Control transition animation |
| `CreateTab` | `createTab` | Add a child route to a newly created tabbed page; repeat for more tabs |
| `SelectedTab` | `selectedTab` | Choose the active tab by its registered navigation name |

A request such as `DetailsPage?useModalNavigation=true` requests a modal presentation. To create a modal navigation stack, use `NavigationPage?useModalNavigation=true/DetailsPage`. Parameter choices cannot make an invalid hierarchy valid; inspect the navigation result.

## Navigation Methods

The 9.0 `INavigationService` declares `NavigateAsync`, `GoBackAsync`, `GoBackToAsync`, `GoBackToRootAsync`, and `SelectTabAsync`. String routes and parameterless convenience calls are extension methods in `Prism.Navigation`.

### NavigateAsync

#### Absolute vs Relative Navigation

A route beginning with `/` replaces the root page of the relevant window. A relative route operates within the calling page's context. It may push onto a navigation stack, change flyout detail, or require a modal presentation depending on that context; it is not always a plain push.

```cs
// Replace the current window's root with a fresh hierarchy.
await navigation.NavigateAsync("/NavigationPage/HomePage");

// From a page within that navigation stack, push DetailsPage.
await navigation.NavigateAsync("DetailsPage");

// From DetailsPage, remove it and navigate forward to SummaryPage.
await navigation.NavigateAsync("../SummaryPage");
```

Register every page used in these routes. An absolute reset can remove a large page tree and its state. Use it intentionally for flows such as login/logout, rather than as a substitute for normal Back navigation.

#### Deep Linking

A route such as `/NavigationPage/HomePage/DetailsPage` creates a navigation page with both content pages in its stack. This constructs a hierarchy in one navigation request; it is not an operating-system app-link registration. Register both pages first. For tab-specific hierarchies, see [tabbed navigation](tabbed-navigation.md).

#### FlyoutPages

Declare the menu in `FlyoutPage.Flyout`, then let Prism supply `Detail` through navigation:

```xml
<FlyoutPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:prism="http://prismlibrary.com"
    x:Class="MyApp.Views.MenuPage">
    <FlyoutPage.Flyout>
        <ContentPage Title="Menu">
            <Button Text="Home" Command="{prism:NavigateTo 'NavigationPage/HomePage'}" />
        </ContentPage>
    </FlyoutPage.Flyout>
</FlyoutPage>
```

Register `MenuPage` and navigate initially to `/MenuPage/NavigationPage/HomePage`. Do not also assign its `Detail` directly. A simple menu can share its parent's binding context or use [XAML navigation](xaml-navigation.md); it does not need an independently navigated menu-page view model.

### GoBackAsync

```cs
var back = await navigation.GoBackAsync();
```

`GoBackAsync` leaves the current page using its stack/modal context. At the application root, behavior is platform-specific; it is not a universal way to close the application. Inspect its result and handle a confirmation veto as cancellation.

### GoBackToRootAsync

```cs
var toRoot = await navigation.GoBackToRootAsync();
```

This retains the root of the current `NavigationPage` and removes pages above it. It requires a navigation-page context. To retain a particular earlier page in that stack, use `await navigation.GoBackToAsync("HomePage")`. Choose a page behind the current page, and use its registered name. Both operations return results and check navigation confirmation.

Use Prism's service rather than directly calling `Navigation.PopAsync` or editing the navigation stack, so confirmation, callbacks, and cleanup can run. [PrismNavigationPage](prismnavigationpage.md) integrates system Back with that flow, subject to platform-specific behavior.

## Navigation lifecycle

Page navigation can invoke `IInitialize` / `IInitializeAsync`, navigation-aware callbacks, and `IConfirmNavigation` / `IConfirmNavigationAsync`. Page appearing/disappearing are separate [MAUI lifecycle notifications](../appmodel/pagelifecycleaware.md). Removing a page triggers Prism cleanup and `IDestructible` callbacks; temporary disappearance does not mean the page or scope has ended.

## Source reference

- [Prism 9.0 navigation service contract](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Navigation/INavigationService.cs)
- [String-route and convenience overloads](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Navigation/INavigationServiceExtensions.cs)
- [Page creation, confirmation, and stack handling](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Navigation/PageNavigationService.cs)

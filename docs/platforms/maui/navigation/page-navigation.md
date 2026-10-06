---
sidebar_position: 2
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

## Segments and parameters

A route such as `HomePage/DetailsPage` has two page segments. A segment can have its own query parameters, for example `HomePage?section=recent/DetailsPage?customerId=42`. The query parameters for each segment are delivered to that segment's page. An `INavigationParameters` object passed with the request is available throughout that navigation.

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

Useful controls in `KnownNavigationParameters` include:

| Member | URI key | Purpose |
| --- | --- | --- |
| `UseModalNavigation` | `useModalNavigation` | Request modal/non-modal navigation where the current page hierarchy supports it |
| `Animated` | `animated` | Control transition animation |
| `CreateTab` | `createTab` | Add a child route to a newly created tabbed page; repeat for more tabs |
| `SelectedTab` | `selectedTab` | Choose the active tab by its registered navigation name |

A request such as `DetailsPage?useModalNavigation=true` requests a modal presentation. To create a modal navigation stack, use `NavigationPage?useModalNavigation=true/DetailsPage`. Parameter choices cannot make an invalid hierarchy valid; inspect the navigation result.

## Absolute and relative routes

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

## Back navigation

```cs
var back = await navigation.GoBackAsync();
var toHome = await navigation.GoBackToAsync("HomePage");
var toRoot = await navigation.GoBackToRootAsync();
```

`GoBackAsync` leaves the current page using its stack/modal context. `GoBackToAsync` returns to a named page already in the navigation stack. `GoBackToRootAsync` retains the root of a `NavigationPage` and removes pages above it; it requires that navigation-page context. These operations return results and can be rejected by navigation confirmation.

Use Prism's service rather than directly calling `Navigation.PopAsync` or editing the navigation stack, so confirmation, callbacks, and cleanup can run. [PrismNavigationPage](prismnavigationpage.md) integrates system Back with that flow, subject to platform-specific behavior.

## Navigate from an existing page

Prism 9.1 also exposes `NavigateFromAsync`:

```cs
var result = await navigation.NavigateFromAsync("HomePage", "SummaryPage",
    new NavigationParameters { { "orderId", orderId } });
```

This finds the nearest matching registered name on the active path in the calling page's window, removes pages after it, then navigates relative to that retained page. The search includes modal stacks, the selected tab, and flyout detail. It excludes inactive tabs and the flyout menu. With duplicate names, the nearest match wins.

The route must be relative. A missing source or an absolute route fails without changing the stack. Leading `../` segments go backward from the named source. The active departing page is confirmed before stack changes. Navigating from a container follows that container's normal rules; the method does not implicitly select a tab. Test this flow with cancellation, modal pages, and repeated commands when using it to complete an editor or wizard.

## Flyout pages

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

## Lifecycle and current path

Page navigation can invoke `IInitialize` / `IInitializeAsync`, navigation-aware callbacks, and `IConfirmNavigation` / `IConfirmNavigationAsync`. Page appearing/disappearing are separate [MAUI lifecycle notifications](../appmodel/pagelifecycleaware.md). Removing a page triggers Prism cleanup and `IDestructible` callbacks; temporary disappearance does not mean the page or scope has ended.

`navigation.GetNavigationUriPath()` reports the active hierarchy for the page's window, including registered names, tab selection, and modal boundaries. It returns an empty string before the page is attached and does not retain caller-supplied navigation parameters. Treat it as an observation of the current path, not a complete persisted state snapshot.

## Source reference

- [Navigation methods and NavigateFrom contract](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Navigation/INavigationService.cs)
- [String-route and convenience overloads](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Navigation/INavigationServiceExtensions.cs)
- [Page creation, confirmation, and stack handling](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Navigation/PageNavigationService.cs)

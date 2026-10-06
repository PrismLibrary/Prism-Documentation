---
sidebar_position: 8
description: "Create Prism 9.0 MAUI tabs, select wrapped tabs by their root page, and configure tab presentation."
---

# TabbedPages

Prism creates tabbed page hierarchies from registered routes. It registers MAUI `TabbedPage` under the key `TabbedPage` if that name is absent during initialization. You do not need a custom tabbed-page subclass for a simple tab layout.

## Navigating to a TabbedPage

Register each content page and its view model. Then use the builder to create the hierarchy:

```cs
using Prism.Navigation;

var result = await navigationService.CreateBuilder()
    .UseAbsoluteNavigation()
    .AddTabbedSegment(tabs => tabs
        .CreateTab("HomePage")
        .CreateTab(tab => tab
            .AddNavigationPage()
            .AddSegment<OrdersPageViewModel>())
        .SelectedTab("HomePage"))
    .NavigateAsync();
```

The absolute form replaces the relevant window root. Omit `UseAbsoluteNavigation()` only when a relative tabbed-page presentation is what your current context requires.

A simpler URI with two unwrapped content tabs is `TabbedPage?createTab=HomePage&createTab=OrdersPage`. Repeat `createTab` for each tab. Prefer the builder for navigation-page tabs and deep-linked child stacks, so the construction is readable. In 9.0 a navigation-page tab can include further registered pages through additional `AddSegment` calls. However, its creation path does not initialize each content page with that child segment's parameters: the later tabbed-page initialization visits the current page of each navigation tab using the outer parameters. For a flow that needs per-page initialization data, create the tab first, then navigate within it using `SelectTabAsync` with a relative route.

Avoid manually creating the `TabbedPage.Children` list in XAML or code when Prism should own its pages. Direct construction can bypass route-based view-model mapping and page scopes.

## Selecting a Tab at Runtime

Call from the tabbed page or a page associated with its hierarchy:

```cs
var result = await navigationService.SelectTabAsync("HomePage");
```

For a tab wrapped by a navigation page, use the wrapper's registration name and its root page's name:

```cs
var result = await navigationService.SelectTabAsync("NavigationPage|OrdersPage");
```

Keep using `NavigationPage|OrdersPage` even if that tab has pushed `OrderDetailsPage`: 9.0 runtime selection matches `RootPage`. A single `"OrdersPage"` name can also match a wrapped tab's root. The initial `selectedTab` URI option accepts a wrapper/root pair and can fall back to the current-page match; using the root name works consistently for both paths.

Select a tab and navigate from its current page in one request:

```cs
var result = await navigationService.SelectTabAsync(
    "NavigationPage|OrdersPage", "OrderDetailsPage",
    new NavigationParameters { { "orderId", 42 } });
```

The follow-on route must be relative. Register `OrderDetailsPage` first. Inspect the returned result: `SelectTabAsync` does not publish the global navigation event in this release. Switching tabs does not destroy the previous tab's page.

## Reuse a tab layout

```cs
using Prism.Navigation;
using Prism.Navigation.Builder;

public static class AppNavigation
{
    public static INavigationBuilder AddMainTabs(this INavigationBuilder builder)
    {
        return builder.AddTabbedSegment(tabs => tabs
            .CreateTab("HomePage")
            .CreateTab(tab => tab.AddNavigationPage().AddSegment("OrdersPage")));
    }
}
```

Create a fresh navigation builder per request, then call `AddMainTabs().NavigateAsync()`. Test initial selection, switching back to a tab with an existing stack, Back within a tab, and absolute replacement of the tabbed hierarchy.

## Tab titles and icons

Set `Title` and `IconImageSource` on a content page. For a navigation-page tab, 9.0 normally binds the wrapper's title and icon to its root page. The attached `prism:TabbedPage.Title`, `prism:TabbedPage.IconImageSource`, and `prism:TabbedPage.TitleBindingSource` properties let the root/wrapper control that presentation. Set an explicit tab title together with its icon when using that override. `TitleBindingSource="CurrentPage"` opts into following the active page instead of the root. These are XAML attached properties; the 9.0 tab builder has no `Title()` method.

## Source reference

- [Tab creation and selection](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Navigation/PageNavigationService.cs)
- [Builder tab helpers](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Navigation/Builder/NavigationBuilderExtensions.cs)
- [Tab presentation attached properties](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Navigation/Xaml/TabbedPage.cs)

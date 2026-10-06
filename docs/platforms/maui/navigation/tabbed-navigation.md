---
sidebar_position: 8
---

# Tabbed Navigation

Prism creates tabbed page hierarchies from registered routes. It registers MAUI `TabbedPage` under the key `TabbedPage` if that name is absent during initialization. You do not need a custom tabbed-page subclass for a simple tab layout.

## Create tabs through navigation

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

A simple equivalent URI is `TabbedPage?createTab=HomePage&createTab=OrdersPage`. Repeat `createTab` for each tab. Prefer the builder for navigation-page tabs and deep-linked child stacks, so the construction is readable. At the audited source head a navigation-page tab can include further registered pages through additional `AddSegment` calls.

Avoid manually creating the `TabbedPage.Children` list in XAML or code when Prism should own its pages. Direct construction can bypass route-based view-model mapping and page scopes.

## Select an existing tab

Call from the tabbed page or a page associated with its hierarchy:

```cs
var result = await navigationService.SelectTabAsync("HomePage");
```

For a tab wrapped by a navigation page, include the wrapper's registration name and the current/top page name:

```cs
var result = await navigationService.SelectTabAsync("NavigationPage|OrdersPage");
```

If that tab has navigated forward to `OrderDetailsPage`, target `NavigationPage|OrderDetailsPage` instead. Registering or selecting a tab is not the same as replacing the entire application's root. Inspect the result and avoid assuming a tab change destroyed the previous tab's page.

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

## Source reference

- [Tab creation and selection](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Navigation/PageNavigationService.cs)
- [Builder tab helpers](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Navigation/Builder/NavigationBuilderExtensions.cs)

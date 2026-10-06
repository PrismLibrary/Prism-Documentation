---
sidebar_position: 1
---

# Navigation in Prism.Maui

Prism.Maui has two navigation models. Choose the one that owns the UI you want to change:

- **Page navigation**, through `Prism.Navigation.INavigationService`, constructs pages and updates the calling page's navigation/window stack. It supports navigation pages, modal routes, flyout detail, and tabbed pages.
- **Region navigation**, through `Prism.Navigation.Regions.IRegionManager`, composes views inside named regions. It uses region navigation contracts and a region context, not the page-navigation stack.

The two can coexist: a page can contain regions, while the page navigation service owns the surrounding page. A region view should use the region APIs for its region and only use a page navigation service when it has the correct owning-page context.

## MAUI Shell

Prism page navigation does not support MAUI Shell. Remove the template's Shell startup when configuring Prism. Use `NavigationPage`, `TabbedPage`, or `FlyoutPage` as appropriate and let Prism construct the page hierarchy from registered routes.

This is an integration boundary, not a claim that Shell lacks modal navigation or dependency injection. For comparison, Microsoft documents Shell's [navigation](https://learn.microsoft.com/en-us/dotnet/maui/fundamentals/shell/navigation?view=net-maui-10.0) and [page presentation modes](https://learn.microsoft.com/en-us/dotnet/maui/fundamentals/shell/pages?view=net-maui-10.0). Do not mix two independent navigation owners for the same page tree.

## Start with a registered route

```cs
// Startup registration; using Prism.Ioc;
container.RegisterForNavigation<HomePage, HomePageViewModel>();
container.RegisterForNavigation<DetailsPage, DetailsPageViewModel>();

// Startup callback on PrismAppBuilder.
prism.CreateWindow("/NavigationPage/HomePage");
```

Inject `INavigationService` into `HomePageViewModel`, then await `NavigateAsync("DetailsPage")` from a command. Inspect the returned `INavigationResult`; a rejected confirmation is a cancelled request, not a successful transition.

## Learning path

1. [Page navigation](page-navigation.md): scope, parameters, back navigation, and stack ownership
2. [Navigation Builder](navigation-builder.md): compose routes and view-model-based segments
3. [Tabbed navigation](tabbed-navigation.md) and [PrismNavigationPage](prismnavigationpage.md)
4. [XAML navigation](xaml-navigation.md) for simple view-owned actions
5. [Results](navigation-result.md), [exceptions](navigation-exceptions.md), and [global observation](global-navigation-observer.md)
6. [Region navigation](../../../navigation/regions/index.md) for composition inside pages

[Current page-navigation contract](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Navigation/INavigationService.cs).

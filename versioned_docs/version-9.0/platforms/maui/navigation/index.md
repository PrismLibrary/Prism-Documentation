---
sidebar_position: 1
description: "Choose page or region navigation and register routes for a Prism 9.0 MAUI application."
---

# Getting Started

Prism.Maui has two navigation models. Choose the one that owns the UI you want to change:

- **Page navigation**, through `Prism.Navigation.INavigationService`, constructs pages and updates the calling page's navigation/window stack. It supports navigation pages, modal routes, flyout detail, and tabbed pages.
- **Region navigation**, through `Prism.Navigation.Regions.IRegionManager`, composes views inside named regions. It uses region navigation contracts and a region context, not the page-navigation stack.

The two can coexist: a page can contain regions, while the page navigation service owns the surrounding page. A region view should use the region APIs for its region and only use a page navigation service when it has the correct owning-page context.

## Comparison

### Supported Navigation Types

Prism supports page navigation and region navigation in MAUI. Shell navigation remains a separate MAUI system.

### Shell vs Prism - What's Supported

Prism supports modal/non-modal page navigation, dynamically constructed page hierarchies, view-model injection, and navigation lifecycle interfaces. These are capabilities of Prism, not a feature matrix for Shell.

## What about MAUI Shell?

Prism page navigation does not support MAUI Shell. Remove the template's Shell startup when configuring Prism. Use `NavigationPage`, `TabbedPage`, or `FlyoutPage` as appropriate and let Prism construct the page hierarchy from registered routes.

This is an integration boundary, not a claim that Shell lacks modal navigation or dependency injection. For comparison, Microsoft's current documentation describes Shell's [navigation](https://learn.microsoft.com/en-us/dotnet/maui/fundamentals/shell/navigation) and [page presentation modes](https://learn.microsoft.com/en-us/dotnet/maui/fundamentals/shell/pages?view=net-maui-10.0). These comparison links follow current MAUI; the Prism 9.0 contract is pinned below. Do not mix two independent navigation owners for the same page tree.

### FAQ

- Shell routes and Prism page-registration names belong to different navigation systems; they are not interchangeable.
- Use [TabbedPage](tabbed-navigation.md) for Prism-managed tabs.
- Register each page by name, then compose a URI from those names. You do not need to register every complete path.

## Start with a registered route

```cs
// Startup registration; using Prism.Ioc;
container.RegisterForNavigation<HomePage, HomePageViewModel>();
container.RegisterForNavigation<DetailsPage, DetailsPageViewModel>();

// Startup callback on PrismAppBuilder.
prism.CreateWindow("/NavigationPage/HomePage");
```

Inject `INavigationService` into `HomePageViewModel`, then await `NavigateAsync("DetailsPage")` from a command. Inspect the returned `INavigationResult`; a rejected confirmation is a cancelled request, not a successful transition.

## Next Steps

1. [Page navigation](page-navigation.md): scope, parameters, back navigation, and stack ownership
2. [Navigation Builder](navigation-builder.md): compose routes and view-model-based segments
3. [Tabbed navigation](tabbed-navigation.md) and [PrismNavigationPage](prismnavigationpage.md)
4. [XAML navigation](xaml-navigation.md) for simple view-owned actions
5. [Results](navigation-result.md), [exceptions](navigation-exceptions.md), and [global observation](global-navigation-observer.md)
6. [Region navigation](../../../navigation/regions/index.md) for composition inside pages

[Prism 9.0 page-navigation contract](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Navigation/INavigationService.cs).

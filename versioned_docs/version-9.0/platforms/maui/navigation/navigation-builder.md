---
sidebar_position: 3
description: "Compose Prism 9.0 MAUI routes, parameters, navigation-page stacks, and tabs with NavigationBuilder."
---

# Navigation Builder

The builder composes a MAUI page-navigation request from segments and parameters. Create a fresh builder from the page's injected `INavigationService` for each operation. It does not replace page registration, and it is not a service to inject or keep as a singleton.

## Getting the NavigationBuilder

```cs
using Prism.Navigation;

var result = await navigationService.CreateBuilder()
    .AddSegment("DetailsPage", segment => segment.AddParameter("id", 42))
    .NavigateAsync();
```

## Building the NavigationURI

Segments appear in the order they are added. Register the page routes before building the request.

### ViewModel First Navigation

Register both types so the builder can look up the navigation key:

```cs
container.RegisterForNavigation<DetailsPage, DetailsPageViewModel>();
```

Then compose the route without repeating its string name:

```cs
var result = await navigationService.CreateBuilder()
    .AddSegment<DetailsPageViewModel>()
    .NavigateAsync();
```

The generic argument is a view model, not a page. Keep mappings unambiguous; registering several routes for the same view model requires a deliberate route-selection strategy. A string segment remains useful when you need to choose a particular registration name.

### Navigation Pages

```cs
var result = await navigationService.CreateBuilder()
    .UseAbsoluteNavigation()
    .AddNavigationPage()
    .AddSegment<HomePageViewModel>()
    .NavigateAsync();
```

### Relative or Absolute Navigation

By default the builder produces a relative route. `UseAbsoluteNavigation()` resets the relevant window root; `UseRelativeNavigation()` selects the relative form. A boolean overload is available when this is decided at runtime.

`AddNavigationPage()` looks up registered `NavigationPage` types. In Prism 9.0 it chooses the last matching registration. If you register more than one navigation-page route, use `AddSegment("YourNavigationPageRoute")` to make the choice explicit. Prism supplies the `NavigationPage` route when that name is not already registered.

### Modal navigation

```cs
var result = await navigationService.CreateBuilder()
    .AddNavigationPage(segment => segment.UseModalNavigation())
    .AddSegment<DetailsPageViewModel>()
    .NavigateAsync();
```

Modal navigation is a segment option; it is not implied by using the builder. The requested hierarchy must still be valid for the calling page's context.

### Adding URI Parameters

Use a segment callback, such as `segment.AddParameter("id", 42)`, to serialize a value into that segment's URI. The string form `AddSegment("DetailsPage?id=42")` is also supported.

### Adding Navigation Parameters

```cs
var parameters = new NavigationParameters { { "customer", customer } };

var result = await navigationService.CreateBuilder()
    .AddSegment("DetailsPage", segment => segment.AddParameter("id", 42))
    .AddParameter("source", "search")
    .WithParameters(parameters)
    .NavigateAsync();
```

Segment parameters are serialized into that segment's URI and apply to that page. Request parameters apply across the navigation and can carry objects. Avoid secrets in URI parameters; route strings may appear in diagnostics.

### Tabbed Pages

```cs
var result = await navigationService.CreateBuilder()
    .UseAbsoluteNavigation()
    .AddTabbedSegment(tabs => tabs
        .CreateTab("HomePage")
        .CreateTab(tab => tab
            .AddNavigationPage()
            .AddSegment<OrdersPageViewModel>())
        .SelectedTab("NavigationPage|OrdersPage"))
    .NavigateAsync();
```

Register all pages and view-model pairs first. A navigation-page tab can contain multiple registered pages in 9.0; the old beta note describing tab deep links as unavailable no longer applies. Prefer the root page's registration name when selecting a navigation-page tab. See [tabbed navigation](tabbed-navigation.md) for 9.0 selection and initialization details.

## Navigating

Prefer `NavigateAsync()` and inspect the [navigation result](navigation-result.md). Callback overloads are also available:

```cs
await builder.NavigateAsync(
    () => System.Diagnostics.Debug.WriteLine("Navigation succeeded."),
    error => System.Diagnostics.Debug.WriteLine(error));
```

`Navigate()` and its callback overloads are fire-and-forget `async void` entry points. They do not give the caller an awaitable completion or result. Use them only when that tradeoff is intentional; awaiting makes sequencing, error handling, and testing clearer.

## Source reference

- [Builder extensions and route lookup](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Navigation/Builder/NavigationBuilderExtensions.cs)
- [Tab segment construction](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Navigation/Builder/CreateTabBuilder.cs)
- [Navigation service tab construction](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Navigation/PageNavigationService.cs)

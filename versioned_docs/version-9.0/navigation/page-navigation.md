---
sidebar_position: 3
---

# Page Navigation

Prism's page navigation service is available in .NET MAUI. It resolves registered pages, manages navigation and modal stacks, passes parameters and invokes page lifecycle interfaces. WPF and Uno Platform use [region navigation](regions/index.md) for Prism-managed view navigation.

## Choose the correct service

| Change | Service | Destination registration |
| --- | --- | --- |
| Show a new MAUI page or change a page stack | `Prism.Navigation.INavigationService` | `RegisterForNavigation<TPage, TViewModel>()` |
| Replace content within a named region | `Prism.Navigation.Regions.IRegionManager` | MAUI: `RegisterForRegionNavigation<TView, TViewModel>()`; other platforms: `RegisterForNavigation<TView, TViewModel>()` |

For example, a MAUI customer page can contain a region that switches between a summary and an editor. Going back from the page uses page navigation; switching panels or traversing their journal uses region navigation. A region journal does not pop the page stack.

## MAUI learning path

1. [Register pages and navigate](../platforms/maui/navigation/page-navigation.md).
2. Understand [navigation results](../platforms/maui/navigation/navigation-result.md) and [exceptions](../platforms/maui/navigation/navigation-exceptions.md).
3. Use the [navigation builder](../platforms/maui/navigation/navigation-builder.md) or [XAML navigation](../platforms/maui/navigation/xaml-navigation.md) for your preferred calling style.
4. Add [tabbed navigation](../platforms/maui/navigation/tabbed-navigation.md) and [page lifecycle handling](../platforms/maui/appmodel/pagelifecycleaware.md) as needed.

Inject the page's `INavigationService` into its view model so it uses the appropriate page scope. Do not cache it in a global singleton to navigate unrelated pages or windows.

Source (Prism 9.0.537): [MAUI page service contract](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Navigation/INavigationService.cs), [MAUI region registrations](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Ioc/RegionNavigationRegistrationExtensions.cs).

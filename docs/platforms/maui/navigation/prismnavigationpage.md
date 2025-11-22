---
sidebar_position: 9
uid: Platforms.Maui.Navigation.PrismNavigationPage
---

# PrismNavigationPage

The NavigationPage is a unique element in .NET MAUI as it is the single Page that is capable of independently Popping Pages off of the Navigation Stack thus bypassing the NavigationService. In Prism.Maui we have made it easier to ensure that the NavigationService is used to navigate between Pages.

## Automatic Registration

By Default the `PrismAppBuilder` will register the `PrismNavigationPage` with the navigation key `NavigationPage` if you do not register a NavigationPage. Keep in mind that it will NOT be available if you have registered any NavigationPages.

## What does it do?

By default the PrismNavigationPage will intercept the request to Pop the CurrentPage and cancel the request. It will then retrieve the NavigationService for the CurrentPage, and call the NavigationService's `GoBackAsync` method. As a result the Navigation Events will occur as you would expect honoring things like Prism's `IConfirmNavigation` rather than being reactionary.

## Why do we need it?

The `PrismNavigationPage` was added because there is simply no way with a Behavior that we could hook in and get access to be able to cancel the back navigation event. Without the PrismNavigationPage your app will be reactionary to the user pressing the back button which means they may navigate away before you have a chance to save state.


---
sidebar_position: 1
---

# IPageLifecycleAware

`Prism.AppModel.IPageLifecycleAware` receives MAUI page appearing/disappearing notifications. Prism attaches `PageLifeCycleAwareBehavior` to pages created through its navigation flow. That behavior invokes matching interfaces on the page, its binding context, and its tracked child-region views/view models.

```cs
using Prism.AppModel;
using Prism.Mvvm;

public class DetailsPageViewModel : BindableBase, IPageLifecycleAware
{
    private bool _isVisible;
    public bool IsVisible
    {
        get => _isVisible;
        private set => SetProperty(ref _isVisible, value);
    }

    public void OnAppearing() => IsVisible = true;
    public void OnDisappearing() => IsVisible = false;
}
```

These methods are synchronous and can run repeatedly during a page's lifetime. Keep them short. For asynchronous refreshes, use an owned task/command with cancellation and error handling rather than an unobserved `async void` lifecycle method.

## Choose the correct lifecycle

- Use `IInitialize` / `IInitializeAsync` to consume page-navigation initialization parameters.
- Use `INavigationAware` / `INavigatedAware` for page navigation notifications and `IConfirmNavigation` / `IConfirmNavigationAsync` to allow or reject navigation.
- Use `IPageLifecycleAware` for visibility-related work such as starting/stopping a UI refresh.
- Use `IDestructible` for final page/view-model cleanup when Prism removes the page. A disappearing page can remain on a navigation stack or inactive tab.
- Use MAUI's [application/window lifecycle](https://learn.microsoft.com/en-us/dotnet/maui/fundamentals/app-lifecycle?view=net-maui-10.0) for application activation, stopping, resuming, and native window destruction.

Do not equate `OnDisappearing` with scope disposal or user approval to leave an editor. Modal overlays, tab changes, and native platform behavior can affect visibility independently of the navigation decision.

Prism's removal path destroys child pages/regions and invokes destruction callbacks. Some visual cleanup is deferred to avoid disrupting transition animations. Avoid depending on immediate clearing of bindings or behaviors after a pop. Page scopes belong to pages; view models and services with longer lifetimes must not retain removed pages or their navigation services.

## Source reference

- [Page lifecycle behavior](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Behaviors/PageLifeCycleAwareBehavior.cs)
- [View/view-model propagation and destruction](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Common/MvvmHelpers.cs)
- [Page scope behavior](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Behaviors/PageScopeBehavior.cs)

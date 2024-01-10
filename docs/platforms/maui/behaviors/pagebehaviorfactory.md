---
uid: Platforms.Maui.Behaviors.PageBehaviorFactory
---

# PageBehaviorFactory

For those coming from Prism.Forms who may have had some previous knowledge of the PageBehaviorFactory, this has been completely re-imagined for Prism.Maui. You can no longer override Prism's Page Behaviors, however it is extremely easy to apply any Behavior to pages in your application and get full Dependency Injection support along the way.

## Applying behaviors from the Container

Registering a Behavior to be applied to every page the Navigation Service creates is extremely easy as we provide a new `RegisterPageBehavior` method on the `IContainerRegistry` and we have duplicated these extensions on the `IServiceCollection` as well so you can add these regardless of which context you are in while registering your services.

```cs
private void RegisterTypes(IContainerRegistry container)
{
    container.RegisterPageBehavior<MyBehavior>();
}

private void ConfigureServices(IServiceCollection services)
{
    services.RegisterPageBehavior<MyBehavior>();
}
```

Sometimes though you may want to provide some limits around what pages that your Behavior will be added to. For instance you may want a specific behavior applied only to a NavigationPage but not a ContentPage. In this case you can use the overload for the RegisterPageBehavior method like:

```cs
private void RegisterTypes(IContainerRegistry container)
{
    container.RegisterPageBehavior<NavigationPage, MyBehavior>();
}

private void ConfigureServices(IServiceCollection services)
{
    services.RegisterPageBehavior<NavigationPage, MyBehavior>();
}
```
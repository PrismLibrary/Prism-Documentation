---
sidebar_position: 4
uid: Platforms.Maui.Behaviors.PageBehaviorFactory
---

# Page Behavior Factory

Register page behaviors to add them to pages created by Prism navigation. The factory resolves each behavior through the page's container context, so constructor injection is available. It supplements Prism's built-in page behaviors; it is not an instruction to remove the scope, lifecycle, or cleanup behaviors Prism needs.

## Apply to every Prism-created page

```cs
using Prism.Ioc;

prism.RegisterTypes(container =>
{
    container.RegisterPageBehavior<PageTraceBehavior>();
});
```

`PageTraceBehavior` can derive from `BehaviorBase<Page>` as shown in [BehaviorBase](behaviorbase.md). Each page receives its own resolved behavior instance.

The `IServiceCollection` equivalent is also available:

```cs
prism.ConfigureServices(services =>
{
    services.RegisterPageBehavior<PageTraceBehavior>();
});
```

Choose one registration path for a behavior to avoid adding it twice.

## Restrict to a page type

```cs
container.RegisterPageBehavior<NavigationPage, NavigationTraceBehavior>();
```

The generic filter matches that page type and its subclasses. Ensure `NavigationTraceBehavior` can attach to that type, for example by deriving from `BehaviorBase<NavigationPage>`. The same two-type overload exists on `IServiceCollection`.

## Configure through a delegate

```cs
container.RegisterPageBehaviorFactory((provider, page) =>
{
    if (page is ContentPage)
        page.Behaviors.Add(provider.Resolve<PageTraceBehavior>());
});
```

Register `PageTraceBehavior` explicitly when using this delegate form. Use a fresh instance per page, detach subscriptions in `OnDetachingFrom`, and do not retain the page in a singleton. Pages manually created outside Prism's navigation flow do not automatically receive these registered behaviors.

[Registration overloads and factory lifetimes](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Ioc/BehaviorFactoryRegistrationExtensions.cs).

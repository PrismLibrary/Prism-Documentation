---
sidebar_position: 3
uid: DependencyInjection.Supplement
---

# Dependency Injection - Supplement

As you may already realize, Dependency Injection is a first class citizen in .NET MAUI. As you might expect from a Microsoft product, they have adopted the Microsoft.Extensions.DependencyInjection package. Prism however going back to Prism 7.0 continues to rely on the Prism Ioc Abstractions for the `IContainerRegistry` and `IContainerProvider`.

## IServiceCollection Extensions

Despite the fact that you may want to use a container other than Microsoft.Extensions.DependencyInjection, there are many times in which you may want to leverage the registration extensions that are provided by packages that use Microsoft.Extensions.DependencyInjection. In Prism 9.0 we have added a core reference to the Microsoft.Extensions.DependencyInjection.Abstractions allowing us to ensure that all container implementations can support these extensions natively.

## F.A.Q.

Q. Is it EntityFrameworkCore or the Microsoft.Extensions.Http HttpClientFactory, or the Microsoft..... supported?
A. Short answer is maybe. These extension may work just fine, may need some tweaking, or you may want to go to GitHub, copy the Registration Extension and alter it to work for you in your project. Remember that the extensions written for registering these services were built around developers developing for AspNetCore. This is a very different environment than the one that we are building for. In some cases such as Entity Framework Core you may find that you need to change the default Lifetime of the Service. For example EntityFrameworkCore will register your DbContext as a Scoped Service. This make perfect sense in a WebApi, however if you are building a Blazor Application you may find yourself hitting several errors because various components are trying to use the same instance of the DbContext at the same time. You may find yourself hitting the same exact issue if you are using Prism Regions in which case you would need to change the default lifetime to Transient. Each library that you're trying to pull in built around Microsoft.Extensions.DependencyInjection may or may not have quirks that show up because they weren't originally built with the understanding of running in a Mobile app.

Q. What is a Scoped Service? What does it mean in a Prism.Maui app?
A. Scoped Services can be a bit of an advanced topic. In short, they provide you a middle ground between a Transient and a Singleton in which a Service resolve multiple instances throughout the lifecycle of the application, while providing the same exact instance to dependencies within the Scope. For the context of a Prism.Maui application, Scoped Services resolve the same instance of services such as the INavigationService within the scope of a given Page. This means that whether the INavigationService is injected into the Page itself, the ViewModel, some service you have a dependency on, or even the ViewModel of a Region dynamically created later during the Page's lifecycle, you will always be able to access the same instance of the INavigationService. However as the scope of the next page is different, the instance of the INavigationService will be different. You can utilize scoped services within your application in the same way.

## Further Reading

If you have additional questions about Dependency Injection, please be sure to check out the full Dependency Injection Topic

- [Dependency Injection](../dependency-injection/)


# Dependency Injection - Supplement

As you may already realize, Dependency Injection is a first class citizen in .NET MAUI. As you might expect from a Microsoft product, they have adopted the Microsoft.Extensions.DependencyInjection package. Prism however going back to Prism 7.0 continues to rely on the Prism Ioc Abstractions for the `IContainerRegistry` and `IContainerProvider`. We continue to rely on these abstractions for 2 primary reasons:

1) As you might guess it provides consistency across all Prism platforms
2) Microsoft.Extensions.DependencyInjection cannot be supported by Prism

## Why Prism does NOT support Microsoft.Extensions.DependencyInjection

We often get questions as to why Prism does not support Microsoft.Extensions.DependencyInjection. The simple truth is that there are some core design decisions that the team at Microsoft made which makes a certain degree of sense for AspNetCore applications. The decisions they made however do not make as much sense for Desktop and Mobile Applications which are not running one instance for potentially thousands or even millions of users. In the case of Desktop and Mobile Applications we are working with the context of a single user and we may have very important decisions we want to make about when we want to bring things in dynamically. 

From a DI Container perspective, the Microsoft.Extensions.DependencyInjection implementation is referred to as an Immutable DI Container. This means that services are registered, and once the container is built and we've resolved a service, we can no longer update (mutate) the service registrations that the container has. This is perhaps one of the single biggest issues that prevents Prism from adopting Microsoft.Extensions.DependencyInjection.

Other concerns that we have

## A Single Container to Rule them All

While Prism cannot itself run on Microsoft.Extensions.DependencyInjection, Prism does work transparently with Microsoft.Extensions.DependencyInjection. This means that regardless of whether you register a service with Prism's IContainerRegistry or Microsoft's IServiceCollection, whether you are using the IServiceProvider from the MauiApp or using the DI from Prism to inject your dependencies, you will always be able to access all of the same exact services. We can do this because as Prism hooks into .NET MAUI we provide a special delegate that allows Prism to get notified when the IServiceCollection has been built, and then allows us to return an IServiceProvider to .NET MAUI that it will be able to use internally.

### IServiceCollection Extensions

While there isn't likely to be a Prism.MsftDI.Maui project anytime soon, the good news is that we can absolutely support service registration. We can do this because as previous mentioned we get notified by .NET MAUI when the IServiceCollection is completed. We have tried to duplicate any extensions you might find for the `IContainerRegistry` such as registering views for Page or Region navigation so that you can use these wherever you might need to.

## F.A.Q.

Q. Is it EntityFrameworkCore or the Microsoft.Extensions.Http HttpClientFactory, or the Microsoft..... supported?
A. Short answer is maybe. These extension may work just fine, may need some tweaking, or you may want to go to GitHub, copy the Registration Extension and alter it to work for you in your project. Remember that the extensions written for registering these services were built around developers developing for AspNetCore. This is a very different environment than the one that we are building for. In some cases such as Entity Framework Core you may find that you need to change the default Lifetime of the Service. For example EntityFrameworkCore will register your DbContext as a Scoped Service. This make perfect sense in a WebApi, however if you are building a Blazor Application you may find yourself hitting several errors because various components are trying to use the same instance of the DbContext at the same time. You may find yourself hitting the same exact issue if you are using Prism Regions in which case you would need to change the default lifetime to Transient. Each library that you're trying to pull in built around Microsoft.Extensions.DependencyInjection may or may not have quirks that show up because they weren't originally built with the understanding of running in a Mobile app.

Q. What is a Scoped Service? What does it mean in a Prism.Maui app?
A. Scoped Services can be a bit of an advanced topic. In short, they provide you a middle ground between a Transient and a Singleton in which a Service resolve multiple instances throughout the lifecycle of the application, while providing the same exact instance to dependencies within the Scope. For the context of a Prism.Maui application, Scoped Services resolve the same instance of services such as the INavigationService within the scope of a given Page. This means that whether the INavigationService is injected into the Page itself, the ViewModel, some service you have a dependency on, or even the ViewModel of a Region dynamically created later during the Page's lifecycle, you will always be able to access the same instance of the INavigationService. However as the scope of the next page is different, the instance of the INavigationService will be different. You can utilize scoped services within your application in the same way.

## Further Reading

If you have additional questions about Dependency Injection, please be sure to check out the full Dependency Injection Topic

- [Dependency Injection](../dependency-injection/index.md)
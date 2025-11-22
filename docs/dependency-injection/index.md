---
sidebar_position: 1
uid: DependencyInjection.GettingStarted
---

# Dependency Injection with Prism

Prism has always been built around Dependency Injection. This helps you to architect apps that are maintainable and testable and help you reduce or eliminate your dependence on Static and circular references. Prior to Prism 7, dependency injection with Prism was focused around various containers that were implemented for use with Prism. This led to a number of issues including that while docs may have been written showing you how to do something with one container they did not necessarily reflect the appropriate API to use for the container that you were using for your application.

Prism 7 introduced several new interfaces for abstracting what Prism requires for dependency injection. This has several benefits as you might imagine including:

- Docs showing how to do something in Prism will always show you what you need to do without any concern for which dependency injection container you are using.
- This greatly simplified what needed to be added to any container specific package. In the case of Prism.Forms this reduces each container specific project 3 classes: `PrismApplication`, an implementation of `IContainerExtension` and an extension class to retrieve the underlying container should you feel the need to access it for one of it's API's that is not implemented by Prism.

In Prism 9, the Prism Ioc layer has been removed from the Prism.Core and now ships independently from Prism. This makes it easier for us to share the container implementation across all supported Prism platforms (WPF, Uno Platform, .NET MAUI, etc). Additional work has been done in Prism 9 to also give the containers better integration with Microsoft.Extensions.DependencyInjection and provide better support for Container Scoping scenarios some of which are used extensively by Prism.Maui.

## Using Microsoft's IServiceCollection

Prism 9.0 has separated the Container implementations from the main Prism repo. This allows us to ship and to share the containers across all platforms without any specific code coupling to the Prism.Core. In the updated Prism 9.0 implementations support has been added for Microsoft's IServiceCollection. This helps Prism better support .NET MAUI applications and the IHostBuilder approach used by the Uno.Extensions. It is important to consider that when using Registration Extensions from various Microsoft libraries, these will have been tailored to use for Web Applications. For example if using EntityFrameworkCore the default Lifetime of the DbContext will be set to Scoped. For most Prism applications you will likely want to set this to be Transient as a Singleton could cause DbAccess issues if different ViewModels or Services are accessing the database at the same time. Be sure to spend some time evaluating any prebuilt extension methods for registering services so that you can be sure that the service will have an appropriate lifetime for your application.

## Containers

The Prism team ships several DI container implementations for the Prism IoC abstractions. 

| Container | Availability | Notes |
|:---------:|:------------:|:-----:|
| DryIoc | NuGet.org | Supported across all targets |
| Grace | Commercial Plus | |
| Microsoft | Commercial Plus | |
| Unity | NuGet.org | Legacy support for WPF only |

:::note
While the DryIoc and Unity Container's are available on NuGet.org they are still subject to the Prism License. You should have a valid license for Prism.
:::

## Next Steps

- Learn how to [Register Services](xref:DependencyInjection.RegisterServices)
- Learn how to [Register Platform Specific Services](xref:DependencyInjection.IPlatformInitializer) ***(Legacy)***
- [Microsoft.Extensions.DependencyInjection (Supplement)](xref:DependencyInjection.Supplement)
<!-- - Learn how to [Add a Custom Container](xref:DependencyInjection.AddCustomContainer) -->
- Learn more about the Prism Container Extensions and working with Shiny in the [Appendix](xref:DependencyInjection.Appendix)


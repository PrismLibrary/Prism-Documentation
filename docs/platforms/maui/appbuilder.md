---
uid: Platforms.Maui.AppBuilder
---

# App Builder

.NET MAUI adopts a pattern that we see commonly throughout modern .NET Applications with a Builder Pattern. Prism.Maui adopts this as part of the natural pattern for MAUI Developers by first exposing an extension method on the `MauiAppBuilder`. To get started we simply need to include `UsePrism` after the `UseMauiApp` call on the `MauiAppBuilder`.

```cs
var builder = MauiApp.CreateBuilder();

// Default MAUI Applications
builder.UseMauiApp<App>();

// Include UsePrism after UseMauiApp
builder.UseMauiApp<App>()
builder.UsePrism(prism =>
{
    // configure prism
});
```

## Configuring Prism

The `UsePrism` method expects a delegate that will configure the startup for Prism applications. This includes registering services, adding modules, and various other common tasks. While we have tried to keep this as simple as possible, we have also tried to provide a number of overloads to make it easier to get started for developers who may have different requirements as you will see as we go into depth into the `PrismAppBuilder`.

> [!NOTE]
> In the Prism Templates we use a static `PrismStartup` class. The class is no way required. This is provided out of the box for convenience as many medium to large apps may have hundreds of lines of code simply to register base services. We find that smaller/focused files are easier for many developers to maintain. By moving the configuration of Prism to another file we can more easily focus on thew lines that build the pipeline for the MauiApplicationBuilder.

### Registering Services with Prism's IContainerRegistry

If you are coming to Prism.Maui from Prism.Forms, Prism.Wpf, or Prism.Uno you may be familiar with the RegisterTypes on the PrismApplication. In Prism.Maui this has moved to the `PrismAppBuilder`.

```cs
var builder = MauiApp.CreateBuilder();
builder.UseMauiApp<App>()
builder.UsePrism(prism =>
{
    prism.RegisterTypes(container => {
        // Register platform agnostic types
    });
}
```

#### Platform Specific Registrations

MAUI Single Project eliminates the need for the goofy IPlatformInitializer that was required for Prism.Forms. Registering Platform Specific services is as simple as including a compiler directive in your project.

```cs
prism.RegisterTypes(container =>
{
#if IOS
    container.Register<IFoo, iOSFoo>();
#elif ANDROID
    container.Register<IFoo, AndroidFoo>();
#elif WINDOWS
    container.Register<IFoo, WindowsFoo>();
#elif MACCATALYST
    container.Register<IFoo, MacCatalystFoo>();
#elif TIZEN
    container.Register<IFoo, TizenFoo>();
#endif
});
```

For larger projects where you may have a larger number of platform specific registrations you may instead want to simply write an extension method in your platform specific code. In this case let's say that the project name is `MyAwesomeProject` and you want to register your services with an extension method. You would start by creating a static class in each platform specific folder which has the namespace `MyAwesomeProject` so that you can reference without any compiler directives for namespace usings.

```cs
public static class PlatformRegistrations
{
    public static void RegisterPlatformTypes(IContainerRegistry container)
    {
        container.Register<IFoo, iOSFoo>();
    }
}
```

With this we can now simply update our our code like:

```cs
var builder = MauiApp.CreateBuilder();
builder.UseMauiApp<App>()
builder.UsePrism(prism =>
{
    prism.RegisterTypes(PlatformRegistrations.RegisterPlatformTypes)
        .RegisterTypes(container => {
            // Register platform agnostic types
        });
}
```

### IServiceCollection Support

While the `MauiAppBuilder` does expose the `IServicesCollection` through the `Services` property, it does not have an easy to use extension for registering services. To help make it even easier on developers using Prism, we have exposed an extension method on the `PrismAppBuilder` to give you the ability to easily register services with either `IContainerRegistry` or `IServiceCollection` on an as needed basis. As discussed in the [Dependency Injection](dependencyinjection.md) topic, we do expose several additional extensions on the `IServiceCollection` to make it even easier on you to ensure you can register what you need to with Prism even when you're using the `IServiceCollection`.

> [!NOTE]
> It's important to remember that if you register a service with the `IServiceCollection` it will not be available from the `IContainerRegistry`. As a result if you call the `IsRegistered<T>` method on the `IContainerRegistry` it will return `false`.

```cs
var builder = MauiApp.CreateBuilder();
builder.UseMauiApp<App>()
builder.UsePrism(prism => {
    prism.ConfigureServices(services => {
        // Register services with the IServiceCollection
        services.AddSingleton<IFoo, Foo>();
    });
});
```

### Logging Support

Similar to the `ConfigureServices` overload which is provided as a convenience method, the `ConfigureLogging` method is also provided as a convenience method. This method allows you to easily configure the logging for your application using the Microsoft `ILoggingBuilder`. It is important to note that this is provided through the `MauiAppBuilder`, and Prism does not make use of the `ILogger` anywhere internally.

```cs
var builder = MauiApp.CreateBuilder();
builder.UseMauiApp<App>()
builder.UsePrism(prism => {
    prism.ConfigureLogging(builder => {
        builder.AddConsole();
    });
});
```

### OnInitialized

While .NET MAUI does actually provide an interface that you can register to handle registration logic, something that 3rd parties like Prism or ShinyLib both utilize, it may be overkill for you. Prism provides 2 easy to use overloads for the `OnInitialized` method. You can use either of these methods to do any initializations.

```cs
var builder = MauiApp.CreateBuilder();
builder.UseMauiApp<App>()
builder.UsePrism(prism =>
{
    prism.OnInitialized(container =>
    {
        // resolve services and do other initialization
    })
    .OnInitialized(() => {
        // do some initialization that doesn't require resolving services
    });
}
```

### Configuring the Module Catalog

For those coming from other platforms you may be used to adding your Modules to the ModuleCatalog in the `PrismApplication`. The `PrismAppBuilder` also provides an easy to use method for adding modules to the ModuleCatalog.

```cs
var builder = MauiApp.CreateBuilder();
builder.UseMauiApp<App>()
builder.UsePrism(prism => {
    prism.ConfigureModuleCatalog(moduleCatalog => {
        moduleCatalog.AddModule<ModuleA>();
        moduleCatalog.AddModule<ModuleB>();
    });
});
```

### OnAppStart

This is an entirely new concept unique to Prism.Maui. The OnAppStart method is one of the most important methods on the `PrismAppBuilder` as it is used as your starting point to set the initial Navigation Event for Prism. We provide a number of overloads here to make it easier for you whether you want to operate within an Async or Synchronous context. We also provide overloads that let you access the container to resolve services you may need such as the `ILogger` to Log a Navigation Exception that was encountered. Additionally if you want to keep things as simple as possible we even have an overload to let you only pass in a Navigation URI.

```cs
var builder = MauiApp.CreateBuilder();
builder.UseMauiApp<App>()

// Bare Bones
builder.UsePrism(prism => {
    // Register Types excluded for brevity
    prism.OnAppStart("/MainPage");
});

// Bare Bones with Exception Handler
builder.UsePrism(prism => {
    // Register Types excluded for brevity
    prism.OnAppStart("/MainPage", exception => Console.WriteLine(exception));
});

// Use the NavigationService
builder.UsePrism(prism => {
    // Register Types excluded for brevity
    prism.OnAppStart(navigation => navigation.NavigateAsync("/MainPage"));
});

// Use the NavigationService & Container
builder.UsePrism(prism => {
    // Register Types excluded for brevity
    prism.OnAppStart(async (container, navigation) => {
        var result =  await navigation.NavigateAsync("/MainPage");
        if(!result.Success)
        {
            var logger = container.Resolve<ILogger<MauiProgram>>();
            logger.Log(result.Exception);
        }
    });
});
```

---
sidebar_position: 3
description: "Configure Prism 9.0 MAUI registrations, logging, module initialization, and the initial navigation window."
---

# App Builder

Prism configures MAUI through `MauiAppBuilder.UsePrism`. Call it once, after `UseMauiApp<App>()`, and finish with `Build()`. Your application remains a `Microsoft.Maui.Controls.Application`; Prism registers the container integration, navigation services, and window creator.

## Configuring Prism

### Choose the startup overload

`Prism.Maui` exposes the container-instance overload in namespace `Prism`:

```cs
using Microsoft.Maui.Hosting;
using Prism;
using Prism.Ioc;

public static MauiApp BuildApp(IContainerExtension container)
{
    return MauiApp.CreateBuilder()
        .UseMauiApp<App>()
        .UsePrism(container, prism => prism
            .RegisterTypes(registry =>
                registry.RegisterForNavigation<MainPage, MainPageViewModel>())
            .CreateWindow("/NavigationPage/MainPage"))
        .Build();
}
```

Supply a configured container compatible with your packages. `Prism.DryIoc.Maui` supplies `UsePrism(Action<PrismAppBuilder>)` and a DryIoc-rules overload in the `Microsoft.Maui` namespace; the [getting-started example](index.md) uses that convenience API.

A helper class called `PrismStartup` is an organizational choice, not a required base class.

### Registering Services with Prism's IContainerRegistry

Use `RegisterTypes` for Prism registrations. Explicit view/view-model pairs make route ownership clear:

```cs
prism.RegisterTypes(container =>
{
    container.RegisterSingleton<ICustomerStore, CustomerStore>();
    container.RegisterForNavigation<MainPage, MainPageViewModel>();
    container.RegisterForNavigation<CustomerPage, CustomerPageViewModel>();
});
```

#### Platform Specific Registrations

MAUI's single-project layout supports platform-specific code and compile conditions:

```cs
prism.RegisterTypes(container =>
{
#if ANDROID
    container.Register<IDeviceIntegration, AndroidDeviceIntegration>();
#elif IOS
    container.Register<IDeviceIntegration, IosDeviceIntegration>();
#elif WINDOWS
    container.Register<IDeviceIntegration, WindowsDeviceIntegration>();
#endif
});
```

These service types are application-defined. Alternatively, put the same static registration method in each selected platform folder and call it from the shared startup code. Only add branches for targets your actual Prism package and project support.

### IServiceCollection Support

Use `ConfigureServices` when an integration expects `IServiceCollection`:

```cs
using Microsoft.Extensions.DependencyInjection;

prism.ConfigureServices(services =>
{
    services.AddSingleton<ReportCache>();
});
```

This delegates to `MauiAppBuilder.Services`. Configure services on this collection before `Build()` and let Prism's configured provider integrate them with the application. Do not create a second provider with `BuildServiceProvider()`. An `IsRegistered` check during configuration is not a reliable description of the final built container. See the [IServiceCollection supplement](../../dependency-injection/servicecollection-supplement.md) for the integration details.

Page navigation uses scoped services. Inject `INavigationService` into the page's view model rather than capturing one in an application singleton. Region-manager scopes, page scopes, and application singletons have different purposes; see [page navigation](navigation/page-navigation.md) and the [container guide](../../dependency-injection/index.md).

### Logging Support

`ConfigureLogging` delegates to MAUI's `ILoggingBuilder`:

```cs
using Microsoft.Extensions.Logging;

prism.ConfigureLogging(logging => logging.SetMinimumLevel(LogLevel.Information));
```

Configure an appropriate logging provider through MAUI or your chosen integration. Prism 9.0 MAUI uses `ILogger` internally, including initialization and navigation diagnostics. Do not depend on the old claim that Prism never logs. Review your providers and filters before recording navigation URIs, parameters, or exception content that may contain private application data.

### Configuring the Module Catalog

```cs
using Prism.Modularity;

prism.ConfigureModuleCatalog(catalog =>
{
    catalog.AddModule<CustomersModule>();
});

prism.OnInitialized(container =>
{
    // Synchronous app setup. Module initialization has not run yet in 9.0.
});
```

### OnInitialized

Prism 9.0 performs these stages once:

1. Execute registered `OnInitialized` delegates in registration order. `ConfigureModuleCatalog` adds its catalog-configuration callback to this same list.
2. Run the module manager if the configured catalog contains modules.
3. Add default `NavigationPage` and `TabbedPage` routes if those names are absent.
4. Invoke the configured `CreateWindow` navigation callback when the initial window is requested.

Do not resolve services registered by a module in an `OnInitialized` delegate: module initialization occurs later in this release. Put module-dependent startup navigation in `CreateWindow`. Both `OnInitialized(Action)` and `OnInitialized(Action<IContainerProvider>)` are available; neither awaits an asynchronous delegate.

`OnInitialized` is synchronous initialization, not the initial navigation callback. Keep startup navigation in `CreateWindow`. The default navigation-page route maps to `Prism.Controls.PrismNavigationPage`; see [its back-navigation behavior](navigation/prismnavigationpage.md).

### CreateWindow

`CreateWindow` configures the initial navigation invoked by Prism's MAUI window creator. It is not the `Application.CreateWindow` override and it does not directly return a `Window`.

Choose one of these alternatives:

```cs
// A route string.
prism.CreateWindow("/NavigationPage/MainPage");

// A route string with error handling.
prism.CreateWindow("/NavigationPage/MainPage",
    error => System.Diagnostics.Debug.WriteLine(error));
```

Or await and inspect navigation explicitly:

```cs
using Microsoft.Extensions.Logging;
using Prism.Navigation;

prism.CreateWindow(async (container, navigation) =>
{
    var result = await navigation.NavigateAsync("/NavigationPage/MainPage");
    if (!result.Success)
    {
        var logger = container.Resolve<ILogger<App>>();
        logger.LogError(result.Exception, "Initial navigation failed.");
    }
});
```

A builder-returning overload also runs the navigation:

```cs
using Prism.Navigation;

prism.CreateWindow(navigation => navigation.CreateBuilder()
    .UseAbsoluteNavigation()
    .AddNavigationPage()
    .AddSegment<MainPageViewModel>());
```

The generic segment requires the explicit page/view-model registration. The initial route must produce a root page; an error callback does not manufacture a fallback window. If startup fails, inspect the result/exception and registrations before attempting another route.

Remove the template's competing `MainPage` assignment or `CreateWindow` implementation that constructs an `AppShell`. If an application override remains for window-event subscriptions, preserve Prism's creator by obtaining the window from `base.CreateWindow(activationState)`.

## Source reference

- [Container-instance and CreateWindow overloads](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/PrismAppBuilderExtensions.cs)
- [Initialization stages and registrations](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/PrismAppBuilder.cs)
- [Window creation and initial navigation failure](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Navigation/PrismWindowManager.cs)

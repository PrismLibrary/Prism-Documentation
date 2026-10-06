---
sidebar_position: 3
---

# App Builder

Prism configures MAUI through `MauiAppBuilder.UsePrism`. Call it once, after `UseMauiApp<App>()`, and finish with `Build()`. Your application remains a `Microsoft.Maui.Controls.Application`; Prism registers the container integration, navigation services, and window creator.

## Choose the startup overload

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

For supported NativeAOT applications in Prism 9.1, supply `Prism.Container.Microsoft.MicrosoftContainerExtension` from Commercial Plus and follow the [NativeAOT guide](../../dependency-injection/native-aot.md). [Magician](../../magician/index.md) can generate startup and explicit mappings. A helper class called `PrismStartup` is an organizational choice, not a required base class.

## Register services and views

Use `RegisterTypes` for Prism registrations. Explicit view/view-model pairs make route ownership clear:

```cs
prism.RegisterTypes(container =>
{
    container.RegisterSingleton<ICustomerStore, CustomerStore>();
    container.RegisterForNavigation<MainPage, MainPageViewModel>();
    container.RegisterForNavigation<CustomerPage, CustomerPageViewModel>();
});
```

Use `ConfigureServices` when an integration expects `IServiceCollection`:

```cs
using Microsoft.Extensions.DependencyInjection;

prism.ConfigureServices(services =>
{
    services.AddSingleton<ReportCache>();
});
```

This delegates to `MauiAppBuilder.Services`. Prism's service-provider factory imports these registrations into the chosen container. Do not create a second provider with `BuildServiceProvider()`. Avoid assuming that an `IsRegistered` check made during configuration describes the final built container; registration visibility depends on when the service collection is populated.

Page navigation uses scoped services. Inject `INavigationService` into the page's view model rather than capturing one in an application singleton. Region-manager scopes, page scopes, and application singletons have different purposes; see [page navigation](navigation/page-navigation.md) and the [container guide](../../dependency-injection/index.md).

### Platform-specific services

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

## Logging

`ConfigureLogging` delegates to MAUI's `ILoggingBuilder`:

```cs
using Microsoft.Extensions.Logging;

prism.ConfigureLogging(logging => logging.SetMinimumLevel(LogLevel.Information));
```

Configure an appropriate logging provider through MAUI or your chosen integration. Current Prism.Maui code uses `ILogger` internally, including initialization and navigation diagnostics. Do not depend on the old claim that Prism never logs. Review your providers and filters before recording navigation URIs, parameters, or exception content that may contain private application data.

## Modules and initialization order

```cs
using Prism.Modularity;

prism.ConfigureModuleCatalog(catalog =>
{
    catalog.AddModule<CustomersModule>();
});

prism.OnInitialized(container =>
{
    // The configured modules have initialized; their services are available.
});
```

At this source head Prism performs these stages once:

1. Execute module-catalog configuration delegates
2. Run module initialization
3. Execute `OnInitialized` delegates
4. Add default `NavigationPage` and `TabbedPage` routes if those names are absent

`OnInitialized` is synchronous initialization, not the initial navigation callback. Keep startup navigation in `CreateWindow`. The default navigation-page route maps to `Prism.Controls.PrismNavigationPage`; see [its back-navigation behavior](navigation/prismnavigationpage.md).

## Create the initial window through navigation

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

- [Container-instance and CreateWindow overloads](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/PrismAppBuilderExtensions.cs)
- [Initialization stages and registrations](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/PrismAppBuilder.cs)
- [Window creation and initial navigation failure](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Navigation/PrismWindowManager.cs)

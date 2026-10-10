---
sidebar_position: 2
uid: Platforms.Uno.Extensions
description: Use Prism 9 Uno hosting hooks and register services at the correct startup stage.
---

# Uno.Extensions Support

In Prism 9.0.537, `Prism.Uno.WinUI` references `Uno.Extensions.Hosting.WinUI`. Prism owns the application startup sequence and integrates the host with the same Prism container through `PrismServiceProviderFactory`. Use the application hooks to configure services, logging, or hosting without building a second service provider.

## Setting up the Application

```cs
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Prism.DryIoc;
using Prism.Ioc;
using Uno.Extensions;
using Uno.Extensions.Hosting;

// These overrides belong in the App class from Getting Started.
public partial class App : PrismApplication
{
    protected override void ConfigureApp(IApplicationBuilder builder)
    {
        // Configure Uno's application builder before the shell is created.
    }

    protected override void ConfigureHost(IHostBuilder builder)
    {
        builder.ConfigureLogging(logging => logging.SetMinimumLevel(LogLevel.Information));
    }

    protected override void ConfigureServices(IServiceCollection services)
    {
        services.AddSingleton<ReportCache>();
    }
}
```

`ReportCache` is an application service you define. Add any Uno.Extensions package required by additional configuration, authentication, or HTTP APIs you choose to call; the hosting dependency does not install every extension.

## Registration timing matters

The container exists early, but the Uno host is built after the shell loads. The two registration paths therefore have different availability during startup:

- `RegisterTypes(IContainerRegistry)` registers dependencies used to create the shell and its view model.
- `ConfigureServices(IServiceCollection)` participates in host construction. Those services are available after the shell has loaded and the host has been built.
- `OnInitialized()` runs after host construction and module initialization. Resolve host-registered services here or use them in views created later.

For example, if `ShellViewModel` needs `ReportCache` in its constructor, move that registration to `RegisterTypes`:

```cs
protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    containerRegistry.RegisterSingleton<ReportCache>();
    // Other shell, navigation, and dialog registrations.
}
```

Do not register the same intended singleton independently in a second container, call `BuildServiceProvider()` yourself, or assume that host services can already be resolved in `ConfigureWindow` or `CreateShell`.

## Navigation and lifecycle boundaries

Prism's `OnLaunched` override is sealed. Use `ConfigureApp`, `ConfigureHost`, `ConfigureServices`, `ConfigureWindow`, and `OnInitialized` to extend startup. Keep the startup sequence described in [Getting Started](index.md).

Use Prism region navigation for the UI managed by Prism. Combining it with Uno.Extensions navigation creates competing owners for navigation and view construction. MAUI embedding (`Uno.Extensions.Maui.WinUI`) has additional application/hosting assumptions; the Prism application base does not establish compatibility with that integration.

Prism's Uno dialog implementation uses a `ContentDialog` host and obtains `XamlRoot` from the registered application window's content. It cannot display a dialog before that content exists. Treat multi-window ownership as a separate design concern rather than assuming WPF's active-window selection applies.

## Source reference

- [Hook signatures, service-provider integration, and startup ordering](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Uno/Prism.Uno/PrismApplicationBase.cs)
- [Hosting package reference](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Uno/Prism.Uno/Prism.Uno.WinUI.csproj)
- [Uno dialog XamlRoot selection](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Uno/Prism.Uno/Dialogs/DialogService.cs)

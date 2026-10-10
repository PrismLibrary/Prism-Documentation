---
sidebar_position: 2
title: Logging
sidebar_label: Prism.Plugin.Logging
description: "Configure Prism 9.0 logging contracts, providers, filters, scopes, and integrations using the shipped 9.0.345 plugins."
---

# Prism.Plugin.Logging

Prism Logging provides injectable contracts for application messages, analytics events, exception reports, and user context. Install `Prism.Plugin.Logging.Abstractions` and the provider packages you need from the [Commercial Plus feed](../../pipelines/commercial-plus.md).

This guide describes the shipped `9.0.345` plugin packages, mapped to source commit `bbafa527`. That source uses Prism `9.0.539` and Containers `9.0.107`; this does not establish compatibility with the public Prism `9.0.537` baseline used elsewhere in these versioned docs. Check the published dependencies for your selected packages. The abstractions and several local providers include .NET Standard 2.0, .NET 6, and .NET 8 assets. Remote providers and integrations have their own framework and platform requirements.

## Why another Logging Library?

Prism Logging separates three application concerns: tracking a named event, reporting an exception, and associating activity with a user. A service can request only the contract it needs, or use `ILogger` for all three plus ordinary messages.

An aggregate logger forwards calls to the registered providers. For example, you can inspect local Console output while sending error reports to Sentry, or send selected events to a mobile analytics provider. Each provider determines how those operations map to its destination.

## Getting Started

Register logging once during application setup, using `IContainerRegistry`. This example requires `Prism.Plugin.Logging.Console`:

```csharp
using Prism.Ioc;
using Prism.Plugin.Logging;

public static class AppLogging
{
    public static void Register(IContainerRegistry containerRegistry)
    {
        containerRegistry.UsePrismLogging(logging =>
        {
            logging.ConfigureGlobalLoggingProperties(properties =>
                properties.Add("Application", "ExampleApp"));
            logging.AddConsole();
        });
    }
}
```

Call this from your application's existing Prism registration callback or `RegisterTypes` override. `UsePrismLogging` registers the aggregate automatically; add each selected provider once. `AddNull()` is available when you want an explicit no-output provider.

### Choose a contract

All of these interfaces are in `Prism.Plugin.Logging`:

- `IAnalyticsService`: `TrackEvent` with a name and string properties
- `ICrashesService`: `Report` with an exception and string properties
- `IUserProvider`: `SetUser` and `ClearUser`
- `ILogger`: all three interfaces, plus `Log` and `BeginScope`
- `ILogger<T>`: an `ILogger` with a `Service` scope derived from the type name

The extension methods include `Debug`, `Info`, `Warn`, and overloads that accept property tuples. `Report` is the exception-reporting path; logging an exception with the `Log` extension remains generic logging.

```csharp
using Prism.Plugin.Logging;

public sealed class ExportDiagnostics(ILogger<ExportDiagnostics> logger)
{
    public void RecordCompleted()
    {
        logger.TrackEvent("ExportCompleted", ("Format", "Csv"));
        logger.Info("Export completed", ("Outcome", "Succeeded"));
    }

    public void RecordFailure(Exception exception)
    {
        logger.Report(exception);
    }
}
```

Use aliases or fully qualified names when a file also imports `Microsoft.Extensions.Logging`. Only include messages, property values, and user identifiers that your application's telemetry policy permits. Debug and exception helpers can also capture caller information.

### Configuration

Providers that accept `LoggerOptions` allow independent control of generic messages, exception reports, and events. Console and Debug both have configurable overloads. Null discards calls, while the Testing provider records calls without provider filters.

```csharp
logging.AddConsole(options =>
{
    options.EnableErrorTracking = false;
    options.ExcludedLoggingCategories = new[] { LogCategory.Debug };
});
```

`EnableLogging = false` disables generic messages. `EnableErrorTracking = false` disables the provider's exception-reporting path where implemented. Neither setting disables events. `ExcludedLoggingCategories` compares category strings exactly, so custom categories and the levels coming from Microsoft logging need deliberate configuration. Use explicit categories for messages you intend to filter.

#### Customizing Event Tracking

`CanLogEvent` receives the event name and combined properties and decides whether the provider should accept the event. `DisableEvents()` sets that predicate to always return false. `FormatEventName` receives the name and properties and returns the name to send.

```csharp
logging.AddConsole(options =>
{
    options.CanLogEvent = (name, _) =>
        name.StartsWith("Workflow_", StringComparison.Ordinal);
    options.FormatEventName = (name, _) => name.Substring("Workflow_".Length);
});

logging.AddDebug(options =>
{
    options.CanLogEvent = (_, properties) =>
        properties.TryGetValue("Debug", out var value) && value == bool.TrueString;
});
```

Apply each configuration to the provider that needs it. These delegates select and rename events; they do not automatically redact generic messages, exception details, or user context.

### Logging Scopes

Use `BeginScope`, and dispose its result at the end of the operation. The scope's properties are combined with the properties supplied on individual calls.

```csharp
using Prism.Plugin.Logging;

public sealed class ImportDiagnostics(ILogger<ImportDiagnostics> logger)
{
    public void RecordStarted()
    {
        using var scope = logger.BeginScope("Operation", "Import");
        logger.Info("Import started", ("Format", "Csv"));
    }
}
```

For providers that include combined properties, this call carries `Service=ImportDiagnostics`, `Operation=Import`, and `Format=Csv`, as well as any global properties. `ILogger<T>` inherits `ILogger`, so a typed logger can also be passed to a base class that accepts `ILogger`.

`ConfigureGlobalLoggingProperties` supplies application-wide properties. Call properties take precedence over a colliding global key; the global value is retained under `Global:` followed by the key. Prefer distinct property names to keep output easy to read.

The default aggregate and provider registrations are transient, while options and global user state are shared registrations. Keep operation scopes short, and call `ClearUser()` when the relevant account context ends. Changing provider lifetimes can change which operations share scopes.

The logging contracts do not expose an awaitable delivery result or per-message cancellation token. A logging call returning does not establish that a remote service received it. Choose a separate acknowledged application workflow when delivery is part of a business requirement.

## Logging Providers

- [Console](providers/console.md): standard output
- [Debug](providers/debug.md): output while a debugger is attached
- [Firebase](providers/firebase.md): Android and iOS analytics
- [Graylog (GELF)](providers/gelf.md): UDP, TCP, HTTP, and HTTPS transport
- [Kochava](providers/kochava.md): Android, iOS, and Mac Catalyst analytics
- [Raygun](providers/raygun.md): exception reporting and diagnostic breadcrumbs
- [Sentry](providers/sentry.md): messages and exception reports
- [Testing](providers/testing.md): records for assertions
- [Xunit](providers/xunit.md): test output plus the Testing provider
- [AppCenter](providers/appcenter.md): guidance for existing integrations

## Interop Extensions

- [Microsoft.Extensions.Logging Interoperability](interop/microsoft.md)
- [Prism.Plugin.Essentials](interop/essentials.md)

## Source reference

These sources are pinned to the implementation used by the `9.0.345` packages. The Prism.Plugins repository requires authorized access.

- [`DefaultLoggingRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Abstractions/DefaultLoggingRegistrationExtensions.cs)
- [`ILoggerExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Abstractions/ILoggerExtensions.cs)
- [`LoggerOptions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Abstractions/LoggerOptions.cs)
- [`GenericLogger.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Abstractions/GenericLogger.cs)

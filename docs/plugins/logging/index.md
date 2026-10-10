---
sidebar_position: 2
title: Logging
sidebar_label: Prism.Plugin.Logging
---

# Prism Logging

Prism Logging combines application diagnostics, analytics events, exception reports, and user context behind injectable contracts. Install `Prism.Plugin.Logging.Abstractions` plus the provider packages you use from the [authorized Commercial Plus feed](../../pipelines/commercial-plus.md). Current source targets .NET 10 and .NET 11; choose published package versions compatible with the rest of your application.

## Register once at the composition root

This example requires `Prism.Plugin.Logging.Console`:

```csharp
using Prism.Ioc;
using Prism.Plugin.Logging;

public static class AppLogging
{
    public static void Register(IContainerRegistry registry)
    {
        registry.UsePrismLogging(logging =>
        {
            logging.ConfigureGlobalLoggingProperties(properties =>
                properties.Add("Application", "ExampleApp"));
            logging.AddConsole(options =>
            {
                options.ExcludedLoggingCategories = [LogCategory.Debug];
                options.DisableEvents();
            });
        });
    }
}
```

Call `AppLogging.Register` from MAUI's Prism `RegisterTypes` callback or the WPF/Uno/Avalonia application's `RegisterTypes` override. Local console output requires a host/tool that captures stdout; it does not create a file, remote destination, or durable audit trail. Native-provider dependencies may narrow the platforms supported by an otherwise portable application.

`UsePrismLogging` registers an aggregate logger automatically. Add each provider once. A call with no provider does not invent a destination; `AddNull()` is available for an explicit no-output configuration. Do not call the private historical `UseAggregateLogger` entry point.

## Select the contract

- `IAnalyticsService.TrackEvent`: named product/workflow events with string properties
- `ICrashesService.Report`: an exception and diagnostic properties
- `IUserProvider.SetUser` / `ClearUser`: provider user context
- `ILogger`: the three contracts above plus generic `Log` and disposable scopes
- `ILogger<T>`: an `ILogger` with an implicit `Service` property derived from `T`

All of these are in `Prism.Plugin.Logging`. Fully qualify them or use aliases when a file also imports Microsoft.Extensions.Logging.

```csharp
using Prism.Plugin.Logging;

public sealed class ExportDiagnostics(ILogger<ExportDiagnostics> logger)
{
    public void RecordCompleted()
    {
        using var scope = logger.BeginScope("Operation", "Export");
        logger.Info("Export completed", ("Outcome", "Succeeded"));
    }
}
```

Log an outcome after the operation reaches that boundary. Record cancellation separately from failure, and do not log success before persistence or delivery has actually completed. Keep user content, tokens, file paths, and personal information out of messages and properties.

## Provider filters

Options are provider-specific. Common `LoggerOptions` controls are:

| Option | Controls |
| --- | --- |
| `EnableLogging` | Generic log messages |
| `ExcludedLoggingCategories` | Exact category strings on generic logs |
| `EnableErrorTracking` | Exception reporting for providers that implement it |
| `CanLogEvent` / `DisableEvents()` | Analytics-event selection |
| `FormatEventName` | The event name passed to the provider |

For example, send only an approved family of event names to a configured provider:

```csharp
logging.AddConsole(options =>
{
    options.CanLogEvent = (name, _) => name.StartsWith("Workflow_", StringComparison.Ordinal);
    options.FormatEventName = (name, _) => name["Workflow_".Length..];
});
```

This is event routing, not a sanitizer. There is no common option that redacts arbitrary log messages, exception text, scopes, user identifiers, and property values. Enforce a restricted output policy before every provider path, including automatic [Essentials error forwarding](interop/essentials.md), and test it with sensitive sentinel values.

`LogCategory.Uncategorized` is checked when a nonempty property dictionary lacks a category. At the inspected source checkpoint (`f0abcbb9`), an empty/null property dictionary takes the `EnableLogging` fast path; excluding `Uncategorized` alone does not suppress that case. This is a static implementation observation, not a permanent filtering guarantee. Verify the installed package and prefer explicit categories or a custom provider when a strict allowlist is required.

## Lifetimes, scopes, and failure behavior

The aggregate and normal provider registrations are transient. Typed loggers create a provider scope; changing providers to singleton can mix scopes between unrelated services. Provider options and global user state are shared registrations. A provider may additionally own a singleton transport, such as GELF's client. Keep these distinctions when adding an adapter.

Dispose each `BeginScope` result at the operation boundary. Use `ClearUser()` when the relevant account context ends. User context is not a substitute for an operation scope, particularly in applications with concurrent accounts.

The public log/event/report methods are synchronous and do not take per-message cancellation tokens. A provider may queue network work internally. A returned call is not proof of remote receipt. The aggregate invokes providers in order and does not isolate thrown provider exceptions; a failure can stop later providers from receiving that call. Keep diagnostics from masking an application's original error through a deliberate application policy.

## Choose a provider

- [Console](providers/console.md) and [Debug](providers/debug.md): local development output
- [Testing](providers/testing.md) and [xUnit](providers/xunit.md): in-process assertions and test output
- [GELF](providers/gelf.md): Graylog-compatible transport, with opt-in bounded offline storage
- [Firebase](providers/firebase.md): Android/iOS analytics and Crashlytics
- [Kochava](providers/kochava.md): mobile analytics
- [Raygun](providers/raygun.md) and [Sentry](providers/sentry.md): provider-specific error reporting
- [App Center migration](providers/appcenter.md): historical integration, not a current provider package

The source also contains `Prism.Plugin.Logging.Datadog`; validate its installed package and destination policy before adopting it. A package's presence does not qualify every native SDK or host for [NativeAOT](../../dependency-injection/native-aot.md).

## Integrations

Use [Microsoft logging interop](interop/microsoft.md) to forward host/framework logging into Prism. Use [Essentials enrichment](interop/essentials.md) only when you intend to include its application/device fields. Those integrations have distinct behavior and privacy implications.

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Logging.Abstractions/DefaultLoggingRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Abstractions/DefaultLoggingRegistrationExtensions.cs)
- [`src/Prism.Plugin.Logging.Abstractions/LoggerOptions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Abstractions/LoggerOptions.cs)
- [`src/Prism.Plugin.Logging.Abstractions/AggregateLogger.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Abstractions/AggregateLogger.cs)
- [`src/Prism.Plugin.Logging.Abstractions/ILoggerExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Abstractions/ILoggerExtensions.cs)

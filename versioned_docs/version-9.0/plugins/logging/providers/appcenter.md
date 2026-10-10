---
sidebar_position: 1
uid: Plugins.Logging.AppCenter
description: "Plan an App Center migration using Prism logging contracts and supported providers, with current service retirement guidance."
---

# AppCenter

This page is retained for applications with an existing AppCenter integration. An AppCenter provider implementation is not included in the shipped source used for this version's Logging documentation. The `AddAppCenter` examples previously shown here should not be used as a setup guide for the documented `9.0.345` package set.

Microsoft retired most App Center features on March 31, 2025. Its April 15, 2026 update extends Analytics & Diagnostics through the end of March 2027 while customers migrate. That exception does not restore Build, Test, or Distribution. See [Microsoft's retirement notice](https://learn.microsoft.com/en-us/appcenter/retirement) for the current service timeline.

## Isolate the application contract

Prism Logging lets application code depend on injectable services instead of static telemetry SDK calls:

- `IAnalyticsService.TrackEvent` expresses a named application event.
- `ICrashesService.Report` expresses an exception report.
- `IUserProvider.SetUser` and `ClearUser` express user context.

These contracts describe application intent. They do not establish that another provider has identical event names, properties, crash collection, retention, or session behavior to AppCenter. Review those requirements when moving an existing integration.

## Evaluate a replacement

Start with a supported provider and the [Testing provider](testing.md) to check which calls the application makes:

```csharp
using Prism.Plugin.Logging;

containerRegistry.UsePrismLogging(logging =>
{
    logging.AddConsole();
    logging.AddTest();
});
```

This example requires `Prism.Plugin.Logging.Console` and `Prism.Plugin.Logging.Testing`. It records local diagnostic output and in-process test records. When selecting a remote destination, use that provider's registration and configuration guidance: [Firebase](firebase.md), [Kochava](kochava.md), [Raygun](raygun.md), [Sentry](sentry.md), or [GELF](gelf.md).

If an existing application uses an older AppCenter-specific package or a custom adapter, validate it against that package's own API and dependency requirements before combining it with the aggregate logger.

## Source reference

These sources are pinned to the implementation used by the `9.0.345` packages. The Prism.Plugins repository requires authorized access.

- [`ILogger.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Abstractions/ILogger.cs)
- [`DefaultLoggingRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Abstractions/DefaultLoggingRegistrationExtensions.cs)

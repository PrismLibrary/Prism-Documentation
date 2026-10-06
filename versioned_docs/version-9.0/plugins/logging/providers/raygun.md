---
sidebar_position: 7
description: "Configure Raygun exception reporting, breadcrumbs, local ingestion, and optional Prism Essentials integration."
---

# Prism Logging with Raygun

`Prism.Plugin.Logging.Raygun` connects Prism's exception-reporting contract to Raygun. The `9.0.345` package targets .NET 8. Register it with your Raygun API key:

```csharp
using Prism.Plugin.Logging;

containerRegistry.UsePrismLogging(logging =>
{
    logging.AddRaygun("your-raygun-api-key");
});
```

Use your application's configuration mechanism for the key. `AddRaygun(apiKey)` configures Raygun settings with unhandled-exception catching enabled. Application code can explicitly call `Report` for handled exceptions that should be sent.

## Configure reporting

The options overload exposes `RaygunLoggerOptions`, including the underlying `RaygunSettings`, common logging filters, and offline-store settings:

```csharp
using Prism.Plugin.Logging;

containerRegistry.UsePrismLogging(logging =>
{
    logging.AddRaygun(options =>
    {
        options.Settings.ApiKey = "your-raygun-api-key";
        options.ExcludedLoggingCategories = new[] { LogCategory.Debug };
        options.TimeSpan = TimeSpan.FromSeconds(30);
        options.MaxOfflineStorageSize = 100;
    });
});
```

Generic `Log` calls add diagnostic breadcrumbs for subsequent exception reports. They are not separate crash reports. `Report` includes the exception, current breadcrumbs, calculated properties, application/environment details, and user context when set. `SetUser` supplies Raygun's user identifier; `ClearUser` clears it.

For standalone named-event analytics, combine Raygun with an analytics provider such as [Firebase](firebase.md) or [Kochava](kochava.md). Verify each destination's behavior before assuming that one logging call has identical meaning in every provider.

## Local Development & Debugging

If you already have a local Raygun-compatible ingestion endpoint, use `AddLocalRaygun` with its complete ingestion URL:

```csharp
using Prism.Plugin.Logging;

containerRegistry.UsePrismLogging(logging =>
{
    logging.AddLocalRaygun("http://127.0.0.1:8080/Ingestion/Entries");
});
```

This configures a generated API key and the supplied `ApiEndpoint`. It does not start a server. Replace the URL with the endpoint exposed by your local receiver; an application running on a physical device needs a reachable host address instead of the developer machine's loopback address. Send a test exception and verify it in that receiver.

## Prism.Essentials Integration

The Raygun provider checks for optional [Prism.Plugin.Essentials](../../essentials/index.md) services when its options are resolved. Register the appropriate Essentials host integration before resolving logging services.

- `IAppContext` supplies the application name and version.
- `IDeviceInfo` supplies the machine name.
- `IFileSystem` enables a file-system crash-report store under the directory returned by `IFileSystem.AppData`, at `Prism/Logging/Raygun`.
- When that store is enabled, `IConnectivity` selects a send strategy that checks for internet access. Without it, the provider uses a timer-based strategy.

`TimeSpan` defaults to 30 seconds and configures the store's send interval. `MaxOfflineStorageSize` defaults to `100` and is passed to Raygun's file-system crash-report store. An available offline store enables the background-send path. Without a store, the provider uses its direct asynchronous send path.

Treat stored crash reports and their exception details as application data when deciding retention and cleanup policies. This integration is separate from the [Essentials global-property helper](../interop/essentials.md); adding that helper is not required for Raygun's optional service detection.

## Source reference

These sources are pinned to the implementation used by the `9.0.345` packages. The Prism.Plugins repository requires authorized access.

- [`RaygunLoggerExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Raygun/RaygunLoggerExtensions.cs)
- [`RaygunLoggerOptions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Raygun/RaygunLoggerOptions.cs)
- [`RaygunLoggingService.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Raygun/RaygunLoggingService.cs)
- [`ConnectivityBackgroundSendStrategy.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Raygun/ConnectivityBackgroundSendStrategy.cs)

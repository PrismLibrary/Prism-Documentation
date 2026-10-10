---
sidebar_position: 7
---

# Raygun

Install `Prism.Plugin.Logging.Raygun` for exception reports sent through Raygun4Net. Configure one destination in your composition root:

```csharp
using Prism.Plugin.Logging;

registry.UsePrismLogging(logging => logging.AddRaygun(options =>
{
    options.ApiKey = "your-raygun-application-key";
    options.EnableErrorTracking = true;
    options.ThrowOnError = false;
}));
```

Supply the key through your application's configuration policy. `AddRaygun(apiKey)` is the shorter overload. Review what exception/environment/user data the SDK collects before sending it to a remote service.

## Reporting behavior

`Report` constructs Raygun exception reports. Generic `Log` adds breadcrumbs rather than sending an independent report. At the inspected source checkpoint (`f0abcbb9`), `TrackEvent` adds its event breadcrumb when `CanLogEvent` returns `false`, the reverse of the common provider convention. Do not rely on it as a general analytics destination or silently invert your application-wide event policy. This is a source observation, not the intended permanent filtering contract or a runtime-confirmed result. Verify the installed package's behavior before enabling event routing.

The reporting implementation is `async void`; the public call cannot be awaited as a delivery acknowledgment. `ThrowOnError` affects the underlying client but does not create a Task-returning Prism contract. Keep an application's recovery flow independent of diagnostics completion.

## Optional Essentials integration

Register [Essentials](../../essentials/index.md) before the logging options/client are first resolved if you want these behaviors:

- `IAppContext`: application name/version metadata
- `IDeviceInfo`: machine/device name metadata
- `IFileSystem`: an offline report store beneath `AppData/Prism/Logging/Raygun`
- `IConnectivity`: a connectivity-aware background send strategy; otherwise a timer strategy is used

These registrations are detected individually. Without `IFileSystem`, the integration does not configure that offline store. Browser virtual-file behavior is not proof of durable browser persistence. Review stored crash data, retention, and device-name privacy before enabling it. Avalonia requires application-owned Essentials adapters for those optional contracts.

## Local receiver

For a development receiver, the source exposes:

```csharp
registry.UsePrismLogging(logging =>
    logging.AddLocalRaygun("http://127.0.0.1:8080/Ingestion/Entries"));
```

Use the address reachable from the application; an emulator/device may need a different host. Follow [Raygun's current local Docker instructions](https://raygun.com/documentation/product-guides/crash-reporting/local-docker-setup/) for receiver installation, versions, persistence, and optional dependencies. Local HTTP is a development choice, not a production transport recommendation.

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Logging.Raygun/RaygunLoggerExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Raygun/RaygunLoggerExtensions.cs)
- [`src/Prism.Plugin.Logging.Raygun/RaygunLoggerOptions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Raygun/RaygunLoggerOptions.cs)
- [`src/Prism.Plugin.Logging.Raygun/RaygunLoggingService.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Raygun/RaygunLoggingService.cs)

---
sidebar_position: 2
uid: Plugins.Logging.Essentials
description: "Enrich Prism 9.0 logging with application and device properties from Prism Essentials."
---

# Logging Interop with Prism.Plugin.Essentials

`Prism.Plugin.Logging.Essentials` adds application and device metadata to Prism's global logging properties. It is an enrichment helper; you still need at least one logging provider to produce output. This version targets .NET 8.

## Register Essentials and logging

Install the logging integration package, the [Essentials package for your host](../../essentials/index.md), and your selected logging provider. Ensure Essentials is registered before a logger is resolved:

```csharp
using Prism.Plugin.Essentials;
using Prism.Plugin.Logging;

containerRegistry.UsePrismEssentials();
containerRegistry.UsePrismLogging(logging =>
{
    logging.UseEssentialsLogging(properties =>
        properties.Add("Channel", "InternalTest"));
    logging.AddConsole();
});
```

The example also requires `Prism.Plugin.Logging.Console`. Use `UseEssentialsLogging()` without a callback when you only need the built-in metadata. The helper resolves `IAppContext` and `IDeviceInfo`; those services must be available in the application container.

## Included properties

| Property | Source |
| --- | --- |
| `PackageName` | `IAppContext.PackageName` |
| `Version` | `IAppContext.VersionString` |
| `Build` | `IAppContext.BuildString` |
| `Idiom` | `IDeviceInfo.Idiom` |
| `Manufacturer` | `IDeviceInfo.Manufacturer` |
| `Platform` | `IDeviceInfo.Platform` |
| `OSVersion` | `IDeviceInfo.OSVersion.ToString()` |
| `DeviceName` | `IDeviceInfo.Name` |

The callback runs after these values are added. `Add` can add a key or replace its value. Multiple `UseEssentialsLogging` or `ConfigureGlobalLoggingProperties` calls register replacement global-property configurations; combine related enrichment in one callback.

Check which fields your telemetry policy permits. Device names can contain identifying information. If the full set is unsuitable, configure an explicit set with `ConfigureGlobalLoggingProperties` instead of enabling this helper. `GlobalLoggingProperties` does not expose a removal method.

## Integration boundaries

This stable integration supplies metadata through the normal provider property pipeline. It does not register a logging destination, capture unhandled exceptions, or automatically forward Essentials errors into logging. Application code still calls `Log`, `TrackEvent`, or `Report` for the operations it needs to record.

Raygun's optional use of Essentials for application information and an offline crash-report store is separate; see [Raygun integration](../providers/raygun.md#prismessentials-integration).

## Source reference

These sources are pinned to the implementation used by the `9.0.345` packages. The Prism.Plugins repository requires authorized access.

- [`EssentialsLoggingExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Essentials/EssentialsLoggingExtensions.cs)
- [`Prism.Plugin.Logging.Essentials.csproj`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Essentials/Prism.Plugin.Logging.Essentials.csproj)

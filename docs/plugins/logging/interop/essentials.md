---
sidebar_position: 2
uid: Plugins.Logging.Essentials
---

# Essentials logging integration

There are two independent integrations: optional application/device enrichment and automatic Essentials error forwarding. Enabling one is not a prerequisite for the other.

## Add application and device properties

Install `Prism.Plugin.Logging.Essentials` with your host's Essentials package and selected logging provider. Register Essentials before logging is resolved:

```csharp
using Prism.Plugin.Essentials;
using Prism.Plugin.Logging;

registry.RegisterSerializer(AppJsonContext.Default);
registry.UsePrismEssentials();
registry.UsePrismLogging(logging =>
{
    logging.UseEssentialsLogging(properties =>
        properties.Add("Channel", "InternalTest"));
    logging.AddConsole();
});
```

`UseEssentialsLogging()` resolves `IAppContext` and `IDeviceInfo` to populate `GlobalLoggingProperties`. It adds `PackageName`, `Version`, `Build`, `Idiom`, `Manufacturer`, `Platform`, `OSVersion`, and `DeviceName`. The callback can add/overwrite properties, but the public properties type has no removal API. Multiple `ConfigureGlobalLoggingProperties`/`UseEssentialsLogging` calls replace the registration rather than forming an enrichment pipeline.

`DeviceName` can identify a person. If that field is not allowed by your telemetry policy, skip this helper and configure a small allowlist with `ConfigureGlobalLoggingProperties` instead. Do not use an empty replacement as a claim that the metadata was never collected. Avalonia has no Essentials host integration; calling this helper there requires application-owned implementations of both contracts.

## Essentials errors are wired by logging registration

`UsePrismLogging` attempts to locate Essentials' error handler and register a forwarding callback when the Essentials assembly is present. This occurs in the logging abstractions package; it does not require `UseEssentialsLogging()` or the enrichment package.

The bridge converts error properties to strings and calls Prism's exception `Log` extension. That path includes the exception message and may add its type and stack trace. It is generic logging, so turning off only `EnableErrorTracking` does not suppress it. Filter or sanitize all provider entry points if the application must keep exception content out of output.

The integration is best-effort and uses reflection. The merged source retains loaded-assembly discovery and a literal assembly-qualified lookup that preserves the linked Essentials bridge's public methods during trimming. Externally loaded plugin hosts must preserve that bridge contract themselves. Missing assemblies, an incompatible error-handler API, or failure to resolve a logger can prevent forwarding. Do not rely on it as a guaranteed audit channel, global unhandled-exception handler, or NativeAOT qualification. Verify the actual published application, including any trimming configuration.

See [logging configuration](../index.md), [device information](../../essentials/devices/deviceinfo.md), and [NativeAOT](../../../dependency-injection/native-aot.md).

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Logging.Essentials/EssentialsLoggingExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Logging.Essentials/EssentialsLoggingExtensions.cs)
- [`src/Prism.Plugin.Logging.Abstractions/Internals/EssentialsErrorLoggingIntegration.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Logging.Abstractions/Internals/EssentialsErrorLoggingIntegration.cs)
- [`src/Prism.Plugin.Logging.Abstractions/ILoggerExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Logging.Abstractions/ILoggerExtensions.cs)
- [`src/Prism.Plugin.Logging.Abstractions/GlobalLoggingProperties.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Logging.Abstractions/GlobalLoggingProperties.cs)

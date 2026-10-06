---
sidebar_position: 3
uid: Plugins.Logging.Debug
description: "Configure debugger-attached output and provider filters with the Prism Debug logging provider."
---

# Debug

Install `Prism.Plugin.Logging.Debug` to write through `System.Diagnostics.Debug.WriteLine`. The implementation checks `Debugger.IsAttached` before writing. Use it for diagnostics during an attached debugging session; it is not a persistent log destination for an application running on its own.

```csharp
using Prism.Plugin.Logging;

containerRegistry.UsePrismLogging(logging =>
{
    logging.AddDebug();
});
```

Like the [Console provider](console.md), Debug formats messages, tracked events, and exception reports with their properties. It includes global properties, active scopes, and the provider's current user when set. The package includes .NET Standard 2.0, .NET 6, and .NET 8 assets.

## Configure output

Debug accepts the same common options as other configurable providers:

```csharp
logging.AddDebug(options =>
{
    options.EnableErrorTracking = false;
    options.CanLogEvent = (_, properties) =>
        properties.TryGetValue("Diagnostic", out var value) && value == bool.TrueString;
});
```

This keeps generic messages enabled, disables exception reports for this provider, and accepts only events carrying `Diagnostic=True`. Options affect this provider only; other registered providers keep their own configuration.

Use [Console](console.md) when the host captures standard output, or a configured remote provider when logs must be collected without an attached debugger.

## Source reference

These sources are pinned to the implementation used by the `9.0.345` packages. The Prism.Plugins repository requires authorized access.

- [`DebugLoggingService.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Debug/DebugLoggingService.cs)
- [`DebugLoggingExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Debug/DebugLoggingExtensions.cs)

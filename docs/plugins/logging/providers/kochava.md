---
sidebar_position: 6
uid: Plugins.Logging.Kochava
---

# Kochava

Install `Prism.Plugin.Logging.Kochava` for analytics on Android, iOS, and Mac Catalyst. `AddKochava` does nothing on other targets, so a shared registration call is not evidence that an active provider exists on every head.

```csharp
using Prism.Plugin.Logging;

registry.UsePrismLogging(logging => logging.AddKochava(
    "your-application-guid",
    options =>
    {
        options.CanLogEvent = (name, _) =>
            name.StartsWith("Workflow_", StringComparison.Ordinal);
    }));
```

Use the application GUID supplied by your Kochava project. The extension registers the native app GUID and starts the Kochava SDK during registration. Complete native configuration and consent decisions before this point.

`TrackEvent` combines global/scoped properties, applies `CanLogEvent`, transforms the name with `FormatEventName`, and sends it to Kochava. `SetUser` / `ClearUser` manage the SDK's default event user ID. Generic `Log` and exception `Report` are no-ops; pair with an explicitly selected diagnostic provider if needed.

Disabling Prism events only filters calls passing through this adapter. It is not a promise that the native SDK has no other automatic collection. Verify the installed SDK's platform setup and data policy. Keep identifiers and event properties within the application's approved telemetry scope. See [logging configuration](../index.md).

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Logging.Kochava/KochavaLoggerExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Kochava/KochavaLoggerExtensions.cs)
- [`src/Prism.Plugin.Logging.Kochava/KochavaLoggingService.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Kochava/KochavaLoggingService.cs)
- [`src/Prism.Plugin.Logging.Kochava/Prism.Plugin.Logging.Kochava.csproj`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Kochava/Prism.Plugin.Logging.Kochava.csproj)

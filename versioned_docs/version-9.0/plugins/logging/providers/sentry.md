---
sidebar_position: 8
uid: Plugins.Logging.Sentry
description: "Send Prism messages, events, exception reports, and contextual tags to Sentry."
---

# Sentry

Install `Prism.Plugin.Logging.Sentry` to send messages and exception reports to Sentry. This version targets .NET 8 and takes the project's DSN at registration:

```csharp
using Prism.Plugin.Logging;

containerRegistry.UsePrismLogging(logging =>
{
    logging.AddSentry("your-sentry-dsn", options =>
    {
        options.ExcludedLoggingCategories = new[] { LogCategory.Debug };
    });
});
```

`AddSentry(dsn)` is also available. Registration initializes the Sentry SDK and starts a session. Coordinate this with any existing Sentry SDK initialization in the host, and initialize telemetry at the appropriate point in the application's consent flow.

## Messages, events, and exceptions

- `Log` captures a Sentry message. The provider chooses its level from the `Category` property when recognized and otherwise uses Info.
- `TrackEvent` captures an Info-level Sentry message after applying `CanLogEvent` and `FormatEventName`.
- `Report` captures an exception when `EnableErrorTracking` is enabled.

Call properties, active scopes, and global properties are attached as Sentry tags. `SetUser` adds the configured identifier as a `User` tag to subsequent captured output; `ClearUser` clears that provider context. This is tag enrichment, not population of Sentry's full user object.

The options callback configures Prism's `LoggerOptions`, not Sentry SDK options. For example, `DisableEvents()` stops Prism event captures while leaving generic messages and exception reports controlled by their separate options.

Verify the resulting messages, tags, and severity in your Sentry project when integrating additional logging adapters. [Microsoft logging](../interop/microsoft.md), custom categories, and Prism's helper methods can supply different category strings.

## Source reference

These sources are pinned to the implementation used by the `9.0.345` packages. The Prism.Plugins repository requires authorized access.

- [`SentryServiceExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Sentry/SentryServiceExtensions.cs)
- [`SentryLoggingService.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Sentry/SentryLoggingService.cs)
- [`Prism.Plugin.Logging.Sentry.csproj`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Sentry/Prism.Plugin.Logging.Sentry.csproj)

---
sidebar_position: 8
uid: Plugins.Logging.Sentry
---

# Sentry

Install `Prism.Plugin.Logging.Sentry` and configure the application's Sentry DSN:

```csharp
using Prism.Plugin.Logging;

registry.UsePrismLogging(logging => logging.AddSentry(
    "your-sentry-dsn",
    options =>
    {
        options.DisableEvents();
        options.ExcludedLoggingCategories = [LogCategory.Debug];
    }));
```

`AddSentry` calls `SentrySdk.Init(dsn)` and starts a session during registration. Configure it once and decide how it interacts with any existing Sentry host integration. The options callback configures Prism's `LoggerOptions<SentryLoggingService>`, not the full native Sentry SDK options object.

## Mapping and limitations

- `Report` captures exceptions when `EnableErrorTracking` allows it.
- `TrackEvent` captures an informational Sentry message after event filtering/name formatting; it is not a separate analytics SDK.
- `Log` captures a message, mapping recognized category strings to Sentry levels.
- Scopes and global properties become tags; the provider's user context is also added as a tag.

At the inspected source checkpoint (`f0abcbb9`), static inspection shows that the level mapping recognizes `debug`, `info`, `warning`, `error`, and `fatal` case-insensitively. Other strings fall back to Info. In particular, Prism's `Warn` and Microsoft's `Critical` are not identical to the recognized `warning` and `fatal` strings. This checkpoint-specific observation is not a guarantee about later packages; its runtime impact still needs a transport-level test. Test severity expectations when combining providers or using [Microsoft interop](../interop/microsoft.md).

Provider disposal releases its Prism scope manager; this wrapper does not expose a flush/shutdown contract for the global Sentry SDK. Handle the SDK's application lifetime through one deliberate host policy. Neither a successful call nor disposal guarantees remote receipt. Review exception content and all tags against your data policy before enabling collection.

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Logging.Sentry/SentryServiceExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Sentry/SentryServiceExtensions.cs)
- [`src/Prism.Plugin.Logging.Sentry/SentryLoggingService.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Sentry/SentryLoggingService.cs)

---
sidebar_position: 1
uid: Plugins.Logging.AppCenter
---

# App Center migration

The current 9.1 Prism.Plugins source no longer contains an App Center provider project or an `AddAppCenter` extension. Older examples using those APIs describe historical packages; do not add them to a new 9.1 application without separately verifying that older dependency and its support policy.

Microsoft retired most App Center features on March 31, 2025. Its April 15, 2026 update extends **Analytics & Diagnostics through the end of March 2027** while customers migrate. That exception does not restore Build, Test, or Distribution. Check [Microsoft's retirement notice](https://learn.microsoft.com/en-us/appcenter/retirement) for the current service timeline.

## Move provider selection out of application logic

Keep shared application code on Prism's `IAnalyticsService`, `ICrashesService`, or `ILogger` contracts, and choose current providers in the composition root. [Testing](testing.md) can validate your event/error calls without sending telemetry; [Console](console.md) can show local output during migration.

For remote destinations, review [Firebase](firebase.md), [Sentry](sentry.md), [Raygun](raygun.md), or [GELF](gelf.md) against the required event, crash, identity, platform, consent, and retention behavior. They do not all implement those capabilities in the same way. Registering multiple providers duplicates data transmission, so use it only as an explicit migration decision.

Prism Logging does not migrate historical App Center data, provision a replacement backend, or transfer distribution/signing workflows. Follow Microsoft's migration guidance for those service responsibilities.

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Logging.Abstractions/DefaultLoggingRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Abstractions/DefaultLoggingRegistrationExtensions.cs)

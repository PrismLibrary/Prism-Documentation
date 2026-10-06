---
sidebar_position: 4
uid: Plugins.Logging.Firebase
---

# Firebase

`Prism.Plugin.Logging.Firebase` contains Android and iOS implementations for Firebase Analytics and Crashlytics. It is no longer a placeholder. `AddFirebase` is a no-op on other targets; the reference asset does not mean that Windows, Mac Catalyst, Skia, or BrowserWasm has a Firebase provider.

## Native setup and registration

Configure the Firebase application for the Android package ID / iOS bundle ID and include the platform configuration required by the installed .NET Firebase bindings. Firebase's official [Android setup](https://firebase.google.com/docs/android/setup) and [Apple setup](https://firebase.google.com/docs/ios/setup) describe the platform projects and configuration files; adapt the build integration to the binding packages used by your Prism version.

Then register the provider once after the native application is ready and after resolving the application's telemetry-consent policy:

```csharp
using Prism.Plugin.Logging;

registry.UsePrismLogging(logging => logging.AddFirebase(options =>
{
    options.EnableAnalytics = false;
    options.EnableErrorTracking = true;
}));
```

These are explicit application-policy choices, not a universal consent recommendation. The default enables analytics and error tracking. On supported targets the extension initializes Firebase immediately, configures collection, and requests sending unsent crash reports when error tracking is enabled. Do not register it speculatively before deciding whether collection is allowed.

## Supported calls

- `TrackEvent` sends an Analytics event when `EnableAnalytics` and `CanLogEvent` allow it; `FormatEventName` transforms its name.
- `Report` records an exception and custom diagnostic properties in Crashlytics when `EnableErrorTracking` is enabled.
- `SetUser` / `ClearUser` updates the relevant native SDK user context for enabled features.
- Generic `Log` is currently a no-op. `EnableLogging = true` does not add a generic-log destination.

An exception is marked as reported in its `Data` dictionary to suppress repeated Firebase reporting. Calls return without confirming server receipt. Validate event names, property limits, native startup, collection settings, and crash-report behavior with the actual Firebase SDK/backend; a portable build is not native runtime qualification.

The public Prism options do not provide a runtime consent-change API. If collection policy changes during a session, design and verify the native SDK lifecycle explicitly. See [logging privacy and lifetimes](../index.md).

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Logging.Firebase/Prism.Plugin.Logging.Firebase.csproj`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Firebase/Prism.Plugin.Logging.Firebase.csproj)
- [`src/Prism.Plugin.Logging.Firebase/FirebaseLoggerExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Firebase/FirebaseLoggerExtensions.cs)
- [`src/Prism.Plugin.Logging.Firebase/FirebaseLoggerExtensions.android.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Firebase/FirebaseLoggerExtensions.android.cs)
- [`src/Prism.Plugin.Logging.Firebase/FirebaseLoggerExtensions.apple.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Firebase/FirebaseLoggerExtensions.apple.cs)
- [`src/Prism.Plugin.Logging.Firebase/FirebaseLoggingService.android.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Firebase/FirebaseLoggingService.android.cs)

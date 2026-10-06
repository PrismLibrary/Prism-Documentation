---
sidebar_position: 4
uid: Plugins.Logging.Firebase
description: "Register Firebase Analytics for Android and iOS with Prism 9.0 event filtering, properties, and user context."
---

# Firebase

`Prism.Plugin.Logging.Firebase` connects Prism's analytics contract to Firebase Analytics on Android and iOS. The `9.0.345` package contains `net8.0`, `net8.0-android`, and `net8.0-ios` assets. The plain .NET asset allows shared registration code; it does not register a Firebase provider on other platforms.

## Register the provider

Configure the application's native Firebase project and SDK resources for the platform before registering the provider. On Android, the provider also requires Prism Essentials' `ICurrentActivity` service. Register your supported host's [Essentials integration](../../essentials/index.md) before logging is resolved:

```csharp
using Prism.Plugin.Essentials;
using Prism.Plugin.Logging;

containerRegistry.UsePrismEssentials();
containerRegistry.UsePrismLogging(logging =>
{
    logging.AddFirebase(options =>
    {
        options.CanLogEvent = (name, _) =>
            name.StartsWith("Workflow_", StringComparison.Ordinal);
        options.FormatEventName = (name, _) => name.Substring("Workflow_".Length);
    });
});
```

The parameterless `AddFirebase()` overload enables all events. On Android, the provider initializes Firebase using the current activity or application context when its analytics service is resolved. On iOS, registration calls Firebase's application configuration API. Registration also enables analytics collection, so perform it at the appropriate point in the application's consent flow.

## What is sent

`TrackEvent` combines call properties with active scopes and global properties, applies the event predicate, formats the name, and sends the event. Properties are passed as string values. Ensure names and properties fit the Firebase SDK's requirements, including any names produced by `FormatEventName`.

`SetUser` forwards a user ID to Firebase Analytics; `ClearUser` clears it. Choose an identifier appropriate for your telemetry policy.

In this version the provider implements analytics and user context. Generic `Log` and exception `Report` calls have no Firebase output, and the package does not provide a Crashlytics integration. Add another provider if those diagnostics are required.

:::note
`AddFirebase()` can remain in shared registration code. Outside Android and iOS it returns the logging builder without adding a provider. A successful build on another target is not evidence that Firebase events are being collected there.
:::

## Source reference

These sources are pinned to the implementation used by the `9.0.345` packages. The Prism.Plugins repository requires authorized access.

- [`FirebaseLoggerExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Firebase/FirebaseLoggerExtensions.cs)
- [`FirebaseLoggingService.android.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Firebase/FirebaseLoggingService.android.cs)
- [`FirebaseLoggingService.apple.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Firebase/FirebaseLoggingService.apple.cs)
- [`Prism.Plugin.Logging.Firebase.csproj`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Firebase/Prism.Plugin.Logging.Firebase.csproj)

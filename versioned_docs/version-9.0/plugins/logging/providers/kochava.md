---
sidebar_position: 6
uid: Plugins.Logging.Kochava
description: "Forward Prism analytics events and user context to Kochava on Android, iOS, and Mac Catalyst."
---

# Kochava

Install `Prism.Plugin.Logging.Kochava` to forward Prism analytics events to Kochava. Configure the app GUID for the target platform during startup:

```csharp
using Prism.Plugin.Logging;

containerRegistry.UsePrismLogging(logging =>
{
    logging.AddKochava("your-platform-app-guid", options =>
    {
        options.CanLogEvent = (name, _) =>
            name.StartsWith("Marketing_", StringComparison.Ordinal);
        options.FormatEventName = (name, _) => name.Substring("Marketing_".Length);
    });
});
```

The simpler `AddKochava(appSecret)` overload accepts all events. The registration parameter is named `appSecret`, but the implementation passes it to Kochava's platform app-GUID registration API. It then starts the SDK, so register it at the appropriate point in your application's consent flow.

## Limitations & Considerations

Kochava is an analytics destination. Use event filtering to send the events appropriate for that destination, and choose another provider for error reports or general diagnostics.

### API

`TrackEvent` combines call properties, active scopes, and global properties before evaluating `CanLogEvent` and `FormatEventName`. It sends either a named event or an event with a dictionary of string values, depending on whether properties are present.

`SetUser` sets Kochava's default event user ID; `ClearUser` clears it. The provider's generic `Log` and exception `Report` methods have no implementation, so disabling those two paths is unnecessary.

### Supported Platforms

The `9.0.345` package targets .NET 8 with Android, iOS, and Mac Catalyst implementations, plus a plain .NET asset for shared code. `AddKochava` registers the Android app GUID on Android and the iOS app GUID on iOS or Mac Catalyst.

On unsupported targets the method returns the builder without adding a provider or starting the native SDK. Shared startup code therefore does not need a compiler directive merely to call the registration extension.

## Source reference

These sources are pinned to the implementation used by the `9.0.345` packages. The Prism.Plugins repository requires authorized access.

- [`KochavaLoggerExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Kochava/KochavaLoggerExtensions.cs)
- [`KochavaLoggingService.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Kochava/KochavaLoggingService.cs)
- [`Prism.Plugin.Logging.Kochava.csproj`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Kochava/Prism.Plugin.Logging.Kochava.csproj)

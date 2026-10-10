---
sidebar_position: 3
uid: Plugins.Logging.Debug
---

# Debug

Install `Prism.Plugin.Logging.Debug` for formatted diagnostic output through `System.Diagnostics.Debug.WriteLine` when `Debugger.IsAttached` is true.

```csharp
using Prism.Plugin.Logging;

registry.UsePrismLogging(logging => logging.AddDebug(options =>
{
    options.DisableEvents();
}));
```

Both `AddDebug()` and an options callback are supported. Common logging and exception filters apply through `LoggerOptions<DebugLoggingService>`; this provider is configurable.

The provider checks for a debugger before writing, and `Debug.WriteLine` itself follows the library's compilation behavior. Do not depend on this sink for production diagnostics or claim that a missing Output-window line proves no code ran. [Console](console.md) is a separate stdout sink that does not require an attached debugger.

Disabling output is not a privacy boundary: application code still creates the message/properties, and another aggregate provider can receive the same event. Keep sensitive values out of the original call and review the [logging configuration](../index.md).

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Logging.Debug/DebugLoggingExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Debug/DebugLoggingExtensions.cs)
- [`src/Prism.Plugin.Logging.Debug/DebugLoggingService.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Debug/DebugLoggingService.cs)

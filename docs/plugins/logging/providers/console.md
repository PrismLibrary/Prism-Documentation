---
sidebar_position: 2
uid: Plugins.Logging.Console
---

# Console

Install `Prism.Plugin.Logging.Console`. The provider formats Prism logs, events, and exceptions and calls `System.Console.WriteLine`.

```csharp
using Prism.Plugin.Logging;

registry.UsePrismLogging(logging => logging.AddConsole(options =>
{
    options.ExcludedLoggingCategories = [LogCategory.Debug];
    options.DisableEvents();
}));
```

Use `AddConsole()` for default options. A desktop GUI launch may have no visible stdout; launch with an IDE/tool that captures output or redirect stdout through the host. This provider does not create a log file or send logs to a remote service.

Unlike the [Debug provider](debug.md), Console does not check for an attached debugger. Treat captured output as application data: exception text, user context, and scope/global properties can appear there. Category/event filters are not redaction. Review [filters and output boundaries](../index.md) before recording user-generated content.

Registration uses a transient provider with shared options. Keep the default lifetime so typed-logger scopes remain isolated. Console output is synchronous and is not a durable transaction/audit channel.

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Logging.Console/ConsoleLoggingService.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Console/ConsoleLoggingService.cs)
- [`src/Prism.Plugin.Logging.Console/ConsoleLoggingServiceExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Console/ConsoleLoggingServiceExtensions.cs)
- [`src/Prism.Plugin.Logging.Abstractions/GenericOutputLoggingService.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Abstractions/GenericOutputLoggingService.cs)

---
sidebar_position: 2
uid: Plugins.Logging.Console
description: "Write Prism messages, events, and exception reports to standard output with the Console logging provider."
---

# Console

Install `Prism.Plugin.Logging.Console` to write Prism messages, events, and exception reports through `System.Console.WriteLine`. The package includes .NET Standard 2.0, .NET 6, and .NET 8 assets.

```csharp
using Prism.Plugin.Logging;

containerRegistry.UsePrismLogging(logging =>
{
    logging.AddConsole();
});
```

The provider writes a heading identifying a logged message, tracked event, or reported exception, followed by its text and properties. It includes global properties, active scopes, and the current provider user when one is set. This is text output; it does not create a log file or manage retention. Your host or development tools must capture standard output to display it.

## Configure output

The options overload supports the common [logging filters](../index.md#configuration):

```csharp
logging.AddConsole(options =>
{
    options.ExcludedLoggingCategories = new[] { LogCategory.Debug };
    options.DisableEvents();
});
```

Generic messages, exception reports, and events are controlled separately. In this example, exceptions still appear and generic messages with other categories remain enabled. Use `EnableLogging` or `EnableErrorTracking` when you also need to disable those paths.

For output that is tied to an attached debugger, use the [Debug provider](debug.md). For assertions about recorded messages, use the [Testing provider](testing.md).

## Source reference

These sources are pinned to the implementation used by the `9.0.345` packages. The Prism.Plugins repository requires authorized access.

- [`ConsoleLoggingService.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Console/ConsoleLoggingService.cs)
- [`ConsoleLoggingServiceExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Console/ConsoleLoggingServiceExtensions.cs)

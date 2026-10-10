---
sidebar_position: 1
uid: Plugins.Logging.Microsoft
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Microsoft.Extensions.Logging interop

`Prism.Plugin.Logging.Microsoft.Interop` forwards Microsoft logging to your configured Prism providers. It does not register a Prism destination by itself: configure `UsePrismLogging(...)` in the application container as well as `AddPrismLogging()` in the Microsoft logging builder.

## Configure the host

The snippets below belong inside an application's existing startup; keep its container choice, shell/window setup, and navigation configuration.

<Tabs groupId="platform">
<TabItem value="maui" label=".NET MAUI">

Inside the existing `UsePrism` callback:

```csharp
using Prism;
using Prism.Plugin.Logging;

prism.RegisterTypes(registry =>
    registry.UsePrismLogging(logging => logging.AddConsole()));
prism.ConfigureLogging(logging => logging.AddPrismLogging());
```

Alternatively configure `builder.Logging.AddPrismLogging()` on the `MauiAppBuilder`, while retaining the Prism provider registration. Use one adapter-registration path.

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

In the existing Prism application:

```csharp
using Microsoft.Extensions.Hosting;
using Prism.Ioc;
using Prism.Plugin.Logging;

protected override void ConfigureHost(IHostBuilder builder)
{
    builder.ConfigureLogging(logging => logging.AddPrismLogging());
}

protected override void RegisterTypes(IContainerRegistry registry)
{
    registry.UsePrismLogging(logging => logging.AddConsole());
    // Retain the application's other registrations here.
}
```

Prism's Uno host bridges its service collection and application container. Complete registrations before the host resolves the adapter.

</TabItem>
<TabItem value="wpf" label="WPF">

A WPF Prism application does not gain a Microsoft host by adding the package. Configure the adapter in the application's existing Microsoft `ILoggingBuilder`, if it has one. Its `PrismLoggerProvider` constructor must be able to resolve `Prism.Plugin.Logging.ILogger` from that service provider. If Microsoft and Prism containers are separate, explicitly bridge the existing Prism logger with the intended ownership instead of creating a second unrelated aggregate.

</TabItem>
<TabItem value="avalonia" label="Avalonia">

The same host/provider requirement applies to Avalonia. Use the application's actual Microsoft host integration if present; `AddPrismLogging()` alone does not create one or connect two independent containers.

</TabItem>
</Tabs>

## What crosses the adapter

- The formatted Microsoft message becomes a Prism generic log.
- The Microsoft category name is the `Name` property.
- The Microsoft log level becomes the `Category` string, for example `Information` or `Warning`.
- A positive event ID, otherwise a nonempty event name, becomes `EventId`.
- An exception is sent through `Report`, with formatted-message and stack information when present.

At the inspected source checkpoint (`f0abcbb9`), the adapter does not preserve Microsoft structured state as separate key/value fields. Its `BeginScope` returns `null`, so Microsoft scopes are not forwarded. Its `IsEnabled` returns `true`; apply Microsoft builder/factory filtering upstream and configure Prism provider filters deliberately. These are statically observed implementation limits, not a promise that future adapters will discard this information; runtime behavior should be checked against the installed package. The provider alias is `Prism`. See [Microsoft's logging and filter guidance](https://learn.microsoft.com/en-us/dotnet/core/extensions/logging/overview).

Do not assume Microsoft's level strings match Prism's `Info`/`Warn` constants. Inspect each downstream provider's mapping. Avoid a reverse adapter that sends the same Prism output back into Microsoft logging and creates a loop. If a Microsoft console provider is also enabled, duplicate local output may be intentional or may need configuration changes.

`AddPrismLogging()` uses `TryAddEnumerable` for a singleton adapter provider, making repeated identical builder registration idempotent. The adapter disposes its captured Prism logger if that logger implements `IDisposable`; keep container/lifetime ownership consistent.

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Logging.Microsoft.Interop/PrismLoggingAdapterExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Microsoft.Interop/PrismLoggingAdapterExtensions.cs)
- [`src/Prism.Plugin.Logging.Microsoft.Interop/PrismLoggerProvider.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Microsoft.Interop/PrismLoggerProvider.cs)
- [`src/Prism.Plugin.Logging.Microsoft.Interop/PrismLoggerAdapter.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Microsoft.Interop/PrismLoggerAdapter.cs)

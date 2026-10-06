---
sidebar_position: 1
uid: Plugins.Logging.Microsoft
description: "Forward Microsoft logging into Prism 9.0 providers through MAUI or Uno host configuration."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Microsoft.Extensions.Logging Interop

`Prism.Plugin.Logging.Microsoft.Interop` forwards Microsoft logging calls to the application's configured Prism providers. The `9.0.345` package targets .NET 8. Configure both the Prism destination with `UsePrismLogging(...)` and the Microsoft adapter with `AddPrismLogging()`.

## Configure the host

The following snippets belong inside an application's existing startup. They route Microsoft output through Prism as the selected provider by clearing existing Microsoft providers first. Keep the application's other Prism services, shell, and navigation configuration.

<Tabs groupId="platform">
<TabItem value="maui" label=".NET MAUI">

Inside the existing `UsePrism` callback:

```csharp
using Microsoft.Extensions.Logging;
using Prism;
using Prism.Plugin.Logging;

prism.RegisterTypes(containerRegistry =>
    containerRegistry.UsePrismLogging(logging => logging.AddConsole()));

prism.ConfigureLogging(logging =>
{
    logging.ClearProviders();
    logging.AddPrismLogging();
});
```

Alternatively, configure `builder.Logging` on the existing `MauiAppBuilder` with the same Microsoft logging callback. Use one adapter-registration path and retain the Prism destination registration.

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

Inside the existing Prism application:

```csharp
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Prism.Ioc;
using Prism.Plugin.Logging;

protected override void ConfigureHost(IHostBuilder hostBuilder)
{
    hostBuilder.ConfigureLogging(logging =>
    {
        logging.ClearProviders();
        logging.AddPrismLogging();
    });
}

protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    containerRegistry.UsePrismLogging(logging => logging.AddConsole());
    // Retain the application's other registrations here.
}
```

Finish registration before the host resolves its loggers. This example requires `Prism.Plugin.Logging.Console` in addition to the interop package.

</TabItem>
</Tabs>

`PrismLoggerProvider` needs access to `Prism.Plugin.Logging.ILogger` through the Microsoft service provider. When the application maintains separate Microsoft and Prism containers, bridge the intended Prism logger explicitly. Installing the package alone does not connect two independent containers or create a Microsoft host for a desktop application.

## What crosses the adapter

- The formatted message is passed to Prism's generic `Log` method.
- The Microsoft category name becomes the `Name` property.
- The Microsoft log level becomes the `Category` string, except for `LogLevel.None`.
- A positive event ID, otherwise a nonempty event name, becomes `EventId`.
- Calls containing an exception use `Report`, with formatted-message and stack-trace properties when present.

Event IDs remain properties on a log or exception; they do not become Prism `TrackEvent` calls. Configure generic logging and exception-reporting options on the downstream provider accordingly.

## Filtering and validation

Configure Microsoft filters at the logging builder or factory, then apply any provider-specific Prism filters. Microsoft category values such as `Information` and `Warning` differ from Prism helper values such as `Info` and `Warn`; use the actual strings arriving at the provider when filtering.

The adapter forwards the formatted message and the fields listed above. When your application requires additional structured properties or operation context to reach Prism providers, pass them through the Prism logging contracts and `BeginScope`. Verify the resulting records with the [Testing provider](../providers/testing.md) and the destination used in production.

Avoid an adapter cycle that sends Prism output back into the same Microsoft pipeline. If you configure multiple output paths, check that a single application call produces the number of records you intend.

## Source reference

These sources are pinned to the implementation used by the `9.0.345` packages. The Prism.Plugins repository requires authorized access.

- [`PrismLoggingAdapterExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Microsoft.Interop/PrismLoggingAdapterExtensions.cs)
- [`PrismLoggerAdapter.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Microsoft.Interop/PrismLoggerAdapter.cs)
- [`PrismLoggerProvider.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Microsoft.Interop/PrismLoggerProvider.cs)

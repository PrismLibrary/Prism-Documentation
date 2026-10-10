---
sidebar_position: 5
uid: Plugins.Logging.Gelf
description: "Configure Prism 9.0 GELF transport, provider options, and local Graylog receiver validation."
---

# Logging with Graylog (GELF)

`Prism.Plugin.Logging.Gelf` sends Prism messages, events, and exception reports to a GELF-compatible server such as Graylog. It is useful for collecting diagnostics independently of an attached debugger or for sending logs to infrastructure managed by your organization. The `9.0.345` package includes .NET Standard 2.0 and .NET 8 assets.

## Setup

Create a GELF input on the receiving server and match its protocol, host, and port in the application. For example, to send UDP messages to a local input:

```csharp
using Prism.Plugin.Logging;

containerRegistry.UsePrismLogging(logging =>
{
    logging.AddUdpGelf(host: "127.0.0.1", port: 12201);
});
```

Other convenience methods are `AddTcpGelf` and `AddHttpsGelf`. All three default to host `127.0.0.1` and port `12201`. For HTTP or an explicit timeout, use the protocol overload:

```csharp
using Prism.Plugin.Logging;
using Prism.Plugin.Logging.Gelf;

containerRegistry.UsePrismLogging(logging =>
{
    logging.AddGelf(
        GelfProtocol.Http,
        host: "127.0.0.1",
        port: 12201,
        timeout: TimeSpan.FromSeconds(10));
});
```

HTTP and HTTPS post JSON to `/gelf` on the configured host and port. Pass a hostname or IP address in `Host`, not a complete URL or a path. The server must expose the corresponding input; the Graylog web interface port is not automatically a GELF ingestion port.

### Configure transport and logging

Pass a `GelfLoggerOptions` instance when you need both transport settings and provider filters:

```csharp
using Prism.Plugin.Logging;
using Prism.Plugin.Logging.Gelf;

containerRegistry.UsePrismLogging(logging =>
{
    logging.AddGelf(new GelfLoggerOptions
    {
        Protocol = GelfProtocol.Udp,
        Host = "127.0.0.1",
        Port = 12201,
        CompressUdp = true,
        ExcludedLoggingCategories = new[] { LogCategory.Debug },
        FormatEventName = (name, _) => $"Event: {name}"
    });
});
```

The stable API accepts an options object, rather than an options callback. Set `Host` explicitly when constructing the options yourself.

| Option | Default and purpose |
| --- | --- |
| `Protocol` | `Udp`; also supports `Tcp`, `Http`, and `Https` |
| `Host` | No default on a new options instance; receiving host |
| `Port` | `12201` |
| `Timeout` | 30 seconds; HTTP request and applicable stream-operation timeout |
| `CompressUdp` | `true`; enables gzip compression |
| `UdpCompressionThreshold` | `512` bytes; messages larger than this can be compressed |
| `UdpMaxChunkSize` | `8192` bytes; maximum UDP datagram size |
| `HttpHeaders` | Empty dictionary; headers for HTTP/HTTPS requests |

The common `LoggerOptions` filters are also available. By default, GELF formats event names as `Event: ` followed by the supplied name.

### Message contents

Generic messages and events become GELF short messages with additional fields from their properties, scopes, and global properties. Exception reports use the exception's message and include its string representation in an `Exception` field. A configured user is included as a `User` field. The serializer prefixes additional-field names with an underscore in the GELF payload.

A `Category` property selects the syslog severity when recognized; messages without a recognized category default to informational severity. Review the resulting message and severity at the receiver when adding another adapter to the pipeline.

## Local Debugging

Run a GELF-capable receiver, enable an input, and expose its port for the selected protocol. A container port published for TCP does not also publish UDP. Then send a recognizable message from the running application and verify it in the receiver:

```csharp
logger.Info("GELF connection check", ("Environment", "LocalDevelopment"));
```

`127.0.0.1` refers to the machine or device running the application. A physical device or separate container needs a reachable address for the receiver instead of the developer computer's loopback address. Check the input binding, network routing, and firewall when the message does not arrive.

This stable provider has no durable offline storage option. The logging contract does not return a delivery acknowledgement or expose a flush operation. Use a reachable receiver while testing and verify arrival there; a completed `Log` call is not confirmation that the server stored the message.

## Source reference

These sources are pinned to the implementation used by the `9.0.345` packages. The Prism.Plugins repository requires authorized access.

- [`GelfLoggingServiceExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Gelf/GelfLoggingServiceExtensions.cs)
- [`GelfLoggerOptions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Gelf/GelfLoggerOptions.cs)
- [`GelfLoggingService.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Gelf/GelfLoggingService.cs)
- [`HttpGelfClient.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Gelf/HttpGelfClient.cs)

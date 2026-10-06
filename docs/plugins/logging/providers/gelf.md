---
sidebar_position: 5
uid: Plugins.Logging.Gelf
---

# Graylog (GELF)

Install `Prism.Plugin.Logging.Gelf` to send Graylog Extended Log Format messages over UDP, TCP, HTTP, or HTTPS. Create a matching receiver input and use the application's reachable host/port; a phone's `localhost` refers to the phone, not your development computer.

```csharp
using Prism.Plugin.Logging;
using Prism.Plugin.Logging.Gelf;

registry.UsePrismLogging(logging => logging.AddGelf(new GelfLoggerOptions
{
    Protocol = GelfProtocol.Https,
    Host = "logs.example.com",
    Port = 443,
    Timeout = TimeSpan.FromSeconds(10)
}));
```

Replace the host/port with your configured destination. `Host` is the server hostname; the HTTP transport constructs the `/gelf` endpoint. Use [Graylog's current GELF input documentation](https://go2docs.graylog.org/current/getting_in_log_data/gelf.html) to configure transport, TLS, and the server's access policy. Do not copy an obsolete development stack or default credentials into production.

Convenience methods include `AddUdpGelf(host, port)`, `AddTcpGelf(host, port)`, and `AddHttpsGelf(host, port)`. The default protocol is UDP, which is fire-and-forget and does not support the persistent store. Browser hosts require HTTP(S), with normal CORS and mixed-content restrictions.

## Opt into bounded offline storage

`OfflineStore` defaults to `null`. For native TCP or HTTP(S), give the logger its own absolute application-private directory:

```csharp
var options = new GelfLoggerOptions
{
    Protocol = GelfProtocol.Https,
    Host = "logs.example.com",
    Port = 443,
    Timeout = TimeSpan.FromSeconds(10),
    OfflineStore = new GelfOfflineStoreOptions
    {
        DirectoryPath = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "ExampleApp", "Gelf"),
        MaxMessages = 1000,
        MaxBytes = 1024 * 1024,
        RetryInterval = TimeSpan.FromSeconds(30)
    }
};
registry.UsePrismLogging(logging => logging.AddGelf(options));
```

Use one registration approach, not both examples in the same container. The directory is exclusive to one active logger/process and bound to the destination. Do not reuse it for another endpoint, put it in cache/shared storage, or modify records while the logger owns it.

An accepted native log is serialized, written/flushed, and renamed synchronously before returning. Network replay uses a single FIFO worker. A full store, oversized record, or storage failure is reported synchronously to the logging caller; accepted records are not evicted to admit new ones. `OnError` can report background delivery/storage failures. Do not log through this provider or synchronously dispose it from that callback.

Defaults are 10,000 messages and 16 MiB of payload, excluding storage overhead. Failed sends, including HTTP 4xx, retain the head record and retry; a malformed retained record can block the queue. Recovery needs an application policy, not a claim that retries always fix invalid configuration.

## Uno BrowserWasm persistence

Configure `BrowserStorageKey` instead of `DirectoryPath`, then initialize on the browser thread before the first log:

```csharp
registry.UsePrismLogging(logging => logging.AddGelf(new GelfLoggerOptions
{
    Protocol = GelfProtocol.Https,
    Host = "logs.example.com",
    Port = 443,
    OfflineStore = new GelfOfflineStoreOptions
    {
        BrowserStorageKey = "example-app-gelf",
        MaxMessages = 1000,
        MaxBytes = 1024 * 1024
    }
}));

// After the application container exists, on the browser thread:
await containerProvider.InitializeGelfAsync(cancellationToken);
```

Initialization requires a secure context and Web Locks. A second active owner of the same key fails initialization. Registration alone acquires no ownership. Logging before initialization or on the wrong browser thread fails visibly. Initialization can be retried after cancellation/failure.

Browser records are a bounded plaintext `localStorage` snapshot. A completed write means the browser accepted it, not that bytes were physically flushed. Storage is readable by same-origin scripts and subject to quota, clearing, and eviction. Limits exclude snapshot/escaping overhead. This is not equivalent to native durable storage or a background service that survives a closed tab.

## Delivery, cancellation, and shutdown

Public Prism log/event/report calls have no per-message cancellation token. Once accepted into storage, a record belongs to the queue; canceling the producer's operation does not retract it. Native filesystem operations already in progress cannot be interrupted mid-commit.

HTTP removes a record after a successful 2xx response; that is not proof of indexing or durable server storage. TCP removes it after a successful socket write, with no application-level acknowledgment. Ambiguous failures or process termination around delivery can cause duplicates. Delivery is not exactly once.

Dispose the owning DI container at shutdown. For deterministic asynchronous ownership release, especially before another browser owner starts, call:

```csharp
await containerProvider.ShutdownGelfAsync();
```

Shutdown cancels delivery and retains pending records; it does not drain the queue. Remaining accepted records replay when a new owner resolves/initializes the logger. Uninstallation, storage cleanup, or corruption can still lose records.

Persisted payloads can include messages, exception details, user identifiers, and properties. HTTP headers are not stored, but queued payloads are plaintext. Select retention, access permissions, backup exclusion, and encryption requirements before enabling storage. Review [provider filtering](../index.md); it is not a general sanitizer.

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Logging.Gelf/GelfLoggingServiceExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Gelf/GelfLoggingServiceExtensions.cs)
- [`src/Prism.Plugin.Logging.Gelf/GelfLoggerOptions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Gelf/GelfLoggerOptions.cs)
- [`src/Prism.Plugin.Logging.Gelf/GelfOfflineStoreOptions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Gelf/GelfOfflineStoreOptions.cs)
- [`src/Prism.Plugin.Logging.Gelf/ReadMe.md`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Gelf/ReadMe.md)

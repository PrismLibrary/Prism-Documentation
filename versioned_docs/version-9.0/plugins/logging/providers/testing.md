---
sidebar_position: 9
uid: Plugins.Logging.Testing
description: "Assert on Prism logging calls using TestLogger, typed scopes, and in-memory test records."
---

# Prism.Plugin.Logging.Testing

Install `Prism.Plugin.Logging.Testing` to record calls in memory and assert against them in unit tests. It supports .NET Standard 2.0, .NET 6, and .NET 8 and does not send records to a remote service.

## Create a logger directly

`TestLogger.Create()` supplies the dependencies needed for a standalone logger. A typed wrapper also gives a service its implicit `Service` scope:

```csharp
using Prism.Plugin.Logging;
using Xunit;

public sealed class ExportDiagnosticsTests
{
    [Fact]
    public void RecordsCompletedExport()
    {
        var testLogger = TestLogger.Create();
        using var logger = testLogger.AsGenericLogger<ExportDiagnostics>();
        var service = new ExportDiagnostics(logger);

        service.RecordCompleted();

        var record = Assert.Single(logger.GetLogs());
        Assert.Equal(LogType.Event, record.Type);
        Assert.Equal("ExportCompleted", record.Message);
        Assert.Equal("Csv", record.InitialProperties["Format"]);
        Assert.Equal(nameof(ExportDiagnostics), record.CalculatedProperties["Service"]);
    }
}

public sealed class ExportDiagnostics(ILogger<ExportDiagnostics> logger)
{
    public void RecordCompleted() =>
        logger.TrackEvent("ExportCompleted", ("Format", "Csv"));
}
```

Use a fresh logger for each test to keep records and scopes isolated.

## Register with a container

```csharp
using Prism.Plugin.Logging;

containerRegistry.UsePrismLogging(logging =>
{
    logging.AddTest();
});
```

Resolve the service under test and inspect the same logger instance used for its calls. `GetLogs()` works with a `TestLogger`, an aggregate containing a single TestLogger, or a typed logger wrapper. It throws if no TestLogger can be located. Resolving a separate transient aggregate after the operation is not a way to retrieve the earlier instance's records.

## Inspect records

Each `Log` record exposes:

- `Type`: `Log`, `Report`, or `Event`
- `Message`: a message or event name, when applicable
- `Exception`: the exception supplied to `Report`, when applicable
- `InitialProperties`: properties supplied with the call
- `CalculatedProperties`: the record's calculated property dictionary

For message and event records, calculated properties include scopes, global properties, and the current user when set. For exception assertions, check `Type`, `Exception`, and the explicitly supplied properties. Keep assertions focused on the behavior the application needs to guarantee.

`AddTest` has no options callback and records calls without provider filtering. Passing these assertions validates application logging calls; it does not verify a remote provider's serialization, filters, or delivery. The [xUnit provider](xunit.md) combines these records with test-runner output.

## Source reference

These sources are pinned to the implementation used by the `9.0.345` packages. The Prism.Plugins repository requires authorized access.

- [`TestLogger.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Testing/TestLogger.cs)
- [`TestLoggerExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Testing/TestLoggerExtensions.cs)
- [`Log.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Testing/Log.cs)
- [`LogType.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Testing/LogType.cs)

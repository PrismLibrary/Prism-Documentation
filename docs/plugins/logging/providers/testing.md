---
sidebar_position: 9
uid: Plugins.Logging.Testing
---

# Testing logger

`Prism.Plugin.Logging.Testing` records messages in memory so tests can assert application outcomes without a network destination. Construct an isolated logger directly for a unit test:

```csharp
using Prism.Plugin.Logging;
using Xunit;

public sealed class DiagnosticsTests
{
    [Fact]
    public void Records_successful_export()
    {
        var recorder = TestLogger.Create();
        using var logger = recorder.AsGenericLogger<DiagnosticsTests>();

        using (logger.BeginScope("Operation", "Export"))
            logger.Info("Export completed", ("Outcome", "Succeeded"));

        var entry = Assert.Single(recorder.GetLogs());
        Assert.Equal(LogType.Log, entry.Type);
        Assert.Equal("Export completed", entry.Message);
        Assert.Equal("Succeeded", entry.CalculatedProperties["Outcome"]);
        Assert.Equal("Export", entry.CalculatedProperties["Operation"]);
    }
}
```

For integration tests register `logging.AddTest()` inside `UsePrismLogging`. `GetLogs()` can unwrap typed loggers and locate a single `TestLogger` in an aggregate. Inspect the same logger instance that the code under test used; resolving another transient aggregate/provider can produce a different recording list.

## What to assert

Each `Log` record has `Type`, `Message`, `Exception`, `InitialProperties`, and `CalculatedProperties`. Event and generic-log records include combined scope/global/user properties in `CalculatedProperties`. At the inspected source checkpoint (`f0abcbb9`), the exception `Report` implementation stores the original properties in both property fields, despite computing enriched properties internally; this is a static source observation, not a guaranteed future contract. Verify the installed package before using that path to assert scope/user enrichment.

Use isolated recorders per test and avoid concurrent writes to the public mutable list. Await the application operation before inspecting its output. Assert failed persistence, cancellation, successful retries, and privacy-sensitive sentinel exclusion as distinct cases. This provider verifies application logging calls, not transport delivery or native SDK behavior.

See [xUnit output](xunit.md) if you also want diagnostics in test runner output, and [logging contracts](../index.md) for provider lifetime and scope rules.

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Logging.Testing/TestLogger.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Testing/TestLogger.cs)
- [`src/Prism.Plugin.Logging.Testing/TestLoggerExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Testing/TestLoggerExtensions.cs)
- [`src/Prism.Plugin.Logging.Testing/Log.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Testing/Log.cs)

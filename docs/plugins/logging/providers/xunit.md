---
sidebar_position: 10
uid: Plugins.Logging.Xunit
---

# xUnit output

Install `Prism.Plugin.Logging.Xunit` in the test project. The current package uses xUnit v3's `Xunit.ITestOutputHelper`; do not copy an xUnit v2 `Xunit.Abstractions` helper into this registration without checking package compatibility.

```csharp
using Prism.Ioc;
using Prism.Plugin.Logging;
using Xunit;

public static class TestLogging
{
    public static void Register(IContainerRegistry registry, ITestOutputHelper output)
    {
        registry.UsePrismLogging(logging => logging.AddXunit(output));
    }
}
```

Pass the current test's output helper and use a fresh container per test. `AddXunit` registers both the output provider and the [Testing logger](testing.md), so the same application calls can appear in runner output and be inspected through `GetLogs()`. Do not add `AddTest()` a second time to this configuration.

Output belongs to the test's lifetime. Await asynchronous application work before the test ends; a late write is not guaranteed to be accepted by the runner. Keep remote production providers out of the test container and avoid sensitive data in recorded output. Scope/lifetime rules from [logging configuration](../index.md) still apply.

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Logging.Xunit/XunitTestLoggerExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Xunit/XunitTestLoggerExtensions.cs)
- [`src/Prism.Plugin.Logging.Xunit/Prism.Plugin.Logging.Xunit.csproj`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Logging.Xunit/Prism.Plugin.Logging.Xunit.csproj)

---
sidebar_position: 10
uid: Plugins.Logging.Xunit
description: "Connect Prism logging to xUnit test output and inspect recorded calls with the included Testing provider."
---

# Xunit

Install `Prism.Plugin.Logging.Xunit` to write Prism diagnostics through an xUnit `ITestOutputHelper`. Output is associated with the test that owns the helper, making it easier to inspect messages when a test fails.

```csharp
using Prism.Plugin.Logging;
using Xunit.Abstractions;

// testOutputHelper is the ITestOutputHelper supplied to the current test.
containerRegistry.UsePrismLogging(logging =>
{
    logging.AddXunit(testOutputHelper);
});
```

`AddXunit` registers the supplied helper, a text-output provider, and the [Testing provider](testing.md). You can inspect the aggregate's recorded calls with `GetLogs()` while retaining readable output in the test runner. You do not need to add `AddTest()` separately.

## Test lifetime and assertions

Create the container or logging setup for the test that owns the helper, and finish asynchronous application work before that test ends. Avoid sharing one helper across unrelated tests or writing through it after its test has completed.

Inspect the logger actually used by the service under test. Default logger registrations are transient, so resolving a new aggregate for the assertion can produce a different TestLogger instance.

The output provider uses default logging options and writes messages, events, exception details, and calculated properties. It does not have an options callback. If you only need assertions and no runner output, use `TestLogger.Create()` or `AddTest()` instead.

The `9.0.345` package includes .NET Standard 2.0, .NET 6, and .NET 8 assets and references `xunit.abstractions` 2.x. Check the test framework's output-helper API before adopting it in a test project using a different major version of xUnit.

## Source reference

These sources are pinned to the implementation used by the `9.0.345` packages. The Prism.Plugins repository requires authorized access.

- [`XunitTestLoggerExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Xunit/XunitTestLoggerExtensions.cs)
- [`XunitTestLoggingService.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Xunit/XunitTestLoggingService.cs)
- [`Prism.Plugin.Logging.Xunit.csproj`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Logging.Xunit/Prism.Plugin.Logging.Xunit.csproj)

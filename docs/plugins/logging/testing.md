---
uid: Plugins.Logging.Testing
---

# Prism.Plugin.Logging.Testing

Prism Logging also provides a more generic Testing logger that can be used to validate that logs were actually logged as part of your unit tests.

```cs
containerRegistry.UsePrismLogging(logging => {
    logging.AddTest();
});
```

When unit testing you can take advantage of the an additional extension method to get the Logs from the Test Logger. You can then interrogate the logs for your unit tests.

```cs
// NOTE: The Test logger can also be created manually for unit tests without the DI Container.
var logger = TestLogger.Create();
var service = new MyService(logger);
service.DoSomething();

var logs = logger.GetLogs();

// assuming you're using FluentAssertions
logs.Should().ContainSingle();
```

You can also use the Test logger with services that make use of the implicit type scope.

```cs
var logger = TestLogger.Create();
var service = new MyService(logger.AsGenericLogger<MyService>());
```

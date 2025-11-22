---
sidebar_position: 10
uid: Plugins.Logging.Xunit
---

# Xunit

Unit testing is critical to catching bugs early. But the logging that you might have in your application you probably don't want to have used in your unit tests. For this reason we have an Xunit provider that enables logging using the ITestOutputHelper. This will help to ensure that logs collected during a unit test are associated with the test and makes it easier to view the logged output from your tests.

```cs
containerRegistry.UsePrismLogging(logging => {
    logging.AddXunit(testOutputHelper);
});
```


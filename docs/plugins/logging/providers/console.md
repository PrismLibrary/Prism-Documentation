---
uid: Plugins.Logging.Console
---

# Console

By installing the `Prism.Plugin.Logging.Console` package you get access to the generic Console Logger. This will literally call `System.Console.WriteLine` to write logging messages.

```cs
containerRegistry.UsePrismLogging(logging => {
    logging.AddConsole();
});
```

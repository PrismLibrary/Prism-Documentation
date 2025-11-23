---
sidebar_position: 3
uid: Plugins.Logging.Debug
---

# Debug

Similar to the Console Logger is the Debug Logger. This will use `System.Diagnostics.Debug.WriteLine`, and will only write to `Debug.WriteLine` when the Debugger is currently attached. This is a great logger to use for debugging in your IDE and will not produce any logs in the device console if you forget to remove it for production.

```cs
containerRegistry.UsePrismLogging(logging => {
    logging.AddDebug();
});
```


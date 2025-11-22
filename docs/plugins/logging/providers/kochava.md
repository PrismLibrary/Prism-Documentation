---
sidebar_position: 6
uid: Plugins.Logging.Kochava
---

# Kochava

By installing the `Prism.Plugin.Logging.Kochava` package you get access to the Kochava Logging provider.

```cs
containerRegistry.UsePrismLogging(logging => {
    logging.AddKochava("{app secret}");
});
```

## Limitations & Considerations

Kochava is best utilized for application Analytics.

### API

Only the `TrackEvent` API has been implemented for Kochava. As a result there is no need to try to disable the Error Tracking or generic Logging.

### Supported Platforms

Kochava is only available on Android, iOS, & MacCatalyst. The `Prism.Plugin.Logging.Kochava` package can safely be used across any other targets you may have without the need to put a compiler directive around it. Adding the provider outside of the supported platforms will not result in any additional provider being added and you will not have a Kochava reference in your code.


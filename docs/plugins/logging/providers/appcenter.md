---
uid: Plugins.Logging.AppCenter
---

# AppCenter

While AppCenter has been deprecated and will be officially shut down in March of 2025 many apps continue to have a dependency on AppCenter. As a result Prism Logging will continue to ship the AppCenter package until it has been officially retired.

As previously mentioned, Prism.Plugin.Logging has a couple of interfaces which help users better map to the sort of calls that you might be used to with the AppCenter SDK. This can really help you in 2 critical ways.

1) By removing the static references to the AppCenter SDK from your codebase, your code becomes easier to manage over time as you have the ability to swap out providers or inject a mock for Unit Testing.
2) Since AppCenter is nearing EOL, it will be critical for businesses to continue using App Center while they evaluate other options. Prism.Plugin.Logging will help you to do just that by combining the AppCenter provider with the AggregateLogger as you evaluate other providers.

```cs
containerRegistry.UsePrismLogging(logging => {
    // By Default this registers Analytics and Crashes
    logging.AddAppCenter("appSecret");

    // If you need to customize the list with other providers
    logging.AddAppCenter("appSecret", typeof(Analytics), typeof(Crashes), typeof(Distribution));
});
```

# Prism.Plugin.Logging

Available now to Commercial Plus license holders on the Prism NuGet feed.

## Why another Logging Library?

It's a fair question. Certainly you may be thinking we already have a number of logging options using Microsoft.Extensions.Logging. While Microsoft Logging works great for a number of solutions it falls flat in a few key areas:

- It's hard to collect metrics with the context of a specific user
- It doesn't map well for Tracking Events and Error Reports similar to what developers are used to with AppCenter

Additionally Prism.Plugin.Logging allows you to opt into using the AggregateLogger. This allows you to register multiple logging providers which can be simultaneously streamed to. For instance you may want to use AppCenter while also testing out other providers like Graylog, Raygun or Sentry.

## Getting Started

Prism.Plugin Logging has a number of providers out of the box and it's fairly straight forward to implement custom solutions. There are 4 key interfaces that you may want to use from Prism.Plugin.Logging.

- IAnalyticsService
- ICrashesService
- IUserProvider

These 3 provide specific functionality that developers are generally looking for and can be helpful to write meaningful code as you can see clearly that you're tracking analytics, exceptions or managing the active user in your application. All 3 of these are included as part of the central `ILogger` interface, which additionally exposes a more generic `Log` method.

By default Prism Logging provides an Aggregate Logger allowing you to register and configure multiple logging providers. There is no additional configuration that you need to do in order to use this feature. To get started with Prism Logging you simply need to register it with the IContainerProvider:

```cs
containerRegistry.UsePrismLogging(logging => {
    // Register your providers
    logging.AddDebug();
});
```

### Configuration

Some logging providers such as the Null, Debug and Testing providers are intentionally not configurable as it makes sense to log all messages sent to them, or in the case of the Null logger nothing is logged anyway. The rest of the Logging providers provide some degree of configuration. This ensures that you can tailor the logging experience based on the provider. By default all features of the ILogger are enabled, however by optionally configuring the options, you can disable Event Tracking, Error Reporting, or you can disable or tune the generic logging.

To disable Event Tracking we can simply set the `EnableEventTracking` property to false

```cs
logging.AddConsole(o => o.EnableEventTracking = false);
```

To disable the Error Tracking we can simply set the `EnableErrorTracking` property to false

```cs
logging.AddConsole(o => o.EnableErrorTracking = false);
```

To disable generic logging we can simply set the `EnableLogging` property to false

```cs
logging.AddConsole(o => o.EnableLogging = false);
```

We can also tune the logging to filter out logged messages by category assuming that it has one. In the following case we will exclude any logs that have a property `Category` with the value `Debug`.

```cs
logging.AddConsole(o => o.ExcludedLoggingCategories = [LogCategory.Debug]);
```

Similarly we could exclude logs which lack a category property.

```cs
logging.AddConsole(o => o.ExcludedLoggingCategories = [LogCategory.Uncategorized]);
```

### Logging Scopes

Scopes allow you to provide additional properties automatically on any logs, events or errors that you send to the ILogger. This means that you can define a property one time and it will automatically be added for you without the need to specify it again within the scope. An implicit Service Scope can be created by providing a generic type argument when resolving the ILogger.

```cs
public class MyViewModel(ILogger<MyViewModel> logger) : BindableBase
{
}
```

Keep in mind that the `ILogger<T>` inherits from `ILogger` so when working with a base Service or ViewModel you can have a requirement for `ILogger` while injecting a typed `ILogger` in the implementing class.

```cs
public abstract class ViewModelBase(ILogger logger) : BindableBase { }

public sealed class ViewAViewModel(ILogger<ViewAViewModel> logger) : ViewModelBase(logger) { }
```

In addition to implicit scoping you can provide an explicit logging scope by creating a disposable scope within your code. There are a number of times this could be useful for instance you may want to chain this within Commands or helper methods to help provide additional context about the code path that lead to an event or error.

```cs
public abstract class ViewModelBase(ILogger logger, IRegionManager regionManager) : BindableBase
{
    protected void DoNavigation(string regionName, string viewName)
    {
        using (logger.CreateScope("Method", nameof(DoNavigation)))
        {
            logger.Debug($"Navigating to {viewName} in the {regionName} region.");
            regionManager.RequestNavigate(regionName, viewName);
        }
    }
}

public sealed class ViewAViewModel(ILogger<ViewAViewModel> logger, IRegionManager regionManager) : ViewModelBase(logger, regionManager)
{
    private void OnLogin()
    {
        using var _ = logger.CreateScope("Command", nameof(LoginCommand));
        // your login logic

        DoNavigation("MyContent", "ViewB");
    }
}
```

In the above example we can see that we have a single Debug log generated which has a simple message. However due to the Implicit and Explicit scopes we can expect to see the Service type, the Command name, and the Method name all added automatically as properties to our logged message.

## Logging Providers

Prism provides a number of logging providers available out of the box for you with additional providers currently under consideration. If we do not have integration for a provider that you would like please let us know on Discord.

### AppCenter

As previously mentioned, Prism.Plugin.Logging has a couple of interfaces which help users better map to the sort of calls that you might be used to with the AppCenter SDK. This can really help you in 2 critical ways.

1) By removing the static references to the AppCenter SDK from your codebase, your code becomes easier to manage over time as you have the ability to swap out providers or inject a mock for Unit Testing.
2) Since AppCenter is nearing EOL, it will be critical for businesses to continue using App Center while they evaluate other options. Prism.Plugin.Logging will help you to do just that by combining the AppCenter provider with the AggregateLogger as you evaluate other providers.

```cs
// By Default this registers Analytics and Crashes
containerRegistry.RegisterAppCenterLogger("appSecret");

// If you need to customize the list with other providers
containerRegistry.RegisterAppCenterLogger("appSecret", typeof(Analytics), typeof(Crashes), typeof(Distribution));
```

### Console Logger

By installing the `Prism.Plugin.Logging.Console` package you get access to the generic Console Logger. This will literally call `System.Console.WriteLine` to write logging messages.

```cs
containerRegistry.UsePrismLogging(logging => {
    logging.AddConsole();
});
```

### Debug Logger

Similar to the Console Logger is the Debug Logger. This will use `System.Diagnostics.Debug.WriteLine`, and will only write to `Debug.WriteLine` when the Debugger is currently attached. This is a great logger to use for debugging in your IDE and will not produce any logs in the device console if you forget to remove it for production.

```cs
containerRegistry.UsePrismLogging(logging => {
    logging.AddDebug();
});
```

### Graylog (GELF)

For more information see the [Gelf docs](xref:Plugins.Logging.Gelf).

### Microsoft.Extensions.Logging Interoperability

For more information see the [Microsoft.Extensions.Logging Interoperability docs](xref:Plugins.Logging.Microsoft).

### Raygun

```cs
containerRegistry.UsePrismLogging(logging => {
    logging.AddRaygun("RaygunApiKey");
});
```

### Sentry

```cs
containerRegistry.UsePrismLogging(logging => {
    logging.AddSentry("sentryDsn");
});
```

### Testing

For more information on Unit Testing support see the [Prism.Plugin.Logging.Testing docs](xref:Plugins.Logging.Testing).

### Xunit

Unit testing is critical to catching bugs early. But the logging that you might have in your application you probably don't want to have used in your unit tests. For this reason we have an Xunit provider that enables logging using the ITestOutputHelper. This will help to ensure that logs collected during a unit test are associated with the test and makes it easier to view the logged output from your tests.

```cs
containerRegistry.UsePrismLogging(logging => {
    logging.AddXunit(testOutputHelper);
});
```

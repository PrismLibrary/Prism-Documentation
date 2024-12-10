---
uid: Plugins.Logging
---

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

#### Customizing Event Tracking

Event Tracking is handled special in Prism Logging. This allows you to enable some very powerful scenarios that can include multiple providers working in concert with each provider determining what it can and cannot track. This is done through 2 properties which can be used independently. The first is the `CanLogEvent` delegate which passes the Event Name and the Properties and returns a boolean indicating whether or not the provider can track a given event.

```cs
logging.AddConsole(o =>
{
    // Disable Events for the provider
    o.CanLogEvent = (name, properties) => false;

    // Optionally we can also do the following
    o.DisableEvents();
});

logging.AddDebug(o =>
{
    // Conditionally Enable Event for the provider
    o.CanLogEvent = (name, properties) => properties.TryGetValue("Debug", out var value) && value == bool.TrueString;
});
```

The next delegate we have is the `FormatEventName` delegate. This again passes the provided event name and allows you to make any required modifications. If we put it all together you might have a situation where the Marketing team wants certain events and they want to use a platform like Kochava, while the development team might want some additional event tracking with App Center. In this case Prism Logging shines as it provides you the flexibility to customize the logger to your needs while only needing a single ILogger in your codebase.

```cs
logging.AddAppCenter("appSecret", o =>
    {
        o.CanLogEvent = (name, _) => name.StartsWith("Dev_");
        o.FormatEventName = (name, _) = name[4..];
    })
    .AddKochava("{app secret}", o =>{
        o.EnableErrorTracking = false;
        o.EnableLogging = false;
        o.CanLogEvent = (name, _) => !name.StartsWith("Dev_");
    });
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

- [AppCenter](xref:Plugins.Logging.AppCenter)
- [Console](xref:Plugins.Logging.Console)
- [Debug](xref:Plugins.Logging.Debug)
- [Firebase](xref:Plugins.Logging.Firebase)
- [Graylog (GELF)](xref:Plugins.Logging.Gelf)
- [Kochava](xref:Plugins.Logging.Kochava)
- [Raygun](xref:Plugins.Logging.Raygun)
- [Sentry](xref:Plugins.Logging.Sentry)
- [Testing](xref:Plugins.Logging.Testing)
- [Xunit](xref:Plugins.Logging.Xunit)

## Interop Extensions

- [Microsoft.Extensions.Logging Interoperability](xref:Plugins.Logging.Microsoft)
- [Prism.Plugins.Essentials](xref:Plugins.Logging.Essentials)

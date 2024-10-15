---
uid: Plugins.Logging.Microsoft
---

# Microsoft.Extensions.Logging Interop

We recognize that your apps (particularly .NET MAUI and Uno Platform), may have logging that occurs internally using Microsoft.Extensions.Logging. For this reason we've taken the time to put together a logging adapter that allows the logging output from the Microsoft.Extensions.Logging.ILogger to be passed through to the configured Prism Logging Providers that you have in your application. While the exact code may vary

## Prism for Uno Platform

```cs
public class App : PrismApplication
{
    protected override void ConfigureHost(IHostBuilder hostBuilder)
    {
        builder.UseLogging(configure: (context, logBuilder) => {
            logBuilder.AddPrismLogging();
        });
    }
}
```

## Prism for .NET MAUI

```cs
public static class PrismStartup
{
    public static void Configure(PrismAppBuilder builder)
    {
        builder.ConfigureLogging(logging => logging.AddPrismLogging());
    }
}
```

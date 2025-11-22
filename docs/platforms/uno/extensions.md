---
sidebar_position: 2
uid: Platforms.Uno.Extensions
---

# Uno.Extensions Support

Prism 9 for Uno.WinUI makes some opinionated choices that we feel ultimately enhances the development experience for those building apps with Uno Platform. One of the choices that we've made is to take a dependency on `Uno.Extensions.Hosting.WinUI`. As a result this makes it easier for Uno developers building apps with Prism to opt into the Uno.Extensions model for things like App Configuration, Http/Rest Clients, or even Authentication.

:::note
Prism is fundamentally not compatible with all of the Uno.Extensions. Specifically as Prism requires the use of the PrismApplication, this creates an inherent incompatibility with `Uno.Extensions.Maui.WinUI`. Similarly we do not suggest attempting to combine both Prism's Region Navigation and the Region Navigation in `Uno.Extensions.Navigation.WinUI`.
:::

## Setting up the Application

As part of the App Initialization you will find that the `OnLaunched` method is sealed by `PrismApplicationBase`. This is ultimately to protect you from inadvertently making changes that would lead to breaks in your Application Startup. Additionally part of the `Uno.Extensions.Hosting.WinUI` model we create for you and expose methods for you to make use of Uno's `IApplicationBuilder` and the `IHostBuilder` depending on what you need to extend.

```cs
public partial class App : PrismApplication
{
    protected override void ConfigureApp(IApplicationBuilder builder)
    {
        // Your logic here
    } 

    protected override void ConfigureHost(IHostBuilder builder)
    {
        // Your logic here
    }
}
```

It is important for Prism to control this process as we additionally take the extra steps of ensuring that both Prism and Uno.Extensions will maintain a single Dependency Injection Container. This ensures that regardless of whether a service is ultimately registered through the `IServiceCollection` or the `IContainerRegistry` your services will be available for you to inject throughout your application code with no additional effort.


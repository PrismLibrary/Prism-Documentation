# Migrating from Prism.Forms

With more than 5 million downloads Prsim.Forms has been an amazingly popular choice for Xamarin.Forms developers to build and develop their apps. While many features and API's remain the same or very similar there are some differences which you will need to be aware of before making an upgrade. The bulk of these changes are directly related to the startup/bootstrapping process. In Prism.Forms, the startup process was handled by PrismApplication as Xamarin.Forms itself had no real concept of Dependency Injection. 

.NET MAUI revolutionizes mobile app development for .NET Developers making Dependency Injection a first class concept even if you are not using Prism. It also shifts from the older paradigm of one project per platform plus a shared project to the new Single Project format. This allows for a radically different startup flow with the `MauiAppBuilder`. As a result, Prism for .NET MAUI no longer relies on `PrismApplication` and instead uses an extension on the `MauiAppBuilder`.

## Legacy PrismApplication Support

While there were a number of methods off of the `PrismApplication`, the majority of code most people wrote was located within 2 methods:

1. `OnInitialized`
2. `RegisterTypes`

To better support developers migrating code from Prism.Forms to Prism.Maui, both of these methods remain in the `PrismApplication` class, and will be called automatically on application startup. Any code that you might have customizing the container, adding Prism Modules, or customizing the ViewModelLocationProvider will need to be move to the `PrismAppBuilder`.

> [!Note]
> These methods will only be supported in .NET 6.0 & .NET 7.0. These are planned for removal in .NET 8.0.

### IPlatformInitializer Conversion

For those who may have been making use of Prism's IPlatformInitializer interface, the SingleProject provides a great place to keep move that code. As there is no need for the interface in Prism.Maui it no longer exists.

**EXISTING**
```cs
public class iOSPlatformInitializer : IPlatformInitializer
{
    public void RegisterTypes(IContainerRegistry containerRegistry)
    {
        // Register any platform specific implementations
    }
}
```

**RECOMMENDED**
```cs
// In the root namespace in the Platform Code Folder
// Keep the name the same on each platform to avoid compiler directives
public static class PlatformInitializer
{
    public static void RegisterTypes(IContainerRegistry containerRegistry)
    {
        // Register any platform specific implementations
    }
}

public class MauiProgram
{
    public static MauiApp CreateMauiApp() =>
        MauiApp.CreateBuilder()
            .UsePrismApp<App>(prism =>
                prism.RegisterTypes(container => {
                    PlatformInitializer.RegisterTypes(container);
                }))
            .Build();
}
```

## ViewModelLocator Autowire Property

Developers coming to Prism.Maui from Prism.Forms may be familiar with the `prism:ViewModelLocator.Autowire="true"` property. This goes back Prism's earliest days. In early Prism 6 versions this was implemented as a boolean flag meaning that if you wanted to opt out of use you just didn't reference it and if you wanted to Autowire the ViewModel you added the property and you knew that Prism would find and resolve the ViewModel and attach it as the BindingContext of your View. Before very long in Prism 6.2, this was changed to a nullable boolean allowing for what we have felt is really the intended behavior which is that Prism Applications should Autowire the ViewModel and that the behavior should be Opt-Out and not Opt-In.

In Prism.Maui we have introduced a breaking change. The change provides us more flexibility by allowing us to check if you Opted Out or already provided a ViewModel, and automatically Autowire the ViewModel once the View has been properly initialized by Prism. This allows us behind the scene to attach the Container Scope to the Page allowing us to always access correct container to resolve things as needed for Regions, or XAML Extensions, etc. For those developers migrating code which relied on the Opt-In behavior and thus did not explicitly declare the Autowire property, your code should migrate over without any changes besides changing the Xamarin.Forms xmlns to the new MAUI one. In the event that you have declared the Autowire property, this will need to be updated to the new Enum value that the property uses.
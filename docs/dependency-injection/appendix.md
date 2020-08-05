# Prism Container Extensions

Prism's out of the box registration methods cover you for most of your dependency injection scenarios. In fact there are many projects which will never need to do more than simply register a service as either a Transient or a Singleton in addition to registering Pages for Navigation. There are however times where you may need to do things like:

- Register a type using a factory method
- Register a single implementing type for more than one service
  - This may be done simply with Prism if you are registering it as a Transient, however the Container Extensions allow you to do this with a single line of code
  - You may also have a need for the service to be a singleton and use that same instance regardless of which interface was resolved.

In addition to this you may want to take advantage of extended version of Prism.Forms from the Container Extension as this provides more debugging hooks built in by default to give you better context around uncaught exceptions encountered in your application. For more information be sure to check out the [Prism.Container.Extensions](https://github.com/dansiegel/Prism.Container.Extensions) repo.

## Support for Shiny Lib

One of the best new libraries for Xamarin developers is without question the Shiny Library from Allan Ritchie. This provides a number of features from handling settings, determining whether you are connected to a network, background tasks, bluetooth and more. Shiny was built with Dependency Injection in mind from the start. This has a number of benefits including that it uses an interface based approach allowing you to mock any services from Shiny which you might inject into your ViewModels.

The one downside with Shiny is that it requires initialization before Xamarin.Forms or Prism have had a chance to initialize. This fundamentally changes the source of truth for your Dependency Injection. In order to properly combine both Prism and Shiny you will need to properly provide the DI container as the IServiceProvider that Shiny will use. The easiest way to do this is to use a container impelementation from [Prism.Container.Extensions](https://github.com/dansiegel/Prism.Container.Extensions) along with the [Shiny.Prism](https://www.nuget.org/packages/Shiny.Prism) NuGet from the same repo.

> [!NOTE]
> If you use the Extended Forms packages (Prism.DryIoc.Forms.Extended or Prism.Unity.Forms.Extended) you should not use the Container specific packages from Prism (Prism.DryIoc.Forms or Prism.Unity.Forms) as the PrismApplication in those packages is already configured to use the proper PrismContainerExtension.

You may elect to use Prism.Forms directly with one of the Container Extensions packages. If you do so you will want to update your app as follows:

```cs
public partial class App : PrismApplicationBase
{
    protected override IContainerExtension CreateContainerExtension() =>
        PrismContainerExtension.Current;
}
```

Using the Startup base class in Shiny.Prism you will then simply provide the container extension as follows:

```cs
public class Startup : PrismStartup
{
    public Startup()
        : base(PrismContainerExtension.Current)
    {
    }

    protected override void ConfigureServices(IServiceCollection services)
    {
        // Register any types you need to with Shiny
    }
}
```

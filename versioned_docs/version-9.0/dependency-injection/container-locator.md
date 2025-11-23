---
sidebar_position: 6
---

# The ContainerLocator

The ContainerLocator is new in Prism 8.0. This was introduced to help Prism get rid of a dependency on the CommonServiceLocator, and solve a number of internal issues where we must fallback to a ServiceLocator pattern such as within XAML Extensions.

The ContainerLocator also has some additional benefits for Prism, particularly for those developers working on Cross Platform applications such as .NET MAUI or Uno Platform. In these cases it may sometimes be necessary to initialize the container prior to initializing your Prism application. A common example of this would be apps that are leveraging Shiny. For such apps you may want to add the ServiceCollection to your Prism container and then return the ServiceProvider to Shiny. This allows both Prism and Shiny to maintain a single container rather than have multiple containers.

:::note
For those developers sponsoring [Dan Siegel](https://xam.dev/sponsor-prism-dan) it is recommended that you use the Prism.Magician for this.
:::

## How to use the ContainerLocator

Note that the ContainerLocator can set the container instance lazily by taking a delegate to create the container. It will NOT create the container until ContainerLocator.Container is called.

```csharp
var createContainerExtension = () => new DryIocContainerExtension();
ContainerLocator.SetContainerExtension(createContainerExtension);
```

:::warning
If you do not call `ContainerLocator.Current` or `ContainerLocator.Container` after setting the creation delegate, subsequent calls to `SetContainerExtension` will override your initial delegate.
:::

## Advanced Usage

Please note that the information here is for advanced users only. These API's are intentionally hidden from intellisense because they are not for common consumption. Use these at your own risk, and only under the right circumstances.

In the event that you need to access the raw IContainerExtension you can do so by accessing `ContainerLocator.Current`.

### Testing

While not entirely an uncommon issue, while unit testing it is commonly recommended that you reset the ContainerLocator. This ensures container is disposed and that the container instance is cleared along with the delegate to create a new instance.

```csharp
public class SomeTests : IDisposable
{
    public void Dispose()
    {
        ContainerLocator.ResetContainer();
    }
}
```

## Example Usage

In a ShinyStartup you might have something like:

```csharp
public class MyStartup : ShinyStartup
{
    private void RegisterTypes(IContainerRegistry container)
    {
        // Your normal registrations here...
    }

    private IContainerExtension CreateContainerExtension() =>
        new DryIocContainerExtension();

    public override IServiceProvider CreateServiceProvider(IServiceCollection services)
    {
        ContainerLocator.SetContainerExtension(CreateContainerExtension);
        var container = ContainerLocator.Container;
        container.RegisterServices(services);
        RegisterTypes(container);
        return container.GetContainer();
    }
}
```

In a XAML Extension

```csharp
public class SomeMarkupExtension : IMarkupExtension
{
    private static readonly Lazy<IEventAggregator> _lazyEventAggregator =
        new Lazy<IEventAggregator>(() => ContainerLocator.Container.Resolve<IEventAggregator>());

    private IEventAggregator EventAggregator => _lazyEventAggregator.Value;

    public object ProvideValue(IServiceProvider provider)
    {
        // your logic here...
    }
}
```


# Custom Containers

For a variety of reasons the Prism team cannot support every container that developers may want to use. Prism makes it very easy to use a container that isn't officially supported or shipped by the Prism Library.

Prism imposes the following requirements in order to use a container:

- The container must be mutable to support Prism Modularity
- The container must support Transient and Singleton registrations
- The container must support registering a specified instance
- The container must support keyed registrations / resolving by name
- The container must support accessing it's service registrations
- The container must support all three Prism platforms (WPF, Uno/WinUI/UWP, Xamarin.Forms)

In this topic we wil be creating a conatiner extension for the Grace DI container.

## Create a New Project

The first step is to create a new project that will contain the code for your DI container extension.

```shell
dotnet new classlib
```

Next you'll want to add a Reference to the Prism.Core and your container of choice

## Adding a Container Extension

Next, add a new class to your project and implement the `IContainerExtension` interface.  The `IContainerExtension` interface is used to create a mapping for the most common registration and resolution methods.

In the case of the Grace DI container we simply need to add this single class:

```cs
public class GraceContainerExtension : IContainerExtension<IInjectionScope>
{
    public GraceContainerExtension()
        : this(new DependencyInjectionContainer())
    {
    }

    public GraceContainerExtension(IInjectionScope injectionScope)
    {
        Instance = injectionScope;
    }

    public IInjectionScope Instance { get; }

    public bool SupportsModules => true;

    public void FinalizeExtension() { }

    public IContainerRegistry Register(Type from, Type to)
    {
        Instance.Configure(c => c.Export(to).As(from));
        return this;
    }

    public IContainerRegistry Register(Type from, Type to, string name)
    {
        Instance.Configure(c => c.Export(to).AsKeyed(from, name));
        return this;
    }

    public IContainerRegistry RegisterInstance(Type type, object instance)
    {
        Instance.Configure(c => c.ExportInstance(instance).As(type));
        return this;
    }

    public IContainerRegistry RegisterSingleton(Type from, Type to) =>
        Instance.Configure(c => c.Export(to).As(from).Lifestyle.Singleton());

    // NOTE: ContainerResolutionException is v8.0+
    public object Resolve(Type type)
    {
        try
        {
            return Instance.Locate(type);
        }
        catch(Exception ex)
        {
            throw new ContainerResolutionException(ex);
        }
    }

    // NOTE: ContainerResolutionException is v8.0+
    public object Resolve(Type type, string name)
    {
        try
        {
            return Instance.Locate(type, withKey: name);
        }
        catch(Exception ex)
        {
            throw new ContainerResolutionException(ex);
        }
    }
}
```

> [!NOTE]
> If using Prism 8+ you will need to additionally implement `IContainerInfo`, and your Resolve methods should catch any exception thrown by the container and rethrow using the Prism ContainerResolutionException.

## Create the Application Class

Once we've added this single class we only need to add to update our App as follows:

```cs
namespace Prism.Grace
{
    public partial class PrismApplication : PrismApplicationBase
    {
        protected override IContainerExtension CreateContainerExtension() => new GraceContainerExtension();
    }
}
```

As previously mentioned, Prism's IOC abstraction only provides the most common functionality. This means that you could find an advanced scenario where you need direct access to the underlying container. To achieve a more complex registration, you can add an extension method like we provide in the Container specific packages:

```cs
public static class ContainerExtensions
{
    public static IInjectionScope GetContainer(this IContainerRegistry containerRegistry) =>
        ((IContainerExtension<IInjectionScope>)containerRegistry).Instance;
}
```

# Custom Containers

For a variety of reasons the Prism team cannot support every container that developers may want to use. Prism makes it very easy to use a container that isn't officially supported or shipped by the Prism Library.

Prism imposes the following requirements in order to use a container:
- The container must be mutable to support Prism Modularity
- The container must support Transient and Singleton registrations
- The container must support registering a specified instance
- The container must support keyed registrations / resolving by name
- The container must support all three Prism platforms (WPF, UWP, Xamarin.Forms)

In this topic we wil be creating a conatiner extension for the Grace DI container.

## Create a New Project
The first step is to create a new project that will contain the code for your DI container extension.

TODO: fill this section out

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
 
    public void Register(Type from, Type to) =>
        Instance.Configure(c => c.Export(to).As(from));
 
    public void Register(Type from, Type to, string name) =>
        Instance.Configure(c => c.Export(to).AsKeyed(from, name));
 
    public void RegisterInstance(Type type, object instance) =>
        Instance.Configure(c => c.ExportInstance(instance).As(type));
 
    public void RegisterSingleton(Type from, Type to) =>
        Instance.Configure(c => c.Export(to).As(from).Lifestyle.Singleton());
 
    public object Resolve(Type type) =>
        Instance.Locate(type);
 
    public object Resolve(Type type, string name) =>
        Instance.Locate(type, withKey: name);
 
    public object ResolveViewModelForView(object view, Type viewModelType)
    {
        Page page = null;
 
        switch(view)
        {
            case Page viewAsPage:
                page = viewAsPage;
                break;
            case BindableObject bindable:
                page = bindable.GetValue(ViewModelLocator.AutowirePartialViewProperty) as Page;
                break;
            default:
                return Instance.Locate(viewModelType);
        }
 
        var navService = Instance.Locate<INavigationService>(withKey: PrismApplicationBase.NavigationServiceName);
        ((IPageAware)navService).Page = page;
        return Instance.Locate(viewModelType, new[] { navService });
    }
}
```
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

As I mentioned, Prism's IOC abstraction only provides the most common functionality. This means that you could find an advanced scenario where you need direct access to the underlying container. To achieve a more complex registration, you can add an extension method like we provide in the Container specific packages:
```cs
public static class ContainerExtensions
{
    public static IInjectionScope GetContainer(this IContainerRegistry containerRegistry) =>
        ((IContainerExtension<IInjectionScope>)containerRegistry).Instance;
}
```
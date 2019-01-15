# Managing Dependencies Between Components Using the Prism Library for WPF

Applications based on the Prism Library are composite applications that potentially consist of many loosely coupled types and services. They need to interact to contribute content and receive notifications based on user actions. Because they are loosely coupled, they need a way to interact and communicate with one another to deliver the required business functionality. To tie together these various pieces, applications based on the Prism Library rely on a dependency injection container.

Dependency injection containers reduce the dependency coupling between objects by providing a facility to instantiate instances of classes and manage their lifetime based on the configuration of the container. During the objects creation, the container injects any dependencies that the object requires into it. If those dependencies have not yet been created, the container creates and resolves their dependencies first. In some cases, the container itself is resolved as a dependency. For example, when using the Unity Application Block (Unity) as the container, modules have the container injected, so they can register their views and services with that container.

There are several advantages of using a container:

* A container removes the need for a component to locate its dependencies or manage their lifetimes.
* A container allows swapping of implemented dependencies without affecting the component.
* A container facilitates testability by allowing dependencies to be mocked.
* A container increases maintainability by allowing new components to be easily added to the system.

In the context of an application based on the Prism Library, there are specific advantages to a container:

* A container injects module dependencies into the module when it is loaded.
* A container is used for registering and resolving view models and views.
* A container can create the view models and injects the view.
* A container injects the composition services, such as the region manager and the event aggregator.
* A container is used for registering module-specific services, which are services that have module-specific functionality.

## Key Decision: Choosing a Dependency Injection Container

The Prism Library provides six options for dependency injection containers: Unity, MEF, AutoFAC, Dryloc, StructureMap and Ninject. The Prism Library makes them almost interchangable, but the container should still be carefully chosen. Not all containers support the concept of Prism Modules and not all containers are available on all of the different platforms that Prism supports.

| Prism WPF | WPF Modules | Xamarin | Xamarin Modules | UWP | UWP Modules |
|-----------|-------------|---------|-----------------|-----|-------------|
| Prism.AutoFac | No | Yes | No | No | No | No | 
| Prism.Dryloc | Yes | Yes | Yes | Yes | Yes | Yes | 
| Prism.MEF | Yes* | No | No | No | No | No | 
| Prism.NInject | Yes | Yes | Yes | No | No | No | 
| Prism.StructureMap | Yes | No | No | No | No | No | 
| Prism.Unity | Yes | Yes | Yes | Yes | Yes |

(*) Prism.MEF bootstraps the application in the old manner with a separate bootstrapper class and does not work off of the main App object.

## IContainerRegistry Interface

Each container is hidden behind an interface that provides standard functions used by the application for registering and resolving types.

| Functions          | Description |
|--------------------|-------------|
| ```GetInstance``` | Returns an instance of the native container hidden behind the interface. |
| ```Register(Type type)``` | Registers a type with the container for construction. |
| ```Register(Type type, string name)``` | Registers a type with the container for construction and gives it a scope to resolve against. |
| ```Register(Type from, Type to)``` | Registers a from, typically an interface, to a "to" that is a concrete class that implements the interface. |
| ```Register(Type from, Type to, string name)``` | Same as above but gives the resolution a scope to resolve against. |
| ```Register<T>()``` | Template style version of ```Register(Type type)```. |
| ```Register<T>(string name)``` | Template style version of ```Register(Type type, string name)```. |
| ```Register<TFrom, TTo>()``` | Template style version of ```Register(Type from, Type to)```. |
| ```Register<TFrom, TTo>(string name)``` | Template style version of ```Register(Type from, Type to, string name)```. |
| ```RegisterForNavigation(Type type, string name)``` | Used to register a view for navigation. Not really used in WPF. |
| ```RegisterForNavigation<T>(string name)``` | Used to register a view for navigation. Not used in WPF. |
| ```RegisterForNavigation<TView, TViewModel>(string name)``` | Used to register a view, its view model for navigation. Not used in WPF. |
| ```RegisterInstance(Type type, object instance)``` | Registers an object in the container and associates it with a type. |
| ```RegisterInstance<T>(T instance)``` | Template implementation of above. |
| ```RegisterSingleton(Type t)``` | Creates an instance of ```Type T``` upon demand. Once created, subsequent requests will get the same instance. |
| ```RegisterSingleton<T>()``` | Templated version of above but typed. |
| ```RegisterSingleton<TFrom, TTo>()``` | Templated version of above, but when ```TFrom``` is demanded, ```TTo``` is supplied. ```TFrom``` is typically an interface and ```TTo``` is the concrete class that implements the interface. |


### Registering and Resolving Objects

Applications make use of app specific services, for example, a service that could be used to manage a customer store of some kind. Many different objects in the app could make use of that customer store: one could list all the customers, one could add a new customer, one could list all the details for a single customer and permit editing.

All of these services can be hidden behind an interface:
```cs
public interface ICustomerStore
{
    IList<Customer> GetAllCustomers();
    bool AddNewCustomer(Customer customer);
    Customer GetCustomer(int id);
    bool UpdateCustomer(Customer customer);
}
```

This interface could be implemented in a number of different ways, such as over a SQL server, a REST API, a flat file, etc.
```cs
public class SqlCustomerStore : ICustomerStore
{
    /// implementation here
}
```
Remember from the initializing section, we need to register all of our services. Using the above, it could look like this:
```cs
protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    containerRegistry.Register<ICustomerStore, SqlCustomerStore>();
}
```

Now when the app needs to create the customer details view, Prism will also take care of instantiating the view model for the view see [ViewModelLocator](implementing-mvvm.md). The view model itself will have a dependency on the ```ICustomerStore``` interface such as below:
```cs
public class CustomerDetailViewModel : BaseViewModel
{
    CustomerDetailViewModel(ICustomerStore customerStore)
    {
    }
}
```
The application will use the container to create the viewmodel and it will see the dependency on ```ICustomerStore```. The container will create an instance of ```SqlCustomerStore``` for use in the constructor.

Of course the wonderful thing about this is that the app view model is decoupled from the implementation details of customer services. By simply changing the registration in ```RegisterTypes``` and the application will be updated everywhere.

Use either ```RegisterInstance``` or ```RegisterSingleton``` if the application needs to use the same instance of an object everywhere.

If you need container specific capabilities, use the ```Container``` property of your ```Application``` object to access. 


## Considerations for Using the Container

You should consider the following before using containers:

* Consider whether it is appropriate to register and resolve components using the container:
    * Consider whether the performance impact of registering with the container and resolving instances from it is acceptable in your scenario. For example, if you need to create 10,000 polygons to draw a surface within the local scope of a rendering method, the cost of resolving all of those polygon instances through the container might have a significant performance cost because of the container's use of reflection for creating each entity.
    * If there are many or deep dependencies, the cost of creation can increase significantly.
    * If the component does not have any dependencies or is not a dependency for other types, it may not make sense to put it in the container.
    * If the component has a single set of dependencies that are integral to the type and will never change, it may not make sense to put it in the container.

* Consider whether a component's lifetime should be registered as a singleton or instance:
    * If the component is a global service that acts as a resource manager for a single resource, such as a logging service, you may want to register it as a singleton.
    * If the component provides shared state to multiple consumers, you may want to register it as a singleton.
    * If the object that is being injected needs to have a new instance of it injected each time a dependent object needs one, register it as a non-singleton. For example, each view probably needs a new instance of a view model.

* Consider whether you want to configure the container through code or configuration:
    * If you want to centrally manage all the different services, configure the container through configuration.
    * If you want to conditionally register specific services, configure the container through code.
    * If you have module-level services, consider configuring the container through code so that those services are registered only if the module is loaded.

**Note:** Some containers, such as MEF, cannot be configured via a configuration file and must be configured via code.


## Using Another Container
If none of the containers meet the needs of the app, a custom implementation of Prism.Wpf.PrismApplicationBase can be derived with a new container as the app needs. In that case, use one of the existing libraries (i.e. Prism.Unity or Prism.Dryloc) as a template to build something app specific.




## IServiceLocator

The Prism WPF Region services also make use of the ```IServiceLocator``` interface for dynamically resolving regions in the user interface. ```IServiceLocator``` is implemented by ```ServiceLocatorImplBase``` which in turn is implemented by each of the containers. All ```IServiceLocator``` functions are in effect implemented by the container, so it will take advantage of all of the registrations that the application performs.

## Prism Registrations

Prism registers several services for you out of the box. You can use these in your app. Below is a list along with the type of registration.
- instance = one object for the app already created
- singleton = one object for the app, will get created on first use
- type = a new instance is created each time the type is requested from the container

| Service | Type | Implementation | Description |
|---------|------|----------------|-------------|
| IContainerExtension | Instance | Package dependent, could be Unity, Dryloc, etc. | This is the instance of your selected container see ```IContainerRegistry``` interface for details on available methods. |
| IModuleCatalog | Instance | ModuleCatalog | This class manages the independent modules for your application. If you want to use a different implementation, override the ```CreateModuleCatalog``` function in your ```Application``` class. |
| ILoggerFacade | Singleton | TextLogger | Used for logging messages in your app. This implementation outputs log messages to the console. If you want something different, register a different implementation in your ```RegisterTypes``` method of your ```Application``` class. |
| IModuleInitializer | Singleton | ModuleInitializer | This service handles loading and initializing modules in your application. See [Modules](modules.md) for more information on this service. |
| IModuleManager | Singleton | ModuleManager | This service is used to create a loading strategy for your application modules. It is used to ensure that modules are loaded in the right order with the correct dependencies. |
| RegionAdapterMappings | Singleton | RegionAdapterMappings | For use with composable UI. Tells the ```IRegionManager``` what type of adapter to use with the region container control. See [Composing the UI](Composing-the-ui.md) for more details. |
| IRegionManager | Singleton | RegionManager | This service will maintain the collection of regions and is responsible for creating the control for the region. See [Composing the UI](Composing-the-ui.md) for more details. |
| IEventAggregator | Singleton | EventAggregator | This service is used for communicating between components. Components don't need to know about each other, instead they just subscribe to message types. See [Communication](communication.md) for more details. |
| IRegionViewRegistry | Singleton | RegionViewRegistry | This service is used to manage the collection of regions. See [Composing the UI](Composing-the-ui.md) for more details. |
| IRegionBehaviorFactory | Singleton | RegionBehaviorFactory | Allows the registration of the default behaviors for regions. See [Composing the UI](Composing-the-ui.md) for more details. |
| IRegionNavigationJournalEntry | Type | RegionNavigationJournalEntry | For navigation, this represents a journal entry for tracking navigation within the ui. |
| IRegionNavigationJournal | Type | RegionNavigationJournal | Provides journaling of current, back and forward navigation within regions. See [Composing the UI](Composing-the-ui.md) for more details. |
| IRegionNavigationService | Type | RegionNavigationService | Provides navigation for regions. |

## More Information

For information related to containers, see the following:

* [Inversion of Control containers and the Dependency Injection pattern](http://www.martinfowler.com/articles/injection.html) on Martin Fowler's website.
* [Unity](https://github.com/unitycontainer/container)
* [AutoFac](https://github.com/autofac/Autofac)
* [Dryloc](https://github.com/dadhi/DryIoc)
* [MEF](https://github.com/MicrosoftArchive/mef)
* [NInject](http://www.ninject.org/)
* [StructureMap](https://github.com/structuremap/structuremap)

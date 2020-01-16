# Registering Types with Prism

For those who may be familiar with ASP.NET Core you may be familiar with 3 basic types of dependency registrations: Transients, Singletons, and Scoped Services. It is important to understand that Prism has no use, and no implementations for Scoped Services. Unlike the web environment in which many of your services are scoped around the User Request, for Desktop and Mobile applications we are dealing with a single user. As a result, we must instead decide whether for memory management and other business requirements our services are best suited as a single instance that will be reused throughout our application or whether we will create a new instance each time it is requested and then allow the Garbage Collector to free up the memory when we are done with it.

It is also important to consider that Prism has a hard requirement on the use of named service registrations. This is what allows Prism to register your Page for navigation and then resolve it later based on the Uri segment like `MyMasterDetailPage/NavigationPage/ViewA`. Any Dependency Injection container which does not support named services out of the box therefore cannot and will not be implemented officially by the Prism team.

## Registering Transient Services

For those services that you expect to create a new instance each time it is created you will simply call the `Register` method and provide the Service Type and the Implementing Type, except in cases where it may be appropriate to simply register the concrete type.

```cs
// Where it will be appropriate to use FooService as a concrete type
containerRegistry.Register<FooService>();

containerRegistry.Register<IBarService, BarService>();
```

## Registering Singleton Services

Many times you may have a service which is used throughout your application. As a result it would not be a good idea to create a new instance every time you need the service. In order to provide better memory management it is therefore a better practice to make such services a Singleton that can be used throughout the application. There are also many times in which you may need a service that retains it state throughout the lifecycle of your application. For either of these cases it makes far more sense to register your service as a Singleton.

> [!NOTE]
> Singleton Services are not actually created, and therefore do not start using memory until the first time the service is resolved by your application.

```cs
// Where it will be appropriate to use FooService as a concrete type
containerRegistry.RegisterSingleton<FooService>();

containerRegistry.RegisterSingleton<IBarService, BarService>();
```

### Registering a Service Instance

While many times you'll want to register a Singleton by simply providing the Service and Implementation types, there are times in which you may want to new up a service instance and provide it for a given service, or in which you may want to register the Current instance from a plugin such as MonkeyCache as shown below:

```cs
containerRegistry.RegisterInstance<IFoo>(new FooImplementation());

// Sample of using James Montemagno's Monkey Cache
Barrel.ApplicationId = "your_unique_name_here";
containerRegistry.RegisterInstance<IBarrel>(Barrel.Current);
```

## Understanding Named Services

Both the Transient and Singleton registration methods have overloads which allow you to specify a specific name for a given service which again may be very useful in some circumstances.

```cs
containerRegistry.Register<IVehicleService, CarService>("carService");
containerRegistry.Register<IVehicleService, TruckService>("truckService");
```

In the example here you may have a single interface `IVehicleService` which has an implementation for Cars and another for Trucks. In this scenario you may inject both implementations into a consuming type like:

```cs
public class ViewAViewModel
{
    private IVehicleService _carService { get; }
    private IVehicleService _truckService { get; }

    public ViewAViewModel(IVehicleService carService, IVehicleService truckService)
    {
        _carService = carService;
        _truckService = truckService;
    }

    private void DoSomething(VehicleType vehicleType)
    {
        switch(vehicleType)
        {
            case VehicleType.Car:
                _carService.DoFoo();
                break;
            case VehicleType.Truck:
                _truckService.DoFoo();
                break;
        }
    }
}
```

### How Prism uses Named Services under the hood

Prism uses named services in two major ways. The first is that the `NavigationService` is registered as a named service so that we can resolve it transitively and provide the specific Page which it will navigate from as all Navigation in Xamarin.Forms is relative to a specific Page.

The second way that Prism uses named services under the hood is for registering Pages for Navigation. Rather than Prism staticly tracking a mapping between a navigation key and the Page type it is simply registered as a named service like the following:

```cs
containerRegistry.Register<object, ViewA>("ViewA");
containerRegistry.Register<object, ViewB>("ViewB");
```

This then allows Prism behind the scenes to resove the Page like:

```cs
var viewA = (Page)Container.Resolve<object>("ViewA");
var viewB = (Page)Container.Resolve<object>("ViewB");
```

## Checking if a Service has been Registered

There are many times particularly when writing Prism Modules or Plugins in which you may want to check if a service has been registered and then do something based on whether it has or has not been registered.

> [!NOTE]
> When working with Prism Modules if you have a hard dependency on a given service it should be injected into the constructor so as to generate an exception when initializing the Module if the service type is missing. You should only use `IsRegistered` to check for it if your intent is to register a default implementation.

```cs
if (containerRegistry.IsRegistered<ISomeService>())
{
    // Do something...
}
```

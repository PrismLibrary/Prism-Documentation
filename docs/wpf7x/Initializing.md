# Initializing Applications Using the Prism Library for WPF

This topic addresses what needs to happen to get a Prism for WPF application up and running. A Prism application requires registration and configuration during the application startup process—this is known as bootstrapping the application. The Prism bootstrapping process includes creating and configuring a module catalog, creating a dependency injection container such as Unity, configuring default region adapter for UI composition, creating and initializing the shell view, and initializing modules.

## Initializing the Application

The Prism Library includes abstract classes that are derived from the Application class in WPF. Each of these abstract classes are centered around a dependency injection container. For the purposes of this article ```Prism.Unity.PrismApplication``` class will be used. Many of the methods in the ```PrismApplication``` class are virtual and can be overridden as appropriate for your needs.

The PrismApplication class takes care of much of the boilerplate code that would typically need to be included to start up an app. Apps are only required to implement CreateShell and RegisterTypes.

Below are the basic steps that take place within Prism for WPF.

| Step   | Override | Description |
|--------|----------|-------------|
| **1. Configure Viewmodel Locator** | Yes | This step creates the object that will automatically determine the correct view model type for a given view. |
| **2. Create DI Container** | Yes | This step will create the dependency injection container and register it with the Application class. Though it can be overridden, if the app is using one of the containers supplied by the Prism Library, it probably shouldn't be. |
| **3. Create Module Catalog** | Yes | This step creates the module catalog that is used to manage the loading and dependencies of the modules in an application. By default, this step provides the most basic module catalog implementation where the app registers modules via code. Override this to use a different catalog technique. |
| **4. DI Prism Services** | Yes | This step is used to register all of the services that Prism requires with the selected dependency injection container. It can be overridden, but probably shouldn't. App specific services should instead be registered in step 4 |
| **5. DI App Services** | **MUST** | This step is used to register all of the app specific services with the selected dependency injection container. This method must be implemented. |
| **6. Service Locator** | Yes | I don't know what this is for yet |
| **7. Configure Module Catalog** | Yes | If the app is registering modules via code, override this function to perform that operation. |
| **8. Configure Region Adapter Mappings** | Yes | This step configures the default region adapter mappings. |
| **9. Configure Region Behavior** | Yes | Configure the list of default behaviors that will be added to regions. |
| **10. Register Exceptions**| Yes | Registers exception types that are part of the framework. |
| **11. Create Main Window**| **MUST** | This step is used to create the main window and must be overridden for each app. Remember to use the container to create the object so that all the services will be injected. |
| **12. Initialize Modules** | Yes | This step is used to go through the module catalog and load and initialize each. Probably doesn't need to be overridden. |
| **13. OnInitialized** | Yes | Final step before the app is visible to the user. Just displays the MainWindow. Probably doesn't need to be overridden. |



## Dependency Injection

Applications built with the Prism Library rely on dependency injection provided by a container. The library provides assemblies that work with the Unity, AutoFAC, Dryloc, MEF, Ninject and StructureMap. It also allows the application to use other dependency injection containers. Part of the bootstrapping process is to configure this container and register types with the container.

## Creating the Shell

In a traditional Windows Presentation Foundation (WPF) application, a startup Uniform Resource Identifier (URI) is specified in the App.xaml file that launches the main window.

In an application created with the Prism Library, the application class will create the main window using the container so that any needed dependencies are automatically injected in, such as the Region Manager, the Event Aggregator etc. It would look something like this in the Application class:
```
protected override Window CreateShell()
{
    return Container.Resolve<MyAppMainWindow>();
}
```

## Key Decisions

After deciding to use the Prism Library in the application, there are a number of additional decisions that need to be made:

- Decide which dependency injection container to use: MEF, Unity, or another. The Prism Library supplies implementation for AutoFac, Dryloc, MEF, Ninject, StructureMap and Unity out of the box. Or you can use something else if that makes sense for you. For out of the box options, use Nuget to add the correct packages to the application
  - Prism.Unity
  - Prism.AutoFac
  - Prism.Dryloc
  - Prism.MEF
  - Prism.Ninject
  - Prism.StructureMap
- Determine the application-specific services required in the application. These will need to be registered with the container.
- Determine whether the built-in logging service is adequate for the application or if another logging service needs to be created.
- Determine how modules will be discovered by the application: via explicit code declarations, code attributes on the modules discovered via directory scanning, configuration, or XAML.

The rest of this topic provides more details.

## Core Scenarios

Creating a startup sequence is an important part of building a Prism application. This section describes the steps to take a new WPF application project created in Visual Studio and turn it into a Prism based app. Below it is assumed that Unity will be the dependency injection container.

### Add the Nuget Packages
After creating the project, add the Prism.Unity nuget package to the app. This will automatically add in other dependencies such as Prism.WPF, Prism.Core and Unity.

### Update the App Class to Derive from PrismApplication

In the App.xaml markup file, add in the name space declaration and update the base class type:
```
<prism:PrismApplication x:Class="HelloWorld.App"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:prism="http://prismlibrary.com/"
    xmlns:local="clr-namespace:HelloWorld">
    <Application.Resources>
         
    </Application.Resources>
</prism:PrismApplication>
```

And in the App.xaml.cs class, update the base class and override the abstract methods.
```
public partial class App : Prism.Unity.PrismApplication
{
    public App()
    {
    }

    protected override Window CreateShell()
    {
        // MainWindow is the shell window of the app
        return Container.Resolve<MainWindow>();
    }

    protected override void RegisterTypes()
    {
        // register app specific services here
    }
}
```

## Creating and Configuring the Container

Containers play a key role in an application created with the Prism Library. Both the Prism Library and the applications built on top of it depend on a container for injecting required dependencies and services. During the container configuration phase, several core services are registered. In addition to these core services, you may have application-specific services that provide additional functionality as it relates to composition. Register the application specific services in the ```RegisterTypes()``` function.


## Creating and Configuring the Module Catalog

If the app is a module application, a module catalog will need to be created and configured. Prism uses a concrete ```IModuleCatalog``` instance to keep track of what modules are available to the application, which modules may need to be downloaded, and where the modules reside.

The ```PrismApplication``` class provides a protected ```ModuleCatalog``` property to reference the catalog as well as a base implementation of the virtual ```CreateModuleCatalog``` method. The base implementation returns a new instance of ```ModuleCatalog```; however, this method can be overridden to provide a different ```IModuleCatalog``` instance, one that uses a configuration file instead.

```cs
protected override IModuleCatalog CreateModuleCatalog()
{
    // When using MEF, the existing Prism ModuleCatalog is still
    // the place to configure modules via configuration files.
    return new ConfigurationModuleCatalog()
}
```

### Core Services

The following table lists the core non-application specific services in the Prism Library.

| Service interface      | Description |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **IModuleManager**     | Defines the interface for the service that will retrieve and initialize the application's modules. |
| **IModuleCatalog**     | Contains the metadata about the modules in the application. The Prism Library provides several different catalogs.|
| **IModuleInitializer** | Initializes the modules. |
| **IRegionManager**     | Registers and retrieves regions, which are visual containers for layout.|
| **IEventAggregator**   | A collection of events that is loosely coupled between the publisher and the subscriber. |
| **ILoggerFacade**      | A wrapper for a logging mechanism, so you can choose your own logging mechanism. The Stock Trader Reference Implementation (Stock Trader RI) uses the Enterprise Library Logging Application Block, via the **EnterpriseLibraryLoggerAdapter** class, as an example of how you can use your own logger. The logging service is registered with the container by the bootstrapper's **Run** method, using the value returned by the **CreateLogger** method. Registering another logger with the container will not work; instead override the **CreateLogger** method on the bootstrapper. |
| **IServiceLocator**    | Allows the Prism Library to access the container. If you want to customize or extend the library, this may be useful. |



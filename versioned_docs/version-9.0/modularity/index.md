---
sidebar_position: 1
uid: Modularity.GettingStarted
---

# Modularity {#modular-application-development-using-prism-library}

A Prism module is a feature's registration and initialization boundary. It implements `Prism.Modularity.IModule`, contributes services and views, and can declare dependencies on other modules. A module can live in its own project, but a separate assembly is not required.

## Benefits of Building Modular Applications

Use modules when features need independent ownership or deferred initialization. Related views and services can be maintained together while sharing a small set of contracts with the rest of the application. A small application can use its application-level registrations without adding a module for every view.

## Prism's Support for Modular Application Development

Prism provides a catalog to describe modules, a manager to coordinate loading, and an initializer to create each module and invoke its lifecycle. Registering a class in the container alone does not add it to the module catalog.

## Core Concepts

### IModule: The Building Block of Modular Applications

```csharp
using Prism.Ioc;
using Prism.Modularity;

public sealed class CustomersModule : IModule
{
    public void RegisterTypes(IContainerRegistry containerRegistry)
    {
        containerRegistry.RegisterSingleton<ICustomerDirectory, CustomerDirectory>();
    }

    public void OnInitialized(IContainerProvider containerProvider)
    {
        // Integrate the feature after its registrations exist.
        // For example, contribute a registered view to a shell region.
    }
}
```

`ICustomerDirectory` and `CustomerDirectory` are application-defined service types. Keep their shared contracts in a project that consumers can reference without referencing the feature's UI.

### Module Lifecycle

- `RegisterTypes` declares services, navigation views and dialogs. Do not start asynchronous work or resolve the feature's own services here.
- `OnInitialized` performs short, synchronous integration after that module's registrations have completed.

The initializer constructs a module before calling `RegisterTypes`. Its constructor therefore cannot depend on a service registered only by that same module. Resolve that service during `OnInitialized`, or move its registration into a dependency initialized earlier.

### Module Catalog

The [catalog](module-catalog.md) gives each module a name, an initialization mode and any dependencies. Declare dependencies by their catalog names, and keep those names stable.

### Controlling When to Load a Module

`InitializationMode.WhenAvailable` selects startup initialization. `InitializationMode.OnDemand` defers initialization until the module manager receives a load request. On-demand loading does not itself download an assembly, create a container scope or unload a completed feature.

### Integrate Modules With The Application

The shell owns region names and layout. A module can register a view for navigation, then contribute it to a region by name:

```csharp
using Prism.Navigation.Regions;

public void OnInitialized(IContainerProvider containerProvider)
{
    var regions = containerProvider.Resolve<IRegionManager>();
    regions.RegisterViewWithRegion("CustomerToolsRegion", typeof(CustomerToolsView));
}
```

For this type-based discovery example, register the concrete `CustomerToolsView` and its dependencies on WPF/Uno. Use `RegisterForNavigation<CustomerToolsView, CustomerToolsViewModel>()` as well if the feature also exposes a navigation route and explicit view-model pairing. On MAUI, use `RegisterForRegionNavigation<CustomerToolsView, CustomerToolsViewModel>()`. View discovery can wait for the host region to be created; a direct `RequestNavigate` needs an existing region. See [Region Manager](../navigation/regions/region-manager.md).

### Communicate Between Modules

Prefer shared service interfaces or deliberate event contracts for cross-feature communication. Avoid having one feature construct another feature's view model or navigate to undocumented string routes.

### Dependency Injection and Modular Applications

Module lifetime and service lifetime are separate choices. Use the [container registration guidance](../dependency-injection/registering-types.md) to choose transient, scoped or singleton services deliberately. A module is not a dependency-injection scope.

## Key Decisions

Decide which features initialize at startup, which depend on other features, and which platforms must share the module code. Choose explicit catalog registration by default; dynamic discovery adds deployment, runtime and trust requirements.

## Partition Your Application into Modules

Group a coherent feature's registrations and integration work together. Keep shared contracts independent of feature UI assemblies, and avoid circular dependencies between modules.

### Determine Ratio of Projects to Modules

A project may contain multiple modules, and a feature may use several supporting projects. Do not equate every assembly with a module. Choose boundaries around ownership and initialization requirements.

## Use Dependency Injection for Loose Coupling

Inject shared interfaces rather than constructing another module's concrete services. A constructor dependency must already be registered when that object is created. Module constructors are created before their own `RegisterTypes` callback, so move same-module service use into `OnInitialized`.

## Learning path

1. [Module Catalog](module-catalog.md): choose startup versus on-demand modules and declare dependencies.
2. [Module Initialization](module-initialization.md): understand ordering, results and failure handling.
3. [Region navigation](../navigation/regions/index.md): compose the feature's views.
4. [Container registration](../dependency-injection/registering-types.md): choose service lifetimes independently of module lifetime.

## Platform boundaries

WPF uses the desktop module manager and catalog implementation. MAUI and Uno use a lighter implementation for modules already available to the application. They share `IModule` and `IModuleCatalog`, but do not have identical dynamic assembly-loading or startup-order behavior.

In Prism 9.0 MAUI, application `OnInitialized` delegates run before the module manager. In Uno, the application callback follows module startup. See [Module Initialization](module-initialization.md) before resolving module-provided services during application startup.

## Core Scenarios

### Defining a Module

Implement `IModule`, as in the example above. `IModuleInfo` is catalog metadata; it is not the interface that implements a feature's registration and initialization methods.

### Registering and Discovering Modules

Choose the mechanism that fits the target platform and how feature assemblies are deployed.

#### Registering Modules in Code

Use `ConfigureModuleCatalog` on WPF/Uno or the MAUI builder callback, then add module types with `AddModule<T>()`. See the [platform-specific examples](module-catalog.md#configure-the-catalog).

#### Registering Modules Using a XAML File

For WPF application resources, return `XamlModuleCatalog` from `CreateModuleCatalog`. Use `InitializationMode="OnDemand"` on XAML module entries. See [WPF XAML catalogs](module-catalog.md#read-a-wpf-xaml-resource-catalog).

#### Registering Modules Using a Configuration File

For WPF, `ConfigurationModuleCatalog` reads a modules configuration section. Its `startupLoaded` attribute belongs to configuration entries, not XAML `ModuleInfo` objects. See [configuration catalogs](module-catalog.md#read-an-application-configuration-catalog).

#### Discovering Modules in a Directory

WPF's `DirectoryModuleCatalog` can discover trusted deployed module assemblies. Its behavior differs between .NET and .NET Framework; see [directory discovery](module-catalog.md#discover-modules-in-a-directory). It is not a portable MAUI/Uno module-download API.

## Other Modularity Items of Note

### Requesting On-Demand loading of Module

Call `IModuleManager.LoadModule` with the exact catalog name. It returns `void`, so use the module's initialized state and completion events where appropriate. See [on-demand loading](module-initialization.md#load-an-on-demand-feature).

### Detecting When a Module is Loaded

Subscribe to `LoadModuleCompleted` before requesting a load, filter for the requested module, and inspect its error. Also handle exceptions from the initiating call; desktop initializer failures and loader failures have different paths. See [failure handling](module-initialization.md#observe-and-handle-failures).

Source (Prism 9.0.537): [IModule contract](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Modularity/IModule.cs), [desktop initializer](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Modularity/ModuleInitializer.cs), [MAUI/Uno initializer](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Modularity/ModuleInitializer.cs).

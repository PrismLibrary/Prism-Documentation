---
sidebar_position: 1
uid: Modularity.GettingStarted
---

# Modularity

A Prism module is a feature's registration and initialization boundary. It implements `Prism.Modularity.IModule`, contributes services and views, and can declare dependencies on other modules. A module can live in its own project, but a separate assembly is not required.

Use modules when features need independent ownership or deferred initialization. A small application can use its application-level registrations without adding a module for every view.

## A module's two responsibilities

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

- `RegisterTypes` declares services, navigation views and dialogs. Do not start asynchronous work or resolve the feature's own services here.
- `OnInitialized` performs short, synchronous integration after that module's registrations have completed.

The initializer constructs a module before calling `RegisterTypes`. Its constructor therefore cannot depend on a service registered only by that same module. Resolve that service during `OnInitialized`, or move its registration into a dependency initialized earlier.

## Compose features without coupling their screens

The shell owns region names and layout. A module can register a view for navigation, then contribute it to a region by name:

```csharp
using Prism.Navigation.Regions;

public void OnInitialized(IContainerProvider containerProvider)
{
    var regions = containerProvider.Resolve<IRegionManager>();
    regions.RegisterViewWithRegion("CustomerToolsRegion", "CustomerToolsView");
}
```

Register `CustomerToolsView` first with `RegisterForNavigation` on WPF/Uno/Avalonia or `RegisterForRegionNavigation` on MAUI. View discovery can wait for the host region to be created; a direct `RequestNavigate` needs an existing region. See [Region Manager](../navigation/regions/region-manager.md).

Prefer shared service interfaces or deliberate event contracts for cross-feature communication. Avoid having one feature construct another feature's view model or navigate to undocumented string routes.

## Learning path

1. [Module Catalog](module-catalog.md): choose startup versus on-demand modules and declare dependencies.
2. [Module Initialization](module-initialization.md): understand ordering, results and failure handling.
3. [Region navigation](../navigation/regions/index.md): compose the feature's views.
4. [Container registration](../dependency-injection/registering-types.md): choose service lifetimes independently of module lifetime.

## Platform boundaries

WPF and Avalonia use the desktop module manager and catalog implementation. MAUI and Uno use a lighter implementation for modules already available to the application. They share `IModule` and `IModuleCatalog`, but do not have identical dynamic assembly-loading or startup-order behavior.

On-demand means that Prism defers initialization until requested. It does not automatically download code, unload an initialized feature, create a container scope or make a feature NativeAOT-compatible. For NativeAOT, use the [supported container and explicit registration guidance](../dependency-injection/native-aot.md); do not carry a directory-scanning plugin model into an AOT build.

Source: [IModule contract](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Prism.Core/Modularity/IModule.cs), [desktop initializer](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Wpf/Prism.Wpf/Modularity/ModuleInitializer.cs), [MAUI/Uno initializer](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Modularity/ModuleInitializer.cs).

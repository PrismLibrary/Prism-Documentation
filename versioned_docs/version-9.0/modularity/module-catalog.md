---
sidebar_position: 2
uid: Modularity.ModuleCatalog
---

# Module Catalog

The module catalog describes which modules exist, how they are named, when they initialize and which modules they depend on. Adding a module to the catalog does not itself execute its `RegisterTypes` or `OnInitialized` methods; the module manager performs that work.

Prefer explicit, code-based registration for application features that ship together. It makes the feature set inspectable and avoids a runtime assembly-discovery requirement.

:::note Prism 9.0 source scope
The platform distinctions below are based on the source recorded in the Prism 9.0.537 packages. In particular, the MAUI/Uno startup-order caveat is a static-source observation, not a newly executed runtime reproduction. Validate dependency ordering on the exact package and platform you ship.
:::

## Configure the catalog

These examples assume application module classes `InfrastructureModule`, `CustomersModule` and `ReportsModule`, each implementing `IModule`. Add `using Prism.Modularity;`.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="platform">
<TabItem value="wpf" label="WPF" default>

Override the application's catalog configuration:

```csharp
protected override void ConfigureModuleCatalog(IModuleCatalog catalog)
{
    catalog.AddModule<InfrastructureModule>();
    catalog.AddModule<CustomersModule>(
        InitializationMode.WhenAvailable, nameof(InfrastructureModule));
    catalog.AddModule<ReportsModule>(
        InitializationMode.OnDemand, nameof(InfrastructureModule));
}
```

The desktop manager initializes and validates the catalog, expands startup dependencies and initializes dependencies before their consumers.

</TabItem>
<TabItem value="maui" label=".NET MAUI">

Inside the `UsePrism` configuration callback:

```csharp
prism.ConfigureModuleCatalog(catalog =>
{
    catalog.AddModule<InfrastructureModule>();
    catalog.AddModule<CustomersModule>(
        InitializationMode.WhenAvailable, nameof(InfrastructureModule));
    catalog.AddModule<ReportsModule>(
        InitializationMode.OnDemand, nameof(InfrastructureModule));
    catalog.Initialize();
});
```

In Prism 9.0, `ConfigureModuleCatalog` adds an application `OnInitialized` delegate. The builder runs all such delegates in registration order, then starts the module manager. Register catalog configuration before any delegate that inspects the catalog. Application `OnInitialized` delegates must not depend on services registered only by modules, because those modules have not run yet. Use `CreateWindow` or a later workflow for that work.

The 9.0 MAUI manager enumerates startup modules in catalog order rather than expanding their dependencies first. Keep prerequisites before consumers and explicitly validate with `Initialize()`. An explicit `LoadModule` request does use the catalog's dependency expansion and ordering.

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

```csharp
protected override void ConfigureModuleCatalog(IModuleCatalog catalog)
{
    catalog.AddModule<InfrastructureModule>();
    catalog.AddModule<CustomersModule>(
        InitializationMode.WhenAvailable, nameof(InfrastructureModule));
    catalog.AddModule<ReportsModule>(
        InitializationMode.OnDemand, nameof(InfrastructureModule));
    catalog.Initialize();
}
```

Uno compiles the MAUI modularity implementation. Its startup manager enumerates the catalog's startup modules in order, so put prerequisites first and validate explicitly. Uno's application startup differs from MAUI's: Prism runs modules after the shell has loaded and before the application's `OnInitialized` callback.

</TabItem>
</Tabs>

## Names, modes and dependencies

- The default module name is `typeof(TModule).Name`. An explicit name becomes the key used by dependencies and `LoadModule`.
- `InitializationMode.WhenAvailable` selects startup initialization.
- `InitializationMode.OnDemand` defers initialization until requested.
- Dependencies are module names, not assembly filenames, service types or region names.

For an explicit name, use the overload that also names the mode to make the intent clear:

```csharp
catalog.AddModule<ReportsModule>(
    "Reporting", InitializationMode.OnDemand, nameof(InfrastructureModule));
```

Then load `"Reporting"`, not `nameof(ReportsModule)`. The generic `LoadModule<ReportsModule>()` extension uses the type's short name and does not discover that alias.

Catalog validation rejects duplicate names, missing dependencies, dependency cycles and a startup module depending on an on-demand module. WPF module groups add another boundary: a grouped module may depend on its own group or groupless modules, while groupless modules cannot depend on a grouped module. For ordinary application features, a flat catalog is usually easier to maintain.

## WPF deployment-based catalogs

For an existing WPF application that deploys trusted module assemblies separately, the desktop APIs also support the following approaches.

### Discover modules in a directory

```csharp
protected override IModuleCatalog CreateModuleCatalog() =>
    new DirectoryModuleCatalog { ModulePath = @".\Modules" };
```

Use `[Module(ModuleName = "Reports", OnDemand = true)]` and `[ModuleDependency("InfrastructureModule")]` on discoverable module classes when metadata must come from the assemblies.

The catalog performs discovery when it loads; it does not continually watch the folder. In the 9.0 .NET implementation, discovery uses the current application domain and `Assembly.LoadFrom`. It does not use a collectible discovery load context. The .NET Framework implementation uses a separate application domain for discovery; neither approach provides a general way to unload initialized features. Only load assemblies you trust, and test discovery with your target runtime and deployed dependencies.

### Read an application configuration catalog

```csharp
protected override IModuleCatalog CreateModuleCatalog() =>
    new ConfigurationModuleCatalog();
```

The WPF configuration section is `Prism.Modularity.ModulesConfigurationSection, Prism.Wpf`. Entries specify `moduleName`, `moduleType`, `assemblyFile`, and optionally `startupLoaded="false"`. Keep assembly-qualified type names and deployed paths correct. A catalog change cannot turn an incompatible binary into a compatible feature.

### Read a WPF XAML resource catalog

```csharp
protected override IModuleCatalog CreateModuleCatalog() =>
    new XamlModuleCatalog(new Uri(
        "/MyApplication;component/ModulesCatalog.xaml", UriKind.Relative));
```

`ModulesCatalog.xaml` must be packaged as a WPF application resource containing a `ModuleCatalog`. Use `InitializationMode="OnDemand"` on a `ModuleInfo` in XAML. `startupLoaded` is a configuration-file attribute, not a Prism 9.0 `ModuleInfo` XAML property. The old `ModuleCatalog.CreateFromXaml(...)` call is not the public API for this implementation.

## Platform and deployment limits

MAUI and Uno's `ModuleInfo` represents types already present in the application; its `IModuleInfo.Ref` getter is not supported. Do not use a desktop `file://` module catalog as a portable download mechanism.

Prefer explicit registration for features shared across WPF, MAUI and Uno. Discovery, registration and initialization are separate stages; successful catalog validation does not establish that a deployed assembly can be loaded or that its services can be resolved.

Source (Prism 9.0.537): [shared catalog validation](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Modularity/ModuleCatalogBase.cs), [desktop catalog extensions](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Modularity/IModuleCatalogExtensions.cs), [MAUI catalog configuration](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/PrismAppBuilderExtensions.cs), [MAUI/Uno module manager](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Modularity/ModuleManager.cs), [.NET directory discovery](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Modularity/DirectoryModuleCatalog.netcore.cs), [.NET Framework directory discovery](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Modularity/DirectoryModuleCatalog.net45.cs), [WPF XAML catalog](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Modularity/XamlModuleCatalog.cs).

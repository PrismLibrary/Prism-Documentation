---
sidebar_position: 2
uid: Modularity.ModuleCatalog
---

# Module Catalog

The module catalog describes which modules exist, how they are named, when they initialize and which modules they depend on. Adding a module to the catalog does not itself execute its `RegisterTypes` or `OnInitialized` methods; the module manager performs that work.

Prefer explicit, code-based registration for application features that ship together. It makes the feature set inspectable and avoids a runtime assembly-discovery requirement.

:::note Source-checkpoint limitation
The MAUI/Uno startup-order guidance below comes from inspection of the linked source implementation, not a guarantee that future packages require catalog-order workarounds. Validate dependency ordering on the exact package you ship; this docs audit did not run a new native startup-order repro.
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

The builder configures the catalog before running modules, then runs application `OnInitialized` delegates. The current MAUI manager enumerates startup modules in catalog order; keep prerequisites before consumers and explicitly validate with `Initialize()`. An explicit `LoadModule` request uses the catalog's dependency expansion and ordering.

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

Uno compiles the MAUI modularity implementation. Its startup manager enumerates the catalog's startup modules in order, so put prerequisites first and validate explicitly. Prism runs modules after the shell has loaded and before the application's `OnInitialized` callback.

</TabItem>
<TabItem value="avalonia" label="Avalonia">

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

Prism.Avalonia uses the desktop catalog and manager implementation. WPF's `XamlModuleCatalog` is excluded from the Avalonia project; a WPF pack-URI XAML catalog example is not portable to Avalonia.

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

Catalog validation rejects duplicate names, missing dependencies, dependency cycles and a startup module depending on an on-demand module. Module groups add another boundary: a grouped module may depend on its own group or groupless modules, while groupless modules cannot depend on a grouped module. For ordinary application features, a flat catalog is usually easier to maintain.

## WPF deployment-based catalogs

For an existing WPF application that deploys trusted module assemblies separately, the desktop APIs also support the following approaches.

### Discover modules in a directory

```csharp
protected override IModuleCatalog CreateModuleCatalog() =>
    new DirectoryModuleCatalog { ModulePath = @".\Modules" };
```

Use `[Module(ModuleName = "Reports", OnDemand = true)]` and `[ModuleDependency("InfrastructureModule")]` on discoverable module classes when metadata must come from the assemblies.

The current .NET implementation scans managed DLLs once in an isolated collectible discovery load context and initiates unloading of that discovery context afterward. It does not continually watch the folder, and this discovery cleanup does not mean that initialized application modules can be unloaded. Only load assemblies you trust; discovery isolation is not a security sandbox.

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

`ModulesCatalog.xaml` must be packaged as a WPF application resource containing a `ModuleCatalog`. Use `InitializationMode="OnDemand"` on a `ModuleInfo` in XAML. `startupLoaded` is a configuration-file attribute, not a current `ModuleInfo` XAML property. The old `ModuleCatalog.CreateFromXaml(...)` call is not the public API for this implementation.

## Deployment and AOT limits

MAUI and Uno's `ModuleInfo` represents types already present in the application; its `IModuleInfo.Ref` getter is not supported. Do not use a desktop `file://` module catalog as a portable download mechanism.

Prism.Avalonia includes desktop directory/configuration catalog sources, but their use still depends on your runtime, deployment and trust model. Prefer explicit registration for cross-platform features. Dynamic managed assembly loading is incompatible with [Native AOT's documented restrictions](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/#limitations-of-native-aot-deployment). Explicit modules must still satisfy the [Prism NativeAOT setup](../dependency-injection/native-aot.md).

Source: [shared catalog validation](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Prism.Core/Modularity/ModuleCatalogBase.cs), [desktop catalog extensions](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Wpf/Prism.Wpf/Modularity/IModuleCatalogExtensions.cs), [MAUI/Uno module manager](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Modularity/ModuleManager.cs), [current directory discovery](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Wpf/Prism.Wpf/Modularity/DirectoryModuleCatalog.netcore.cs), [WPF XAML catalog](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Wpf/Prism.Wpf/Modularity/XamlModuleCatalog.cs).

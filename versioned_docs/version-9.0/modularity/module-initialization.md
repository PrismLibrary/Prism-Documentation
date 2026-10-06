---
sidebar_position: 3
uid: Modularity.ModuleInitialization
---

# Module Initialization

The module manager coordinates loading and initialization. The module initializer constructs an `IModule`, calls `RegisterTypes`, then calls `OnInitialized`. A successful module reaches `ModuleState.Initialized` and is not initialized again by another ordinary load request.

## The order that matters

For each module:

1. Its prerequisites must be available according to the [catalog's platform-specific ordering rules](module-catalog.md).
2. The container creates the module instance.
3. `RegisterTypes(IContainerRegistry)` adds that module's registrations.
4. `OnInitialized(IContainerProvider)` integrates the feature.
5. The manager marks the module initialized and raises its completion event.

This is per module. Prism does not register every module first and then initialize every module. If `CustomersModule.OnInitialized` needs a service from `InfrastructureModule`, declare that dependency and ensure it is initialized first.

Keep constructors cheap. Keep initialization synchronous and bounded. An `async void OnInitialized` is not awaited by the manager; it can mark the module initialized before the asynchronous work finishes, and later exceptions do not become a reliable module-load result. Put longer work behind a service or command with an explicit `Task`, cancellation and error handling.

The MAUI/Uno dependency-ordering caveat below is based on inspection of the shipped Prism 9.0.537 source. No new native runtime reproduction is claimed; regression-test the scenario against the installed package.

## Application startup is not identical everywhere

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="platform">
<TabItem value="wpf" label="WPF" default>

Prism creates and initializes the shell before running the module manager. The manager initializes the catalog and orders startup dependencies. Do not constructor-inject a service into the shell view model if that service is registered only by a module that has not run yet. Move shell-critical registrations earlier, or defer the feature's creation until after module initialization.

</TabItem>
<TabItem value="maui" label=".NET MAUI">

Prism 9.0 runs the application's `OnInitialized` delegates first, in registration order. `ConfigureModuleCatalog` itself registers one of those delegates. Only after all delegates complete does the builder run modules; `CreateWindow` follows module startup.

Do not resolve a module-only service inside an application `OnInitialized` delegate. Register application-startup dependencies earlier, or use `CreateWindow` or a later workflow after successful module initialization. Startup modules are processed in catalog order, so put prerequisites first and validate the catalog explicitly. The MAUI manager catches per-module initialization exceptions and reports them through `LoadModuleCompleted`; reaching `CreateWindow` alone does not prove that every module succeeded.

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

Prism creates the shell and waits for its loaded state, attaches regions, builds its host, runs modules, then invokes application `OnInitialized`. Uno uses MAUI's module manager, including its catalog-order startup behavior and completion-event error reporting. Shell construction still precedes module registration.

</TabItem>
</Tabs>

## Load an on-demand feature

Inject `IModuleManager` into the coordinator that activates the feature:

```csharp
using System;
using Prism.Modularity;

public sealed class ReportsLoader
{
    private readonly IModuleManager _modules;

    public ReportsLoader(IModuleManager modules) => _modules = modules;

    public void Load()
    {
        if (!_modules.ModuleExists("Reporting"))
            throw new InvalidOperationException("Reporting is not in the catalog.");

        if (!_modules.IsModuleInitialized("Reporting"))
            _modules.LoadModule("Reporting");
    }
}
```

`"Reporting"` must match the catalog name. An explicit load expands the module's dependencies. `LoadModule` returns `void`, not a `Task`; do not treat its return as a cross-platform asynchronous completion contract. Desktop type loaders can complete later, while packaged MAUI/Uno modules initialize synchronously.

Subscribe to `LoadModuleCompleted` before requesting a load and check the relevant module name, `Error` and initialized state before navigating to one of its newly registered views. The successful completion of a dependency is not the completion of the requested feature.

## Observe and handle failures

```csharp
private void OnLoadModuleCompleted(object? sender, LoadModuleCompletedEventArgs e)
{
    if (e.ModuleInfo.ModuleName != "Reporting")
        return;

    if (e.Error is not null)
    {
        System.Diagnostics.Debug.WriteLine(e.Error);
        return;
    }

    // The feature may now expose its registered navigation targets.
}
```

Attach this named handler to the manager for the lifetime of its owner and unsubscribe when that owner is disposed. Also catch exceptions around the initiating call or startup boundary:

- The desktop initializer wraps initialization failures in `ModuleInitializeException`; not every such failure is delivered as a completion-event error.
- Desktop type-loader errors can be reported through `LoadModuleCompleted`. Set `IsErrorHandled = true` only when the application has deliberately handled that error and wants to suppress the manager's subsequent type-loading exception.
- MAUI/Uno's manager catches per-module initialization failures and raises `LoadModuleCompleted` with the error. It does not use `IsErrorHandled` as a universal retry or rollback mechanism.

An exception may occur after some registrations or side effects have already happened. Initialization is not a transaction. Do not blindly reset `ModuleState` or re-run the module to recover. Fail the feature cleanly, log the cause, and choose an application-specific recovery strategy.

## Lifetime and testing

An initialized module is not an unloadable feature scope. Prism does not provide a general `UnloadModule` operation that removes registrations, views, subscriptions and loaded assemblies. Keep ongoing work in explicit application services with appropriate disposal and ownership.

Before shipping a module, test:

- Catalog validation with missing and cyclic dependencies.
- A dependency required by a module constructor and by `OnInitialized`.
- Startup ordering on the target platform, particularly MAUI and Uno.
- A repeated load request after successful initialization.
- Registration failure, initialization failure and desktop type-load failure separately.
- Navigation to a view registered by an on-demand module after earlier navigation has already occurred. On MAUI, include a case where its navigation registry was resolved before the module loaded.
- The actual deployment configuration and runtime used by the application.

Source (Prism 9.0.537): [desktop initializer](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Modularity/ModuleInitializer.cs), [desktop manager](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/Modularity/ModuleManager.cs), [MAUI/Uno manager](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Modularity/ModuleManager.cs), [MAUI startup phases](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/PrismAppBuilder.cs), [Uno shell startup](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Uno/Prism.Uno/PrismApplicationBase.cs), [module-manager helpers](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Modularity/IModuleManagerExtensions.cs).

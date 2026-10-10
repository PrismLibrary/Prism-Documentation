---
sidebar_position: 2
uid: DependencyInjection.RegisterServices
description: "Register Prism services with explicit lifetimes, names, scopes and ownership."
---

# Registering services {#registering-types-with-prism}

Use the `Prism.Ioc` abstractions from `Prism.Container.Abstractions` to express application composition. `IContainerRegistry` registers services; `IContainerProvider` resolves them. Register at startup or within a module's registration phase, then inject dependencies into consumers.

## Choose a lifetime

| Lifetime | Registration | Useful boundary |
| --- | --- | --- |
| Transient | `Register<TService, TImplementation>()` | A new instance per resolution |
| Singleton | `RegisterSingleton<TService, TImplementation>()` | Shared application state/service |
| Scoped | `RegisterScoped<TService, TImplementation>()` | One instance within an explicit scope |
| Existing instance | `RegisterInstance<TService>(instance)` | An instance supplied by composition |

```csharp
using Prism.Ioc;

containerRegistry.Register<IReportFormatter, ReportFormatter>();
containerRegistry.RegisterSingleton<IWorkspace, Workspace>();
containerRegistry.RegisterScoped<IEditSession, EditSession>();
containerRegistry.RegisterInstance<AppOptions>(options);
```

The example's service contracts, implementations and `options` belong to the application. A singleton is normally created when first resolved, whereas an instance registration has already been constructed. Select lifetimes for ownership and concurrency, not simply because “one instance uses less memory.” A singleton can retain an entire dependency graph and must be safe for its callers.

### Registering Transient Services

Use `Register<TService, TImplementation>()` when each resolution should create a new instance. The owner still needs a disposal policy for disposable results.

### Registering Singleton Services

Use `RegisterSingleton<TService, TImplementation>()` for an application-wide instance. Avoid capturing short-lived page or operation services in that singleton.

#### Registering a Service Instance

Use `RegisterInstance<TService>(instance)` for an existing object. Confirm who owns disposal with the selected adapter.

## Scopes and disposal

Prism.Maui uses page scopes for services such as `INavigationService`, `IPageDialogService` and `IDialogService`. A desktop region is not automatically a separate DI scope. For a bounded operation you can create and dispose an explicit Prism scope:

```csharp
using var scope = containerProvider.CreateScope();
var session = scope.Resolve<IEditSession>();
// Complete the operation while the scope is alive.
```

Do not retain `session` after its scope is disposed or inject a page-scoped navigation service into an application singleton. Disposal behavior for externally supplied instances and adapter-specific services must be verified with the selected adapter. The garbage collector does not replace deterministic disposal of subscriptions, scopes or native resources.

## Factories and shared implementations

A factory can use the provider supplied for the resolution rather than capturing a global root:

```csharp
containerRegistry.Register<IReportFormatter>(provider =>
    new ReportFormatter(provider.Resolve<IFormatRules>()));
```

Keep factories synchronous. Do async initialization through an explicit operation after construction, rather than blocking on `.Result` in a constructor or factory.

Expose one implementation through multiple contracts with an explicit list:

```csharp
containerRegistry.RegisterManySingleton<Workspace>(
    typeof(IWorkspaceReader), typeof(IWorkspaceWriter));
```

Use `RegisterMany` for transient multi-contract registration. These APIs register one implementing type under multiple contracts; they are different from registering several implementations for collection injection. Explicit service lists make the registration's intended public contracts visible.

## Named registrations and view registrations

A named service registration is useful when a consumer deliberately selects one implementation:

```csharp
containerRegistry.Register<IReportFormatter, CsvReportFormatter>("csv");
var formatter = containerProvider.Resolve<IReportFormatter>("csv");
```

For views use the platform's `RegisterForNavigation<View, ViewModel>()` or `RegisterDialog<View, ViewModel>()` API. In 9.0 WPF/Uno, navigation registration uses named container registrations plus the view-model mapping; MAUI uses its view registry. MAUI region views use `RegisterForRegionNavigation<View, ViewModel>()`. An ordinary service registration alone is not a complete navigation registration.

## Checking if a Service has been Registered

Use `TryRegister` / `TryRegisterSingleton` / `TryRegisterScoped` when a module supplies a default that the application may override. Required module dependencies should be explicit, with a catalog dependency when another module must register them first.

```csharp
containerRegistry.TryRegisterSingleton<IClock, SystemClock>();
```

For an explicit registration check, use `containerRegistry.IsRegistered<IClock>()`. This checks registration metadata; it does not prove the complete object graph can be constructed.

## Lazy Resolution

`Func<T>`, `Lazy<T>` and collection resolution depend on the selected adapter and its registration rules. Do not assume every adapter supports every advanced shape identically. For a portable lazy-creation boundary, inject an application-owned factory interface and test it with the chosen container. A factory that creates disposable objects needs an explicit owner.

## Resolve All

`IEnumerable<T>` service collection registrations are useful for several independent implementations, but test ordering, duplicate/named registrations and lifetimes instead of relying on a legacy “DryIoc only” rule. See [Microsoft integration](servicecollection-supplement.md).

## Source and next steps

The [registry contract](https://github.com/PrismLibrary/Prism.Containers/blob/3e2b38b767397b7595542369ab8e9e21e3c6cdcb/src/Prism.Container.Abstractions/IContainerRegistry.cs), [generic extensions](https://github.com/PrismLibrary/Prism.Containers/blob/3e2b38b767397b7595542369ab8e9e21e3c6cdcb/src/Prism.Container.Abstractions/IContainerRegistryExtensions.cs), and [scope contract](https://github.com/PrismLibrary/Prism.Containers/blob/3e2b38b767397b7595542369ab8e9e21e3c6cdcb/src/Prism.Container.Abstractions/IScopedProvider.cs) are authoritative (authorized repository access required).

Continue with [platform-specific services](platform-specific-services.md) and [resolution diagnostics](resolution-errors.md).

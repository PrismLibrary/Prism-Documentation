---
sidebar_position: 3
uid: DependencyInjection.Supplement
description: "Integrate Microsoft service registrations with the Prism 9.0 host and selected container."
---

# Microsoft service-collection integration {#dependency-injection---supplement}

`IServiceCollection` is a registration format used by the Microsoft extensions ecosystem. Importing those registrations into a Prism container does **not** select the Microsoft container adapter. The application still chooses its Prism adapter during startup.

## Use the host's composition path {#iservicecollection-extensions}

MAUI's application builder and Uno host integration already coordinate service collection and Prism registration. Add services through those supported startup paths. Do not call `BuildServiceProvider()` midway through registration to fetch a dependency: it creates a separate provider with potentially different singleton and scope ownership.

For infrastructure that owns composition directly, Prism's adapter integration contract is `IServiceCollectionAware`:

```csharp
using Microsoft.Extensions.DependencyInjection;
using Prism.Ioc;

var services = new ServiceCollection();
services.AddSingleton<IClock, SystemClock>();
services.AddTransient<IReportFormatter, ReportFormatter>();

// container is the selected IContainerExtension owned by this host.
container.Populate(services);
IServiceProvider provider = container.CreateServiceProvider();
```

`Populate` and `CreateServiceProvider` require an adapter implementing that contract. This is an illustration of the integration boundary, not a replacement for MAUI/Uno startup or an instruction to build an additional provider inside a running application.

## Match scopes to operations

A desktop/mobile application does not have an HTTP request scope. MAUI has page scopes; a desktop editor might need a document/session or operation scope. Audit the lifetimes chosen by a library's `Add...` extension before adopting it. Avoid resolving a short-lived scoped dependency from a long-lived singleton.

For EF Core, one page can perform several separate units of work. A context per operation, often through `IDbContextFactory<TContext>`, can make that ownership explicit. A `DbContext` is not thread safe; switching every registration to transient does not by itself define disposal or prevent overlapping use. See Microsoft's [context lifetime and factory guidance](https://learn.microsoft.com/en-us/ef/core/dbcontext-configuration/).

## Check a library's actual dependencies {#faq}

A registration extension can rely on more than `IServiceCollection`: options, logging, keyed service behavior, scopes, disposal, open generics or host lifecycle. Compile success is not a behavior-compatibility certificate. Test the extension with the actual Prism adapter, framework and runtime used by the application.

Useful tests include resolving the full graph, two separate scopes, shared singleton identity, collection registrations, disposal, named/keyed services, and the failure path. Do not describe the Prism Microsoft adapter as a fully behavior-identical replacement for every newer .NET DI feature without qualification.

## Further Reading

Sources: [IServiceCollectionAware](https://github.com/PrismLibrary/Prism.Containers/blob/3e2b38b767397b7595542369ab8e9e21e3c6cdcb/src/Prism.Container.Abstractions/IServiceCollectionAware.cs), [integration extensions](https://github.com/PrismLibrary/Prism.Containers/blob/3e2b38b767397b7595542369ab8e9e21e3c6cdcb/src/Prism.Container.Abstractions/MicrosoftDependencyInjectionExtensions.cs), and [adapter integration tests](https://github.com/PrismLibrary/Prism.Containers/blob/3e2b38b767397b7595542369ab8e9e21e3c6cdcb/tests/Prism.Container.Shared/Tests/ServiceCollectionAwareFixture.cs). Containers source access is restricted. Microsoft's [DI guidelines](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/guidelines) provide the baseline lifetime and ownership guidance.

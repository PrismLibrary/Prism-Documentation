---
sidebar_position: 2
title: NativeAOT in Prism 10.0
---

# NativeAOT in Prism 10.0

Prism 10.0 (vNext) is planned as the first NativeAOT-ready Prism release. **The supported NativeAOT path requires the Microsoft container (`Prism.Container.Microsoft`), which is available with Commercial Plus.**

NativeAOT compiles an application to native code at publish time. It also trims unused code and cannot rely on arbitrary runtime code generation or loading previously unknown assemblies. Prism's support preserves the metadata needed by its container and view-model activation paths. Your UI framework, bindings, serializers, modules, and other dependencies still need to support the selected deployment target.

:::caution Prism 10.0 is vNext
The release is being prepared; its upstream package rollout is not complete. The source references below include work previously tested in 9.1 prereleases. They establish the implementation checkpoint, not the availability or qualification of a published 10.0 application. See [migration and package readiness](../migrating-to-10.md).
:::

## Choose the container and packages

1. Configure your authorized [Commercial Plus package feed](../pipelines/commercial-plus.md).
2. Reference the Prism platform package for your head and `Prism.Container.Microsoft` from a compatible package set available in your feed; use the 10.0 set only after its publication is verified.
3. Keep `Prism.Container.Abstractions` and its transitive analyzer/build assets enabled in application and module projects. Rebuild libraries that contain registrations when updating the generator.
4. Configure the Microsoft adapter explicitly. `IServiceCollection` integration alone does not change which container Prism uses.

Package version numbers across Prism, Containers, Plugins, and Magician are independent. Follow the actual package dependency constraints and resolved assets, rather than assigning the same version number to every package. A source change may require a newer prerelease than the package already installed.

### .NET MAUI setup

With `Prism.Maui` and `Prism.Container.Microsoft` referenced, the following composition excerpt uses the container-instance overload of `UsePrism`. `App`, `HomePage`, and `HomePageViewModel` are application types; retain your existing fonts, resources, and native startup configuration.

```csharp
using Microsoft.Maui.Controls.Hosting;
using Microsoft.Maui.Hosting;
using Prism;
using Prism.Container.Microsoft;
using Prism.Ioc;

var builder = MauiApp.CreateBuilder();
builder.UseMauiApp<App>()
    .UsePrism(new MicrosoftContainerExtension(), prism =>
    {
        prism.RegisterTypes(registry =>
            registry.RegisterForNavigation<HomePage, HomePageViewModel>());
        prism.CreateWindow("HomePage");
    });
return builder.Build();
```

### Desktop application setup

In an existing WPF, Uno, or Avalonia `PrismApplicationBase` subclass, supply the adapter through the container override:

```csharp
protected override Prism.Ioc.IContainerExtension CreateContainerExtension()
    => new Prism.Container.Microsoft.MicrosoftContainerExtension();
```

Keep that platform's own shell, XAML application base, and startup lifecycle. This selects the container; it does not enable NativeAOT on a framework that cannot support it. [Magician](../magician/index.md) can also generate startup registrations and select the Microsoft adapter.

## Make activation visible at build time

Prefer normal typed registrations and explicit view/view-model pairs:

```csharp
registry.RegisterSingleton<IOrderService, OrderService>();
registry.RegisterForNavigation<OrderView, OrderViewModel>("Orders");
```

The shared container generator examines statically visible registration and resolution calls, public constructor dependencies, and closed `Func<T>` / `Lazy<T>` uses. Each rebuilt assembly contributes preservation metadata for its own types, including internal implementations. The Microsoft adapter uses that metadata with its ordinary registration graph.

Preservation does **not** register a service, change its lifetime, eagerly activate modules, or replace named navigation registrations with anonymous factories. Keep using Prism's registration APIs. In MAUI, page-scoped services and their deferred dependencies must remain associated with the page scope; do not promote them to application singletons.

### Types hidden from the generator

Arbitrary runtime `Type` values, custom naming conventions, and output from another source generator in the same compilation may not be visible to the container generator. For a known concrete type reached through such a path, request preservation in the assembly that owns or can reference it:

```csharp
[assembly: Prism.Ioc.PreserveForContainer(typeof(MyApp.ViewModels.OrderViewModel))]
```

This keeps the type available for container activation; normal service and navigation registrations are still required where applicable. Inspect generated output and publish diagnostics when combining generators. Do not assume that Magician-generated registrations alone prove that every activation type has been preserved.

The default ViewModelLocator first uses explicit mappings, then supported preserved convention types. During NativeAOT publishing, Prism disables its reflection-based fallback through the `Prism.Mvvm.ReflectionBasedViewModelLocationEnabled` feature switch. Do not turn the fallback back on to hide missing preservation. Custom conventions and reflection-based XAML bindings require their own explicit metadata or compiled bindings.

Prism uses linker annotations such as `DynamicallyAccessedMembers` to carry public-constructor requirements. This is preserved reflection metadata, not a promise of reflection-free execution. Do not suppress trimming or dynamic-code warnings globally. `ContainerResolutionException.GetErrors()` performs optional reflection-based diagnostic traversal; in trimmed applications, prefer the original exception and `InnerException` details.

## Modules and serialization

Use statically referenced modules and their normal module catalog registrations. They may register services on demand when Prism loads them. NativeAOT cannot add unknown assemblies discovered from a directory after publication.

For [Essentials stores](../plugins/essentials/io/stores.md), rebuild each assembly declaring generated store interfaces. Register a generated `JsonSerializerContext` or your own AOT-compatible `ISerializer` **before** registering Essentials platform services. This explicit serializer requirement applies to ordinary builds too; platform startup no longer chooses a reflection serializer. Compose `BackgroundTaskStore.SerializationContext` with your application context in the first serializer registration when enabling [background tasks](../plugins/essentials/applicationmodel/background-tasks.md). Constructor preservation does not generate JSON metadata or qualify native scheduling, persisted task-type lookup, or every optional plugin.

## Platform boundaries

| Prism platform | NativeAOT requirement or boundary |
| --- | --- |
| WPF | WPF trimming is disabled by the .NET SDK. The Microsoft container's NativeAOT support does not make a WPF UI application NativeAOT-publishable. |
| .NET MAUI | Follow the SDK's supported NativeAOT targets, compiled XAML/binding requirements, and native toolchains. Ordinary mobile AOT and NativeAOT are different deployment modes. |
| Uno Platform | Support depends on the selected application head. Follow Uno's Skia Desktop NativeAOT guidance and validate that head's shell, bindings, and dependencies. WebAssembly AOT is a separate target. |
| Avalonia | Use Avalonia's NativeAOT configuration and compiled bindings, then publish and run the actual desktop application with the Microsoft adapter. |

See the platform owners' guidance: [.NET NativeAOT](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/), [WPF trimming limitations](https://learn.microsoft.com/en-us/dotnet/core/deploying/trimming/incompatibilities#wpf), [MAUI NativeAOT](https://learn.microsoft.com/en-us/dotnet/maui/deployment/nativeaot?view=net-maui-10.0), [Uno Skia Desktop](https://platform.uno/docs/articles/features/using-skia-desktop.html#net-native-aot-support), and [Avalonia NativeAOT](https://docs.avaloniaui.net/docs/deployment/native-aot).

## Validate the application you ship

Enable `PublishAot` using your UI framework's guidance, then publish a Release build for the exact supported target framework and runtime identifier on a host with its native toolchain. A normal build or a successful container smoke test is insufficient.

- Review the complete publish output for trimming and AOT warnings, including dependency warnings.
- Run the resulting native executable on the target OS.
- Exercise named navigation, dialogs, view-model creation and bindings, deferred factories, page scopes and disposal, and modules loaded after initial resolution.
- Exercise every serialized data shape and platform capability used by the app, including denied permissions, cancellation, and shutdown.
- Repeat for each application head you intend to distribute. A successful check on one host does not qualify the other heads.

## Prism source references

- [ViewModelLocator preservation and fallback](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Prism.Core/Mvvm/ViewModelLocationProvider.cs)
- [NativeAOT feature-switch configuration](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Prism.Core/build/Package.targets)
- [MAUI container-instance startup](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/PrismAppBuilderExtensions.cs)

---
sidebar_position: 1
uid: Magician.Index
---

# Prism Magician

Prism.Magician supplies Roslyn source generators, analyzers, and IDE code fixes for Prism applications. It is available with Commercial Plus. Reference `Prism.Magician` from your authorized Prism feed together with your platform and container packages.

The current generator uses C# 14 partial properties and field-backed accessors. Use a compatible compiler and package version. It supports WPF, .NET MAUI, Uno WinUI, and Avalonia composition, with platform-specific generated code. It does not require an IL weaver or a runtime `Magician.Initialize()` call.

## Generated services and views

Attributes describe the registrations to generate. For example, these application types register a service as a singleton:

```csharp
using Prism.Magician;

public interface IReportStore
{
    string ReadTitle(int reportId);
}

[RegisterSingleton(typeof(IReportStore))]
public sealed class ReportStore : IReportStore
{
    public string ReadTitle(int reportId) => $"Report {reportId}";
}
```

Put a navigation attribute on the view or page, retaining its existing XAML initialization:

```csharp
[Prism.Magician.RegisterForNavigation(typeof(EditorViewModel), "EditorPage")]
public partial class EditorPage : Microsoft.Maui.Controls.ContentPage
{
    public EditorPage() => InitializeComponent();
}
```

`EditorViewModel` is your application view model. On desktop platforms, use the corresponding framework view type instead of `ContentPage`.

- `[Register]` is transient; `[RegisterSingleton]` is singleton. Specify `typeof(IService)` when multiple service interfaces would make selection ambiguous.
- `[Register(typeof(IExporter), "csv")]` creates a named registration.
- `[RegisterManySingleton(typeof(IFirst), typeof(ISecond))]` gives multiple service aliases the same implementation instance.
- `[AutoRegisterViews]` opts into conventional views in `Views`, `Pages`, and `Dialogs` namespaces. Explicit view/view-model attributes make the relationship clearer.
- `[MagicianSkip]` excludes a declaration or opts an owner out of automatic generation.

For MAUI, page navigation, region navigation, and dialog content use different view contracts. A `Page` is not interchangeable with a region or dialog `View`.

## .NET MAUI startup

With `Prism.Maui`, `Prism.Magician`, and one compatible container adapter referenced, use the generated builder extension:

```csharp
using Microsoft.Maui.Controls.Hosting;
using Microsoft.Maui.Hosting;
using Prism;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp() =>
        MauiApp.CreateBuilder()
            .UseMauiApp<App>()
            .UsePrismMagician(prism => prism.CreateWindow("EditorPage"))
            .Build();
}
```

`App` and the attributed `EditorPage` belong to the application. Generated registrations run before the configuration callback's initial navigation. Do not call a second generated registration hook alongside this startup path.

One referenced adapter is selected automatically. If several are referenced, select it explicitly. For the supported Prism 9.1 NativeAOT path:

```csharp
.UsePrismMagician<Prism.Container.Microsoft.MicrosoftContainerExtension>(
    prism => prism.CreateWindow("EditorPage"))
```

An overload accepting an `IContainerExtension` instance supports custom construction. An assembly-level `[Prism.Magician.ContainerExtension(typeof(...))]` can also select an adapter.

## WPF, Uno, and Avalonia startup

Make your existing `PrismApplication` or `PrismApplicationBase` subclass partial. Retain its shell, resources, and platform-specific XAML declaration.

Magician generates a `RegisterRequiredTypes(IContainerRegistry)` override that calls the base implementation and then adds the current assembly's registrations. For `PrismApplicationBase`, it can also generate the required container override and an empty `RegisterTypes` override when none exists. A container-specific `PrismApplication` keeps its existing container selection.

Shell contracts differ: WPF uses `Window`, Uno uses `UIElement`, and Avalonia uses `AvaloniaObject`. Preserve the correct override for your head. If you already implement `RegisterRequiredTypes`, use an explicit hook rather than adding a conflicting generated override.

## Modules and explicit ownership

In a separate module library, make the module partial and call its generated `Abracadabra` method from the actual Prism registration lifecycle:

```csharp
using Prism.Ioc;
using Prism.Modularity;

public partial class EditorModule : IModule
{
    public void RegisterTypes(IContainerRegistry registry)
    {
        Abracadabra(registry);
    }

    public void OnInitialized(IContainerProvider provider) { }
}
```

Do not declare `Abracadabra` yourself. Add the module to the application's normal module catalog. The generator does not scan every referenced assembly or activate unloaded modules early.

When several applications or modules share an assembly, use `[RegistrationOwner(typeof(EditorModule))]` on each attributed service or view to give it one owner. Unassigned registrations are diagnosed instead of being copied to every owner.

For custom startup, put an explicit hook on the partial application or module owner and call it from its existing registration callback:

```csharp
[Prism.Magician.GenerateRegistrations]
private partial void RegisterGenerated(Prism.Ioc.IContainerRegistry registry);
```

This disables automatic lifecycle generation for that owner. For MAUI, use an explicit hook with ordinary `UsePrism`, rather than combining it with `UsePrismMagician`.

## Observable properties

```csharp
public partial class EditorViewModel : Prism.Mvvm.BindableBase
{
    [Prism.Magician.Bindable]
    public partial string? Title { get; set; }
}
```

The generator completes the property with Prism's `SetProperty`, including equality checks and change notifications. Both the class and property must be partial. There is no generated subclass to resolve and no separate property activation step.

The `[Notify]` attribute is also supported. Framework control properties have their own attributes: `[BindableProperty]` for MAUI, `[DependencyProperty]` for WPF/Uno, and `[StyledProperty]` for Avalonia. These generate framework-backed properties, not ordinary view-model fields.

## Diagnostics and NativeAOT

- `PMAG015`: conflicting or non-partial startup owner, or ambiguous registration ownership. Retain handwritten methods and choose a suitable explicit hook.
- `PMAG016`: invalid or ambiguous container selection. Select an accessible concrete adapter or pass an instance.
- `PMAG017`: a module is missing the lifecycle call to its generated registration method.
- `PMAG040`: asynchronous work is being executed through `DelegateCommand`; review migration to `AsyncDelegateCommand` and any callers affected by the change.

Magician's generated registration and the container's preservation generator have different jobs. A generator cannot generally inspect a sibling generator's output in the same compilation. Check the emitted registrations, explicitly preserve otherwise invisible activation types when necessary, and publish and run the native application. Magician's support for a container or platform does not independently qualify that combination for NativeAOT. See the [NativeAOT guide](../dependency-injection/native-aot.md).

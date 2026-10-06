---
sidebar_position: 1
uid: Magician.Index
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Prism Magician

Prism.Magician supplies Roslyn source generators, analyzers, and IDE code fixes for Prism applications. It requires an active Commercial Plus or Enterprise subscription; the Community License does not cover it. Reference `Prism.Magician` from your authorized Prism feed together with your platform and container packages.

The current generator targets .NET 10 and .NET 11 and uses C# 14 partial properties and field-backed accessors. Use a compatible SDK/compiler and package version. The package reports `PMAG100` when a numeric `LangVersion` is below 14; changing a language-version string alone cannot upgrade an older compiler. It supports WPF, .NET MAUI, Uno WinUI, and Avalonia composition, with platform-specific generated code. It does not require an IL weaver or a runtime `Magician.Initialize()` call.

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

Shell contracts differ. Retain your real shell implementation rather than copying another head's base class or return type:

<Tabs groupId="platform">
<TabItem value="wpf" label="WPF">

The application shell contract is `System.Windows.Window`. Make the existing Prism application partial and retain its `CreateShell`, XAML resources, and normal window initialization. The generated registration override augments Prism's required registrations.

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

The shell contract is `Microsoft.UI.Xaml.UIElement`. Retain `ConfigureApp` / `ConfigureHost`, the host window setup, and any Essentials setup in those callbacks. Magician adds registrations; it does not replace the Uno hosting lifecycle.

</TabItem>
<TabItem value="avalonia" label="Avalonia">

The shell contract is `Avalonia.AvaloniaObject`. Keep the existing `App.axaml`, Avalonia application lifetime, and shell override. Avalonia support in Magician does not supply an Essentials host package.

</TabItem>
</Tabs>

If you already implement `RegisterRequiredTypes`, retain it and call an explicit hook rather than adding a conflicting generated override.

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

## Initialize navigation parameters

`[AutoInitialize]` generates `InitializeParameters(Prism.Common.IParameters)`. Call it from your actual navigation lifecycle; the attribute does not automatically run a handwritten callback. For a MAUI page view model:

```csharp
using Prism.Magician;
using Prism.Mvvm;
using Prism.Navigation;

[AutoInitialize]
public partial class DetailsViewModel : BindableBase, IInitialize
{
    [AutoInitializeParameter("id", true)]
    public int Id { get; set; }

    public void Initialize(INavigationParameters parameters) =>
        InitializeParameters(parameters);
}
```

Navigate with an `id` value compatible with the property. Required keys are validated before generated property assignments. Optional values and conventional property names are supported; `OnParametersInitializing` and `OnParametersInitialized` partial hooks let you add application behavior.

For WPF and Avalonia region navigation, call from `INavigationAware.OnNavigatedTo`; Uno uses the applicable `IRegionAware.OnNavigatedTo` lifecycle. Keep the lifecycle's navigation context and parameter type appropriate to the platform. Generated initialization is not persistence or a one-time migration mechanism.

## Generate dialog members

`[DialogAware]` on a partial class generates missing members of `Prism.Dialogs.IDialogAware`, including the `DialogCloseListener` property. `[AutoInitialize]` can be combined with it so the generated `OnDialogOpened` calls `InitializeParameters`:

```csharp
using Prism.Magician;
using Prism.Mvvm;

[DialogAware]
[AutoInitialize]
public partial class ConfirmExportViewModel : BindableBase
{
    [AutoInitializeParameter("reportTitle", true)]
    public string ReportTitle { get; set; } = string.Empty;

    partial void OnCanCloseDialog(ref bool canClose)
    {
        // Replace this with the application's close policy if work is pending.
        canClose = true;
    }
}
```

This example demonstrates generated members and parameters; register the application dialog view and provide its actions through the normal [dialog service](../dialogs/index.md). Close with `RequestClose.Invoke(...)` from a deliberate user action. The generator supports `OnDialogOpening` and `OnDialogClosing` partial hooks; it does not overwrite existing lifecycle implementations. If you keep your own `OnDialogOpened`, you own the initialization call.

## Conditional and generated service composition

Use `[RegisterOnPlatform(Platform.Android)]` and `[RegisterOnIdiom(Idiom.Phone)]` alongside normal registration attributes to select implementations. Multiple platform choices are alternatives, multiple idiom choices are alternatives, and the two kinds of filter combine. An unfiltered implementation of the same service/name group can serve as fallback. Overlapping alternatives are diagnosed rather than silently choosing one.

The generated hook uses a host-registered `IRegistrationContext` when present. MAUI can otherwise derive its context from device information; desktop detection does not tell a platform-neutral module every mobile/browser form factor. Register a deliberate context before loading such modules. Conditional registration does not activate an unloaded module.

`[BaseServices]` generates a service-aggregate constructor/properties; `[ViewModelBase]` generates supported Prism lifecycle scaffolding and service accessors. Select a service aggregate explicitly when several exist, preserve user-written lifecycle code, and dispose the generated subscriptions at teardown. These attributes do not silently opt into logging, popups, Essentials, background tasks, or JSON metadata.

## Inspect and migrate generated code

- Make every attributed owner/property partial as required, then inspect generated source and build diagnostics before changing startup again.
- Retain custom property accessor logic instead of asking an IDE fix to discard it. A generated property completes the same type; it does not require a generated subclass.
- Replace obsolete weaving configuration when migrating older Magician experiments. There is no IL weaving step in the current package.
- Use `AsyncDelegateCommand` for asynchronous execution. `PMAG040` fixes may change a command's declared type and private callback signature; review concrete-type callers and event handlers. A fix does not invent cancellation, retries, or exception policy.
- Validate actual package consumption, native startup, navigation, binding notifications, and command execution for each selected head. A generator unit test or headless startup is not device qualification.

## Diagnostics and NativeAOT

- `PMAG015`: conflicting or non-partial startup owner, or ambiguous registration ownership. Retain handwritten methods and choose a suitable explicit hook.
- `PMAG016`: invalid or ambiguous container selection. Select an accessible concrete adapter or pass an instance.
- `PMAG017`: a module is missing the lifecycle call to its generated registration method.
- `PMAG040`: asynchronous work is being executed through `DelegateCommand`; review migration to `AsyncDelegateCommand` and any callers affected by the change.

Magician's generated registration and the container's preservation generator have different jobs. A generator cannot generally inspect a sibling generator's output in the same compilation. Check the emitted registrations, explicitly preserve otherwise invisible activation types when necessary, and publish and run the native application. Magician's support for a container or platform does not independently qualify that combination for NativeAOT. See the [NativeAOT guide](../dependency-injection/native-aot.md).

## Source reference

These pinned source links require authorized access to the private Prism.Magician repository. The source revision documents behavior, not proof that every feed package already contains it.

- [`ReadMe.md`](https://github.com/PrismLibrary/Prism.Magician/blob/3b121c460e5dfe136fc7c6f05c8cbe39fa7a38fa/ReadMe.md)
- [`src/Prism.Magician/build/Prism.Magician.targets`](https://github.com/PrismLibrary/Prism.Magician/blob/3b121c460e5dfe136fc7c6f05c8cbe39fa7a38fa/src/Prism.Magician/build/Prism.Magician.targets)
- [`src/Prism.Magician.Analyzers/Generation/RegistrationGenerator.Startup.cs`](https://github.com/PrismLibrary/Prism.Magician/blob/3b121c460e5dfe136fc7c6f05c8cbe39fa7a38fa/src/Prism.Magician.Analyzers/Generation/RegistrationGenerator.Startup.cs)
- [`src/Prism.Magician.Analyzers/Generation/PropertyGenerator.cs`](https://github.com/PrismLibrary/Prism.Magician/blob/3b121c460e5dfe136fc7c6f05c8cbe39fa7a38fa/src/Prism.Magician.Analyzers/Generation/PropertyGenerator.cs)
- [`src/Prism.Magician.Analyzers/Generation/ParameterInitializationGenerator.cs`](https://github.com/PrismLibrary/Prism.Magician/blob/3b121c460e5dfe136fc7c6f05c8cbe39fa7a38fa/src/Prism.Magician.Analyzers/Generation/ParameterInitializationGenerator.cs)
- [`src/Prism.Magician.Analyzers/Generation/DialogGenerator.cs`](https://github.com/PrismLibrary/Prism.Magician/blob/3b121c460e5dfe136fc7c6f05c8cbe39fa7a38fa/src/Prism.Magician.Analyzers/Generation/DialogGenerator.cs)

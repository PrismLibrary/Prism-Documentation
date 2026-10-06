---
sidebar_position: 2
uid: Mvvm.ViewModelLocator
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# View-model location

Prism connects a view to its view model through `Prism.Mvvm.ViewModelLocationProvider` and the host's `ViewModelLocator`. Prefer an explicit view/view-model pair in navigation or dialog registration. That makes the relationship visible to readers, tooling and the NativeAOT preservation pipeline.

```csharp
containerRegistry.RegisterForNavigation<OrderView, OrderViewModel>();
containerRegistry.RegisterDialog<ConfirmOrderView, ConfirmOrderViewModel>();
```

The view must satisfy the host's view constraints: for example, a .NET MAUI navigation registration is a `Page`, while dialog content is a `View`.

## Host behavior

<Tabs groupId="platform" queryString="platform">
<TabItem value="wpf" label="WPF">

Prism uses the view's `DataContext`. Navigation and dialog creation can autowire a view. For a manually created/injected view, opt in explicitly when needed:

```xml
<UserControl xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:prism="http://prismlibrary.com/"
             prism:ViewModelLocator.AutoWireViewModel="True">
</UserControl>
```

Use `False` when you own the data context. The attached property's default is nullable; do not assume every arbitrary WPF view is autowired merely because Prism is present.

</TabItem>
<TabItem value="maui" label=".NET MAUI">

Prism's navigation path wires the `BindingContext` and preserves page-scoped resolution. The attached property uses an enum, with the spelling **AutowireViewModel**:

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:prism="http://prismlibrary.com"
             prism:ViewModelLocator.AutowireViewModel="Disabled">
</ContentPage>
```

The values are `Automatic` (default), `Disabled`, and `Forced`. Automatic wiring respects an existing non-inherited binding context. Avoid replacing Prism's view-aware factory with a root-container resolver: a page's `INavigationService` must remain associated with the correct page scope.

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

Prism uses `DataContext`. Uno's attached property is spelled **AutowireViewModel**, with a nullable boolean value:

```xml
<Page xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
      xmlns:prism="using:Prism.Mvvm"
      prism:ViewModelLocator.AutowireViewModel="True">
</Page>
```

Use the navigation/dialog registration pair for routed views. An explicit `False` opts a view out; `True` opts in when constructing a view outside that path.

</TabItem>
<TabItem value="avalonia" label="Avalonia">

Prism.Avalonia supplies a `DataContext`-based locator using the shared WPF/Avalonia implementation:

```xml
<UserControl xmlns="https://github.com/avaloniaui"
             xmlns:prism="clr-namespace:Prism.Mvvm;assembly=Prism.Avalonia"
             prism:ViewModelLocator.AutoWireViewModel="True">
</UserControl>
```

This is a supported Prism API even though the five reference applications do not yet provide Avalonia sample heads. Design mode is excluded from automatic runtime activation.

</TabItem>
</Tabs>

## Custom view-model registrations

Map a non-conventional pair without replacing the application's resolver:

```csharp
using Prism.Mvvm;

ViewModelLocationProvider.Register<OrderView, EditOrderViewModel>();
```

A factory registration is also possible:

```csharp
ViewModelLocationProvider.Register<OrderView>(
    () => containerProvider.Resolve<EditOrderViewModel>());
```

A factory must use the appropriate scope and lifetime. A static factory that captures a page or scoped provider can retain that page; do not use one global mapping to smuggle per-page state into every future view.

## Default naming convention

With no explicit mapping, the default resolver changes `.Views.` to `.ViewModels.` in the fully qualified view name and looks in the same assembly. A name ending in `View` receives `Model`; other names receive `ViewModel`:

- `Example.Views.OrderView` → `Example.ViewModels.OrderViewModel`
- `Example.Views.OrderPage` → `Example.ViewModels.OrderPageViewModel`

A registered factory is tried first. Type mappings, a platform view-to-type resolver and finally the convention provide the view-model type. The host's configured factory then creates the instance.

## Change the naming convention

`SetDefaultViewTypeToViewModelTypeResolver` changes global convention lookup. For a finite mapping, a type-based resolver avoids constructing type names with reflection:

```csharp
ViewModelLocationProvider.SetDefaultViewTypeToViewModelTypeResolver(
    viewType => viewType == typeof(OrderView)
        ? typeof(EditOrderViewModel)
        : null);
```

Returning null means no type was found; it does not ask Prism to retry the old resolver. WPF/Avalonia applications can configure this after `base.ConfigureViewModelLocator()`. On builder-based hosts, configure it during startup before views are created.

## Control how view models are resolved

`SetDefaultViewModelFactory` has type-only and `(view, viewModelType)` overloads. These are advanced global customizations. Normally keep Prism's container-backed factory so constructor injection and host-specific scopes continue to work. A standalone use of `ViewModelLocationProvider` without a host factory defaults to parameterless activation, not automatic constructor injection.

## NativeAOT and trimming

In Prism 9.1 the default convention first checks types preserved by the container generator. Unrestricted reflection lookup is disabled for NativeAOT publication. Explicit mappings still need statically preserved activation paths and binding metadata; a mapping by itself is not application qualification. Use the supported Microsoft container from Commercial Plus and follow the [NativeAOT guide](../dependency-injection/native-aot.md).

Sources: [core lookup and factories](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Prism.Core/Mvvm/ViewModelLocationProvider.cs), [WPF/Avalonia attached property](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Wpf/Prism.Wpf/Mvvm/ViewModelLocator.cs), [.NET MAUI locator](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Mvvm/ViewModelLocator.cs), and [Uno locator](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Uno/Prism.Uno/Mvvm/ViewModelLocator.cs).

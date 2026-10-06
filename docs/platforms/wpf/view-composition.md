---
sidebar_position: 1
---

# Composing the User Interface Using the Prism Library for WPF

A composite UI places independently developed views into named locations called regions. The shell owns the layout; views and modules supply the content. Start with [the WPF setup](getting-started.md), then use `Prism.Navigation.Regions` for the region APIs in this guide.

![Conceptual application composed from regions and views](./images/Ch7UIFig1.png)

This illustration explains the composition pattern. It is not a screenshot of the current setup walkthrough.

## Shell, views, and regions

The WPF shell is usually a `System.Windows.Window`. A view is often a `UserControl`; it can contain further regions. A region maintains `Views` and `ActiveViews` collections, while an adapter translates those collections into the host control's content or items.

The default WPF mappings are:

| Host | Adapter | Typical purpose |
| --- | --- | --- |
| `ContentControl` | `ContentControlRegionAdapter` | One active workspace view |
| `ItemsControl` | `ItemsControlRegionAdapter` | Multiple visible items |
| `Selector`, including `TabControl` | `SelectorRegionAdapter` | Selected/active items such as document tabs |

These are WPF mappings, not a guarantee that a same-named control on another framework behaves identically. Keep a region host's content/items under the adapter's control instead of simultaneously binding `ItemsSource` or setting content yourself.

## Define a region in XAML

```xml
<Window x:Class="MyApp.Views.Shell"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:prism="http://prismlibrary.com/"
    Title="Workspace" Width="1000" Height="700">
    <Grid>
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="220" />
            <ColumnDefinition Width="*" />
        </Grid.ColumnDefinitions>
        <ContentControl prism:RegionManager.RegionName="NavigationRegion" />
        <ContentControl Grid.Column="1"
            prism:RegionManager.RegionName="MainRegion" />
    </Grid>
</Window>
```

The Prism XML namespace includes its trailing slash. Prism attaches the application's region manager to the shell it creates. Descendant region hosts locate that manager through their view hierarchy.

Use constants via `x:Static` if region names are shared across multiple modules. Names must be unique within one region manager, but can repeat in separate manager scopes.

## Choose discovery, injection, or navigation

These approaches solve different problems:

- **Discovery:** associate content with a region name and let Prism populate it when that region is created.
- **Injection:** add a particular view instance to a region that already exists.
- **Navigation:** request a registered destination and use navigation parameters, reuse/confirmation contracts, and the region journal.

### Displaying views when the region loads

Register a view/view-model pair first:

```cs
// App.RegisterTypes or IModule.RegisterTypes; using Prism.Ioc;
containerRegistry.RegisterForNavigation<CustomerListView, CustomerListViewModel>();
```

Then register discovery, for example in module initialization using an injected `IRegionManager`:

```cs
using Prism.Navigation.Regions;

regionManager.RegisterViewWithRegion("MainRegion", "CustomerListView");
```

The named route uses Prism's view registry to create and wire the view. A type-based overload is also available:

```cs
regionManager.RegisterViewWithRegion("MainRegion", typeof(CustomerListView));
```

For custom construction, a factory receives the provider used for that discovery operation:

```cs
regionManager.RegisterViewWithRegion("MainRegion",
    provider => provider.Resolve<CustomerListView>());
```

If you bypass the registered view-creation path in a custom factory, also arrange the view's data context; a raw container resolve is not itself a navigation request. `AutoPopulateRegionBehavior` populates existing/new regions as discovery registrations become available. Discovery does not run a navigation request with a journal entry.

### Displaying views programmatically

Wait until the region exists, then inject and activate an instance:

```cs
using Prism.Ioc;
using Prism.Navigation.Regions;

var view = container.Resolve<OrdersView>();
IRegion region = regionManager.Regions["MainRegion"];
region.Add(view, "OpenOrders");
region.Activate(view);
```

`container` and `regionManager` are injected services in this example. Ensure `OrdersView` has the desired data context and is registered as needed. The name `OpenOrders` identifies this instance within the region; it need not be the navigation registration name.

### Navigating within the region

```cs
regionManager.RequestNavigate("MainRegion", "CustomerListView", result =>
{
    if (!result.Success)
        System.Diagnostics.Debug.WriteLine(result.Exception);
});
```

Current results use `Success` and `Exception`, with `Context` for region navigation. The region must be registered before the request. For startup content that must wait for region creation, discovery can be simpler. For parameters, confirmation, reuse, and journal behavior, continue with [region navigation](../../navigation/regions/index.md).

## Activation, retention, and destruction

Region activity and object lifetime are separate:

- `IActiveAware` on a view or view model observes active/inactive state.
- `IRegionAware.IsNavigationTarget` determines whether an existing region view can satisfy a navigation request.
- `IRegionMemberLifetime.KeepAlive` or `RegionMemberLifetimeAttribute` determines whether a deactivated view remains in `Views`.
- `DestructibleRegionBehavior` calls `IDestructible.Destroy()` on views/view models removed from the region's `Views` collection.

The lifetime behavior checks the view's `IRegionMemberLifetime`, then its data context's implementation, then the view's lifetime attribute, then the data context's attribute. With no override, retained views can be reactivated later. `KeepAlive=false` removes a deactivated view; it does not redefine container registration lifetimes or mean that every dependency is automatically disposed.

Unsubscribe dialog/view-owned events when that object is finished. Do not tear down a retained view's permanent state just because another tab becomes active. Closing a shell window is a separate application/window lifetime event, not necessarily a removal notification for each object your application still retains.

## Sharing region context

`RegionContext` shares contextual data from a host to the views in its region without replacing each view's `DataContext`:

```xml
<ContentControl
    prism:RegionManager.RegionName="CustomerDetails"
    prism:RegionManager.RegionContext="{Binding SelectedCustomer}" />
```

The hosted WPF view can access `RegionContext.GetObservableContext(this).Value` and subscribe to that observable object's `PropertyChanged` event. Remove the subscription when the view is finished. If a view model needs the value, pass it through a view binding, navigation parameters, or a service rather than coupling the view model to `DependencyObject` solely to read an attached property.

## Creating multiple instances of a region

If two editor views each contain a region named `DetailsRegion`, attaching both to one global manager produces duplicate names. Create a region-manager scope for each editor:

```cs
var editor = container.Resolve<CustomerEditorView>();
IRegion documents = regionManager.Regions["DocumentsRegion"];
IRegionManager editorRegions = documents.Add(
    editor, "Customer42", createRegionManagerScope: true);
documents.Activate(editor);
```

The returned manager owns the editor's descendant regions. Wait for those hosts to register before navigating them. Keep the manager associated with that editor instance; do not query the global manager for its local names.

![Parent and scoped region managers](./images/Ch7UIFig11.png)

A region-manager scope isolates region names. It does not itself create a dependency-injection scope. If your editor also owns a DI scope, establish and dispose that scope explicitly in the component that owns the editor's lifetime.

## Source reference

- [Default WPF adapters and behaviors](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Wpf/Prism.Wpf/PrismInitializationExtensions.cs)
- [Discovery registration and view creation](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Wpf/Prism.Wpf/Navigation/Regions/RegionViewRegistry.cs)
- [Region Add, activation, removal, and manager scope](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Wpf/Prism.Wpf/Navigation/Regions/Region.cs)
- [Retention precedence](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Wpf/Prism.Wpf/Navigation/Regions/Behaviors/RegionMemberLifetimeBehavior.cs)
- [Destruction on removal](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Wpf/Prism.Wpf/Navigation/Regions/Behaviors/DestructibleRegionBehavior.cs)

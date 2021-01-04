# Basic Region Navigation

Both view injection and view discovery can be considered to be limited forms of navigation. View injection is a form of explicit, programmatic navigation and view discovery is a form of implicit or deferred navigation. However, in Prism, regions have been extended to support a more general notion of navigation, based on URIs and an extensible navigation mechanism.

Navigation within a region means that a new view is to be displayed within that region. The view to be displayed is identified via a URI, which, by default, refers to the name of the view to be created. You can programmatically initiate navigation using the **RequestNavigate** method defined by the **INavigateAsync** interface.

>**Note:** Despite its name, the **INavigateAsync** interface does not represent asynchronous navigation that's carried out on a separate background thread. Instead, the **INavigateAsync** interface represents the ability to perform pseudo-asynchronous navigation. The **RequestNavigate** method may return synchronously following the completion of navigation operation, or it may return while a navigation operation is still pending, as in the case where the user needs to confirm the navigation. By allowing you to specify callbacks and continuations during navigation, Prism provides a mechanism to enable these scenarios without requiring the complexity of navigating on a background thread.

The **INavigateAsync** interface is implemented by the **Region** class, allowing you to initiate navigation within that region.

```cs
IRegion mainRegion = ...;
mainRegion.RequestNavigate(new Uri("InboxView", UriKind.Relative));
```

You can also use the simpler string overload:

```cs
IRegion mainRegion = ...;
mainRegion.RequestNavigate("InboxView");
```

You can also call the **RequestNavigate** method on the **RegionManager**, which allows you to specify the name of the region to be navigated. This convenient method obtains a reference to the specified region and then calls the **RequestNavigate** method, as shown in the preceding code example.

```cs
IRegionManager regionManager = ...;
regionManager.RequestNavigate("MainRegion", new Uri("InboxView", UriKind.Relative));
```

As above, you can use a string overload to navigate:

```cs
IRegionManager regionManager = ...;
regionManager.RequestNavigate("MainRegion", "InboxView");
```

By default, the navigation URI specifies the name of a view that is registered in the container.

During navigation, the specified view is instantiated, via the container, along with its corresponding view model and other dependent services and components. After the view is instantiated, it is then added to the specified region and activated. Refer to [View and View Model Participation](view-viewmodel-participation.md) for more information on this.

>**Note:** The preceding description illustrates view-first navigation, where the URI refers to the name of the view type, as it is registered with the container. With view-first navigation, the dependent view model is created as a dependency of the view. An alternative approach is to use view model–first navigation, where the navigation URI refers to the name of the view model type, as it is registered with the container. View model–first navigation is useful when the view is defined as a data template, or when you want your navigation scheme to be defined independently of the views.

The **RequestNavigate** method also allows you to specify a callback method, or a delegate, which will be called when navigation is complete.

```cs
private void SelectedEmployeeChanged(object sender, EventArgs e)
{
    ...
    regionManager.RequestNavigate(RegionNames.TabRegion, "EmployeeDetails", NavigationCompleted);
}
private void NavigationCompleted(NavigationResult result)
{
    ...
}
```

The **NavigationResult** class defines properties that provide information about the navigation operation. The **Result** property indicates whether or not navigation succeeded. If navigation was successful, then the **Result** property will be _true_. If navigation failed, normally because of returning 'continuationCallBack(false)' in the **IConfirmNavigationResult.ConfirmNavigationRequest** method, then the **Result** property will be _false_. If navigation failed due to an exception, the **Result** property will be _false_ and the **Error** property provides a reference to any exception that was thrown during navigation. The **Context** property provides access to the navigation URI and any parameters it contains, and a reference to the navigation service that coordinated the navigation operation.

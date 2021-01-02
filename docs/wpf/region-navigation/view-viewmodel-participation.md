# View and View Model Participation in Navigation

Frequently, the views and view models in your application will want to participate in navigation. The **INavigationAware** interface enables this. You can implement this interface on the view or (more commonly) the view model. By implementing this interface, your view or view model can opt-in to participate in the navigation process.

>**Note:** In the description that follows, although a reference is made to calls to this interface during navigation between views, it should be noted that the **INavigationAware** interface will be called during navigation whether it is implemented by the view or by the view model.
During navigation, Prism checks to see whether the view implements the **INavigationAware** interface; if it does, it calls the required methods during navigation. Prism also checks to see whether the object set as the view's **DataContext** implements this interface; if it does, it calls the required methods during navigation.

This interface allows the view or view model to participate in a navigation operation. The **INavigationAware** interface defines three methods.

```cs
public interface INavigationAware
{
    bool IsNavigationTarget(NavigationContext navigationContext);
    void OnNavigatedTo(NavigationContext navigationContext);
    void OnNavigatedFrom(NavigationContext navigationContext);
}
```

The **IsNavigationTarget** method allows an existing (displayed) view or view model to indicate whether it is able to handle the navigation request. This is useful in cases where you can re-use an existing view to handle the navigation operation or when navigating to a view that already exists. For example, a view displaying customer information can be updated to display a different customer's information. For more information about using this method, see the section, [Navigating to Existing Views](navigation-existing-views.md).

The **OnNavigatedFrom** and **OnNavigatedTo** methods are called during a navigation operation. If the currently active view in the region implements this interface (or its view model), its **OnNavigatedFrom** method is called before navigation takes place. The **OnNavigatedFrom** method allows the previous view to save any state or to prepare for its deactivation or removal from the UI, for example, to save any changes that the user has made to a web service or database.

If the newly created view implements this interface (or its view model), its **OnNavigatedTo** method is called after navigation is complete. The **OnNavigatedTo** method allows the newly displayed view to initialize itself, potentially using any parameters passed to it on the navigation URI. For more information on passing parameters, see [Passing Parameters During Navigation](passing-parameters.md).

After the new view is instantiated, initialized, and added to the target region, it then becomes the active view, and the previous view is deactivated. Sometimes you will want the deactivated view to be removed from the region. Prism provides the **IRegionMemberLifetime** interface, which allows you to control the lifetime of views within regions by allowing you to specify whether deactivated views are to be removed from the region or simply marked as deactivated.

```cs
public class EmployeeDetailsViewModel : IRegionMemberLifetime
{
    public bool KeepAlive
    {
        get { return true; }
    }
}
```

The **IRegionMemberLifetime** interface defines a single read-only property, **KeepAlive**. If this property returns **false**, the view is removed from the region when it is deactivated. Because the region no longer has a reference to the view, it then becomes eligible for garbage collection (unless some other component in your application maintains a reference to it). You can implement this interface on your view or your view model classes. Although the **IRegionMemberLifetime** interface is primarily intended to allow you to manage the lifetime of views within regions during activation and deactivation, the **KeepAlive** property is also considered during navigation after the new view is activated in the target region.

>**Note:** Regions that can display multiple views, such as those that use an **ItemsControl** or a **TabControl**, will display both non-active and active views. Removal of a non-active view from these types of regions will result in the view being removed from the UI.
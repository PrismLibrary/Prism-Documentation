---
sidebar_position: 7
uid: Navigation.Regions.NavigationExistingViews
---

# Navigating to Existing Views

Frequently, it is more appropriate for the views in your application to be re-used, updated, or activated during navigation, instead of replaced by a new view. This is often the case where you are navigating to the same type of view but need to display different information or state to the user, or when the appropriate view is already available in the UI but needs to be activated (that is, selected or made top-most).

For an example of the first scenario, imagine that your application allows the user to edit customer records, using the **EditCustomer** view, and the user is currently using that view to edit customer ID 123. If the customer decides to edit the customer record for customer ID 456, the user can simply navigate to the **EditCustomer** view and enter the new customer ID. The **EditCustomer** view can then retrieve the data for the new customer and update its UI accordingly.

An example of the second scenario is where the application allows the user to edit more than one customer record at a time. In this case, the application displays multiple **EditCustomer** view instances in a tab control—for example, one for customer ID 123 and another for customer ID 456. When the user navigates to the **EditCustomer** view and enters customer ID 456, the corresponding view will be activated (that is, its corresponding tab will be selected). If the user navigates to the **EditCustomer** view and enters customer ID 789, a new instance will be created and displayed in the tab control.

The ability to navigate to an existing view is useful for a variety of reasons. It is often more efficient to update an existing view instead of replace it with a new instance of the same type. Similarly, activating an existing view, instead of creating a duplicate view, provides a more consistent user experience. In addition, the ability to handle these situations seamlessly without requiring much custom code means that the application is easier to develop and maintain.

Prism supports the two scenarios described earlier via the **IsNavigationTarget** method on the **INavigationAware** interface. This method is called during navigation on all views in a region that are of the same type as the target view. In the preceding examples, the target type of the view is the **EditCustomer** view, so the **IsNavigationTarget** method will be called on all existing **EditCustomer** view instances currently in the region. Prism determines the target type from the view URI, which it assumes is the short type name of the target type.

:::note
For Prism to determine the type of the target view, the view's name in the navigation URI should be the same as the actual target type's short type name. For example, if your view is implemented by the **MyApp.Views.EmployeeDetailsView** class, the view name specified in the navigation URI should be **EmployeeDetailsView**. This is the default behavior provided by Prism. You can customize this behavior by implementing a custom content loader class: do this by implementing the **IRegionNavigationContentLoader** interface or by deriving from the **RegionNavigationContentLoader** class.
:::

The implementation of the **IsNavigationTarget** method can use the **NavigationContext** parameter to determine whether it can handle the navigation request. The **NavigationContext** object provides access to the navigation URI and the navigation parameters. In the preceding examples, the implementation of this method in the **EditCustomer** view model compares the current customer ID to the ID specified in the navigation request, and it returns **true** if they match.

```cs
public class EmployeeDetailsViewModel : BindableBase, INavigationAware
{
    public bool IsNavigationTarget(NavigationContext navigationContext)
    {
        string id = navigationContext.Parameters["ID"];
        return _currentCustomer.Id.Equals(id);
    }

    public void OnNavigatedTo(NavigationContext navigationContext) { }
    public void OnNavigatedFrom(NavigationContext navigationContext) { }
}
```

If the **IsNavigationTarget** method always returns **true**, regardless of the navigation parameters, that view instance will always be re-used. This allows you to ensure that only one view of a particular type will be displayed in a particular region.


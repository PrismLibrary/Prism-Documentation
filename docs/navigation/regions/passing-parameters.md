---
sidebar_position: 8
uid: Navigation.Regions.PassingParameters
---

# Passing Parameters During Navigation

To implement the required navigational behavior in your application, you will often need to specify additional data during navigation request than just the target view name. The **NavigationContext** object provides access to the navigation URI, and to any parameters that were specified within it or externally. You can access the **NavigationContext** from within the **IsNavigationTarget**, **OnNavigatedFrom**, and **OnNavigatedTo** methods.

Prism provides the **NavigationParameters** class to help specify and retrieve navigation parameters. The **NavigationParameters** class maintains a list of name-value pairs, one for each parameter. You can use this class to pass parameters as part of navigation URI or for passing object parameters.

The following code example shows how to add individual string parameters to the **NavigationParameters** instance so that it can be appended to the navigation URI.

```cs
Employee employee = Employees.CurrentItem as Employee;
if (employee != null)
{
    var navigationParameters = new NavigationParameters();
    navigationParameters.Add("ID", employee.Id);
    _regionManager.RequestNavigate(
        RegionNames.TabRegion,
        new Uri("EmployeeDetailsView" + navigationParameters.ToString(), UriKind.Relative)
    );
}
```

Additionally, you can pass object parameters by adding them to the **NavigationParameters** instance, and passing it as a parameter of the **RequestNavigate** method. This is shown in the following code using the simpler string based navigation:

```cs
Employee employee = Employees.CurrentItem as Employee;
if (employee != null)
{
    var parameters = new NavigationParameters();
    parameters.Add("ID", employee.Id);
    parameters.Add("myObjectParameter", new ObjectParameter());
    regionManager.RequestNavigate(RegionNames.TabRegion, "EmployeeDetailsView", parameters);
}
```

You can retrieve the navigation parameters using the **Parameters** property on the **NavigationContext** object. This property returns an instance of the **NavigationParameters** class, which provides an indexer property to allow easy access to individual parameters, independently of them being passed through the query or through the **RequestNavigate** method.

```cs
public void OnNavigatedTo(NavigationContext navigationContext)
{
    string id = navigationContext.Parameters["ID"];
    ObjectParameter myParameter = navigationContext.Parameters["myObjectParameter"];
}
```

You can also retrieve parameters in a type safe manner using generics:

```cs
public void OnNavigatedTo(NavigationContext navigationContext)
{
    ObjectParameter objectParameter = navigationContext.Parameters.GetValue<ObjectParameter>("myObjectParameter");
}
```


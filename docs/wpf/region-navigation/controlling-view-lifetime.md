# Controlling View Lifetime

## IRegionMemberLifetime

After the new view is instantiated, initialized, and added to the target region, it then becomes the active view, and the previous view is deactivated. Sometimes you will want the deactivated view to be removed from the region. Prism provides the **IRegionMemberLifetime** interface, which allows you to control the lifetime of views within regions by allowing you to specify whether deactivated views are to be removed from the region or simply marked as deactivated.

```cs
public class EmployeeDetailsViewModel : BindableBase, IRegionMemberLifetime
{
    public bool KeepAlive
    {
        get { return true; }
    }
}
```

The **IRegionMemberLifetime** interface defines a single read-only property, **KeepAlive**. If this property returns **false**, the view is removed from the region when it is deactivated. Because the region no longer has a reference to the view, it then becomes eligible for garbage collection (unless some other component in your application maintains a reference to it). You can implement this interface on your view or your view model classes. Although the **IRegionMemberLifetime** interface is primarily intended to allow you to manage the lifetime of views within regions during activation and deactivation, the **KeepAlive** property is also considered during navigation after the new view is activated in the target region.

## RegionMemberLifetimeAttribute

You can accomplish the same thing using an attribute instead.
```cs
[RegionMemberLifetime(KeepAlive = true)]
public class EmployeeDetailViewModel : BindableBase
{
}
```

**Note:** Regions that can display multiple views, such as those that use an **ItemsControl** or a **TabControl**, will display both non-active and active views. Removal of a non-active view from these types of regions will result in the view being removed from the UI.

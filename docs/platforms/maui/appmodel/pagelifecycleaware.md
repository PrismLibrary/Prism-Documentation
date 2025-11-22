---
sidebar_position: 1
uid: Platforms.Maui.AppModel.PageLifecycleAware
---

# IPageLifecycleAware

Prism's `IPageLifecycleAware` interface is used on ViewModels to provide some additional logic when a Page is appearing or disappearing. This could be applied to a ViewModel for the Page or for a ViewModel on a [Region](xref:Navigation.Regions.GettingStarted). The interface itself is very simple with only 2 methods, which as the names suggest are called when the Page is Appearing or Disappearing.

```cs
public class ViewAViewModel : BindableBase, IPageLifecycleAware
{
    public void OnAppearing()
    {
        // Any Logic you need when the Page.OnAppearing() is called
    }

    public void OnDisappearing()
    {
        // Any Logic you need when the Page.OnDisappearing() is called
    }
}
```


---
sidebar_position: 9
uid: Navigation.Regions.ConfirmingNavigation
---

# Confirming Navigation

You will often find that you will need to interact with the user during a navigation operation, so that the user can confirm or cancel it. In many applications, for example, the user may try to navigate while in the middle of entering or editing data. In these situations, you may want to ask the user whether he or she wants to save or discard the data that has been entered before continuing to navigate away from the page, or whether the user wants to cancel the navigation operation altogether. Prism supports these scenarios via the **IConfirmNavigationRequest** interface.

The **IConfirmNavigationRequest** interface derives from the **INavigationAware** interface and adds the **ConfirmNavigationRequest** method. By implementing this interface on your view or view model class, you allow them to participate in the navigation sequence in a way that allows them to interact with the user so that the user can confirm or cancel the navigation. One way of displaying a confirmation is to use a simple windows message box. For something more complex, the **Dialog Service**, as described in [Dialog Service](xref:Dialogs.GettingStarted) could be used.

The **ConfirmNavigationRequest** method provides two parameters, a reference to the current navigation context as described earlier, and a callback method that you can call when you want navigation to continue.

The following steps summarize the process of confirming navigation using an **InteractionRequest** object:

1. Navigation operation is initiated via a **RequestNavigate** call.
1. If the view or view model of the current view implements **IConfirmNavigation**, **ConfirmNavigationRequest** is called.
1. The view displays the confirmation UI and awaits the user's response.
1. Continuation callback is invoked to continue or cancel the pending navigation operation.
1. The navigation operation is completed or canceled.

To illustrate this, check out the sample app at [22-ConfirmCancelNavigation](https://github.com/PrismLibrary/Prism-Samples-Wpf/tree/master/22-ConfirmCancelNavigation).

```cs
public class ViewAViewModel : BindableBase, IConfirmNavigationRequest
{
    public ViewAViewModel()
    {
    }

    public void ConfirmNavigationRequest(NavigationContext navigationContext, Action<bool> continuationCallback)
    {
        bool result = true;

        // this is demo code only and not suitable for production. It is generally
        // poor practice to reference your UI in the view model. Use the Prism
        // IDialogService to help with this.
        if (MessageBox.Show("Do you to navigate?", "Navigate?", MessageBoxButton.YesNo) == MessageBoxResult.No)
            result = false;

        continuationCallback(result);
    }

    public bool IsNavigationTarget(NavigationContext navigationContext)
    {
        return true;
    }

    public void OnNavigatedFrom(NavigationContext navigationContext)
    {
    }

    public void OnNavigatedTo(NavigationContext navigationContext)
    {
    }
}
```

In the above example, when the ConfirmNavigationRequest is called, a simple windows message box is popped up for the user to say yes or no to. If the user picks the "No" button the navigation is then canceled.

All of this happens on the UI thread. But it is still possible to call async methods (such as REST API calls) to help determine navigation status. In that case, depending on implementation, you may need to store a reference to the callback so that you can call it from another location.

If there is a long running implementation, it may be possible for the user to call another navigation operation. If that were to happen, the previous navigation would be canceled and invoking the callback for the previous navigation will have no effect as it is no longer the current navigation.


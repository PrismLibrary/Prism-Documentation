# Confirming Navigaton

A ViewModel can determine whether or not it can perform a navigation operation. When a ViewModel implements the **IConfirmNavigation** or the **IConfirmNavigationAsync** interface, the navigation process looks to see what the result of this method is.  If _true_, a navigation process can be invoked, meaning a call to `NavigationService.NavigateAsync("target")` can be made.  If _false_, the ViewModel cannot invoke the navigation process.

> [!Video https://www.youtube.com/embed/64qxmuzdX0M]

## IConfirmNavigation

```cs
public class ContactPageViewModel : IConfirmNavigation
{
  public bool CanNavigate(INavigationParameters parameters)
  {
    return true;
  }
}
```

## IConfirmNavigationAsync

```cs
public class ContactPageViewModel : IConfirmNavigationAsync
{
  public Task<bool> CanNavigateAsync(INavigationParameters parameters)
  {
    return _pageDialogService.DisplayAlertAsync("Save", "Would you like to save?", "Save", "Cancel");
  }
}
```
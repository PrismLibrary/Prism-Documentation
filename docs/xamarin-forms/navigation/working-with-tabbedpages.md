# Working with TabbedPages

## Selecting the Initial Tab
When navigating to a TabbedPage, by default the selected tab displayed will always be the first Tab defined for the TabbedPage. In Prism, you could select a different tab by specifying the `KnownNavigationParameters.SelectedTab` constant or the `selectedTab` parameter name as a navigation parameter.

```cs
//using parameter name
_navigationService.NavigateAsync("MyTabbedPage?selectedTab=ViewA");

//using KnownNavigationParameters.SelectedTab constant
_navigationService.NavigateAsync($"MyTabbedPage?{KnownNavigationParameters.SelectedTab}=ViewA");
```

For tabs that are wrapped inside a `NavigationPage`, you do not need to change anything. The syntax is the same.

## Selecting a Tab
You can select a tab programmatically from within a tab's ViewModel by using the `INavigationService.SelectTabAsync` method. In order to use this method, you must add the `Prism.Navigation.TabbedPages` namespace to your ViewModel.

```
using Prism.Navigation.TabbedPages;
```

```
async void SelectTab(object parameters)
{
    var result = await _navigationService.SelectTabAsync("Tab3");    
}
```

> [!NOTE]
> When selecting a tab programmatically both the INavigationAware and IConfirmNavigation interfaces are invoked.

> [!NOTE]
> The target tab and the calling tab must exist within the same TabbedPage instance.

## Creating Tabs at Runtime
To get started you will need to register the TabbedPage you wish to use (which can be the base Xamarin.Forms.TabbedPage), and any Views that you may wish to add as a Tab in your App's RegisterTypes method as shown below:

```cs
protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    containerRegistry.RegisterForNavigation<MyTabbedPage>();
    containerRegistry.RegisterForNavigation<ViewA>();
    containerRegistry.RegisterForNavigation<ViewB>();
}
```
Once you have verified your pages have been registered, you can now dynamically create tabs when navigating to a TabbedPage by using the `KnownNavigationParameters.CreateTab` constant or by using the `createTab` parameter name.

```cs
//using parameter name
_navigationService.NavigateAsync("MyTabbedPage?createTab=ViewA&createTab=ViewB");

//using KnownNavigationParameters.CreateTab constant
_navigationService.NavigateAsync($"MyTabbedPage?{KnownNavigationParameters.CreateTab}=ViewA&{KnownNavigationParameters.CreateTab}=ViewB");
```

To create a tab that wraps a page in a NavigationPage, simply denote this as a nested hierarchy using the | character.

```cs
_navigationService.NavigateAsync("MyTabbedPage?createTab=NavigationPage|ViewA");
```

> [!NOTE]
> Dynamic tab creation is only supported from the querystring at this time, and is not supported if you were to add it to the `INavigationParameters` passed in to `NavigateAsync`.

> [!NOTE]
> CarouselPages are not supported.

## Knowing the Selected Tab
The `IActiveAware` interface allows you to respond to tabs being selected/unselected in a TabbedPage. When a tab is selected and it, or it's ViewModel, implements that `IActiveAware` interface, the `IActiveAware.IsActive` property is set to either `true` if selected, or `false` if not selected.

```cs
public class TabItemViewModel : BindableBase, IActiveAware
{
    // NOTE: Prism.Forms only sets IsActive, and does not do anything with the event.
    public event EventHandler IsActiveChanged;

    private bool _isActive;
    public bool IsActive
    {
        get { return _isActive; }
        set { SetProperty(ref _isActive, value, RaiseIsActiveChanged); }
    }

    protected virtual void RaiseIsActiveChanged()
    {
        IsActiveChanged?.Invoke(this, EventArgs.Empty);
    }
}
```

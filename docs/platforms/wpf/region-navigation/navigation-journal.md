# Using the Navigation Journal

The **NavigationContext** class provides access to the region navigation service, which is responsible for coordinating the sequence of operations during navigation within a region. It provides access to the region in which navigation is taking place, and to the navigation journal associated with that region. The region navigation service implements the **IRegionNavigationService**, which is defined as follows.

```cs
public interface IRegionNavigationService : INavigateAsync
{
    IRegion Region {get; set;}
    IRegionNavigationJournal Journal {get;}
    event EventHandler<RegionNavigationEventArgs> Navigating;
    event EventHandler<RegionNavigationEventArgs> Navigated;
    event EventHandler<RegionNavigationFailedEventArgs> NavigationFailed;
}
```

Because the region navigation service implements the **INavigateAsync** interface, you can initiate navigation within the parent region by calling its **RequestNavigate** method. The **Navigating** event is raised when a navigation operation is initiated. The **Navigated** event is raised when navigation within a region is completed. The **NavigationFailed** is raised if an error was encountered during navigation.

The **Journal** property provides access to the navigation journal associated with the region. The navigation journal implements the **IRegionNavigationJournal** interface, which is defined as follows.

```cs
public interface IRegionNavigationJournal
{
    bool CanGoBack { get; }
    bool CanGoForward { get; }
    IRegionNavigationJournalEntry CurrentEntry { get; }
    INavigateAsync NavigationTarget { get; set; }
    void Clear();
    void GoBack();
    void GoForward();
    void RecordNavigation(IRegionNavigationJournalEntry entry);
}
```

You can obtain and store a reference to the region navigation service within a view during navigation via the **OnNavigatedTo** method call. By default, Prism provides a simple stack-based journal that allows you to navigate forward or backward within a region.

You can use the navigation journal to allow the user to navigate from within the view itself. In the following example, the view model implements a **GoBack** command, which uses the navigation journal within the host region. Therefore, the view can display a **Back** button that allows the user to easily navigate back to the previous view within the region. Similarly, you can implement a **GoForward** command to implement a wizard style workflow.

```cs
public class EmployeeDetailsViewModel : INavigationAware
{
    ...
    private IRegionNavigationService navigationService;

    public void OnNavigatedTo(NavigationContext navigationContext)
    {
        navigationService = navigationContext.NavigationService;
    }

    public DelegateCommand<object> GoBackCommand { get; private set; }

    private void GoBack(object commandArg)
    {
        if (navigationService.Journal.CanGoBack)
        {
            navigationService.Journal.GoBack();
        }
    }

    private bool CanGoBack(object commandArg)
    {
        return navigationService.Journal.CanGoBack;
    }
}
```

You can implement a custom journal for a region if you need to implement a specific workflow pattern within that region.

>**Note:** The navigation journal can only be used for region-based navigation operations that are coordinated by the region navigation service. If you use view discovery or view injection to implement navigation within a region, the navigation journal will not be updated during navigation and cannot be used to navigate forward or backward within that region.

## Opting out of the Navigation Journal

When using the Navigation Journal, it can be useful to display intermediary pages like splash screens, loading pages or dialogs. It is desirable that these pages should not be revisited via calls to **IRegionNavigationJournal.GoForward()** or **IRegionNavigationJournal.GoBack()**. This behavior can be achieved by implementing the **IJournalAware** interface.

```cs
public interface IJournalAware
{
    bool PersistInHistory();
}
```

Pages can opt-out of being added to the journal history by implementing **IJournalAware** on the **View** or **View Model** and returning false from **PersistInHistory()**.

```cs
public class IntermediaryPage : IJournalAware
{
    public bool PersistInHistory() => false;
}
```

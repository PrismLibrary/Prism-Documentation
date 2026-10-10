---
sidebar_position: 11
uid: Navigation.Regions.NavigationJournal
---

# Using the Navigation Journal

Each region navigation service has its own `IRegionNavigationJournal`, exposed through `region.NavigationService.Journal`. It tracks the current entry plus Back and Forward stacks for navigation performed by that service.

An entry contains the destination URI and `INavigationParameters`. It is not a saved visual tree or a durable session snapshot. Returning to an entry goes through navigation again, including confirmation and existing-view selection.

## Add Back and Forward commands

This coordinator can be owned by a shell or region toolbar. Call `Attach` after the target region has been created, for example with `regionManager.Regions["MainRegion"].NavigationService`. Dispose it when its owner is torn down.

```csharp
using System;
using Prism.Commands;
using Prism.Navigation.Regions;

public sealed class RegionHistoryViewModel : IDisposable
{
    private IRegionNavigationService? _navigation;

    public RegionHistoryViewModel()
    {
        BackCommand = new DelegateCommand(
            () => _navigation?.Journal.GoBack(),
            () => _navigation?.Journal.CanGoBack == true);
        ForwardCommand = new DelegateCommand(
            () => _navigation?.Journal.GoForward(),
            () => _navigation?.Journal.CanGoForward == true);
    }

    public DelegateCommand BackCommand { get; }
    public DelegateCommand ForwardCommand { get; }

    public void Attach(IRegionNavigationService navigation)
    {
        Detach();
        _navigation = navigation;
        navigation.Navigated += OnNavigated;
        navigation.NavigationFailed += OnNavigationFailed;
        RefreshCommands();
    }

    public void ClearHistory()
    {
        _navigation?.Journal.Clear();
        RefreshCommands();
    }

    private void OnNavigated(object? sender, RegionNavigationEventArgs args) =>
        RefreshCommands();

    private void OnNavigationFailed(object? sender, RegionNavigationFailedEventArgs args) =>
        RefreshCommands();

    private void RefreshCommands()
    {
        BackCommand.RaiseCanExecuteChanged();
        ForwardCommand.RaiseCanExecuteChanged();
    }

    private void Detach()
    {
        if (_navigation is null)
            return;
        _navigation.Navigated -= OnNavigated;
        _navigation.NavigationFailed -= OnNavigationFailed;
        _navigation = null;
    }

    public void Dispose()
    {
        Detach();
        RefreshCommands();
    }
}
```

A view model participating in navigation can instead obtain the same service through `NavigationContext.NavigationService`. Avoid storing that reference globally when multiple regions or documents have independent histories.

## What changes history?

- A successful ordinary navigation records an entry and clears the Forward stack.
- `GoBack()` and `GoForward()` navigate to an existing entry. The journal moves its stacks only when that request succeeds.
- `Clear()` clears the current entry and both stacks; it does not remove the active view.
- Direct view discovery, injection or `Activate` calls do not automatically create journal entries.

Do not manually call `RecordNavigation` for normal navigation. The service already does so. Its Prism 9.0 signature takes both `IRegionNavigationJournalEntry entry` and `bool persistInHistory`.

If UI navigation can remain pending for confirmation, prevent overlapping Back/Forward actions in the application. `CanGoBack` describes available history, not whether a prompt is currently open.

## Exclude an intermediate view {#opting-out-of-the-navigation-journal}

```csharp
using Prism.Navigation.Regions;

public sealed class LoadingViewModel : IJournalAware
{
    public bool PersistInHistory() => false;
}
```

Prism checks both the target view and its view model; either can opt out. The view is still displayed and notified, but it is not retained as the journal's current entry for a future Back/Forward visit. This does not erase earlier entries or undo navigation that already occurred.

## Boundaries to keep in mind

Region history is separate from a WPF `Frame`, browser URL history, native OS Back behavior and the MAUI page stack. Integrate the relevant Back affordance deliberately. Uno's `NavigationViewRegionAdapter` connects its `BackRequested` event to the region journal, but that does not establish a universal OS Back policy.

Object parameters can remain referenced by journal entries. Prefer stable identifiers when possible, and clear history when the application changes a security or workflow boundary, such as switching accounts. Clearing a journal is not a substitute for clearing cached data or enforcing authorization.

Source (Prism 9.0.537): [journal implementation](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Navigation/Regions/RegionNavigationJournal.cs), [journal contract](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Navigation/Regions/IRegionNavigationJournal.cs), [Uno NavigationView adapter](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Uno/Prism.Uno/Navigation/Regions/NavigationViewRegionAdapter.cs).

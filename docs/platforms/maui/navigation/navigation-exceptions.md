---
sidebar_position: 5
---

# Navigation Exceptions

The page navigation service returns many failures in `INavigationResult.Exception`. A `Prism.Navigation.NavigationException` adds a navigation message, an optional `NavigationKey`, and an optional `View`; an inner exception can identify the underlying container or XAML failure.

```cs
var result = await navigationService.NavigateAsync("DetailsPage");
if (result.Cancelled)
    return;

if (!result.Success)
{
    System.Diagnostics.Debug.WriteLine(result.Exception);
}
```

Use the defined constants when distinguishing known cases rather than copying their text:

```cs
if (result.Exception is NavigationException error &&
    error.Message == NavigationException.NoPageIsRegistered)
{
    // Check RegisterForNavigation and the route segment's spelling.
}
```

## Common causes

| Constant | Check |
| --- | --- |
| `IConfirmNavigationReturnedFalse` | The departing page/view model refused navigation; treat it as cancellation |
| `NoPageIsRegistered` | Every route segment must match a page registration, including custom navigation pages |
| `ErrorCreatingPage` | View constructor, XAML loading, and inner exceptions |
| `ErrorCreatingViewModel` | Explicit view-model mapping and its constructor dependencies |
| `GoBackToRootRequiresNavigationPage` | Call from a page inside the intended navigation stack |
| `NavigationSourceNotFound` | `NavigateFromAsync` needs a matching name on the active path |
| `UnsupportedAbsoluteUri` | `NavigateFromAsync` accepts relative routes |
| `UnsupportedMauiNavigation` | Modal/container hierarchy must be valid for the current platform |

Do not assume all failures are wrapped as `NavigationException`, or that catching exceptions is unnecessary everywhere. Inspect the actual exception type and await operations. A global observer can record failures, but it should not blindly retry navigation or create an error-dialog loop.

[Current exception constants](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Prism.Core/Navigation/NavigationException.cs) and [page navigation implementation](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Navigation/PageNavigationService.cs).

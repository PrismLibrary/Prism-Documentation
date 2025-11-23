---
sidebar_position: 5
---

# Navigation Exceptions

The NavigationService makes every effort to capture Exceptions making it safe to call the NavigationService without having to wrap every Navigation call in a try/catch block. When exceptions are encountered, the NavigationService will wrap the caught exception in a NavigationException. The NavigationException is meant to help the debug process by providing context around why the Navigation Failed.

When checking the NavigationException you can check for one of several Constants which the NavigationService uses to determine why the Navigation Failed.

```cs
if(exception.Message == NavigationException.IConfirmNavigationReturnedFalse)
{
    // The ViewModel implements IConfirmNavigation and returned false
}
```

:::note
When the NavigationException message is `IConfirmNavigationReturnedFalse` the [INavigationResult](navigation-result.md) will indicate both that the Navigation was not successful, and that it was cancelled.
:::


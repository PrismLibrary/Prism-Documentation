# Navigation Results

Each of the NavigationService methods returns an `INavigationResult`. The NavigationResult is a good way to verify that the Navigation was successful.

```cs
var result = await NavigationService.NavigateAsync("/ViewA");
if(result.Success)
{
    // Navigation was successful
}
else if(!result.Cancelled)
{
    // Navigation was not successful
}
```
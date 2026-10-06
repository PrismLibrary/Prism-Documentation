---
sidebar_position: 4
uid: Platforms.Maui.Navigation.NavigationResult
description: "Await and inspect Prism MAUI navigation success, cancellation, and exception results."
---

# Navigation Results

Await MAUI navigation methods and inspect the returned `Prism.Navigation.INavigationResult` before proceeding with work that depends on the transition:

```cs
var result = await navigationService.NavigateAsync("DetailsPage");
if (result.Success)
{
    // Continue the successful navigation flow.
}
else if (result.Cancelled)
{
    // A navigation confirmation refused the transition. Keep the current flow.
}
else
{
    System.Diagnostics.Debug.WriteLine(result.Exception);
}
```

- `Success` reports successful completion.
- `Cancelled` is `true` for a `NavigationException` whose message is `NavigationException.IConfirmNavigationReturnedFalse`.
- `Exception` carries a failure when one is supplied. Inspect inner exceptions for view construction or dependency-resolution errors.
- `Context` is populated for region-navigation results; do not expect it to be a MAUI page-navigation context.

A cancellation is not a generic catch-all for every unsuccessful request, nor does it mean a `CancellationToken` was cancelled. Do not show an error dialog for a user deliberately choosing to remain on an editor.

The service captures many failures into a result, but callers and custom extensions can still throw before or outside its guarded operation. Avoid fire-and-forget navigation when ordering and failure handling matter. See [Navigation Exceptions](navigation-exceptions.md) for common diagnoses.

[Result implementation](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Navigation/NavigationResult.cs) and [result contract](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Navigation/INavigationResult.cs).

---
sidebar_position: 9
---

# Confirming Region Navigation

Implement `IConfirmNavigationRequest` to let an active view or view model approve or reject a region navigation request. It inherits `IRegionAware` and adds a continuation callback:

```csharp
void ConfirmNavigationRequest(
    NavigationContext navigationContext,
    Action<bool> continuationCallback);
```

Call the callback with `true` to continue or `false` to stay. You may return from the method before invoking it, which lets a dialog complete without blocking the UI thread.

## Protect unfinished edits with a dialog

This view model uses the shared Prism dialog service. Register a platform-appropriate `ConfirmDiscardDialog` that closes with `ButtonResult.Yes` only when the user explicitly chooses to discard changes; other results keep the editor open. See [Dialog Service](../../dialogs/index.md) for the view and view-model setup.

```csharp
using System;
using System.Diagnostics;
using Prism.Dialogs;
using Prism.Mvvm;
using Prism.Navigation.Regions;

public sealed class EditorViewModel : BindableBase, IConfirmNavigationRequest
{
    private readonly IDialogService _dialogs;
    private bool _hasUnsavedChanges;

    public EditorViewModel(IDialogService dialogs) => _dialogs = dialogs;

    public bool HasUnsavedChanges
    {
        get => _hasUnsavedChanges;
        set => SetProperty(ref _hasUnsavedChanges, value);
    }

    public void ConfirmNavigationRequest(
        NavigationContext context, Action<bool> continuationCallback)
    {
        if (!HasUnsavedChanges)
        {
            continuationCallback(true);
            return;
        }

        _dialogs.ShowDialog("ConfirmDiscardDialog", new DialogParameters
        {
            { "message", "Discard your unsaved changes?" }
        }, new DialogCallback()
            .OnClose(result => continuationCallback(
                result.Exception is null && result.Result == ButtonResult.Yes))
            .OnError((Exception error) =>
            {
                Debug.WriteLine(error);
                continuationCallback(false);
            }));
    }

    public bool IsNavigationTarget(NavigationContext context) => true;
    public void OnNavigatedTo(NavigationContext context) { }
    public void OnNavigatedFrom(NavigationContext context) { }
}
```

The example demonstrates the navigation decision. The application still needs a policy for discarding or retaining the draft, especially if the view has `KeepAlive == true`. An approval is not proof that navigation subsequently succeeded.

## Continuation rules

- Invoke the continuation exactly once for each request, including cancellation and error paths. Otherwise navigation can remain pending or be processed more than once.
- Invoke it on the UI thread. If a background operation is needed, dispatch the final continuation back through the platform's dispatcher.
- Do not block with `.Wait()` or `.Result` while awaiting a UI dialog or save operation.
- If saving is required before leaving, await the save in your confirmation workflow and continue only after it succeeds. `OnNavigatedFrom` is too late to veto navigation.
- Avoid overlapping prompts, for example by disabling navigation commands while a decision is pending.

Prism confirms the active view and then its view model, and can continue to other active views in a multi-active region. Avoid implementing the same prompt independently on both objects.

## Scope of the guard

A later request can supersede an earlier pending request. When the old continuation eventually returns, the region service rejects that old context rather than activating its destination. The old request can still receive an unsuccessful callback, so do not treat a late dialog answer as a successful navigation.

The guard applies to `RequestNavigate` and journal navigation. It does not automatically guard direct `region.Remove`, `region.Activate`, closing a window, changing a native selector, or popping a MAUI page. Handle those entry points through the appropriate application/platform workflow. For MAUI page navigation, use the page-specific confirmation contract.

Test clean and dirty editors, Yes/No, dialog errors, a pending prompt followed by a second request, and failed destination resolution. Inspect `NavigationResult.Success`; declined region requests can have no exception.

Source: [IConfirmNavigationRequest](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Prism.Core/Navigation/Regions/IConfirmNavigationRequest.cs), [confirmation flow](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Wpf/Prism.Wpf/Navigation/Regions/RegionNavigationService.cs), [dialog callback handling](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Prism.Core/Dialogs/DialogCallback.cs).

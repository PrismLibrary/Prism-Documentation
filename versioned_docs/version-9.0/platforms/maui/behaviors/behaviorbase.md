---
sidebar_position: 2
uid: Platforms.Maui.Behaviors.BehaviorBase
description: "Create a Prism MAUI behavior with an associated object, inherited binding context, and correct detachment."
---

# BehaviorBase&lt;T&gt;

`Prism.Behaviors.BehaviorBase<T>` extends MAUI `Behavior<T>` for a `BindableObject`. It exposes `AssociatedObject` while attached and copies the associated object's `BindingContext`, keeping it in sync when that context changes.

## Benefits to the BehaviorBase&lt;T&gt;

Create a separate behavior instance for each element. Do not share the same instance through a style or singleton registration across multiple controls.

```cs
using Microsoft.Maui.Controls;
using Prism.Behaviors;

public class PageTraceBehavior : BehaviorBase<Page>
{
    protected override void OnAttachedTo(Page page)
    {
        base.OnAttachedTo(page);
        page.Appearing += OnAppearing;
    }

    protected override void OnDetachingFrom(Page page)
    {
        page.Appearing -= OnAppearing;
        base.OnDetachingFrom(page);
    }

    private void OnAppearing(object? sender, EventArgs args)
    {
        System.Diagnostics.Debug.WriteLine(AssociatedObject.GetType().Name);
    }
}
```

Always preserve the base attach/detach calls. Detaching removes the binding-context subscription and clears `AssociatedObject`; release your own event handlers too. A behavior detaching is distinct from a page temporarily disappearing.

Use the [page behavior factory](pagebehaviorfactory.md) for dependency-injected behaviors on Prism-created pages. Use [IPageLifecycleAware](../appmodel/pagelifecycleaware.md) when a view model only needs page visibility callbacks.

[Prism 9.0 implementation](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Behaviors/BehaviorBase%7BT%7D.cs).

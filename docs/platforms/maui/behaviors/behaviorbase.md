---
sidebar_position: 2
uid: Platforms.Maui.Behaviors.BehaviorBase
---

# BehaviorBase&lt;T&gt;

The Prism team long ago felt that it was a royal pain for people having to re-implement something that was in every single sample project released by the Xamarin Team. While this Base Behavior does indeed have some limitations that you should be aware of, it is a great starting point for many Behaviors you may need to create.

The Prism `BehaviorBase<T>` class is an opinionated base behavior that is built with the intent that you are creating a new instance of this behavior every single time that you apply it to an Element whether that's a Page, View, or anything else. This subtle yet important design decision is critical to pay attention to because it means that you cannot apply the same behavior to multiple elements through a Style.

## Benefits to the BehaviorBase&lt;T&gt;

The key benefit of the Prism `BehaviorBase<T>` is that you have immediate access to the Element (Page/View) that it was attached to from anywhere in your code, not just in the `OnAttachedTo` or `OnDetachedFrom` methods.


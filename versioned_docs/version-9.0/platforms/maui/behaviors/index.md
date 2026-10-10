---
sidebar_position: 1
title: Getting Started with Behaviors
description: "Add reusable MAUI behavior logic and choose Prism 9.0 lifecycle or page-behavior registration APIs."
---

# Getting Started with Behaviors

Behaviors attach reusable UI logic to a MAUI page, layout, or view. Prism behaviors use the MAUI `http://prismlibrary.com` XML namespace, without a trailing slash. Prism internally utilizes behaviors applied to the Page to provide additional logic on Pages to invoke a call to the `OnAppearing` and `OnDisappearing` methods for ViewModels that implement Prism's [IPageLifecycleAware](../appmodel/pagelifecycleaware.md).

## Next Steps

- [BehaviorBase](behaviorbase.md)
- [EventToCommandBehavior](eventtocommandbehavior.md)
- [Page Behavior Factory](pagebehaviorfactory.md)


Use one behavior instance per attached element, and remove any event subscriptions when it detaches. The [page behavior factory](pagebehaviorfactory.md) applies dependency-injected behaviors to Prism-created pages; it does not replace the page navigation or window lifecycle.

[Built-in behavior registration](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/PrismAppBuilder.cs).

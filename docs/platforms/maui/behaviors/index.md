---
sidebar_position: 1
title: Getting Started with Behaviors
---

# Getting Started with Behaviors

Behaviors attach reusable UI logic to a MAUI page, layout, or view. Prism behaviors use the MAUI `http://prismlibrary.com` XML namespace, without a trailing slash. Prism internally utilizes behaviors applied to the Page to provide additional logic on Pages to invoke a call to the `OnAppearing` and `OnDisappearing` methods for ViewModels that implement Prism's [IPageLifecycleAware](../appmodel/pagelifecycleaware.md).

## Next Steps

- [BehaviorBase](behaviorbase.md)
- [EventToCommandBehavior](eventtocommandbehavior.md)
- [Page Behavior Factory](pagebehaviorfactory.md)


Use one behavior instance per attached element, and remove any event subscriptions when it detaches. The [page behavior factory](pagebehaviorfactory.md) applies dependency-injected behaviors to Prism-created pages; it does not replace the page navigation or window lifecycle.

[Built-in behavior registration](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/PrismAppBuilder.cs).

# Getting Started with Behaviors

Behaviors in .NET MAUI allow us to wire up additional logic to number of Elements within the UI. Most commonly this would be a Page, a Layout, or a View. Prism internally utilizes behaviors applied to the Page to provide additional logic on Pages to invoke a call to the `OnAppearing` and `OnDisappearing` methods for ViewModels that implement Prism's [IPageLifecycleAware](../appmodel/pagelifecycleaware.md).

## Next Steps

- [BehaviorBase](behaviorbase.md)
- [EventToCommandBehavior](eventtocommandbehavior.md)
- [Page Behavior Factory](pagebehaviorfactory.md)
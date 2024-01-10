# Getting Started with Behaviors

Behaviors in .NET MAUI allow us to wire up additional logic to number of Elements within the UI. Most commonly this would be a Page, a Layout, or a View. Prism internally utilizes behaviors applied to the Page to provide additional logic on Pages to invoke a call to the `OnAppearing` and `OnDisappearing` methods for ViewModels that implement Prism's [IPageLifecycleAware](xref:Platforms.Maui.AppModel.PageLifecycleAware).

## Next Steps

- [BehaviorBase](xref:Platforms.Maui.Behaviors.BehaviorBase)
- [EventToCommandBehavior](xref:Platforms.Maui.Behaviors.EventToCommandBehavior)
- [Page Behavior Factory](xref:Platforms.Maui.Behaviors.PageBehaviorFactory)
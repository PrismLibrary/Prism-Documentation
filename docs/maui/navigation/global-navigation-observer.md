# Global NavigationRequest Event

Out of the Box Prism's PageNavigationService (the default implementation of the `INavigationService`) is configured to publish events with the `IEventAggregator` when one of it's Navigation methods `NavigateAsync`, `GoBackAsync`, or `GoBackToRootAsync` are called. When it has completed, the event will fire giving you an opportunity to globally monitor these requests. What you do with the context is ultimately up to you, however it is a great place to handle Navigation Exceptions at a global level.

## Handling this out of the box

As mentioned out of the Box Prism will use the IEventAggregator to publish notifications when a Navigation request is completed. To hook up to this you might add something like the following to your app:

```cs
var builder = MauiApp.CreateBuilder();
builder.UsePrismApp<App>(prism => {
    prism.OnInitialized(container => {
        var eventAggregator = container.Resolve<IEventAggregator>();
        eventAggregator.GetEvent<NavigationRequestEvent>().Subscribe(context => {
            // Handle the event
        });
    });
});
````

## GlobalNavigationObserver

Reactive Programming has become a popular topic among .NET developers over the past several years. As a result we decided to ship the `Prism.Maui.Rx` package. This package is extremely lightweight and provides an easy to use extension on the `PrismAppBuilder` that allows you get access to the `IObservable<NavigationRequestContext>`.

```cs
var builder = MauiApp.CreateBuilder();
builder.UsePrismApp<App>(prism => {
    prism.AddGlobalNavigationObserver(observable => observable.Subscribe(context => {
        if(!context.Success)
        {
            // handle the error
        }
    }));
});
```
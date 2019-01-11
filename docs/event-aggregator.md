# Event Aggregator
The Prism Library provides an event mechanism that enables communications between loosely coupled components in the application. This mechanism, based on the event aggregator service, allows publishers and subscribers to communicate through events and still do not have a direct reference to each other.

The `EventAggregator` provides multicast publish/subscribe functionality. This means there can be multiple publishers that raise the same event and there can be multiple subscribers listening to the same event. Consider using the `EventAggregator` to publish an event across modules and when sending a message between business logic code, such as controllers and presenters.

Events created with the Prism Library are typed events. This means you can take advantage of compile-time type checking to detect errors before you run the application. In the Prism Library, the `EventAggregator` allows subscribers or publishers to locate a specific `EventBase`. The event aggregator also allows for multiple publishers and multiple subscribers, as shown in the following illustration.

![Using the event aggregator](images/event-aggregator-1.png)

> [!Video https://www.youtube.com/embed/xTP9_hN_3xA]

## IEventAggregator
The `EventAggregator` class is offered as a service in the container and can be retrieved through the `IEventAggregator `interface. The event aggregator is responsible for locating or building events and for keeping a collection of the events in the system.
```cs
public interface IEventAggregator
{
    TEventType GetEvent<TEventType>() where TEventType : EventBase;
}
```

The `EventAggregator` constructs the event on its first access if it has not already been constructed. This relieves the publisher or subscriber from needing to determine whether the event is available.

## PubSubEvent
The real work of connecting publishers and subscribers is done by the `PubSubEvent` class. This is the only implementation of the `EventBase` class that is included in the Prism Library. This class maintains the list of subscribers and handles event dispatching to the subscribers.

The `PubSubEvent` class is a generic class that requires the payload type to be defined as the generic type. This helps enforce, at compile time, that publishers and subscribers provide the correct methods for successful event connection. The following code shows a partial definition of the PubSubEvent class.

> [!Note]
> `PubSubEvent` can be found in the Prism.Events namespace which is located in the Prism.Core NuGet package.

## Creating an Event
The `PubSubEvent<TPayload>` is intended to be the base class for an application's or module's specific events. `TPayLoad` is the type of the event's payload. The payload is the argument that will be passed to subscribers when the event is published.

For example, the following code shows the `TickerSymbolSelectedEvent`. The payload is a string containing the company symbol. Notice how the implementation for this class is empty.
```cs
public class TickerSymbolSelectedEvent : PubSubEvent<string>{}
```
> [!Note]
> In a composite application, the events are frequently shared between multiple modules, so they are defined in a common place. It is common practice to define these events in a shared assembly such as a "Core" or "Infrastructure" project.

## Publishing an Event
Publishers raise an event by retrieving the event from the `EventAggregator` and calling the `Publish` method. To access the `EventAggregator`, you can use dependency injection by adding a parameter of type `IEventAggregator` to the class constructor.
```cs
public class MainPageViewModel
{
    IEventAggregator _eventAggregator;
    public MainPageViewModel(IEventAggregator ea)
    {
        _eventAggregator = ea;
    }
}
```
The following code demonstrates publishing the TickerSymbolSelectedEvent.
```cs
_eventAggregator.GetEvent<TickerSymbolSelectedEvent>().Publish("STOCK0");
```

## Subscribing to Events
Subscribers can enlist with an event using one of the `Subscribe` method overloads available on the `PubSubEvent` class. 
```cs
public class MainPageViewModel
{
    public MainPageViewModel(IEventAggregator ea)
    {
        ea.GetEvent<TickerSymbolSelectedEvent>().Subscribe(ShowNews);
    }

    void ShowNews(string companySymbol)
    {
        //implement logic
    }
}
```

There are several ways to subscribe to `PubSubEvents`. Use the following criteria to help determine which option best suits your needs:
- If you need to be able to update UI elements when an event is received, subscribe to receive the event on the UI thread.
- If you need to filter an event, provide a filter delegate when subscribing.
- If you have performance concerns with events, consider using strongly referenced delegates when subscribing and then manually unsubscribe from the PubSubEvent.
- If none of the preceding is applicable, use a default subscription.

The following sections describe these options.

### Subscribing on the UI Thread
Frequently, subscribers will need to update UI elements in response to events. In WPF, only a UI thread can update UI elements.

By default, the subscriber receives the event on the publisher's thread. If the publisher sends the event from the UI thread, the subscriber can update the UI. However, if the publisher's thread is a background thread, the subscriber may be unable to directly update UI elements. In this case, the subscriber would need to schedule the updates on the UI thread using the Dispatcher class.

The `PubSubEvent` provided with the Prism Library can assist by allowing the subscriber to automatically receive the event on the UI thread. The subscriber indicates this during subscription, as shown in the following code example.
```cs
public class MainPageViewModel
{
    public MainPageViewModel(IEventAggregator ea)
    {
        ea.GetEvent<TickerSymbolSelectedEvent>().Subscribe(ShowNews, ThreadOption.UIThread);
    }

    void ShowNews(string companySymbol)
    {
        //implement logic
    }
}
```

The following options are available for `ThreadOption`:
- `PublisherThread`: Use this setting to receive the event on the publishers' thread. This is the default setting.
- `BackgroundThread`: Use this setting to asynchronously receive the event on a .NET Framework thread-pool thread.
- `UIThread`: Use this setting to receive the event on the UI thread.

> [!Note]
> In order for `PubSubEvent` to publish to subscribers on the UI thread, the `EventAggregator` must initially be constructed on the UI thread.

### Subscription Filtering
Subscribers may not need to handle every instance of a published event. In these cases, the subscriber can use the filter parameter. The filter parameter is of type `System.Predicate<TPayLoad>` and is a delegate that gets executed when the event is published to determine if the payload of the published event matches a set of criteria required to have the subscriber callback invoked. If the payload does not meet the specified criteria, the subscriber callback is not executed.

Frequently, this filter is supplied as a lambda expression, as shown in the following code example.
```cs
public class MainPageViewModel
{
    public MainPageViewModel(IEventAggregator ea)
    {
        TickerSymbolSelectedEvent tickerEvent = ea.GetEvent<TickerSymbolSelectedEvent>();
        tickerEvent.Subscribe(ShowNews, ThreadOption.UIThread, false, 
                              companySymbol => companySymbol == "STOCK0");
    }

    void ShowNews(string companySymbol)
    {
        //implement logic
    }
}
```
> [!Note]
> The `Subscribe` method returns a subscription token of type `Prism.Events.SubscriptionToken` that can be used to remove a subscription to the event later. This token is particularly useful when you are using anonymous delegates or lambda expressions as the callback delegate or when you are subscribing the same event handler with different filters.

> [!Note]
> It is not recommended to modify the payload object from within a callback delegate because several threads could be accessing the payload object simultaneously. You could have the payload be immutable to avoid concurrency errors.

### Subscribing Using Strong References
If you are raising multiple events in a short period of time and have noticed performance concerns with them, you may need to subscribe with strong delegate references. If you do that, you will then need to manually unsubscribe from the event when disposing the subscriber.

By default, `PubSubEvent` maintains a weak delegate reference to the subscriber's handler and filter on subscription. This means the reference that `PubSubEvent` holds on to will not prevent garbage collection of the subscriber. Using a weak delegate reference relieves the subscriber from the need to unsubscribe and allows for proper garbage collection.

However, maintaining this weak delegate reference is slower than a corresponding strong reference. For most applications, this performance will not be noticeable, but if your application publishes a large number of events in a short period of time, you may need to use strong references with PubSubEvent. If you do use strong delegate references, your subscriber should unsubscribe to enable proper garbage collection of your subscribing object when it is no longer used.

To subscribe with a strong reference, use the `keepSubscriberReferenceAlive` parameter on the `Subscribe` method, as shown in the following code example.
```cs
public class MainPageViewModel
{
    public MainPageViewModel(IEventAggregator ea)
    {
        bool keepSubscriberReferenceAlive = true;
        TickerSymbolSelectedEvent tickerEvent = ea.GetEvent<TickerSymbolSelectedEvent>();
        tickerEvent.Subscribe(ShowNews, ThreadOption.UIThread, keepSubscriberReferenceAlive, 
                              companySymbol => companySymbol == "STOCK0");
    }

    void ShowNews(string companySymbol)
    {
        //implement logic
    }
}
```

The `keepSubscriberReferenceAlive` parameter is of type `bool`:
- When set to `true`, the event instance keeps a strong reference to the subscriber instance, thereby not allowing it to get garbage collected. For information about how to unsubscribe, see the section Unsubscribing from an Event later in this topic.
- When set to `false` (the default value when this parameter omitted), the event maintains a weak reference to the subscriber instance, thereby allowing the garbage collector to dispose the subscriber instance when there are no other references to it. When the subscriber instance gets collected, the event is automatically unsubscribed.

## Unsubscribing from an Event
If your subscriber no longer wants to receive events, you can unsubscribe by using your subscriber's handler or you can unsubscribe by using a subscription token.

The following code example shows how to directly unsubscribe to the handler.
```cs
public class MainPageViewModel
{
    TickerSymbolSelectedEvent _event;
    public MainPageViewModel(IEventAggregator ea)
    {
        _event = ea.GetEvent<TickerSymbolSelectedEvent>();
        _event.Subscribe(ShowNews);
    }

    void Unsubscribe()
    {
        _event.Unsubscribe(ShowNews);
    }

    void ShowNews(string companySymbol)
    {
        //implement logic
    }
}
```

The following code example shows how to unsubscribe with a subscription token. The token is supplied as a return value from the `Subscribe` method.
```cs
public class MainPageViewModel
{
    TickerSymbolSelectedEvent _event;
    SubscriptionToken _token;
    public MainPageViewModel(IEventAggregator ea)
    {
        _event = ea.GetEvent<TickerSymbolSelectedEvent>();
        _token = _event.Subscribe(ShowNews);
    }

    void Unsubscribe()
    {
        _event.Unsubscribe(_token);
    }

    void ShowNews(string companySymbol)
    {
        //implement logic
    }
}
```

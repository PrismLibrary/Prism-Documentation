---
sidebar_position: 6
uid: Platforms.Maui.Navigation.GlobalNavigationRequest
---

# Observe Navigation Globally

Prism's MAUI page navigation service publishes `Prism.Events.NavigationRequestEvent` through `IEventAggregator` when a request completes. Use it for application-wide diagnostics, not as a replacement for awaiting the result when the caller needs to decide what happens next.

## Subscribe with the event aggregator

Configure the subscription once during startup:

```cs
using Prism.Events;
using Prism.Navigation;

prism.OnInitialized(container =>
{
    var events = container.Resolve<IEventAggregator>();
    events.GetEvent<NavigationRequestEvent>().Subscribe(context =>
    {
        var status = context.Cancelled ? "Cancelled"
            : context.Result.Success ? "Succeeded" : "Failed";
        System.Diagnostics.Debug.WriteLine($"{context.Type}: {status}");
    });
});
```

The event context exposes `Type`, `Uri`, `Parameters`, and `Result`. Inspect `context.Result.Success` and `context.Result.Exception`; there is no `context.Success` property. `context.Cancelled` identifies a confirmation veto. The current request-type enum contains `Navigate`, `GoBack`, and `GoToRoot`, rather than one value for every convenience API.

Retain and dispose the returned `SubscriptionToken` when the subscribing component has a shorter lifetime than the application. EventAggregator uses the publisher thread by default; dispatch UI changes appropriately or choose the relevant subscription thread option. Keep handlers short and avoid starting recursive navigation from a diagnostic subscriber.

## Reactive observer

Install a matching version of `Prism.Maui.Rx` to use `AddGlobalNavigationObserver`:

```cs
using Prism.Navigation;

prism.AddGlobalNavigationObserver(observable => observable.Subscribe(context =>
{
    if (!context.Result.Success && !context.Cancelled)
    {
        System.Diagnostics.Debug.WriteLine(context.Result.Exception);
    }
}));
```

The package exposes `IObservable<NavigationRequestContext>` over the same event stream. The returned Rx subscription is disposable; retain it if you need to stop observing before application shutdown. Choose either this adapter or direct EventAggregator subscription unless you intentionally need both, to avoid duplicate reporting.

Routes, parameter values, and exception details may contain application or personal data. The first example records only operation type/status. Apply redaction before forwarding richer diagnostics to external logging providers.

## Source reference

- [NavigationRequestContext](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Navigation/NavigationRequestContext.cs)
- [Reactive observer registration](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui.Rx/NavigationObserverRegistrationExtensions.cs)
- [EventAggregator-to-Rx adapter](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui.Rx/GlobalNavigationObserver.cs)

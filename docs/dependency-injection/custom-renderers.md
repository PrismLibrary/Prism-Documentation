# Dependency Injection with Xamarin.Forms

A little known feature in Xamarin.Forms is that we actually have the ability to use Dependency Injection for all of our custom services within Xamarin.Forms. This includes but is by no means limited to Renderers and Platform Effects. While this feature is disabled by default you can if you so choose, decide to set the Xamarin.Forms Dependency Resolver at app startup. When you set the flag to true, we will automatically take care of configuring Xamarin.Forms to use Prism's Dependency Injection container to resolve any service which it or any of your plugins may try to resolve with the Xamarin.Forms DependencyService. As mentioned this includes all of your Renderers.

## How to use the Container for Xamarin.Forms

It couldn't be easier. In order to enable this feature you simply need to pass `true` to the base constructor's argument for `setFormsDependencyResolver`.

```cs
public App(IPlatformInitializer initializer = null)
    : base(initializer, setFormsDependencyResolver: true)
{
}
```

## Why Use It

There may be times which you want to implement a custom renderer for which you want to use a service that is registered with your container. As an example let's assume that you are using the Event Aggregator and you want to publish an event when something happens from a platform level:

```cs
public class MyCustomRenderer : PageRenderer
{
    private IEventAggregator _eventAggregator { get; }

    public MyCustomRenderer(IEventAggregator eventAggregator)
    {
        _eventAggregator = eventAggregator;
    }
}
```

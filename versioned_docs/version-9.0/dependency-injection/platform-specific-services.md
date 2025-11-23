---
sidebar_position: 4
uid: DependencyInjection.IPlatformInitializer
---

# Using IPlatformInitializer

:::warning
**Legacy Documentation**: This documentation is for legacy Xamarin.Forms applications only. Xamarin.Forms is End of Life and Prism no longer supports it. This documentation is provided for historical reference only.
:::

The `IPlatformInitializer` was used in Prism for Xamarin.Forms to register platform-specific types with Prism's container. This is no longer needed in modern Prism applications using .NET MAUI or Uno Platform, as these platforms have built-in dependency injection support.

<iframe width="560" height="315" src="https://www.youtube.com/embed/qMzTAOOgY8c" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

The `IPlatformInitializer` is a very simple interface which simply contains a single method for `RegisterTypes`. The `IPlatformInitializer` can then be passed into the PrismApplication when you create your app. For iOS you might simply have the following code:

```cs
public partial class AppDelegate : FormsApplicationDelegate, IPlatformInitializer
{
    public override bool FinishedLaunching(UIApplication app, NSDictionary options)
    {
        global::Xamarin.Forms.Forms.Init();
        LoadApplication(new App(this));

        return base.FinishedLaunching(app, options);
    }

    public void RegisterTypes(IContainerRegistry containerRegistry)
    {
        containerRegistry.Register<ITextToSpeech, TextToSpeech>();
    }
}
```

Keep in mind that you will need to be sure your App contains the proper constructor overload like the following:

```cs
public class App : PrismApplication
{
    public App(IPlatformInitializer initializer)
        : base(initializer)
    {
    }
}
```


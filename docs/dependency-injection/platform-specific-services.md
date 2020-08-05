# Using IPlatformInitializer

> [!NOTE]
> The following docs are only relavent to Prism for Xamarin.Forms. `IPlatformInitializer` is not used by Prism.Wpf or Prism.Uno

With Xamarin.Forms you may have read how you can add the Dependency attribute for an impelementing type in your Platform Specific code and then resolve it with the Xamarin.Forms DependencyService. This is considered a major Anti-Pattern that should be avoided when you are using a proper Dependency Injection container. It is for this reason that Prism has dropped all support for working with the DependencyService as of Prism 7.0. Starting with Prism 6.3 the `IPlatformInitializer` was introduced. This allows you to easily register types with Prism's container.

> [!Video https://www.youtube.com/embed/qMzTAOOgY8c]

<hr />

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

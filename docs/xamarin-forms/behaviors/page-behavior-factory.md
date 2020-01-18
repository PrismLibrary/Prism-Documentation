# Page Behavior Factory

There are many times where you may want to apply specific behaviors to pages universally. Internally Prism utilizes the IPageBehaviorFactory to apply Behaviors for supporting `IActiveAware` on the children of the `TabbedPage` `CarouselPage`, & `NavigationPage` as well as handling [`IPageLifecycleAware`](../page-lifecycle.md). In the event that there are custom behaviors which you would like to apply you can provide a custom implementation of the PageBehaviorFactory.

While this is generally utilized for applying Behaviors, we can do anything we may need to here to configure our Page. As an example we could simplify our Pages, and apply some Platform Specific's from the PageBehaviorFactory. For an example let's assume that we want the Tabbed Bar on the bottom for Android and we want to use the Safe Area on iOS. Given this we could create the following CustomPageBehaviorFactory:

```csharp
using Prism.Behaviors;
using Xamarin.Forms;
using Xamarin.Forms.PlatformConfiguration;
using Xamarin.Forms.PlatformConfiguration.AndroidSpecific;
using Xamarin.Forms.PlatformConfiguration.iOSSpecific;
using TabbedPage = Xamarin.Forms.TabbedPage;

namespace MyApp.Behaviors
{
    public class CustomPageBehaviorFactory : PageBehaviorFactory
    {
        public override void ApplyContentPageBehaviors(ContentPage page)
        {
            base.ApplyContentPageBehaviors(page);
            page.On<iOS>().SetUseSafeArea(true);
        }

        public override void ApplyTabbedPageBehaviors(TabbedPage page)
        {
            base.ApplyTabbedPageBehaviors(page);
            page.On<Android>().SetToolbarPlacement(ToolbarPlacement.Bottom);
        }
    }
}
```

Now that we have a custom implementation all we need to do is Register it in our PrismApplication and we will get the custom behavior and configuration that we are looking for.

```cs
protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    constinerRegistry.RegisterSingleton<IPageBehaviorFactory, CustomPageBehaviorFactory>();
}
```

>[!Warning]
> Prism 8 will have some breaking changes here. When this API was first introduced IPageBehaviorFactory was given several Page type specific methods. These aren't actually used anywhere. For this reason the interface will be simplified to only declare the single ApplyPageBehaviors(Page) method. All of the methods in the PageBehaviorFactory will be changed from public to protected and will remain virtual so that you can apply your custom behaviors.
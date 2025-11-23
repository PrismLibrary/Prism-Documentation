---
sidebar_position: 8
---

# TabbedPages

## Selecting a Tab at Runtime

Sometimes you may want to programmatically switch between tabs. Keep in mind that this must be done from a ViewModel attached to one of the children of the TabbedPage or the TabbedPage itself.

```cs
var result = await navigationService.SelectTabAsync("TabB");
```

In the event that you have a tab which is nested inside of a NavigationPage you can select the tab:

```cs
var result = await navigationService.SelectTabAsync("NavigationPage|TabB");
```

## Navigating to a TabbedPage

Tabbed Navigation in Prism for .NET MAUI has been significantly enhanced. Due to a variety of changes we suggest using a Uri to generate your TabbedPage over using a concrete type like:

```xml
<!-- Not Recommended -->
<TabbedPage>
  <view:ViewA />
  <view:ViewB />
</TabbedPage>
```

The recommended way to do this would be to use either a Uri:

```csharp
navigationService.NavigateAsync("TabbedPage?createTab=ViewA&createTab=ViewB");
```

Alternatively you can use the [NavigationBuilder](navigation-builder) to build your TabbedPage on the fly.

```cs
navigationService.CreateBuilder()
    .AddTabbedSegment(s => s
        .CreateTab(t => t.AddSegment<ViewAViewModel>())
        .CreateTab(t => t.AddNavigationPage().AddSegment<ViewBViewModel>())
    )
    .NavigateAsync();
```

This approach offers you a lot of flexibility when creating the same tabbed page over and over throughout your app as well as you can write an extension method once to consolidate this.

```cs
public static class MyNavigationExtensions
{
    public static INavigationBuilder AddMyTabbedPage(this INavigationBuilder builder, string? selectedTab = null)
    {
        return builder.AddTabbedSegment(s => 
        {
            s.CreateTab(t => t.AddSegment<ViewAViewModel>())
             .CreateTab(t => t.AddNavigationPage().AddSegment<ViewBViewModel>());
            if (!string.IsNullOrEmpty(selectedTab))
            {
                s.SelectedTab(selectedTab);
            }
        });
    }
}
```

:::note
Prism automatically registers the .NET MAUI TabbedPage with the navigation key `TabbedPage`. You do not need to register your own.
:::


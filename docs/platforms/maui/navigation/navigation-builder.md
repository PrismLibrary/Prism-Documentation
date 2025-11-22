---
sidebar_position: 3
uid: Platforms.Maui.Navigation.NavigationBuilder
---

# Navigation Builder

The NavigationBuilder is new to Prism.Maui and is meant to solve a number of issues that developers run into. While Prism's NavigationService will always continue to be URI based, this can create issues for very complex Deep Links and can cause issues for developers who are doing some string interpolation.

```cs
public static class NavigationKeys
{
    public const string ViewA = nameof(ViewA);
    public const string ViewB = nameof(ViewB);
}

public static class NavParameterKeys
{
    public const string Id = nameof(Id);
}

public class ViewAViewModel : BindableBase
{
    private async void OnNavigateCommandExecuted()
    {
        await NavigationService.NavigateAsync($"{NavigationKeys.ViewA}/{NavigationKeys.ViewB}");
    }
}
```

The NavigationBuilder seeks to solve this issue by making the code more readable, easier to maintain, and expose a few new tricks that can help for the first time allow ViewModel based Navigation.

## Getting the NavigationBuilder

The NavigationBuilder can NOT be injected into anything with Dependency Injection. It is a one time use API and is created from the INavigationService.

```cs
public class ViewAViewModel : BindableBase
{
    private void OnNavigateCommandExecuted()
    {
        var builder = NavigationService.CreateBuilder();
    }
}
```

## Building the NavigationURI

it is important to remember that the order in which you add Navigation Segments to the URI will be the order in which they will be added to the Navigation URI. If I want to navigate Modally to `ViewA/ViewB` then this would look like:

```cs
NavigationService.CreateBuilder()
    .AddSegment(NavigationKeys.ViewA)
    .AddSegment(NavigationKeys.ViewB);
```

### ViewModel First Navigation

As mentioned the NavigationBuilder exposes the ONLY API in Prism that allows ViewModel First Navigation. In order to use ViewModel Navigation you **MUST** register **BOTH** the View and the ViewModel.

```cs
container.RegisterForNavigation<ViewA, ViewAViewModel>();
```

If you do not add both the Registration will not exist for the ViewModel to be able to resolve the appropriate navigation key. To use ViewModel Navigation you simply need to supplement the string for the generic ViewModel type.

```cs
NavigationService.CreateBuilder()
    .AddSegment<ViewAViewModel>()
```

### Navigation Pages

As you may have previously read, Prism will automatically register the [PrismNavigationPage](xref:Platforms.Maui.Navigation.PrismNavigationPage) for Navigation. Regardless of whether this is the registered NavigationPage or you have provided your own NavigationPage type, as long as there is a SINGLE registration for a NavigationPage, you can use the helper extension which will check the View Registrations for the proper Navigation Name of the registered NavigationPage.

```cs
NavigationService.CreateBuilder()
    .AddNavigationPage()
```

### Tabbed Pages

Similar to the NavigationPage, Prism automatically registers the MAUI TabbedPage for Navigation. You can dynamically create your TabbedPages as follows. 

:::note
We strongly advise that you DO NOT create a TabbedPage and Manually Add Children.
:::

```cs
NavigationService.CreateBuilder()
    .AddTabbedSegment(b =>
        b.CreateTab("ViewA")
         .CreateTab(t => t.AddNavigationPage().AddSegment("ViewB")));
```

As you may have noticed the TabbedSegmentBuilder has special methods for Creating Tabs and Providing the Selected Tab. The CreateTab method additionally has its own builder that can help you to create Deep Links for individual tabs.

:::warning
Deep Linked Tabs are planned for Prism.Maui but are not available in the Beta
:::

### Relative or Absolute Navigation

By Default the generated Navigation URI will be a Relative URI. However we do expose methods for explicitly setting the URI to be Relative or Absolute.

```cs
NavigationService.CreateBuilder()
    .UseRelativeNavigation();

NavigationService.CreateBuilder()
    .UseAbsoluteNavigation();
```

In the event that you have some sort of boolean that you need to pass in to control whether it is Relative or Absolute you can pass in as follows:

```cs
NavigationService.CreateBuilder()
    .UseAbsoluteNavigation(myCondition);
```

### Adding URI Parameters

By Default the string added will be treated as though you are adding a URI so you may either add them directly or use the Segment Builder as follows:

```cs
NavigationService.CreateBuilder
    .AddSegment("ViewA?id=5")
    .AddSegment(NavigationKeys.ViewB, s => s.AddParameter(NavParameterKeys.Id, 6));
```

:::note
When using Segment parameters these will always append to the URI. These will be available in the NavigationParameters passed to the ViewModel for the Specific NavigationSegment they are added to. For instance if the ViewAViewModel implements IInitialize, you would expect the `id` key to have a value of 5.
:::

### Adding Navigation Parameters

Unlike Segment/URI Parameters, NavigationParameters added to the NavigationBuilder are passed to every page being navigated to. Unlike when we add a Segment, we can add parameters in any order we want. You can add them one at a time or as a full list.

```cs
var parameters = new NavigationParameters
{
    { "foo", foo },
    { "bar", bar }
};

NavigationService.CreateBuilder
    .AddParameter(NavParameterKeys.Id, 5)
    .WithParameters(parameters);
```

## Navigating

Once you're finished building the Navigation URI, of course there is the most important part... Navigating! The NavigationBuilder has a number of Extension Methods to make it easier for you to navigate from any context and help you avoid `async void`.

```cs
// NOTE: We will not get the NavigationResult back as it was not awaited
NavigationService.CreateBuilder()
    .AddSegment(NavigationKeys.ViewA)
    .Navigate();
```

For those who may be dropping this into existing code you can of course simply call the classic `NavigateAsync` and get the [INavigationResult](xref:Platforms.Maui.Navigation.NavigationResult) back.

```cs
var result = await NavigationService.CreateBuilder()
    .AddSegment(NavigationKeys.ViewA)
    .NavigateAsync();
```

Additionally we provide both Async and non-Async methods which simply allow you to provide a callback OnSuccess or OnError.

```cs
builder.Navigate(() => Console.WriteLine("Navigation Successful"));
await builder.NavigateAsync(() => Console.WriteLine("Navigation Successful"));

builder.Navigate(ex => Console.WriteLine($"Navigation Error:\n{ex}"));
await builder.NavigateAsync(ex => Console.WriteLine($"Navigation Error:\n{ex}"));

builder.Navigate(ex => Console.WriteLine(() => Console.WriteLine("Navigation Successful"), $"Navigation Error:\n{ex}"));
await builder.NavigateAsync(() => Console.WriteLine("Navigation Successful"), ex => Console.WriteLine($"Navigation Error:\n{ex}"));
```


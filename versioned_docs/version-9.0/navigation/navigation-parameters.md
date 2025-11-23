---
sidebar_position: 2
---

# INavigationParameters

The Navigation Parameters are a way that you can pass state, options, or other values during Navigation events. This includes both [Page based Navigation](page-navigation.md) as well as [Region based navigation](regions/index.md). The Navigation Parameters can be comprised entirely from the query string in your Navigation Uri, or from an instance of the `NavigationParameters`. It can even merge the two allowing you to combine query string parameters and parameters from an instance of the `NavigationParameters`. This will be done for you automatically by Prism in the Navigation Service.

In Prism 9.0 the Navigation Parameters and interface are entirely shared from the Prism.Core across all Navigation paradigms and platforms.

## Creating Navigation Parameters

```cs
new NavigationParameters
{
    { "Title", "Hello World" },
    { "StarshipLaunchAttempt", new DateTime(2023, 4, 20) }
}
```

As you will notice when creating an instance of the NavigationParameters you can add values of various types.

```cs
new NavigationParameters
{
    { "SelectedColors", Colors.Blue },
    { "SelectedColors", Colors.Gray }
}
```

While at first it may appear that `INavigationParameters` is just an `IDictionary<string, object>`, it is in fact an `IEnumerable<KeyValuePair<string, object>>`. This means that you have the ability to overload the keys adding multiple values to the NavigationParameters with a single key.

## Accessing Navigation Parameters

Depending on what you need to get from the Navigation Parameters you may want to call one of the following APIs.

### Getting a Single Value

To access a single value from the Navigation Parameters you should use the `GetValue` method like:

```cs
Title = parameters.GetValue<string>("Title");
```

### Get a value if the key exists

To access a value only if the key exists you can use the `TryGetValue` method like:

```cs
if (parameters.TryGetValue<string>("Title", out var title))
{
    Title = title;
}
```

### Getting multiple values

To access multiple values you can use the `GetValues` method. This will return an empty list if no values were provided.

```cs
var colors = parameters.GetValues<Color>("SelectedColors");
```


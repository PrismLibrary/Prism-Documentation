---
sidebar_position: 8
uid: Navigation.Regions.PassingParameters
---

# Passing Parameters During Region Navigation

Pass the destination's identity and options as `Prism.Navigation.NavigationParameters`. The destination receives the merged values through `NavigationContext.Parameters`, which implements `INavigationParameters`.

## Pass an identifier

With an injected `IRegionManager regionManager`:

```csharp
using Prism.Navigation;
using Prism.Navigation.Regions;

var parameters = new NavigationParameters
{
    { "customerId", "C-104" },
    { "readOnly", true }
};

regionManager.RequestNavigate("MainRegion", "CustomerView", result =>
{
    if (!result.Success)
        System.Diagnostics.Debug.WriteLine(result.Exception?.Message
            ?? "Navigation did not complete.");
}, parameters);
```

The equivalent simple URI is `CustomerView?customerId=C-104&readOnly=true`. Prefer `NavigationParameters.ToString()` to manually concatenating user-entered text, since it escapes query keys and values.

## Receive it in the view model

Inside an `IRegionAware` implementation:

```csharp
public void OnNavigatedTo(NavigationContext context)
{
    if (!context.Parameters.TryGetValue<string>("customerId", out var id)
        || string.IsNullOrWhiteSpace(id))
        throw new ArgumentException("A customerId is required.");

    CustomerId = id;
    IsReadOnly = context.Parameters.GetValue<bool>("readOnly");
}
```

`CustomerId` and `IsReadOnly` are application properties. Handle invalid input before loading data, and remember that `OnNavigatedTo` can run again on a reused instance. Use the same identity key in [IsNavigationTarget](navigation-existing-views.md).

## Pass an in-memory object deliberately

```csharp
var parameters = new NavigationParameters
{
    { "customerId", customer.Id },
    { "customerSnapshot", customer }
};
regionManager.RequestNavigate("MainRegion", "CustomerView", parameters);
```

Here `customer` is an application object. Retrieve it with `GetValue<Customer>("customerSnapshot")`. Passing it as an object preserves its reference and type; putting it into a URI only uses its string representation. The short overload above omits error handling for brevity; prefer a result callback in application navigation code.

Use an ID instead when the destination should reload current data, survive application restart, or avoid holding a large graph in the [journal](navigation-journal.md). A navigation parameter is neither an authorization check nor a persistent data store.

## Merging and duplicates

A query and an explicit collection can be used together. The region navigation context parses the query first and appends the object parameters. Duplicate keys remain duplicate entries; an object parameter does not overwrite a same-named query parameter. Use unique keys for single values, and `GetValues<T>` for intentional multi-value parameters.

See [Navigation Parameters](../navigation-parameters.md) for conversion, missing-value and validation rules.

Source: [NavigationContext](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Prism.Core/Navigation/Regions/NavigationContext.cs), [manager overloads](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Prism.Core/Navigation/Regions/IRegionManagerExtensions.cs).

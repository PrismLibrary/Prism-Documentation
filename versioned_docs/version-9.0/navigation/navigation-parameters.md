---
sidebar_position: 2
---

# Navigation Parameters {#inavigationparameters}

`Prism.Navigation.INavigationParameters` carries values through both page and region navigation. Create a `NavigationParameters` instance for in-process values, or encode simple values in a URI query. Region callbacks receive the combined values through `NavigationContext.Parameters`; MAUI page callbacks receive `INavigationParameters` directly.

## Creating Navigation Parameters

```csharp
using Prism.Navigation;

var parameters = new NavigationParameters
{
    { "customerId", "C-104" },
    { "readOnly", true },
    { "tag", "priority" },
    { "tag", "renewal" }
};
```

This is a sequence of key/value pairs, not a dictionary with unique keys:

- `Add` appends; it does not replace an earlier value with the same key.
- Keys are case-sensitive.
- `GetValue<T>` reads the first matching value and returns the type's default when the key is absent.
- `GetValues<T>` retrieves multiple values; an absent key produces an empty sequence.
- The indexer returns `object`, so assigning it directly to a `string` or domain object requires a cast. Prefer the typed methods.

Typed access supports assignable object types and some conversions, including string-to-primitive conversion. It is not general-purpose JSON deserialization. Conversion can throw, including through `TryGetValue<T>` when an underlying conversion fails. Validate untrusted URI input before using it as an identifier, amount or permission decision.

## Accessing Navigation Parameters

### Getting a Single Value

```csharp
string customerId = parameters.GetValue<string>("customerId");
bool readOnly = parameters.GetValue<bool>("readOnly");
```

Use a required-value check when the type's default would be ambiguous or invalid for the destination.

### Get a value if the key exists

```csharp
if (parameters.TryGetValue<string>("returnTo", out var returnTo))
{
    // Use the optional destination.
}
```

This is a lookup and conversion helper, not a guarantee that arbitrary input cannot throw.

### Getting multiple values

```csharp
IEnumerable<string> tags = parameters.GetValues<string>("tag");
```

Add `using System.Collections.Generic;` when implicit usings are unavailable. In the example, the two `tag` entries remain separate values.

## URI values and object values

```csharp
var query = new NavigationParameters
{
    { "customerId", "C-104" },
    { "search", "coffee & tea" }
};

string destination = "CustomerView" + query;
// CustomerView?customerId=C-104&search=coffee%20%26%20tea
```

`ToString()` escapes keys and each value's string representation. Query values are parsed as strings. Objects passed directly remain object references; converting the parameter collection to a URI does not serialize and reconstruct those objects.

When you combine a query with an explicit parameter collection, avoid duplicate keys unless multiple values are intentional. Region navigation appends the explicit parameters after the query parameters, so a first-value lookup sees the query value first.

## Design a small navigation contract

Use stable IDs and a small set of options for repeatable navigation. Load the current record through an injected service in the destination. Passing a large mutable object graph couples the two views and can retain objects through the navigation journal. Never put passwords, access tokens or other secrets in a navigation URI.

Examples: [region parameters](regions/passing-parameters.md) and [MAUI page navigation](../platforms/maui/navigation/page-navigation.md).

Source (Prism 9.0.537): [NavigationParameters](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Navigation/NavigationParameters.cs), [parameter storage and URI formatting](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Common/ParametersBase.cs), [typed conversions](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Common/ParametersExtensions.cs), [region parameter merge](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Prism.Core/Navigation/Regions/NavigationContext.cs).

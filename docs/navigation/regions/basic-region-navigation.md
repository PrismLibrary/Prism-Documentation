---
sidebar_position: 5
---

# Basic Region Navigation

A region navigation request identifies a named region and a registered view. Prism asks the active content for permission, reuses or creates the destination, activates it and records the navigation in that region's journal.

Before starting, [declare the region host](region-manager.md) and initialize Prism for your platform.

## 1. Register the destination

Use `Prism.Ioc` extension methods inside the application's or module's `RegisterTypes` callback. The examples assume a platform-specific `CustomerView` and a `CustomerViewModel`.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="platform">
<TabItem value="wpf" label="WPF" default>

```csharp
containerRegistry.RegisterForNavigation<CustomerView, CustomerViewModel>();
```

`CustomerView` is typically a WPF `UserControl`. An explicit view-model pairing avoids relying on naming conventions.

</TabItem>
<TabItem value="maui" label=".NET MAUI">

```csharp
containerRegistry.RegisterForRegionNavigation<CustomerView, CustomerViewModel>();
```

`CustomerView` must be a MAUI `View`, commonly a `ContentView`. `RegisterForNavigation` is for pages; it does not replace region-view registration.

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

```csharp
containerRegistry.RegisterForNavigation<CustomerView, CustomerViewModel>();
```

Use a WinUI/Uno view such as a `UserControl`. The registration and region contracts are shared with the desktop region implementation.

</TabItem>
<TabItem value="avalonia" label="Avalonia">

```csharp
containerRegistry.RegisterForNavigation<CustomerView, CustomerViewModel>();
```

Use an Avalonia view such as a `UserControl`. Prism.Avalonia includes these navigation registration extensions and the region content loader.

</TabItem>
</Tabs>

Without an explicit registration name, the route is the view's type name, `CustomerView`. If you provide an alias, use that alias consistently and review [existing-view matching](navigation-existing-views.md).

## 2. Request navigation and inspect the result

```csharp
using System.Diagnostics;
using Prism.Navigation;
using Prism.Navigation.Regions;

public sealed class CustomerNavigator
{
    private readonly IRegionManager _regions;

    public CustomerNavigator(IRegionManager regions) => _regions = regions;

    public void Open(string customerId)
    {
        var parameters = new NavigationParameters
        {
            { "customerId", customerId }
        };

        _regions.RequestNavigate("MainRegion", "CustomerView", result =>
        {
            if (result.Success)
                return;

            Debug.WriteLine(result.Exception?.ToString()
                ?? "Navigation was declined or superseded.");
        }, parameters);
    }
}
```

Call this on the UI thread after `MainRegion` is available. `RequestNavigate` returns `void`; its callback reports completion. The underlying `INavigateAsync` name does not mean navigation runs on a background thread or returns a `Task`. A [confirmation](confirming-navigation.md) may leave the request pending after the method returns.

## 3. Understand the result

Prism 9 uses `NavigationResult.Success`, `Exception` and `Context`. Older region examples using `Result` and `Error` need updating.

- `Success == true`: the destination was activated and notified.
- `Success == false` with an exception: inspect the registration, missing region, constructor dependencies and lifecycle code.
- `Success == false` without an exception: region confirmation can decline a request, or an older pending request can be superseded.

Do not rely only on `Cancelled` to detect a declined region request. That property recognizes a particular navigation exception; the region service can report `false` without creating that exception. A failed callback also does not guarantee rollback: an exception late in navigation can occur after the destination has been activated.

## What happens next?

Implement [IRegionAware](view-viewmodel-participation.md) on the destination view model to receive `customerId`. Then choose [reuse](navigation-existing-views.md), [lifetime](controlling-view-lifetime.md) and [journal](navigation-journal.md) policies appropriate to the workflow.

Source: [desktop registration extensions](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Wpf/Prism.Wpf/Ioc/IContainerRegistryExtensions.cs), [MAUI region registrations](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Ioc/RegionNavigationRegistrationExtensions.cs), [region navigation service](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Wpf/Prism.Wpf/Navigation/Regions/RegionNavigationService.cs), [NavigationResult](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Prism.Core/Navigation/NavigationResult.cs).

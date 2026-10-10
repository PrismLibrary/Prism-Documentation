---
sidebar_position: 3
uid: Platforms.Maui.Behaviors.EventToCommandBehavior
description: "Bind MAUI events to commands and understand Prism 9.0 event-parameter precedence and cleanup."
---

# Using the EventToCommandBehavior

`Prism.Behaviors.EventToCommandBehavior` invokes an `ICommand` when a named MAUI event is raised. Prefer a control's native `Command` property when it already provides one. Use this behavior for events that otherwise require an event handler.

It derives from `BehaviorBase<BindableObject>`, so it follows the associated object's binding context. This differs from behaviors that do not automatically inherit a context.

## Properties

- `EventName`: the public event to subscribe to
- `Command`: the command to invoke
- `CommandParameter`: an explicit parameter
- `EventArgsParameterPath`: a property path evaluated on the event arguments
- `EventArgsConverter`: a converter for those arguments
- `EventArgsConverterParameter`: the parameter passed to that converter

## Usage

### EventArgsParameterPath

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:prism="http://prismlibrary.com"
    x:Class="MyApp.Views.CustomersPage">
    <CollectionView ItemsSource="{Binding Customers}" SelectionMode="Single">
        <CollectionView.Behaviors>
            <prism:EventToCommandBehavior
                EventName="SelectionChanged"
                Command="{Binding SelectionChangedCommand}"
                EventArgsParameterPath="CurrentSelection" />
        </CollectionView.Behaviors>
    </CollectionView>
</ContentPage>
```

The command receives the event's `CurrentSelection` value, including an empty selection when it is cleared. Handle that case before selecting the first item.

## Parameter precedence

The Prism 9.0 implementation evaluates values in this order and stops when it obtains a non-null result:

1. `CommandParameter`
2. `EventArgsParameterPath`, including dotted property paths
3. `EventArgsConverter`, passing `EventArgsConverterParameter` to the converter

If none produces a value, the command receives `null`. Raw event arguments are not automatically the fallback parameter. The behavior calls `CanExecute(parameter)` before `Execute(parameter)`.

### CommandParameter

For example, an explicit parameter ignores selection data:

```xml
<prism:EventToCommandBehavior EventName="SelectionChanged"
    Command="{Binding RefreshCommand}"
    CommandParameter="selection-changed" />
```

### EventArgsConverter

To transform the event arguments, register an `IValueConverter` resource and use it without a competing explicit parameter:

```xml
<prism:EventToCommandBehavior EventName="SelectionChanged"
    Command="{Binding SelectionChangedCommand}"
    EventArgsConverter="{StaticResource SelectionConverter}" />
```

Implement the converter for the actual event-argument type and handle empty values. A converter runs only after the higher-priority options yield null and the event arguments are neither null nor `EventArgs.Empty`.

## Attachment and detachment

`EventName` is resolved when the behavior attaches; an invalid event name throws. Property paths are evaluated by reflection and invalid paths can fail when the event fires. The event is subscribed at attachment time; changing `EventName` afterwards does not rewire the subscription. Configure it before attaching the behavior. Reflection is used for event discovery and property-path lookup.

The behavior removes its event handler on detachment. Give each control its own behavior instance and avoid making it a singleton.

[Prism 9.0 implementation and parameter order](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Maui/Prism.Maui/Behaviors/EventToCommandBehavior.cs).

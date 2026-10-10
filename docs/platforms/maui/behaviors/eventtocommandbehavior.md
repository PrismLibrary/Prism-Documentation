---
sidebar_position: 3
uid: Platforms.Maui.Behaviors.EventToCommandBehavior
---

# EventToCommandBehavior

`Prism.Behaviors.EventToCommandBehavior` invokes an `ICommand` when a named MAUI event is raised. Prefer a control's native `Command` property when it already provides one. Use this behavior for events that otherwise require an event handler.

It derives from `BehaviorBase<BindableObject>`, so it follows the associated object's binding context. This differs from behaviors that do not automatically inherit a context.

## Convert selection into a command parameter

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

The current implementation evaluates values in this order and stops when it obtains a non-null result:

1. `CommandParameter`
2. `EventArgsParameterPath`, including dotted property paths
3. `EventArgsConverter`, passing `EventArgsConverterParameter` to the converter

If none produces a value, the command receives `null`. Raw event arguments are not automatically the fallback parameter. The behavior calls `CanExecute(parameter)` before `Execute(parameter)`.

For example, an explicit parameter ignores selection data:

```xml
<prism:EventToCommandBehavior EventName="SelectionChanged"
    Command="{Binding RefreshCommand}"
    CommandParameter="selection-changed" />
```

To transform the event arguments, register an `IValueConverter` resource and use it without a competing explicit parameter:

```xml
<prism:EventToCommandBehavior EventName="SelectionChanged"
    Command="{Binding SelectionChangedCommand}"
    EventArgsConverter="{StaticResource SelectionConverter}" />
```

Implement the converter for the actual event-argument type and handle empty/null values. A converter runs only after the higher-priority options yield null.

## Attachment and publishing considerations

`EventName` is resolved when the behavior attaches; an invalid event name throws. Property paths are evaluated by reflection and invalid paths can fail when the event fires. Event subscription uses reflected event metadata and expression construction, so do not assume this behavior is automatically NativeAOT-safe merely because the container is. Prefer direct command bindings or an explicitly typed behavior, and validate trimming/AOT warnings and the published application when using it in a NativeAOT target.

The behavior removes its event handler on detachment. Give each control its own behavior instance and avoid making it a singleton.

[Current implementation and parameter order](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Behaviors/EventToCommandBehavior.cs).

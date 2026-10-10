---
sidebar_position: 1
uid: Platforms.Wpf.Interactivity.EventToCommand
---

# Binding Events to Commands

The ```InvokeCommandAction``` class provides a convenient way to, in XAML, "bind" events to ```ICommand``` properties according to the MVVM paradigm of avoiding code behind.

## Properties

The ```InvokeCommandAction``` exposes the following properties:

* ```Command``` identifies the command to execute when invoked. This is required.
* ```AutoEnable``` identifies if the associated element should automatically be enabled or disabled based on the result of the Command's ```CanExecute```. This is an optional field, default value is ```True```.
* ```CommandParameter``` identifies the command parameter to be supplied to the command. This is an optional field.
* ```TriggerParameterPath``` identifies the path in the event supplied object to be parsed to identify the child property to be used as the command parameter.

## Usage

### Basic Usage

First the binding needs to be hooked up in WPF by adding an `EventTrigger` to `Interaction.Triggers`. This comes from `Microsoft.Xaml.Behaviors.Wpf`, referenced by `Prism.Wpf`. Add the namespace to be able to declare it in the XAML.

`xmlns:i="http://schemas.microsoft.com/xaml/behaviors"`

Add the `Prism` namespace to be able to declare `InvokeCommandAction` in the XAML.

`xmlns:prism="http://prismlibrary.com/"`

And attach to the control with the desired event.

```xml
<Window x:Class="UsingInvokeCommandAction.Views.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:i="http://schemas.microsoft.com/xaml/behaviors"
        xmlns:prism="http://prismlibrary.com/"
        prism:ViewModelLocator.AutoWireViewModel="True"
        Title="{Binding Title}" Height="350" Width="525">
    <Grid>
        <ListBox ItemsSource="{Binding Items}" SelectionMode="Single">
            <i:Interaction.Triggers>
                <i:EventTrigger EventName="SelectionChanged">
                    <prism:InvokeCommandAction Command="{Binding SelectedCommand}"
                                               CommandParameter="{Binding MyParameter}" />
                </i:EventTrigger>
            </i:Interaction.Triggers>
        </ListBox>
    </Grid>
</Window>
```

### TriggerParameterPath

In the code below, the ```SelectionChanged``` event receives a  ```SelectionChangedEventArgs``` object that has an ```IList``` property named ```AddedItems```. Use the ```TriggerParameterPath``` to specify this property to be passed as the parameter in the ```ICommand``` object.

```xml
<Window x:Class="UsingInvokeCommandAction.Views.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:i="http://schemas.microsoft.com/xaml/behaviors"
        xmlns:prism="http://prismlibrary.com/"
        prism:ViewModelLocator.AutoWireViewModel="True"
        Title="{Binding Title}" Height="350" Width="525">
    <Grid>
        <ListBox ItemsSource="{Binding Items}" SelectionMode="Single">
            <i:Interaction.Triggers>
                <i:EventTrigger EventName="SelectionChanged">
                    <prism:InvokeCommandAction Command="{Binding SelectedCommand}"
                                               TriggerParameterPath="AddedItems" />
                </i:EventTrigger>
            </i:Interaction.Triggers>
        </ListBox>
    </Grid>
</Window>
```

### AutoEnable

The `AutoEnable` property specifies if the associated element should be automatically enabled or disabled based on the result of the ```ICommand.CanExecute```. This defaults to ```true``` as this is the most common use.

```xml
<Window x:Class="UsingInvokeCommandAction.Views.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:i="http://schemas.microsoft.com/xaml/behaviors"
        xmlns:prism="http://prismlibrary.com/"
        prism:ViewModelLocator.AutoWireViewModel="True"
        Title="{Binding Title}" Height="350" Width="525">
    <Grid>
        <ListBox ItemsSource="{Binding Items}" SelectionMode="Single">
            <i:Interaction.Triggers>
                <i:EventTrigger EventName="SelectionChanged">
                    <prism:InvokeCommandAction Command="{Binding SelectedCommand}"
                                               TriggerParameterPath="AddedItems"
                                               AutoEnable="true" />
                </i:EventTrigger>
            </i:Interaction.Triggers>
        </ListBox>
    </Grid>
</Window>
```

## Full Code Sample

The historical [29-InvokeCommandAction sample](https://github.com/PrismLibrary/Prism-Samples-Wpf/tree/master/29-InvokeCommandAction) illustrates this behavior. Its package versions may predate the current APIs; use the [current WPF setup](../getting-started.md) and the source below for current APIs.


Use either an explicit `CommandParameter` or a `TriggerParameterPath` when demonstrating event data. An explicit parameter takes precedence and would hide the event property in the examples above. This action is WPF-specific; MAUI uses its [EventToCommandBehavior](../../maui/behaviors/eventtocommandbehavior.md).

[Current WPF implementation](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Wpf/Prism.Wpf/Interactivity/InvokeCommandAction.cs).

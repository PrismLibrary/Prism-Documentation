# Event To Command

Most are aware that, in effect, button clicks can be bound to ```ICommand``` objects in the view model (read more about commands and Prism [here](../../commanding.md)). Not all events have a similar binding out of the box in WPF, but it is possible to use a Prism helper object to bind events to the view model without having to write a custom attached property.

## An Example

One example is an app that needs to execute an action when the ```SelectionChanged``` event of a ```ListBox``` control is fired. This event is not part of the data binding system in WPF so some work is required to surface this to the view model. Normally this would require setting up an attached property so that these custom behaviors could be bound to the view model. Or you can use the Prism ```EventTrigger``` class and declare the binding in XAML.

## Initial Code

Below is the view XAML, code behind and view model starting place.

```xml
<Window x:Class="UsingInvokeCommandAction.Views.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:i="http://schemas.microsoft.com/xaml/behaviors"
        xmlns:prism="http://prismlibrary.com/"
        prism:ViewModelLocator.AutoWireViewModel="True"
        Title="{Binding Title}" Height="350" Width="525">
    <Grid>

        <!-- row/col definitions removed, other ui removed -->

        <ListBox Grid.Row="1" Margin="5" ItemsSource="{Binding Items}" SelectionMode="Single">
        </ListBox>

    </Grid>
</Window>
```

```cs
public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();
    }
}
```

```cs
public class MainWindowViewModel : BindableBase
{
    public IList<string> Items { get; private set; }

    public MainWindowViewModel()
    {
        Items.Add("item 1");
        Items.Add("item 2");
    }
}
```

Let's go ahead and bring the ```SelectionChanged``` event to our ```ListBox```.

## Updating the ListBox

The first thing to do is to make sure you have the correct namespaces in your XAML. In the XAML code above, notice that the ```i``` namespace is declared. This is where the ```EventTrigger``` class resides and now it can be attached to the ```ListBox```. The ```Prism``` namespace is also declared to gain access to the ```InvokeCommandAction``` class.

```xml
<Window x:Class="UsingInvokeCommandAction.Views.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:i="http://schemas.microsoft.com/xaml/behaviors"
        xmlns:prism="http://prismlibrary.com/"
        prism:ViewModelLocator.AutoWireViewModel="True"
        Title="{Binding Title}" Height="350" Width="525">
    <Grid>

        <!-- row/col definitions removed, other ui removed -->

        <ListBox Grid.Row="1" Margin="5" ItemsSource="{Binding Items}" SelectionMode="Single">
            <i:InteractionTriggers>
                <i:EventTrigger EventName="SelectionChanged">
                    <prism:InvokeCommandAction Command="{Binding SelectedCommand}" TriggerParameterPath="AddedItems" />
                </i:EventTrigger>
            </i:InteractionTriggers>
        </ListBox>

    </Grid>
</Window>
```

In the code above, the ```InteractionTriggers``` collection has been added and telling the listbox that an ```EventTrigger``` needs to be added. This is standard WPF capabilities being leveraged. In the ```EventTrigger``` the name of the event is specified. Now every time the ```SelectionChanged``` event is fired it will fire what ever ```TriggerAction``` object is specified inside of the ```EventTrigger```.

In this case, Prism's ```InvokeCommandAction``` object is used. The ```Command``` parameter specifies the ```ICommand``` property in the view model. The ```TriggerParameterPath``` specifies what property in the original event data should be passed to the ```ICommand``` in the view model.

## Updating the View Model

Next up, all that is needed is an ```ICommand``` property called ```SelectedCommand``` to match with the binding in the view. It is easy to use the Prism supplied ```DelegateCommand``` which implements ```ICommand```.

```cs
public class MainWindowViewModel : BindableBase
{
    public IList<string> Items { get; private set; }
    public DelegateCommand<object[]> SelectedCommand { get; private set; }

    public MainWindowViewModel()
    {
        Items.Add("item 1");
        Items.Add("item 2");

        SelectedCommand = new DelegateCommand<object[]>(SelectedCommandExecute);
    }

    private void SelectedCommandExecute(object[] selectedItems)
    {
        // do your business logic here
        var firstItemText = selectedItems.FirstOrDefault().ToString();
        System.Diagnostics.Debug.WriteLine($"first item selected: {firstItemText}");
    }
}

```
> **NOTE**: Notice that the generic version of ```DelegateCommand``` is used to type the argument being supplied to the ```DelegateCommand``` object. It must match the type of the parameter that is being passed. In the example above, AddedItems is an ```IList<object>``` property inside of the object sent from the ```SelectionChanged``` event fired by the ```ListBox```.

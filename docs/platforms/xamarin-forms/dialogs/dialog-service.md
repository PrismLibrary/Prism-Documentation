# Getting to know the Dialog Service

The new Prism Dialog Service is designed to provide you a minimalistic framework that you can build on to provide richly styled dialogs that match the look and feel of your app.

> [!Video https://www.youtube.com/embed/swe4XTksiLI]

## Getting Started with IDialogAware

Creating dialogs with the DialogService requires a ViewModel that is `IDialogAware`. This special interface is what allows the DialogService to work with your ViewModel. Note that the navigation interfaces such as `INavigationAware`, `IConfirmNavigation`, `IInitialize`, `IDestructible` are not supported or used by the DialogService. By implementing `IDialogAware` you have methods that will allow you to do anything that you may be used to doing throught the ViewModel's lifecycle. It is worth noting however, that Dialogs do support `IAutoInitialize` to help reduce the amount of code you need to write.

```cs
public class DemoDialogViewModel : BindableBase, IDialogAware, IAutoInitialize
{
    public DemoDialogViewModel()
    {
        CloseCommand = new DelegateCommand(() => RequestClose(null));
    }

    private string title = "Alert";
    public string Title
    {
        get => title;
        set => SetProperty(ref title, value);
    }

    private string message;
    [AutoInitialize(true)]
    public string Message
    {
        get => message;
        set => SetProperty(ref message, value);
    }

    public DelegateCommand CloseCommand { get; }

    public event Action<IDialogParameters> RequestClose;

    public bool CanCloseDialog() => true;

    public void OnDialogClosed()
    {
        Console.WriteLine("The Demo Dialog has been closed...");
    }

    public void OnDialogOpened(IDialogParameters parameters)
    {
        // If not using IAutoInitialize you would need to set the Message property here.
        // Message = parameters.GetValue<string>("message");
    }
}
```

You can provide any specific logic you may want to prevent your dialog from closing. If RequestClose is invoked and CanCloseDialog returns false the Dialog Service will not close the Dialog.

## Sample Dialog View

Dialog's are built entirely from any Xamarin.Forms Layout or View. These all use normal bindings and might look something like the following:

```xml
<Grid xmlns="http://xamarin.com/schemas/2014/forms"
      xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
      BackgroundColor="White"
      x:Class="HelloWorld.Views.DemoDialog">
    <Grid.RowDefinitions>
        <RowDefinition Height="Auto" />
        <RowDefinition Height="Auto" />
        <RowDefinition Height="Auto" />
    </Grid.RowDefinitions>

    <BoxView Color="Black" />
    <Label Text="{Binding Title}"
           Style="{DynamicResource TitleStyle}"
           Margin="20,5"
           TextColor="White" />
    <Label Text="{Binding Message}"
           Margin="20,0,20,10"
           Grid.Row="1" />
    <Button Text="Ok"
            Command="{Binding CloseCommand}"
            HorizontalOptions="Center"
            Margin="0,0,0,10"
            Grid.Row="2"/>
</Grid>
```

## Registering the Dialog

Similar to registering a Page for Navigation, there is an extension on `IContainerRegistry` to register your Dialogs. You do not need to specify the ViewModel, as the ViewModelLocator will automatically attempt to resolve the ViewModel as long as both the Dialog and the ViewModel match Prism's naming/namespace conventions. Using the fully qualified registration method in which you specify both the Dialog View and the ViewModel is considered a better practice as this bypasses and Reflection cost that would be incurred by the ViewModelLocator.

```cs
protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    // Register the Dialog and allow the ViewModelLocator to locate the ViewModel by convention
    containerRegistry.RegisterDialog<DialogA>();

    // Specify the ViewModel for the ViewModelLocator to use explicitly
    containerRegistry.RegisterDialog<DialogB, DialogBViewModel>();

    // Override the name used to call the dialog
    containerRegistry.RegisterDialog<DialogC, DialogCViewModel>("SomeDialog");
}
```

## Using the Dialog Service

The Dialog Service is a very simplistic service which has a few overrides to make using it easier.

```cs
private void NetworkDisconnected()
{
    var parameters = new DialogParameters
    {
        { "title", "Connection Lost!" },
        { "message", "We seem to have lost network connectivity" }
    };
    _dialogService.ShowDialog("DemoDialog", parameters);
}
```

### Additional Notes on using the Dialog Service

While you will ultimately need to invoke the method provided by the DialogService, there are many times in which it may make sense to write your own extensions to the DialogService to make using it in your app easier. Some examples of this may be as follows:

- You have an Alert Dialog

```cs
public static void ShowAlert(this IDialogService dialogService, string message)
{
    var parameters = new DialogParameters
    {
        { "title", "Alert" },
        { "message", message }
    };
    dialogService.ShowDialog("DemoDialog", parameters)
}
```

- You have a confirmation dialog in which a callback would be less useful than an asynchronous call.

```cs
public static Task<bool> ConfirmAsync(this IDialogService dialogService, string message)
{
    var tcs = new TaskCompletionSource<bool>();
    Task.Factory.StartNew(() => {
        var parameters = new DialogParameters
        {
            { "title", "Question" },
            { "message", message }
        };
        void Callback(IDialogResult result)
        {
            tcs.SetResult(result.Parameters.GetValue<bool>("confirmed"));
        }
        dialogService.ShowDialog("ConfirmationDialog", parameters, Callback);
    });

    return tcs.Task;
}
```

- Note that for scenarios like the one shown in the last section where you are displaying an alert anytime you lose connection to the network, you may want to set this up with a global event from your App as the dialog will appear appropriately regardless of which page is currently displayed.

## Next Steps

Be sure to check out more information on [styling dialogs](styling-dialogs.md).

## Samples

Want to see it all in action? Be sure to check out the following samples from the Prism Forms Samples repo!

- [Dialog Service Sample](https://github.com/PrismLibrary/Prism-Samples-Forms/tree/master/07-DialogService)
- [Prism Forms Gallery](https://github.com/PrismLibrary/Prism-Samples-Forms/tree/master/50-PopupsPlugin)
- [Prism Popups Plugin Sample](https://github.com/PrismLibrary/Prism-Samples-Forms/tree/master/98-PrismFormsGallery)
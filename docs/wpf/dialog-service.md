# Dialog Service

TODO: Intro

## Create Your Dialog View

Your dialog view is a simple **UserControl** that can be designed anyway you please.  The only requirement it has a ViewModel that implements `IDialogAware` set as it's DataContext.  Preferably, it will utilize the `ViewModelLocator`

```xml
<UserControl x:Class="HelloWorld.Dialogs.NotificationDialog"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             xmlns:prism="http://prismlibrary.com/"
             prism:ViewModelLocator.AutoWireViewModel="True"
             Width="300" Height="150">
    <Grid x:Name="LayoutRoot" Margin="5">
        <Grid.RowDefinitions>
            <RowDefinition />
            <RowDefinition Height="Auto" />
        </Grid.RowDefinitions>

        <TextBlock Text="{Binding Message}" HorizontalAlignment="Stretch" VerticalAlignment="Stretch" Grid.Row="0" TextWrapping="Wrap" />
        <Button Command="{Binding CloseDialogCommand}" CommandParameter="true" Content="OK" Width="75" Height="25" HorizontalAlignment="Right" Margin="0,10,0,0" Grid.Row="1" IsDefault="True" />
    </Grid>
</UserControl>
```

## Create Your Dialog ViewModel

Next you need a ViewModel that implements `IDialogAware` which is defined as follows

```cs
public interface IDialogAware
{
    bool CanCloseDialog();
    void OnDialogClosed();
    void OnDialogOpened(IDialogParameters parameters);
    string Title { get; set; }
    event Action<IDialogResult> RequestClose;
}
```

Here is a simple example of what an `IDialogAware` ViewModel may look like.

```cs
public class NotificationDialogViewModel : BindableBase, IDialogAware
{
    private DelegateCommand<string> _closeDialogCommand;
    public DelegateCommand<string> CloseDialogCommand =>
        _closeDialogCommand ?? (_closeDialogCommand = new DelegateCommand<string>(CloseDialog));

    private string _message;
    public string Message
    {
        get { return _message; }
        set { SetProperty(ref _message, value); }
    }

    private string _title = "Notification";
    public string Title
    {
        get { return _title; }
        set { SetProperty(ref _title, value); }
    }

    public event Action<IDialogResult> RequestClose;

    protected virtual void CloseDialog(string parameter)
    {
        ButtonResult result = ButtonResult.None;

        if (parameter?.ToLower() == "true")
            result = ButtonResult.OK;
        else if (parameter?.ToLower() == "false")
            result = ButtonResult.Cancel;

        RaiseRequestClose(new DialogResult(result));
    }

    public virtual void RaiseRequestClose(IDialogResult dialogResult)
    {
        RequestClose?.Invoke(dialogResult);
    }

    public virtual bool CanCloseDialog()
    {
        return true;
    }

    public virtual void OnDialogClosed()
    {

    }

    public virtual void OnDialogOpened(IDialogParameters parameters)
    {
        Message = parameters.GetValue<string>("message");
    }
}
```

## Register the Dialog

To register a dialog, you must have a View (UserControl) and a corresponding ViewModel (which must implement `IDialogAware`).  In the `RegisterTypes` method, simply register your dialog like you would any other service by using the `IContainterRegistery.RegisterDialog` method.

```cs
 protected override void RegisterTypes(IContainerRegistry containerRegistry)
 {
     containerRegistry.RegisterDialog<NotificationDialog, NotificationDialogViewModel>();
 }
```

Optionally, you can provide a custom name for your dialog.
```cs
 protected override void RegisterTypes(IContainerRegistry containerRegistry)
 {
     containerRegistry.RegisterDialog<NotificationDialog, NotificationDialogViewModel>("myDialog");
 }
```

## Using the Dialog Service

To use the dialog service you simply ask for the service in your VM ctor.

```cs
public MainWindowViewModel(IDialogService dialogService)
{
    _dialogService = dialogService;
}
```

Then call either `Show` or `ShowDialog` providing the name of the dialog, any parameters your dialogs requires, and then handle the result via a call back

```cs
private void ShowDialog()
{
    var message = "This is a message that should be shown in the dialog.";
    //using the dialog service as-is
    _dialogService.ShowDialog("NotificationDialog", new DialogParameters($"message={message}"), r =>
    {
           if (r.Result == ButtonResult.None)
               Title = "Result is None";
           else if (r.Result == ButtonResult.OK)
               Title = "Result is OK";
           else if (r.Result == ButtonResult.Cancel)
               Title = "Result is Cancel";
           else
               Title = "I Don't know what you did!?";
    });
}
```

## Register a Custom Dialog Window

It's very common to be using a third-party control vendor such as Infragistics. In these cases, you may want to replace the standard WPF Window control that hosts the dialogs with a custom Window class such as the Infragistics XamRibbonWindow control.

In this case, just create your custom Window, and implement the `IDialogWindow` interface:

```cs
public partial class MyRibbonWindow: XamRibbonWindow, IDialogWindow
{
    public IDialogResult Result { get; set; }
    ….
}
```

Then register your dialog window with the `IContainerRegistry`.

```cs
protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    containerRegistry.RegisterDialogWindow<MyRibbonWindow>();
}
```
If you have more than one dialog window you would like to use as a dialog host, you register multiple dialog windows with the container by specifying a name for the window.
```cs
protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    containerRegistry.RegisterDialogWindow<NotificationWindow>("notifyWindow");
}
```
> [!NOTE] In order to use a dialog window by name, you must provide the dialog window name in the `IDialogService.Show` or `IDialogService.ShowDialog` method as follows:
```
 _dialogService.ShowDialog("DialogName", dialogParameters), r =>
    { ...  }, "notifyWindow");
```

## Style the DialogWindow

You can control the properties of the DialogWindow by using a style via an attatched property on the Dialog UserControl

```xml
<prism:Dialog.WindowStyle>
    <Style TargetType="Window">
        <Setter Property="prism:Dialog.WindowStartupLocation" Value="CenterScreen" />
        <Setter Property="ResizeMode" Value="NoResize"/>
        <Setter Property="ShowInTaskbar" Value="False"/>
        <Setter Property="SizeToContent" Value="WidthAndHeight"/>
    </Style>
</prism:Dialog.WindowStyle>
```

## Simplify your Application Dialog APIs

The intent of the dialog API is not to try and guess exactly what type of parameters your need for all of your dialogs, but rather to just create and show the dialogs.  To simplify common dialogs in your application the guidance will be to create an extension methods to simplify your applications dialogs.

For example:

```cs
public static class DialogServiceExtensions
{
    public static void ShowNotification(this IDialogService dialogService, string message, Action<IDialogResult> callBack)
    {
        dialogService.ShowDialog("NotificationDialog", new DialogParameters($"message={message}"), callBack, "notificationWindow");
    }
}
```

Then to call your Notifications use the new and improved API that you created specifically for your app.

```cs
_dialogService.ShowNotification(message, r =>
{
        if (r.Result == ButtonResult.None)
            Title = "Result is None";
        else if (r.Result == ButtonResult.OK)
            Title = "Result is OK";
        else if (r.Result == ButtonResult.Cancel)
            Title = "Result is Cancel";
        else
            Title = "I Don't know what you did!?";
});
```

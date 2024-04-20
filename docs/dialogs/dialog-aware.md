---
uid: Dialogs.IDialogAware
---

# IDialogAware

The `IDialogAware` interface has undergone some updates in Prism 9 to help you write code that better meets your needs by providing a more robust API that is able to adapt to your needs.

```cs
public interface IDialogAware
{
    bool CanCloseDialog();
    void OnDialogClosed();
    void OnDialogOpened(IDialogParameters parameters)
    DialogCloseListener RequestClose { get; }
}
```

## Can Close

The `IDialogAware` interface provides the method `CanCloseDialog()`. This allows you to provide any custom logic that you may require to determine whether or not the Dialog should be allowed to close:

```cs
public class MyDialogViewModel : IDialogAware
{
    private string? _name;
    public string? Name
    {
        get => _name;
        set => SetProperty(ref _name, value)
    }

    public bool CanCloseDialog() => !string.IsNullOrEmpty(Name);
}
```

## DialogCloseListener

The DialogCloseListener is new in Prism 9 and replaces the event that was in the original API. The DialogCloseListener allows you more flexibility and is part of the Dialog Service's enhanced API.

> [!NOTE]
> The RequestClose property should be implemented as shown below. This property is set by DialogService itself and should not be set by your code.

```cs
public class MyDialogViewModel : IDialogAware
{
    public DialogCloseListener RequestClose { get; }
}
```

### Using the DialogCloseListener

One of the benefits of the DialogCloseListener is that it allows you more flexibility when invoking it.

```cs
private void OnMyCommandExecuted()
{
    // Option 1.
    RequestClose.Invoke();

    // Option 2.
    RequestClose.Invoke(new DialogParameters{ { "MyParameter", SomeValue } });

    // Option 3.
    RequestClose.Invoke(ButtonResult.OK);

    // Option 4.
    RequestClose.Invoke(new DialogParameters{ { "MyParameter", SomeValue } }, ButtonResult.OK);

    // Option 5.
    var result = new DialogResult
    {
        Parameters = new DialogParameters{ { "MyParameter", SomeValue } },
        Result = ButtonResult.OK
    };
    RequestClose.Invoke(result);
}
```

## Additional Considerations

When building apps with .NET MAUI you may want to consider using Popup Pages. With the Commercial Plus license you can take advantage of the [`Prism.Plugin.Popups` package for .NET MAUI](xref:Plugins.Popups).

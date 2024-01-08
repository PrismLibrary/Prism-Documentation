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

The DialogCloseListener is new in Prism 9 and replaces the event that was in the original API. The DialogCloseListener allows you more flexibility and is part of the Dialog Service's enhanced API that accepts both 

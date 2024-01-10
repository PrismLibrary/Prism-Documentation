---
uid: Mvvm.BindableBase
---
# BindableBase

Like you would expect from any MVVM Library, Prism provides a base class implementing `INotifyPropertyChanged`. While it's important to understand how to use it, it's also important to note that features within Prism such as responding to lifecycle events, navigation, etc... are all interface driven. This means that while Prism provides the `BindableBase` as a base implementation of `INotifyPropertyChanged` to better assist you, Prism also has no strict requirement on you to use it. This means that you may use any base class you want for your ViewModels including no base class at all (though that isn't generally recommended).

## Creating Properties

Properties used within a class inheriting from `BindableBase` which must notify the UI of changes should make use of the `SetProperty` method to set the changes and should have both a public property as well as a private backing field. The result is something like this:

```cs
public class ViewAViewModel : BindableBase
{
    private string _message;
    public string Message
    {
        get => _message;
        set => SetProperty(ref _message, value);
    }
}
```

### Why Use SetProperty

You may be wondering, why use `SetProperty`? After all can't you just call RaisePropertyChanged yourself? The short answer is that you can. However this is generally not advisable because you will lose the built in EqualityComparer which helps to ensure that if the setter is called multiple times with the same value `INotifyPropertyChanged` will only trigger the `PropertyChanged` event the first time it changes.

```cs
public class ViewAViewModel : BindableBase
{
    private string _message;
    public string Message
    {
        get => _message;
        set
        {
            // Don't do this!
            _message = value;
            RaisePropertyChanged();
        }
    }
}
```

> [!TIP]
> As we have reviewed code in production, we have commonly run into code like the above sample. This code is fundamentally flawed, overly verbose and will result in unnecessary PropertyChanged events being raised for the property. You should always base your code flow around SetProperty.

### Executing a Delegate on PropertyChanges

Sometimes you may want to provide a callback when the property changes. One such example could be that you are implementing `IActiveAware` and you want to provide a method that will only execute when IsActive is true and another when it is false.

```cs
public abstract class ViewModelBase : BindableBase, IActiveAware
{
    private bool _isActive;
    public bool IsActive
    {
        get => _isActive;
        set => SetProperty(ref _isActive, value, () => {
            if (value)
                OnIsActive();
            else
                OnIsNotActive();
        });
    }

    protected virtual void OnIsActive() { }
    protected virtual void OnIsNotActive() { }
}
```


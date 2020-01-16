# AutoInitialization

Beginning with Prism 7.2, support was added for `IAutoInitialization`. This was provided along with `IInitialize` and `IInitializeAsync`. It is important to remember that `IAutoInitialize` itself lives within the `Prism.AppModel` namespace as it is used both by Prism's NavigationService and DialogService to initialize your ViewModels. AutoInitialization will only occur if you have added this marker interface to your ViewModel.

## How it works

If you pass any parameter via either the QueryString, NavigationParameters, or DialogParameters which you would expect to have access to in one of the Navigation interfaces or in `IDialogAware.OnDialogOpened`, `IAutoInitialize` will automatically inspect your ViewModel through reflection and set any public property which has the same name as is contained in the Parameters.

> [!NOTE]
> Parameter name matching is done using the following string comparison `StringComparison.InvariantCultureIgnoreCase`

## Customizing Parameters

There are times in which you may have a hard requirement for a specific parameter, while other parameters may be optional when initializing your ViewModel. Similarly there may be times in which the name of the Property may not match the parameter key that you wish to use. For either of these cases you can use the `AutoInitializeAttribute` on the property to provide `IAutoInitialize` the proper context for what to do with the given property.

```cs
public class ViewAViewModel : BindableBase
{
    // A required property which will generate an exception if not set
    private string _title;
    [AutoInitialize(true)]
    public string Title
    {
        get => _title;
        set => SetProperty(ref _title, value);
    }

    // An optional property with the parameter key item1
    private FooModel _model1;
    [AutoInitialize("item1")]
    public FooModel Model1
    {
        get => _model1;
        set => SetProperty(ref _model1, value);
    }

    // A required property with the parameter key item2
    private FooModel _model2
    [AutoInitialize("item2", true)]
    public FooModel Model2
    {
        get => _model2;
        set => SetProperty(ref _model2, value);
    }
}
```

## Additional References

- [Dialog Service](dialogs/dialog-service.md)
- [Navigation Basics](navigation/navigation-basics.md)

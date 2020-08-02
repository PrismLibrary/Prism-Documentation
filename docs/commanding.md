# Commanding
In addition to providing access to the data to be displayed or edited in the view, the ViewModel will likely define one or more actions or operations that can be performed by the user. Actions or operations that the user can perform through the UI are typically defined as commands. Commands provide a convenient way to represent actions or operations that can be easily bound to controls in the UI. They encapsulate the actual code that implements the action or operation and help to keep it decoupled from its actual visual representation in the view.

Commands can be visually represented and invoked in many different ways by the user as they interact with the view. In most cases, they are invoked as a result of a mouse click, but they can also be invoked as a result of shortcut key presses, touch gestures, or any other input events. Controls in the view are data bound to the ViewModels's commands so that the user can invoke them using whatever input event or gesture the control defines. Interaction between the UI controls in the view and the command can be two-way. In this case, the command can be invoked as the user interacts with the UI, and the UI can be automatically enabled or disabled as the underlying command becomes enabled or disabled.

The ViewModel can implement commands as a **Command Object** (an object that implements the `ICommand` interface). The view's interaction with the command can be defined declaratively without requiring complex event handling code in the view's code-behind file. For example, certain controls inherently support commands and provide a `Command` property that can be data bound to an `ICommand` object provided by the ViewModel. In other cases, a command behavior can be used to associate a control with a command method or command object provided by the ViewModel.

Implementing the `ICommand` interface is straightforward. Prism provides the `DelegateCommand` implementation of this interface that you can readily use in your applications.

> [!NOTE]
> `DelegateCommand` can be found in the Prism.Commands namespace which is located in the Prism.Core NuGet package.

## Creating a DelegateCommand

> [!Video https://www.youtube.com/embed/tYItSPv58Bo]

The Prism `DelegateCommand` class encapsulates two delegates that each reference a method implemented within your ViewModel class. It implements the `ICommand` interface's `Execute` and `CanExecute` methods by invoking these delegates. You specify the delegates to your ViewModel methods in the `DelegateCommand` class constructor. For example, the following code example shows how a `DelegateCommand` instance, which represents a Submit command, is constructed by specifying delegates to the OnSubmit and CanSubmit ViewModel methods. The command is then exposed to the view via a read-only property that returns a reference to the `DelegateCommand`.

```cs
public class ArticleViewModel
{
    public DelegateCommand SubmitCommand { get; private set; }

    public ArticleViewModel()
    {
        SubmitCommand = new DelegateCommand<object>(Submit, CanSubmit);
    }

    void Submit(object parameter)
    {
        //implement logic
    }

    bool CanSubmit(object parameter)
    {
        return true;
    }
}
```
When the Execute method is called on the `DelegateCommand` object, it simply forwards the call to the method in your ViewModel class via the delegate that you specified in the constructor. Similarly, when the `CanExecute` method is called, the corresponding method in your ViewModel class is called. The delegate to the `CanExecute` method in the constructor is optional. If a delegate is not specified, `DelegateCommand` will always return `true` for `CanExecute`.

The `DelegateCommand` class is a generic type. The type argument specifies the type of the command parameter passed to the `Execute` and `CanExecute` methods. In the preceding example, the command parameter is of type `object`. A **non-generic** version of the `DelegateCommand` class is also provided by Prism for use when a command parameter is not required, and is defined as follows:

```cs
public class ArticleViewModel
{
    public DelegateCommand SubmitCommand { get; private set; }

    public ArticleViewModel()
    {
        SubmitCommand = new DelegateCommand(Submit, CanSubmit);
    }

    void Submit()
    {
        //implement logic
    }

    bool CanSubmit()
    {
        return true;
    }
}
```
> [!NOTE]
> The `DelegateCommand` deliberately prevents the use of value types (int, double, bool, etc). Because `ICommand` takes an `object`, having a value type for `T` would cause unexpected behavior when `CanExecute(null)` is called during XAML initialization for command bindings. Using `default(T)` was considered and rejected as a solution because the implementor would not be able to distinguish between a valid and defaulted values. If you wish to use a value type as a parameter, you must make it nullable by using `DelegateCommand<Nullable<int>>` or the shorthand `?` syntax (`DelegateCommand<int?>`).

## Invoking DelegateCommands from the View
There are a number of ways in which a control in the view can be associated with a command object provided by the ViewModel. Certain WPF, Xamarin.Forms, and UWP controls can be easily data bound to a command object through the `Command` property.

```xml
<Button Command="{Binding SubmitCommand}" CommandParameter="OrderId"/>
```

A command parameter can also be optionally defined using the `CommandParameter` property. The type of the expected argument is specified in the `DelegateCommand<T>` generic declaration. The control will automatically invoke the target command when the user interacts with that control, and the command parameter, if provided, will be passed as the argument to the command's `Execute` method. In the preceding example, the button will automatically invoke the `SubmitCommand` when it is clicked. Additionally, if a `CanExecute` delegate is specified, the button will be automatically disabled if `CanExecute` returns `false`, and it will be enabled if it returns `true`.

## Raising Change Notifications
The ViewModel often needs to indicate a change in the command's `CanExecute` status so that any controls in the UI that are bound to the command will update their enabled status to reflect the availability of the bound command.  The `DelegateCommand` provides several ways to send these notifications to the UI.

### RaiseCanExecuteChanged
Use the `RaiseCanExecuteChanged` method whenever you need to manually update the state of the bound UI elements.  For example, when the `IsEnabled` property values changes, we are calling `RaiseCanExecuteChanged` in the setter of the property to notify the UI of state changes.
```cs
        private bool _isEnabled;
        public bool IsEnabled
        {
            get { return _isEnabled; }
            set
            {
                SetProperty(ref _isEnabled, value);
                SubmitCommand.RaiseCanExecuteChanged();
            }
        }
```

### ObservesProperty
In cases where the command should send notifications when a property value changes, you can use the `ObservesProperty` method. When using the `ObservesProperty` method, whenever the value of the supplied property changes, the `DelegateCommand` will automatically call `RaiseCanExecuteChanged` to notify the UI of state changes.

```cs
public class ArticleViewModel : BindableBase
{
    private bool _isEnabled;
    public bool IsEnabled
    {
        get { return _isEnabled; }
        set { SetProperty(ref _isEnabled, value); }
    }

    public DelegateCommand SubmitCommand { get; private set; }

    public ArticleViewModel()
    {
        SubmitCommand = new DelegateCommand(Submit, CanSubmit).ObservesProperty(() => IsEnabled);
    }

    void Submit()
    {
        //implement logic
    }

    bool CanSubmit()
    {
        return IsEnabled;
    }
}
```
> [!NOTE]
> You can chain-register multiple properties for observation when using the `ObservesProperty` method. Example: `ObservesProperty(() => IsEnabled).ObservesProperty(() => CanSave)`.

### ObservesCanExecute
If your `CanExecute` is the result of a simple `Boolean` property, you can eliminate the need to declare a `CanExecute` delegate, and use the `ObservesCanExecute` method instead. `ObservesCanExecute` will not only send notifications to the UI when the registered property value changes but it will also use that same property as the actual `CanExecute` delegate.

```cs
public class ArticleViewModel : BindableBase
{
    private bool _isEnabled;
    public bool IsEnabled
    {
        get { return _isEnabled; }
        set { SetProperty(ref _isEnabled, value); }
    }

    public DelegateCommand SubmitCommand { get; private set; }

    public ArticleViewModel()
    {
        SubmitCommand = new DelegateCommand(Submit).ObservesCanExecute(() => IsEnabled);
    }

    void Submit()
    {
        //implement logic
    }
}
```
> [!WARNING]
> Do not attempt to chain-register `ObservesCanExecute` methods. Only one property can be observed for the `CanExcute` delegate.

## Implementing a Task-Based DelegateCommand
In today's world of `async`/`await`, calling asynchronous methods inside of the `Execute` delegate is a very common requirement. Everyone's first instinct is that they need an `AsyncCommand`, but that assumption is wrong. `ICommand` by nature is synchronous, and the `Execute` and `CanExecute` delegates should be considered events.  This means that `async void` is a perfectly valid syntax to use for commands.  There are two approaches to using async methods with `DelegateCommand`.

**Option 1:**
```cs
public class ArticleViewModel
{
    public DelegateCommand SubmitCommand { get; private set; }

    public ArticleViewModel()
    {
        SubmitCommand = new DelegateCommand(Submit);
    }

    async void Submit()
    {
        await SomeAsyncMethod();
    }
}
```

**Option 2:**
```cs
public class ArticleViewModel
{
    public DelegateCommand SubmitCommand { get; private set; }

    public ArticleViewModel()
    {
        SubmitCommand = new DelegateCommand(async ()=> await Submit());
    }

    Task Submit()
    {
        return SomeAsyncMethod();
    }
}
```

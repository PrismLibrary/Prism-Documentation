---
sidebar_position: 1
uid: Mvvm.BindableBase
---

# BindableBase

`Prism.Mvvm.BindableBase` implements `INotifyPropertyChanged` in `Prism.Core`. It gives WPF, .NET MAUI, Uno and Avalonia view models the same small property-notification API. Prism's navigation and lifecycle features depend on interfaces, so inheriting from this class is optional.

## Creating properties

```csharp
using Prism.Mvvm;

public sealed class EditorViewModel : BindableBase
{
    private string _name = string.Empty;

    public string Name
    {
        get => _name;
        set
        {
            if (SetProperty(ref _name, value))
                RaisePropertyChanged(nameof(CanSave));
        }
    }

    public bool CanSave => !string.IsNullOrWhiteSpace(Name);
}
```

`SetProperty` compares the existing and proposed values using `EqualityComparer<T>.Default`. If they are equal, it returns false and raises no event. Otherwise it assigns the value, raises `PropertyChanged`, and returns true. The property name is supplied by `CallerMemberName`; use an explicit name for a dependent property such as `CanSave`.

A [command](../commands/commanding.md) can observe `CanSave` with `.ObservesCanExecute(() => CanSave)`. The dependent-property notification is what makes that observation useful.

## Running a callback when a value changes

The callback overload invokes the callback after assignment and **before** the property's notification:

```csharp
private bool _isActive;
public bool IsActive
{
    get => _isActive;
    set => SetProperty(ref _isActive, value,
        () => IsActiveChanged?.Invoke(this, EventArgs.Empty));
}

public event EventHandler? IsActiveChanged;
```

These members can implement `Prism.IActiveAware` on a view model. The callback only runs when the value changes. Keep it synchronous and small; start cancellable asynchronous work through an explicit lifecycle method or [async command](../commands/async-commands.md).

## What property notification does not do

- It does not validate input or implement `INotifyDataErrorInfo` for you.
- It does not dispatch to a UI thread. Update UI-bound state on the appropriate host dispatcher.
- A notification that a collection property changed is different from item-add/remove notifications. Use an appropriate observable collection when the UI must track those changes.
- Equality is the type's equality. Mutating an existing object and assigning the same reference does not necessarily report a change; expose and notify the changed property deliberately.

Calling `RaisePropertyChanged` directly is appropriate for computed properties or a notification with no backing-field assignment. Use `SetProperty` when the intended behavior is “assign only when different.”

Source: [BindableBase](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Prism.Core/Mvvm/BindableBase.cs) and [tests](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/tests/Prism.Core.Tests/Mvvm/BindableBaseFixture.cs). For generated properties, see [Prism Magician](../magician/index.md).

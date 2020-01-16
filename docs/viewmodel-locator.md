# Using the ViewModelLocator
The `ViewModelLocator` is used to wire the `DataContext` of a view to an instance of a ViewModel using a standard naming convention.

The Prism `ViewModelLocator` has an `AutoWireViewModel` attached property, that when set to `true` calls the `AutoWireViewModelChanged` method in the `ViewModelLocationProvider` class to resolve the ViewModel for the view, and then set the view’s data context to an instance of that ViewModel.

Add the `AutoWireViewModel` attached property to each View:
```
<Window x:Class="Demo.Views.MainWindow"
    ...
    xmlns:prism="http://prismlibrary.com/"
    prism:ViewModelLocator.AutoWireViewModel="True">
```

To locate a ViewModel, the `ViewModelLocationProvider` first attempts to resolve the ViewModel from any mappings that may have been registered by the `ViewModelLocationProvider.Register` method (See [Custom ViewModel Registrations](#Custom-ViewModel-Registrations)).  If the ViewModel cannot be resolved using this approach, the `ViewModelLocationProvider` falls back to a convention-based approach to resolve the correct ViewModel type.  

This convention assumes:
- that ViewModels are in the same assembly as the view types
- that ViewModels are in a `.ViewModels` child namespace
- that views are in a `.Views` child namespace
- that ViewModel names correspond with view names and end with "ViewModel."

> [!Note]
> The `ViewModelLocationProvider` can be found in the `Prism.Mvvm` namespace in the **Prism.Core** NuGet package. The `ViewModelLocator` can be found in the `Prism.Mvvm` namespace in the platform specific packages (**Prism.WPF**, **Prism.Forms**) NuGet package.

> [!Note]
> The ViewModelLocator is required, and automatically applied to every View, when developing with Xamarin.Forms as it is responsible for providing the correct instance of the `INavigationService` to the ViewModel. When developing a Xamarin.Forms app, the `ViewModelLocator` is opt-out only.

> [!Video https://www.youtube.com/embed/I_3LxBdvJi4]

## Change the Naming Convention
If your application does not follow the `ViewModelLocator` default naming convention, you can change the convention to meet the requirements of your application.  The `ViewModelLocationProvider` class provides a static method called `SetDefaultViewTypeToViewModelTypeResolver` that can be used to provide your own convention for associating views to view models.

To change the `ViewModelLocator` naming convention, override the `ConfigureViewModelLocator` method in the `App.xaml.cs` class. Then provide your custom naming convention logic in the `ViewModelLocationProvider.SetDefaultViewTypeToViewModelTypeResolver` method.
```
protected override void ConfigureViewModelLocator()
{
    base.ConfigureViewModelLocator();

    ViewModelLocationProvider.SetDefaultViewTypeToViewModelTypeResolver((viewType) =>
    {
        var viewName = viewType.FullName.Replace(".ViewModels.", ".CustomNamespace.");
        var viewAssemblyName = viewType.GetTypeInfo().Assembly.FullName;
        var viewModelName = $"{viewName}ViewModel, {viewAssemblyName}";
        return Type.GetType(viewModelName);
    });
}
```

> [!Video https://www.youtube.com/embed/o4ibaOFvfww]

## Custom ViewModel Registrations
There may be instances where your app is following the `ViewModelLocator` default naming convention, but you have a number of ViewModels that do not follow the convention. Instead of trying to customize the naming convention logic to conditionally meet all your naming requirments, you can register a mapping for a ViewModel to a specific view directly with the `ViewModelLocator` by using the `ViewModelLocationProvider.Register` method.

The following examples show the various ways to create a mapping between a view called `MainWindow` and a ViewModel named `CustomViewModel`.

**Type / Type**
```
ViewModelLocationProvider.Register(typeof(MainWindow).ToString(), typeof(CustomViewModel));
```

**Type / Factory**
```
ViewModelLocationProvider.Register(typeof(MainWindow).ToString(), () => Container.Resolve<CustomViewModel>());
```

**Generic Factory**
```
ViewModelLocationProvider.Register<MainWindow>(() => Container.Resolve<CustomViewModel>());
```

**Generic Type**
```
ViewModelLocationProvider.Register<MainWindow, CustomViewModel>();
```

> [!Note]
> Registering your ViewModels directly with the `ViewModelLocator` is faster than relying on the default naming convention. This is because the naming convention requires the use of reflection, while a custom mapping provides the type directly to the `ViewModelLocator`.

> [!Important]
> The `viewTypeName` parameter must be the fully qualifyied name of the view's Type (`Type.ToString()`). Otherwise the mapping will fail.

> [!Video https://www.youtube.com/embed/phMc4OuKs58]

## Control how ViewModels are Resolved
By default, the `ViewModelLocator` will use the DI container you have chosen to create your Prism application to resolve ViewModels.  However, if you ever have the need to customize how ViewModels are resolved or change the resolver altogether, you can achieve this by using the `ViewModelLocationProvider.SetDefaultViewModelFactory` method.

This example shows how you might change the container used for resolving the ViewModel instances.
```
protected override void ConfigureViewModelLocator()
{
    base.ConfigureViewModelLocator();

    ViewModelLocationProvider.SetDefaultViewModelFactory(viewModelType) =>
    {
        return MyAwesomeNewContainer.Resolve(viewModelType);
    });
}
```

This is an example of how you might check the type of the view the ViewModel is being created for, and performing logic to control how the ViewModel is created.
```
protected override void ConfigureViewModelLocator()
{
    base.ConfigureViewModelLocator();

    ViewModelLocationProvider.SetDefaultViewModelFactory((view, viewModelType) =>
    {
        switch (view)
        {
            case Window window:
                //your logic
                break;
            case UserControl userControl:
                //your logic
                break;
        }

        return MyAwesomeNewContainer.Resolve(someNewType);
    });
}
```

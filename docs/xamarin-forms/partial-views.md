# Partial Views

The concept of a Partial View is to support a custom layout which may be reused across multiple pages, and eliminate ViewModel logic duplication by allowing that custom layout to rely on its own ViewModel. To use a Partial View you must set the ViewModelLocator.AutowirePartialView property with a reference to the containing page as shown here. You should not set the ViewModelLocator.AutowireViewModel property on the Partial View unless you are explicitly opting out as setting this property to true directly may result in the ViewModel being incorrectly set.

### Parent View

```csharp
<ContentPage xmlns="http://xamarin.com/schemas/2014/forms"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:local="clr-namespace:AwesomeApp.Views"
             xmlns:prism="clr-namespace:Prism.Ioc;assembly=Prism.Forms"
             xmlns:mvvm="clr-namespace:Prism.Mvvm;assembly=Prism.Forms"
             x:Name="self"
             x:Class="AwesomeApp.Views.ViewA">
  <StackLayout>
    <local:AwesomeView mvvm:ViewModelLocator.AutowirePartialView="{x:Reference self}" />
    <Entry Text="{Binding SomeValue" />
  </StackLayout>
</ContentPage>
```

### Partial View To Be Included In Parent View

```csharp
<ContentView xmlns="http://xamarin.com/schemas/2014/forms"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:local="clr-namespace:AwesomeApp.Views"
             xmlns:prism="clr-namespace:Prism.Ioc;assembly=Prism.Forms"
             xmlns:mvvm="clr-namespace:Prism.Mvvm;assembly=Prism.Forms"
             x:Class="AwesomeApp.Views.AwesomeView">
  <StackLayout>
    <Entry Text="{Binding SomeText" />
  </StackLayout>
</ContentView>
```

> [!Important]
> Dynamically adding/removing of Partial Views is unsupported. 

## Helpful Hints

The partial view has it's own view model so in order to pass changes because the parent and partial view after the views have loaded you can look at using the [Event Aggregator](https://prismlibrary.github.io/docs/event-aggregator.html) included with Prism

# Passing parameters

The Prism navigation service also allows you to pass parameters to the target view during the navigation process.  Passing parameters to the next View can be done using an overload of the **INavigationService.NavigateAsync** method. This overload accepts a **NavigationParameters** object that can be used to supply data to the next View. The **NavigationParameters** object is in fact just a dictionary. It can accept any arbitrary object as a value.

> [!Video https://www.youtube.com/embed/inxl6Xfqsjs]

## Creating Parameters

Creating parameters can be done in a variety of ways.

```cs
var navigationParams = new NavigationParameters();
navigationParams.Add("model", new Contact());
_navigationService.NavigateAsync("MainPage", navigationParams);
```

You can also create an HTML query string to generate your parameter collection.

```cs
var queryString = "code=CR&desc=Red";
var navigationParams = new NavigationParameters(queryString);
_navigationService.NavigateAsync("MainPage", navigationParameters);
```

When using a short-syntax to navigate, you may append the navigation key with parameters, which will be used as the navigation parameters.

```cs
//query string
_navigationService.NavigateAsync("MainPage?id=3&name=brian");

//using NavigationParameters in short-syntax
_navigationService.NavigateAsync("MainPage" + navParameters.ToString());

//using both short-syntax parameters and NavigationParameters
var navParameters = new NavigationParameters();
navParameters.Add("name", "brian");
_navigationService.NavigateAsync("MainPage?id=3", navParameters);
```

When using a Uri-syntax to navigate, you may append the Uri with parameters, which will be used as the navigation parameters.

```cs
//query string
_navigationService.NavigateAsync(new Uri("MainPage?id=3&name=brian", UriKind.Relative));

//using NavigationParameters in Uri
_navigationService.NavigateAsync(new Uri("MainPage" + navParameters.ToString(), UriKind.Relative));

//using both Uri parameters and NavigationParameters
var navParameters = new NavigationParameters ();
navParameters.Add("name", "brian");
_navigationService.NavigateAsync(new Uri("MainPage?id=3", UriKind.Relative), navParameters);
```

## Getting Parameters

Getting the parameters that were passed to the target View being navigated to can be achieved by using the `INavigationAware` interface on the corresponding ViewModel.

### INavigationAware

The ViewModel of the target navigation Page can participate in the navigation process by implementing the `INavigationAware` interface.  This interface adds three methods to your ViewModel so you can intercept before the View is navigated to **(OnNavigatingTo)**, once it is navigated to **(OnNavigatedTo)**, and once it is navigated away from **(OnNavigatedFrom)**.  These methods make the `NavigationParameters` accessible from either the View being navigated to, or the View being navigated away from.

_Note: You can implement `INavigationAware` on either the View or ViewModel_

Example:

```cs
public class ContactPageViewModel : INavigationAware
{  
    public void OnNavigatedTo(INavigationParameters parameters)
    {

    }

    public void OnNavigatedFrom(INavigationParameters parameters)
    {

    }
}
```

For more granular control, or if you wish to only implement very specific methods, you may choose to implement `INavigatedAware` or `INavigatingAware` interfaces.  These interfaces provide you the ability to choose exactly which navigation methods you wish to participate in.

```cs
public interface INavigatedAware
{
    /// <summary>
    /// Called when the implementer has been navigated away from.
    /// </summary>
    /// <param name="parameters">The navigation parameters.</param>
    void OnNavigatedFrom(INavigationParameters parameters);

    /// <summary>
    /// Called when the implementer has been navigated to.
    /// </summary>
    /// <param name="parameters">The navigation parameters.</param>
    void OnNavigatedTo(INavigationParameters parameters);
}
```

```cs
public interface INavigatingAware
{
    /// <summary>
    /// Called before the implementor has been navigated to.
    /// </summary>
    /// <param name="parameters">The navigation parameters.</param>
    /// <remarks>Not called when using device hardware or software back buttons</remarks>
    void OnNavigatingTo(INavigationParameters parameters);
}
```

In fact, the `INavigationAware` interface simply implements both the `INavigatedAware` and `INavigatingAware` interfaces.

```cs
public interface INavigationAware : INavigatedAware, INavigatingAware
{

}
```

> [!NOTE]
**OnNavigatingTo** is not called when using device hardware or software back button.

## Reading Parameters

Now that you have access to the parameters, you must read the parameters from the available `NavigationParameters` instance.  There are two ways to read parameters; by using the parameter key as an indexer on the parameters instance, or by using the `GetValue`/`GetValues` method on the parameters instance.

```cs
public void OnNavigatedTo(INavigationParameters parameters)
{
  //get a single parameter as type object, which must be cast
  var color = parameters["color"] as Color;

  //get a single typed parameter
  var color = parameters.GetValue<Color>("color");

  //get a collection of typed parameters
  var colors = parameters.GetValues<Color>("colors");
}
```

## Get the NavigationMode

When navigating, it is sometimes important to know which direction you are heading in the navigation stack.  This allows you to make different decisions based on if you are navigating forward or back.

To get the NavigationMode, simply call the `INavigationParameters.GetNavigationMode` method.

```cs
public void OnNavigatedFrom(INavigationParameters parameters)
{
  var navigationMode = parameters.GetNavigationMode();
}
```
Prism for Xamarin.Forms only support two `NavigationMode` options:

```cs
    public enum NavigationMode
    {
        /// <summary>
        /// Indicates that a navigation operation occured that resulted in navigating backwards in the navigation stack.
        /// </summary>
        Back,
        /// <summary>
        /// Indicates that a new navigaton operaton has occured and a new page has been added to the navigation stack.
        /// </summary>
        New,
    }
```

> [!NOTE]
`NavigationMode.Forward` and `NavigationMode.Refresh` are not supported in Xamarin.Forms. These are used in UWP only.

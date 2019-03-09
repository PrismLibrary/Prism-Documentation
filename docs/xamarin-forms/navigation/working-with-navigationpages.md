# Working with NavigationPages

Prism's navigation interface is a very strong and extendible feature with lot of out of the box navigation features to make your Xamarin Forms page navigation easier.

IMPORTANT: All Prism Navigation Methods like GoBackAsync, GoBackToRootAsync, NavigateAsync returns `INavigationResult`.

`INavigationResult` has two properties

**Success** is of type `bool` to indicate whether the navigation operation was a success or not.

**Exception** is of type `Exception` with details about error if navigation fails.

Usage:
```cs
var result = NavigationService.GoBackAsync();
if(!result.Success)
{
    Debug.WriteLine(result.Exception);
}
```


## GoBackAsync

Navigates to the most recent entry in the back navigation history by popping the calling Page off the navigation stack.
It returns `INavigationResult`

| Parameters         | Type          | Required | Remarks   |
| ------------------ |:-------------:|:-------------:| ---------:|
| parameters | `INavigationParameters` | optional (default:null)  | The data you want to send with Navigation.|
| useModalNavigation | `bool?`    | optional (default:null)      | if **true**, it uses PopModalAsync and if **false**, the navigation uses PopAsync |
| animated | `bool` | optional (default:true)  | if **true**, page transition is done with animation, if **false**, the transition will not use animation|

### Usage

```cs
var result = NavigationService.GoBackAsync(useModalNavigation: true, animated: false);
if(!result.Success)
{
    Debug.WriteLine(result.Exception);
}
```


## GoBackToRootAsync

If you are within a `NavigationPage`, you can clear all the pages except the root page off the navigation stack by calling
INavigationService.GoBackToRootAsync.

This is equivalent to calling Xamarin.Forms Navigation.PopToRoot method.

| Parameters         | Type          | Required | Remarks   |
| ------------------ |:-------------:|:-------------:| ---------:|
| parameters | `INavigationParameters` | optional (default:null)  | The data you want to send with Navigation.|

### Usage

```cs
var result = NavigationService.GoBackToRootAsync(useModalNavigation: true, animated: false);
if(!result.Success)
{
    Debug.WriteLine(result.Exception);
}
```

## NavigateAsync

TBD

## Relative GoBack

If you want to navigate to a relative position in your navigation stack, say like you navigate from A - > B - > C - > D
and from D you want to go back to B, you have Relative GoBack Navigation option available with `NavigateAsync`

### Usage

```cs
var result = NavigationService.NavigateAsync("../../");
if(!result.Success)
{
    Debug.WriteLine(result.Exception);
}
```

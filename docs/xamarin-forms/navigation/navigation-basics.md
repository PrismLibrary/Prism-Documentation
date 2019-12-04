# Navigation Basics

Navigating in a Prism application is conceptually different than standard navigation in Xamarin.Forms.  While Xamarin.Forms navigation relies on a Page class instance to navigate, Prism removes all dependencies on Page types to achieve loosely coupled navigation from within a ViewModel.  In Prism, the concept of navigating to a View or navigating to a ViewModel does not exist.  Instead, you simply navigate to an experience, or a unique identifier, which represents the target view you wish to navigate to in your application.

Page navigation in Prism is accomplished by using the **INavigationService**.

> [!Video https://www.youtube.com/embed/33hYzo5cFcE]

## Registering

Registering your Page for navigation is essentially mapping a unique identifier/key to the target view during the bootstrapping process.  In order to register your Pages for Navigation, override the **RegisterTypes** method in your **App.cs**. There are four ways to register your Pages for navigation; default, custom, OnPlatform, and OnIdiom.

App.cs:

```cs
protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    //register pages for navigation
}
```

Next, use the `RegisterForNavigation<T>` extension method off of the `IContainerRegistry`.  

### Default Registration

By default, **RegisterForNavigation** will use the **Name** of the Page type as the unique identifier/key.  The following code snippet results in a mapping between the MainPage type, and the unique identifier/key of "MainPage".  This means when you request to navigate to the MainPage, you will provide the string "MainPage" as the navigation target.

```cs
protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    containerRegistry.RegisterForNavigation<MainPage>();
}
```

To navigate to the MainPage using this registration method:

```cs
_navigationService.NavigateAsync("MainPage");
```

By default, Prism uses a convention to find the ViewModel for the view (PageName + ViewModel = PageNameViewModel). This process uses reflection which introduces a small performance hit. If you would like to avoid this performance hit, you can provide the ViewModel type when registering your Page for navigation.

```cs
protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    containerRegistry.RegisterForNavigation<MainPage, MainPageViewModel>();
}
```

#### Custom Registration

You can override this convention by providing a custom unique identifier/key as a method parameter.  In this case, we are overriding the convention for MainPage, and are creating a mapping between the MainPage Page type, and the unique identifier/key of "CustomKey".  So when we want to navigate to the MainPage, we would provide the "CustomKey" as the navigation target.

```cs
protected override void RegisterTypes()
{
    Container.RegisterTypeForNavigation<MainPage>("CustomKey");
}
```

To navigate to the MainPage using this registration method:

```cs
_navigationService.NavigateAsync("CustomKey");
```

### OnPlatform Registration

When writing a Xamarin.Forms apllication, it is common to use a different view for a specific platform. Prism enables you to register different views for different platforms while using the same ViewModel. To do this, simply register your views using the `IContainerRegistry.RegisterForNavigationOnPlatform` method. The `TView` and `TViewModel` will be used for all views unless you provide an IPlatform arugment.

For example; The following code will use the MainPage, with the MainPageViewModel as it's BindingContent, for every platform except Android and iOS.  For Android, we have rgeistered the MainPageAndroid, and for iOS we have registered the MainPageiOS. Both MainPageAndroid and MainPageiOS will use the MainPageViewModel as their BindingContent.

```cs
containerRegistry.RegisterForNavigationOnPlatform<MainPage, MainPageViewModel>(
    new Platform<MainPageAndroid>(RuntimePlatform.Android),
    new Platform<MainPageiOS>(RuntimePlatform.iOS)
);
```

To navigate to the MainPage use:

```cs
_navigationService.NavigateAsync("MainPage");
```

Depending on which platform your app is running on, the appropriate view will be provided for the respective platform.

### OnIdiom Registration

Another common scenario when creating a Xamarin.Forms aplication is the need to provide a different view based on the device the app is running on, such as Desktop, Phone, Tablet, etc.  

```cs
containerRegistry.RegisterForNavigationOnIdiom<MainPage, MainPageViewModel>(
    desktopView: typeof(MainPageDesktop),
    tabletView: typeof(MainPageTablet)
);
```

To navigate to the MainPage use:

```cs
_navigationService.NavigateAsync("MainPage");
```

Depending on which device your app is running on, the appropriate view will be provided for the respective device.

## Getting the Navigation Service

Once your views are registered for navigation, you must use the INavigationService to perform navigation.  To obtain the **INavigationService** in your ViewModels simply ask for it as a constructor parameter.  There is a caveat while injecting the Navigation Service into your ViewModels. The current version of the Prism.Forms library requires that you name the injection parameter precisely as `navigationService` Otherwise the Navigation Service is unaware of the current View it is used on.  This is a limitation of the dependency injection container.

```cs
public MainPageViewModel(INavigationService navigationService) // has to be named correctly
{
    _navigationService = navigationService;
}
```

### Navigating

Once you have the **INavigationService** in your ViewModel, you can navigate to your target views by calling the `INavigationService.NavigateAsync` method and provide the unique identifier/key that represents the target Page.

There are two types of navigation in Prism; Relative, and Absolute.

**Relative** navigation will always push pages onto the current navigation stack relative to where you are calling the `INavigationService.NavigateAsync` method. For example; assuming your current navigation stack is "ViewA/ViewB", and from ViewB you call `INavigationService.NavigateAsync("ViewC")`, your navigation stack will now look like "ViewA/ViewB/ViewC".

Syntax for Relative navigation:
```cs
//relative short-syntax
_navigationService.NavigateAsync("MainPage");

//relative URI-syntax
_navigationService.NavigateAsync(new Uri("MainPage", UriKind.Relative));
```

**Absolute** navigation will reset the entire navigation stack no matter where you call it, or where you are in the current navigation stack. It is equivalent to `Application.Current.MainPage = new MainPage()`

Syntax for Absolute navigation:
```cs
//absolute short-syntax
_navigationService.NavigateAsync("/MainPage"); //notice the prefix /

//absolute URI-syntax
_navigationService.NavigateAsync(new Uri("http://www.brianlagunas.com/MainPage", UriKind.Absolute));
```

> [!Important]
> If you do not register your Pages with Prism, navigation will not work.

### GoBackAsync

Going back to the previous View is as simple calling the `INavigationService.GoBackAsync` method. 

```cs
_navigationService.GoBackAsync();
```

### Forcing a Modal or Non-Modal Navigation

The Prism navigation service tries it's best to understand the intent of the navigation operation and perform the appropriate modal/non-modal navigation. However, sometimes you require full contol over whether or not you perform a modal or non-modal navigation.  To tell the Prism navigation service how to handle the navigation request, set the `useModalNavigation` parameter in the `INavigationService.NavigateAsync` method signature.

For example; if your navigation stack is rooted within a NavigationPage such as "NavigationPage/ViewA/ViewB", then you call `_navigationService.NavigateAsync("ViewC")` from ViewB, ViewC will be pushed onto the NavigationPage's navigation stack and your new navigation stack will look like "NavigationPage/ViewA/ViewB/ViewC".  If you do not want this behavior, and instead wish to force ViewC to be navigated to modally, you must set the `useModalNavigation` parameter to `true`.

```cs
_navigationService.NavigateAsync("ViewC", useModalNavigation: true);
```

The same approach applies to `GoBackAsync`.  For example, let's assume your navigation stack is rooted with a ContentPage which then has a NavigationPage pushed modally onto the navigation stack.  The Stack would look something like "RootPage/NavigationPage/ViewA".  In this case, if you were to call `GoBackAsync` from ViewA, nothing would happen because you are within the context of a NavigationPage and Prism does not know if you want a non-modal or a modal GoBack operation.  To force a GoBack to the RootPage, you must set the `useModalNavgation` parameter to `true`.

```cs
_navigationService.GoBackAsync(useModalNavigation: true);
```

# Application lifecycle magament
Mobile applications development has to deal with the concept of _application lifecycle_. With this we mean that mobile apps are created to manage scenarios where batterly life, CPU and memory are limited (as opposed to the classic desktop app where all of this is unlimited).

When a mobile app is running in backgroud in is suspended by the OS after a few seconds. The exact timing is different from OS to OS and other factors. When the application is suspended it is _freezed_: the app will continue to use memory but all the running operations are stopped. This way, every other application can make use of resources. However RAM isn't infinite and the app will be killed by the OS to free some memory if necessary.

As mobile developers you need to take care of this to provide your users a smooth and transparent experience whenever possible and restore the previous state of the app.

The typical application lifecycle events are:
+ Initializing. This happens the first time the app is launched.
+ Resuming. This happens every time we restore the app from the background after it has been suspended.
+ Sleeping. This happens when the OS decides to freeze our app after it has gone in background.

The management of these events can be tricky in an MVVM app but Prism provides the [IApplicationLifecycleAware](https://github.com/PrismLibrary/Prism/blob/master/Source/Xamarin/Prism.Forms/AppModel/IApplicationLifecycleAware.cs) to make your life easier.

## How to handle ALM in your view-models
The first thing you have to do to is to implement the `IApplicationLifecycleAware` interface in your view-model class. Implemening this interface means that you have to provide an implementation of the `OnResume()` and `OnSleep()` method that are called by the framework when the app is resuming and going to sleep respectively. The typical operation you'll do in the `OnSleep()` method is to save the state of your view-model to later restore it during the execution of the `OnResume()` method.

The following is an example of a View-Model that implements `IApplicationLifecycleAware`. 

```csharp

 public class ViewModelBase : BindableBase, IApplicationLifecycleAware
    {
        private string _title;

        public ViewModelBase(INavigationService navigationService)
        {
            NavigationService = navigationService;
        }

        public string Title
        {
            get { return _title; }
            set { SetProperty(ref _title, value); }
        }

        protected INavigationService NavigationService { get; private set; }

        public void OnResume()
        {
            //Restore the state of your view-model.
        }

        public void OnSleep()
        {
            //Save the state of your view-model.
        }
    }
```
 

## Reference
[Xamarin Docs App Lifecycle](https://developer.xamarin.com/guides/xamarin-forms/application-fundamentals/app-lifecycle/)

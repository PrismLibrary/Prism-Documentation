# Working with Master-Detail-Pages

The MasterDetailPage is a very special type of page in Xamarin.Forms and it is important to understand first how the MasterDetailPage in Xamarin.Forms itself works before we can hope to understand how it works in Prism.

## Fundamentals

The MasterDetailPage is a special type of Multi-Page, which is comprised of two children:

- The Master Page
- The Detail Page

### The Master Page

The content of the Master is what is used for the Flyout Menu when it is presented. Note that the BindingContext of the Master should be automatically inherited from it's parent the MasterDetailPage.

### The Detail Page

The Detail Page will have the content that is generally visible most of the time. This may be to the right of the Master when the Master is presented, or may take up the full screen when the Master is not presented.

### Master Detail Structure

In Xamarin.Forms you may see a MasterDetailPage classically constructed like the following sample. Here we have a MasterPage and a ContactsPage. The ContactsPage will be the default page displayed when the MasterDetailPage is navigated to.

```xml
<MasterDetailPage xmlns="http://xamarin.com/schemas/2014/forms"
                  xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
                  xmlns:local="clr-namespace:MasterDetailPageNavigation;assembly=MasterDetailPageNavigation"
                  x:Class="MasterDetailPageNavigation.MainPage">
  <MasterDetailPage.Master>
    <local:MasterPage />
  </MasterDetailPage.Master>
  <MasterDetailPage.Detail>
    <NavigationPage>
      <x:Arguments>
        <local:ContactsPage />
      </x:Arguments>
    </NavigationPage>
  </MasterDetailPage.Detail>
</MasterDetailPage>
```

> [!NOTE]
> Xamarin.Forms has a requirement that your Master page MUST contain a Title. It is also important to note that while SOME platforms will automatically provide the classic hamburger menu icon, others such as iOS do not. For those platforms you will need to provide an IconImageSource for the Master page.

## Building your MasterDetailPage with Prism

In Prism.Forms however we construct our MasterDetailPage's a little differently. We recommend that you do NOT create a separate MasterPage as this ultimately leads to confusion for many developers. Instead we recommend simply nesting a ContentPage in the `MasterDetailPage.Master` and building your UI for it there. There will be NO reference to the Detail in the code behind or in XAML.

```xml
<MasterDetailPage xmlns="http://xamarin.com/schemas/2014/forms"
                  xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
                  xmlns:local="clr-namespace:MasterDetailPageNavigation;assembly=MasterDetailPageNavigation"
                  x:Class="MasterDetailPageNavigation.MainPage">
  <MasterDetailPage.Master>
    <ContentPage Title="Menu"
            Padding="0,40,0,0"
            IconImageSource="{OnPlatform iOS='hamburger.png'}">
      <StackLayout>
        <Button Text="View A"
                Command="{Binding NavigateCommand}"
                CommandParameter="ViewA" />
      </StackLayout>
    </ContentPage>
  </MasterDetailPage.Master>
</MasterDetailPage>
```

By adding the MasterContent in this way it remains clear to developers that the ViewModel for that Master is in fact the MainPageViewModel (The ViewModel for our MasterDetailPage itself). When we have our binding for the NavigateCommand this will look for the NavigateCommand in the MainPageViewModel.

### Register for Navigation

While there isn't anything particularly special about how we register the impacted Pages, it is important to Remember that we are in fact dealing with three pages here and not one. When we register our MasterDetailPage we need to remember that we want the top title bar and as a result we will need to ensure that we have a registered NavigationPage. This can be literally any NavigationPage, either one you have customized or the NavigationPage straight from Xamarin.Forms:

```csharp
public class App : PrismApplication
{
    protected override void RegisterTypes(IContainerRegistry containerRegistry)
    {
        containerRegistry.RegisterForNavigation<NavigationPage>();
        containerRegistry.RegisterForNavigation<MainPage, MainPageViewModel>();
        containerRegistry.RegisterForNavigation<ViewA, ViewAViewModel>();
    }
}
```

### Navigating to the MasterDetailPage

> [!NOTE]
> A MasterDetailPage is considered a ROOT page. While you can technically have more than one used in your app, the MasterDetailPage should be navigated to with an absolute uri to reset the NavigationStack setting the Application.MainPage equal to your MasterDetailPage.

```csharp
public class App : PrismApplication
{
    protected override void OnInitialized()
    {
        InitializeComponent();
        NavigationService.NavigateAsync("/MainPage/NavigationPage/ViewA");
    }
}
```

### Navigating from the Master page

Earlier we looked at how we could add a simple master right in the XAML of our MasterDetailPage. We bound our button to a Command in our ViewModel named NavigateCommand. Our button simply passed back that we wanted to Navigate to ViewA, however as you remember we want the Navigation bar with the page title, so we need the actual Detail to be the NavigationPage with it's root page being ViewA. We can do this easily by prefing the `NavigationPage/` before the path we are passed in our Command handler as shown here.

```csharp
public class MainPageViewModel : BindableBase
{
    public DelegateCommand<string> NavigateCommand { get; }

    private async void NavigateCommandExecuted(string path)
    {
        var result = await _navigationService.NavigateAsync($"NavigationPage/{path}");
    }
}
```

## Additional Resources

- [Sample App](https://github.com/PrismLibrary/Prism-Samples-Forms/tree/master/09-MasterDetail)

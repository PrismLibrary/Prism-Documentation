# Page Lifecycle

There are times in your application where you may want to invoke code in your ViewModel based on when the Page Appears or Disappears without Navigation specific consideration. For these times you can utilize the `IPageLifecycleAware` interface to properly respond to the Appearing and Disappearing events from the Page.

! INFO Info
    It is important to remember that although Xamarin.Forms may invoke the Appearing or Disappearing events, this does not always necessarily correlate to the Page having actually appeared or disappeard to the user on the platform. This is a limitation of Xamarin.Forms not Prism.

```csharp
public class ViewAViewModel : IPageLifecycleAware
{
    public void OnAppearing()
    {
        Console.WriteLine("We are appearing");
    }

    public void OnDisappearing()
    {
        Console.WriteLine("We are disappearing");
    }
}
```
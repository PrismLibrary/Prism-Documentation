# Converting Your App From Prism 6.x

In version 6.x, using the Prism framework required an implementation of a bootstrapper class derived from one of the container bootstrapper classes provided by Prism. In the sample below is a minimum version of what that would look like.

```csharp
class AppBootstrapper : UnityBootstrapper
{
    protected override DependencyObject CreateShell()
    {
        return Container.Resolve<MainWindow>():
    }

    protected override void InitializeShell()
    {
        Application.Current.MainWindow.Show();
    }
}
```

The bootstrapper class is used in the Application class and implemented as follows:
```csharp
public partial class App : Application
{
    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);

        var bootstrapper = new AppBootstrapper();
        bootstrapper.Run();
    }
}
```

Above is about the minimum viable implementation of a Prism 6.x implementation. If there is a need to upgrade the application to Prism 7.x, the implementation in the bootstrapper class needs to be moved into the Application class.

## Updating the Application Class

First step is to update the application class. In most cases the App application class is derived from Application. In Prism 7.x the class will be instead derived from one of the Prism application class based on the container of choice. These examples are using the Unity container.

### Update the Application XAML

Make sure that the correct namespace is added to the XAML.
```xml
<prism:PrismApplication
    x:Class="WpfApp1.App"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:local="clr-namespace:WpfApp1"
    xmlns:prism="http://prismlibrary.com/">
    <Application.Resources>
    </Application.Resources>
</prism:PrismApplication>
```
In the above code snippet, the opening tag is changed. Also note the xmlns:prism namespace added on line 6.

Next update the App class code behind.

```cs
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using Prism.Unity;

namespace WpfApp1
{
    public partial class App : PrismApplication
    {
    }
}
```

After updating the class, there will be a couple of abstract methods that need to be implemented in a similar fashion to Prism 6.x.

First implement ```CreateShell```. This is the same as Prism 6.x and can be implemented as follows:

```cs
protected override Window CreateShell()
{
    var w = Container.Resolve<MainWindow>();
    return w;
}
```

Next ```RegisterTypes``` needs to be implemented. This is the same as the ```ConfigureContainer``` in the Bootstrapper class. If you don't have any services to register, this can be left empty.

```cs
protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    // pretend to register a service
    containerRegistry.Register<Services.ISampleService, Services.DbSampleService>();
    // register other needed services here
}
```

### Other Bootstrapper Functionality

The bootstrapper in 6.3x contained other functions that could be overridden for the app. These should have equivalents in the PrismApplication class that can be overridden in Prism 7.x app. One common example would be the ```ConfigureModuleCatalog()``` function.

---
uid: Platforms.UnoPlatform.GettingStarted
---

# Getting Started

## Configuring the Window

Due to Prism's dependency on `Uno.Extensions.Hosting.WinUI` and the adoption of the `IApplicationBuilder`, you do not need to create a Window for your application as this is already done for you by the `IApplicationBuilder`. However you may find that you need to still access the Window to configure properties on the Window, Set the App icon on WinUi, or even initialize certain services which will need access to the Window's `XamlRoot`. To do this you can simply provide an override as follows:

```cs
public partial class App : PrismApplication
{
    protected virtual void ConfigureWindow(Window window)
    {
        // Your code here
    }
}
```

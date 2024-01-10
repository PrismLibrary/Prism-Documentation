---
uid: Plugins.Popups
---

# Getting Started

The Prism.Plugin.Popups package for Xamarin.Forms has been hugely popular enabling developers to leverage the PopupPage's from Rg.Plugins.Popup. Following the introduction of the [IDialogService](xref:Dialogs.GettingStarted), the Popup Plugin was updated to migrate the use of Popup Page's as Dialogs and generally help developers avoid strong dependencies on libraries like Rg.Plugins.Popup as the DialogService could be implemented in other ways in the event that the community package were to fall out of maintenance.

For .NET MAUI Developers, the Popup Plugin will no longer be publicly available on NuGet.org. It instead will only be provided to those with a Commercial Plus license. This is in large part due to the toxic nature of many developers using the plugin over the years who make demands for changes and updates but who never bother to contribute to any Open Source project, nor both to sponsor any Open Source Developers.

If updating your Xamarin.Forms app, particularly from older version of the Popup Plugin where you may have been using the `INavigationService` to Navigate to your Popup Pages, you will need to take time to re-architect some of your code to instead make use of the [IDialogService](xref:Dialogs.GettingStarted).

## Registering the Popup Plugin

`Rg.Plugins.Popup` does not support .NET MAUI applications, however the project has been forked and is now called `Mopups`. To use the Popup Plugin, you must be a Commercial Plus subscriber and have added the private Prism NuGet feed. You can then install `Prism.Plugin.Popups.Maui`. Once you have installed the package you simply need to call `ConfigureMopupDialogs` on the PrismAppBuilder.

```cs
builder.UseMauiApp<App>()
    .UsePrism(prism => prism.ConfigureMopupDialogs())
```

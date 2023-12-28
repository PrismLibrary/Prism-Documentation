# Converting Your App From Prism 7.x

Moving your application from Prism 7.x to 8.x should be pretty straight-forward, but there are a couple of exceptions that you should be aware of, exceptions that could have an effect on your app functionality.

## AutoWireViewModel Changes

In the past, you probably repeated this pattern on all your views:

```xml
<Window
    x:Class="Application1.Views.AppWindow"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    xmlns:local="clr-namespace:Bbsw.VaultToForge.Ux.Views"
    xmlns:prism="http://prismlibrary.com/"
    prism:ViewModelLocator.AutoWireViewModel="True"
>
...
</Window>
```

The AutoWireViewModel is now true by default. If you are using the ViewModelLocator as above, there shouldn't be any changes. If you are doing something different with your view models, perhaps adding them as a dependency in the constructor, you will need to turn off the AutoWireViewModel. 

```xml
<Window
    x:Class="Application1.Views.AppWindow"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    xmlns:local="clr-namespace:Bbsw.VaultToForge.Ux.Views"
    xmlns:prism="http://prismlibrary.com/"
    prism:ViewModelLocator.AutoWireViewModel="False"
>
...
</Window>
```

## ILoggerFacade Removed from Prism.Core

All of the logging has been removed from ```Prism.Core```. The recommended migration is to use ```Prism.Plugin.Logging``` or whatever 3rd party logging framework you prefer. Information on getting started with ```Prism.Plugin.Logging``` can be found [here](https://logging.prismplugins.com/).

## Container Service Locator

New ```ContainerLocator``` has been added to ```Prism.Core``` and it replaces ```Common Service Locator``` in ```Prism.Wpf```.

## All Release Notes

All of the release notes for Prism version 8 can be found [here](https://github.com/PrismLibrary/Prism/releases/tag/v8.0.0.1909).

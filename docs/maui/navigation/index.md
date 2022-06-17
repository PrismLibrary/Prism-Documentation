# Getting Started

When we talk about Navigation for Prism.Maui we are specifically referring to Page based Navigation. Prism.Maui actually provides 2 distinct forms of Navigation, Page based Navigation and Region based Navigation.

## Comparison

### Supported Navigation Types

| Navigation Type | .NET MAUI | Prism.Maui |
| ---------------- | ---------- | ---------- |
| Page Navigation | Supported | [Supported](./page-navigation.md) |
| Shell Navigation | Supported | Not Supported |
| Region Navigation | Not Supported | [Supported](../regions/index.md) |

### Shell vs Prism - What's Supported

| Feature | Shell | Prism |
| ------- | ---- | ----- |
| Non-Modal Navigation | Supported | Supported |
| Modal Navigation | Not Supported | Supported |
| Dynamic Navigation | Not Supported | Supported |
| Navigation Interfaces | Not Supported | Supported |
| Dependency Injection | \*Supported | Supported |

\* .NET MAUI Shell will support Dependency Injection provided that you have registered the View & ViewModel with the Container. Prism does require that you register the Page for Navigation, but the ViewModel can still be resolved even when the ViewModel was not registered with the Container.


## What about MAUI Shell?

The Prism team has spent a lot of time reviewing the MAUI Shell. While we are happy to see many improvements that have come to Shell as a direct result of our involvement with the MAUI Team, it has been our determination that the MAUI Shell is not a good API for developers to rely on for any sort of serious application. There are serious fundamental limitations that MAUI Shell has. As a result of this and the fact that we are aware of a number of companies that have been severely burnt having to completely rebuild their application once they realized Shell would not work for them, we have decided to not support the MAUI Shell.

### FAQ

Q. Isn't the Shell URI Navigation the same as Prism Navigation?
A. No. Shell is an extremely poorly designed API that among other things does not clearly understand the concept of URI's and specifically URI query parameters. While Prism has a rich understanding of URI's that allows you to insert query parameters on any single Navigation segment allowing you to inject parameters that will only be provided to a single page, Shell does not have this capability. Additionally Prism natively supports the concept that you may have a single key with multiple values such as `?color=Red&color=Blue` which is not supported by Shell.

Q. I need to have tabs in my application, how can I do that without using Shell?
A. Xamarin.Forms has always had, and .NET MAUI continues to have a TabbedPage. The TabbedPage is easy to use, and for the purposes of Prism.Maui it isn't even something you need to create anywhere in your app as Prism will automatically register it for you for Navigation, and you can dynamically create your tabs at Runtime! This is just another thing that Shell lacks the ability to do.

Q. Are there differences in routes between Shell and Prism?
A. Shell is extremely declarative meaning that you must either create the Shell Items in your Shell or register a Route and help Shell understand what that "looks like". This is a pretty significant limitation since you must constantly know every possible URI route that will be used. Additionally any scenario in which you need to modally navigate to a page, is simply not supported by Shell. Prism, on the other hand has a much more robust API that allows you to simply register your Page's for Navigation while completely ignoring the concept of "routes". Instead Prism will parse whatever URI you pass and will attempt to find the Page that corresponds with each URI segment.

## Next Steps

- [Page Navigation](./page-navigation.md)
- [Navigation Builder](./navigation-builder.md)
- [XAML Navigation](./xaml-navigation.md)
- [Global Navigation Observer](./global-navigation-observer.md)
- [Navigation Exceptions](./navigation-exceptions.md)
- [Navigation Result](./navigation-result.md)
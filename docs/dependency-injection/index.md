# Dependency Injection with Prism

Prism has always been built around Dependency Injection. This helps you to architect apps that are maintainable and testable and help you reduce or eliminate your dependence on Static and circular references. Prior to Prism 7, dependency injection with Prism was focused around various containers that were implemented for use with Prism. This led to a number of issues including that while docs may have been written showing you how to do something with one container they did not necessarily reflect the appropriate API to use for the container that you were using for your application.

Prism 7 introduced several new interfaces for abstracting what Prism requires for dependency injection. This has several benefits as you might imagine including:

- Docs showing how to do something in Prism will always show you what you need to do without any concern for which dependency injection container you are using.
- This greatly simplified what needed to be added to any container specific package. In the case of Prism.Forms this reduces each container specific project 3 classes: `PrismApplication`, an implementation of `IContainerExtension` and an extension class to retrieve the underlying container should you feel the need to access it for one of it's API's that is not implemented by Prism.

As a result you can easily implement support for a container that is not otherwise provided out of the box by the Prism team. For more information on this be sure to read more on how this works in this blog post by Dan Siegel, [Using "Unsupported" DI Containers with Prism](https://dansiegel.net/post/2018/10/29/using-unsupported-di-containers-with-prism).

## Next Steps

- Learn how to [Register Services](registering-types.md) and [Register Pages for Navigation](../navigation/navigation-basics.md)
- Learn how to [Register Platform Specific Services](platform-specific-services.md) ***(Xamarin Specific)***
- Learn how to [Add a Custom Container](add-custom-container.md)
- Learn how to use the [Xamarin.Forms Dependency Resolver with Prism](custom-renderers.md)
- Learn more about the Prism Container Extensions and working with Shiny in the [Appendix](appendix.md)

﻿# Introduction to Prism

Prism is a framework for building loosely coupled, maintainable, and testable XAML applications in WPF, .NET MAUI, Uno Platform and Xamarin Forms. Separate releases are available for each platform and those will be developed on independent timelines. Prism provides an implementation of a collection of design patterns that are helpful in writing well-structured and maintainable XAML applications, including MVVM, dependency injection, commands, EventAggregator, and others. Prism's core functionality is a shared code base in a Cross Compiled .NET Standard and .NET 4.5/4.8 Library. Those things that need to be platform specific are implemented in the respective libraries for the target platform. Prism also provides great integration of these patterns with the target platform. For example, Prism for Xamarin Forms allows you to use an abstraction for navigation that is unit testable, but that layers on top of the platform concepts and APIs for navigation so that you can fully leverage what the platform itself has to offer, but done in the MVVM way.

Prism 9 represents a major leap forward for app developers with a lot of focus having been spent on unifying the API across all platforms. This will unlock many possibilities for developers to move code forward from legacy applications or transition from one app development platform to another maximizing code reuse and eliminating development costs.

## Licensing

Note that the Prism License has changed for Prism 9. In order to help ensure that Prism continues to be a sustainable project Prism 9 and future versions of Prism will ship under a dual Community / Commercial License.

```text
Prism can be licensed either under the Prism Community License or the Prism Commercial license.

To be qualified for the Prism Community License you must have an annual gross revenue of less than one (1) million U.S. dollars ($1,000,000.00 USD) per year or have never received more than $3 million USD in capital from an outside source, such as private equity or venture capital, and agree to be bound by Prism's terms and conditions.

Customers who do not qualify for the community license can visit the Prism Library website (https://prismlibrary.com/) for commercial licensing options.

Under no circumstances can you use this product without (1) either a Community License or a Commercial License and (2) without agreeing and abiding by Prism's license containing all terms and conditions. 

The Prism license that contains the terms and conditions can be found at
https://cdn.prismlibrary.com/downloads/prism_license.pdf
```

[Download the full Prism License](https://cdn.prismlibrary.com/downloads/prism_license.pdf)

### Commercial Plus License

The Commercial Plus license offers a number of additional packages to help developers. At the time of writing the docs this would include:

- Prism.Plugin.Popups (.NET MAUI)
- Prism.Plugin.Essentials - A cross between several Shiny and .NET MAUI Essentials APIs abstracted and supported across all Prism Platforms allowing you to make use of these APIs with the same ViewModel regardless of which platform you are developing with.
- Prism.Magician - A collection of Roslyn Analyzers, Source Generators, and IL Weaving to help you write less code and catch issues in your code quicker
- Support for additional containers
  - Microsoft.Extensions.DependencyInjection
  - Grace Ioc

Additionally Commercial Plus license holders have access to a private Discord group where they can ask questions, help one another and get help directly from the Prism team.

## Migrating from Xamarin.Forms

Xamarin.Forms is End of Life and as such 9.0 will be the last version that supports Xamarin.Forms apps. The Prism team has support for you in your journey whether you are migrating to .NET MAUI or Uno Platform. We have additionally invested time in providing support for your Xamarin.Forms apps with our new Prism Essentials and Prism Logging libraries. This will help to ensure that you have the maximum support while upgrading your Xamarin.Forms app to Prism 9.0 while working to migrate to .NET MAUI or Uno Platform.

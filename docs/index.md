---
sidebar_position: 1
---

# Introduction to Prism

Prism is a framework for building loosely coupled, maintainable, and testable XAML applications in WPF, .NET MAUI, Uno Platform and Avalonia. Separate releases are available for each platform and those will be developed on independent timelines. Prism provides an implementation of a collection of design patterns that are helpful in writing well-structured and maintainable XAML applications, including MVVM, dependency injection, commands, EventAggregator, and others. Prism's core functionality is shared across its platform packages. Supported target frameworks vary by package; use the assets and dependencies of the version installed in your application. Those things that need to be platform specific are implemented in the respective libraries for the target platform. Prism also provides great integration of these patterns with the target platform. For example, Prism for .NET MAUI allows you to use an abstraction for navigation that is unit testable, but that layers on top of the platform concepts and APIs for navigation so that you can fully leverage what the platform itself has to offer, but done in the MVVM way.

Prism 10.0 is the next release line. Its documentation brings together shared application patterns and the host-specific setup needed to use them correctly.

## Build a feature, then compose an application

1. Start with the host setup for [WPF](platforms/wpf/getting-started.md), [.NET MAUI](platforms/maui/index.md), [Uno](platforms/uno/index.md), or [Avalonia](platforms/avalonia/index.md).
2. Connect a view to a [view model](mvvm/viewmodel-locator.md), notify property changes with [BindableBase](mvvm/bindablebase.md), and expose a [command](commands/commanding.md).
3. Put business work behind an injected service and choose its [lifetime](dependency-injection/registering-types.md). Use [async commands](commands/async-commands.md) for cancellable task-based work.
4. Learn the appropriate [navigation model](navigation/index.md). Use [regions](navigation/regions/index.md) to compose independent views, and [dialogs](dialogs/index.md) for a bounded interaction with a result.
5. Split features into [modules](modularity/index.md) when registration and initialization boundaries become useful. Connect independent components with [events](event-aggregator.md) only when a direct service call is not the right relationship.
6. Add [Essentials](plugins/essentials/index.md) capabilities and [logging](plugins/logging/index.md) at the host boundary, then test the real operating system and published configuration.

## Explore reference applications

See Prism in complete workflows with [Calculator, Planner, Sales Desk, Learning Hub, and Mail](samples/index.md). Follow shared business logic into WPF, MAUI, and Uno composition, with clearly labeled runtime images and platform-specific validation boundaries.

## Prism 10.0 vNext and NativeAOT

Prism 10.0 (vNext) is planned as the first NativeAOT-ready Prism release. **Supported NativeAOT applications require `Prism.Container.Microsoft`, available with Commercial Plus.** The container's generated preservation support works with Prism's registrations, navigation, scopes, and statically linked modules.

Start with the [NativeAOT guide](dependency-injection/native-aot.md). It covers container setup, view-model preservation, trimming, serialization, and the separate requirements of WPF, .NET MAUI, Uno Platform, and Avalonia. Framework readiness does not mean every application head or third-party dependency can be published with NativeAOT.

:::caution vNext package readiness
These pages describe the source being prepared for Prism 10.0. The 10.0 package rollout is not complete; do not assume a package exists because the documentation uses the new release name. Earlier 9.1 prerelease source, sample tests and captures remain historical evidence. Follow the [10.0 migration and readiness checklist](migrating-to-10.md), and use the version selector for 9.0 applications.
:::

## Licensing

Note that the Prism License has changed for Prism 9. In order to help ensure that Prism continues to be a sustainable project Prism 9 and future versions of Prism will ship under a dual Community / Commercial License.

:::important License
Use Prism under the applicable Community or Commercial license and its full terms. Eligibility depends on the controlling agreement; a short documentation summary is not a substitute for checking all requirements. Read the [Prism license](https://cdn.prismlibrary.com/downloads/prism_license.pdf) and use the [Prism website](https://prismlibrary.com/) for licensing options or questions.
:::

### Commercial Plus License

The Commercial Plus license offers a number of additional packages to help developers. At the time of writing the docs this would include:

- Prism.Plugin.Popups (.NET MAUI)
- Prism.Plugin.Essentials - Portable application-service abstractions with [MAUI, WPF, and Uno integrations](plugins/essentials/index.md). Capabilities depend on the selected host and operating system.
- Prism.Magician - [Roslyn analyzers, source generators, and code fixes](magician/index.md) for registration and view-model boilerplate
- Support for additional containers
  - Microsoft.Extensions.DependencyInjection, required for supported NativeAOT applications
  - Grace Ioc

Additionally Commercial Plus license holders have access to a private Discord group where they can ask questions, help one another and get help directly from the Prism team.



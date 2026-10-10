---
sidebar_position: 1
description: "Learn Prism 9.0 application patterns and the WPF, .NET MAUI and Uno startup paths."
---

# Introduction to Prism

Prism helps build loosely coupled, maintainable and testable XAML applications. These Prism 9.0 guides cover WPF, .NET MAUI and Uno Platform. Shared features include view-model support, commands, dependency injection, events, modules and region navigation; each host supplies its own startup, controls and lifecycle integration.

Prism 9 unified more navigation and dialog contracts across platforms and moved container abstractions into their own package. Shared interfaces make it easier to reuse view models, but do not make platform views, registration methods or operating-system behavior interchangeable. Use the target frameworks and dependencies of the installed packages rather than assuming one framework matrix applies to every host.

The source references in these guides use the commits recorded by the shipped Prism 9.0.537 and Containers 9.0.114 packages. They describe that release line, without assuming later APIs are available.

## Build a feature, then compose an application

1. Start with [WPF setup](platforms/wpf/getting-started.md), the [.NET MAUI builder](platforms/maui/appbuilder.md), or [Uno setup](platforms/uno/index.md).
2. Connect a view to a [view model](mvvm/viewmodel-locator.md), notify property changes with [BindableBase](mvvm/bindablebase.md), and expose a [command](commands/commanding.md).
3. Put business work behind an injected service and choose its [lifetime](dependency-injection/registering-types.md). Use the [async commands introduced in Prism 9](commands/async-commands.md) for task-returning work.
4. Choose the appropriate [navigation model](navigation/index.md). Use [regions](navigation/regions/index.md) to compose views and [dialogs](dialogs/index.md) for a bounded interaction with a result.
5. Add [modules](modularity/index.md) when feature registration and initialization boundaries become useful. Use [events](event-aggregator.md) when independent components need an in-process notification.
6. Test startup, navigation, cancellation, cleanup and deployment on the actual target platform.

## Licensing

Prism 9 introduced dual Community / Commercial licensing. Use Prism under the applicable license and its full terms. Eligibility depends on the controlling agreement; this documentation is not a substitute for checking all requirements.

See the [license notice shipped with Prism 9.0.537](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/LICENSE), the [full Prism license](https://cdn.prismlibrary.com/downloads/prism_license.pdf), and the [Prism website](https://prismlibrary.com/) for licensing options or questions.

### Commercial Plus License

Additional packages are distributed through the Commercial Plus feed. Availability, entitlement and version compatibility must be checked for the selected package; a shared service abstraction does not imply every native capability exists on every host.

Use the [private-feed setup guide](pipelines/commercial-plus.md) for authenticated restore. Optional areas have their own documentation, including [Essentials](plugins/essentials/index.md), [Popups](plugins/popups.md), [Prism Magician](magician/index.md), and [container adapters](dependency-injection/index.md).

---
sidebar_position: 1
---

# Getting Started

:::note
As a part of the Prism 9.0 initiative, a lot of focus has been given to unifying the Prism API across all of the supported platforms. As a result the Region Abstractions are no longer platform specific. This greatly simplifies what you must learn as you transition from one platform to another. As an added benefit this means that you can now build applications that share ViewModels across WPF, .NET MAUI and Uno Platform.
:::

As the user interacts with a rich client application, its user interface (UI) will be continuously updated to reflect the current task and data that the user is working on. The UI may undergo considerable changes over time as the user interacts with and completes various tasks within the application. The process by which the application coordinates these UI changes is often referred to as *navigation*. This topic describes how to implement navigation for composite Model-View-ViewModel (MVVM) applications using the Prism library.

Frequently, navigation means that certain controls in the UI are removed, while other controls are added. In other cases, navigation may mean that the visual state of one or more existing controls is updated. As an example,as the state of the app changes, some controls may be simply hidden or collapsed, while other controls are shown or expanded. Navigation may also mean that the data being displayed by a control is updated to reflect the current state of the application. For example, in a master-detail scenario, the data displayed in the detail view will be updated based on the currently selected item in the master view. All of these scenarios can be considered navigation because the user interface is updated to reflect the user's current task and the application's current state.

Navigation within an application can result from the user's interaction with the UI (via mouse events or other UI gestures) or from the application itself as a result of internal logic-driven state changes. In some cases, navigation may involve very simple UI updates that require no custom application logic. In other cases, the application may implement complex logic to programmatically control navigation to ensure that certain business rules are enforced—for example, the application may not allow the user to navigate away from a certain form without first ensuring that the data entered is correct.

Implementing the required navigation behavior in a Windows Presentation Foundation (WPF) or UNO application can often be relatively straightforward because it provides direct support for navigation. However, navigation can be more complex to implement in applications that use the Model-View-ViewModel (MVVM) pattern or in composite applications that use multiple loosely-coupled modules. Prism provides guidance on implementing navigation in these situations.

## Navigation in Prism

Navigation is defined as the process by which the application coordinates changes to its UI as a result of the user's interaction with the application or internal application state changes.

| Navigation Type | Description |
|-----------------|-------------|
| State Based     | Navigation accomplished via state changes to existing controls in the visual tree. |
| View Based      | Navigation accomplished via the addition or removal of elements from the visual tree. |

Prism provides guidance on implementing both styles of navigation, focusing on the case where the application is using the Model-View-ViewModel (MVVM) pattern to separate the UI (encapsulated in the view) from the presentation logic and data (encapsulated in the view model).

| Topics                            | Description |
|-----------------------------------|-------------|
| [Basic Region Navigation](basic-region-navigation.md) | Get started with the Prism navigation system. |
| [Confirming Navigation](confirming-navigation.md) | Learn how to allow the user to interact with the navigation system. |
| [Controlling View Lifetime](controlling-view-lifetime.md) | Setup your view to remain in memory even after navigated away from. |
| [Navigate Existing Views](navigation-existing-views.md) | Navigate between active views. |
| [Navigation Journal](navigation-journal.md) | Use the navigation journal to allow the user to navigate from within the view. |
| [Passing Parameters](passing-parameters.md) | Pass data to the view being navigated to. |
| [View and View Model Participation](view-viewmodel-participation.md) | Link your views and view models to the navigation system. |
| [Global Region Observer](../../plugins/regions.md) | Observe and react to Navigation Events globally. |


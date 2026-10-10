---
sidebar_position: 2
description: Find Prism 9 WPF setup, dialogs, composition, and shared MVVM features.
---

# Introduction

This section covers the WPF-specific portions of Prism 9.0.537. Unless there is something WPF specific with respect to the following topics, please refer to them at the following locations:

| Topic | Description |
|-------|-------------|
| [Commanding](../../commands/commanding.md) | Bind actions such as button clicks to your view model |
| [Composite Commands](../../commands/composite-commands.md) | From parent view model, execute commands in child view models |
| [View Model Injection](../../mvvm/viewmodel-locator.md) | Setup Prism to automatically inject your view model based on naming conventions |
| [Event Aggregation](../../event-aggregator.md) | Send messages between components without components knowing about each other |
| [Application Modularity](../../modularity/index.md) | It can be very helpful for testing and maintainability to structure applications in separate pieces without each component being coupled with the others. Prism has some patterns to help with this problem. |

## WPF Specific Topics

### Getting Started

In this document, learn how to get started with Prism by creating an application from scratch.

[Get Started](getting-started.md)

### Presenting Child Windows in MVVM

Learn how to use the Prism dialog service to present dialog windows in an MVVM friendly manner.

[WPF IDialogService](dialog-service.md)


## Platform boundary

WPF uses `System.Windows` controls, a `Window` shell, `DataContext`, and `Prism.Navigation.Regions`. Its Prism XML namespace is `http://prismlibrary.com/`. Do not copy MAUI page navigation or Uno startup signatures into a WPF application. Start with [the Prism 9 setup and package guide](getting-started.md), then use [UI composition](view-composition.md) to grow the application. WPF is not a NativeAOT target.

Source: [WPF application base and shell contract](https://github.com/PrismLibrary/Prism/blob/ec6d1926b4a20540f1dbf2d90b432660670d0c30/src/Wpf/Prism.Wpf/PrismApplicationBase.cs).

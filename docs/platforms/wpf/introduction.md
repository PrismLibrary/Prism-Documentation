---
uid: Platforms.Wpf.Introduction
---

# Introduction

This section contains all of the WPF specific portions of Prism. Unless there is something WPF specific with respect to the following topics, please refer to them at the following locations:

| Topic | Description |
|-------|-------------|
| [Commanding](xref:Commands.Commanding) | Bind actions such as button clicks to your view model |
| [Composite Commands](xref:Commands.CompositeCommands) | From parent view model, execute commands in child view models |
| [View Model Injection](xref:Mvvm.ViewModelLocator) | Setup Prism to automatically inject your view model based on naming conventions |
| [Event Aggregation](xref:Events.EventAggregator) | Send messages between components without components knowing about each other |
| [Application Modularity](../modules.md) | It can be very helpful for testing and maintainability to structure applications in separate pieces without each component being coupled with the others. Prism has some patterns to help with this problem. |

# WPF Specific Topics

## Getting Started

In this document, learn how to get started with Prism by creating an application from scratch.

[Get Started](xref:Platforms.Wpf.GettingStarted)

## Converting from Version 7.x

In this document, learn how to convert an application built using Prism 7.x to 8.x+.

## Converting From Version 6.x

In this document, learn how to convert an application built using Prism 6.x to 7.x+.

[Convert to Version 7.x](./converting-from-6.md)

## Presenting Child Windows in MVVM

Learn how to use the Prism dialog service to present dialog windows in an MVVM friendly manner.

[Prism IDialogService](xref:Dialogs.GettingStarted)

## Prism 6.x

Maintaining a Prism 6.x app with no plans to bring it forward, find documentation here.

[Legacy documentation](legacy/Introduction.md)

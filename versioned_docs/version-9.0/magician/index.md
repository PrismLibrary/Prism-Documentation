---
sidebar_position: 1
uid: Magician.Index
description: Understand historical Prism Magician build tooling and verify package compatibility before using it with Prism 9.
---

# Prism Magician

Prism Magician provides build-time tooling intended to reduce repetitive Prism application and module code. It is available to Commercial Plus subscribers through the [authorized package feed](../pipelines/commercial-plus.md).

:::note Version compatibility
The available historical source does not establish a released Magician package mapped to Prism 9.0. Check your package's dependencies, bundled build tooling, and release guidance before adding or upgrading it. The current Magician documentation describes a different implementation and should not be used as installation instructions for an existing Prism 9 application.
:::

## What the historical tooling does

The historical implementation combines Roslyn code generation with Fody IL weaving. Its documentation describes discovering application views and their view models, producing navigation or dialog registrations, and using registration attributes to compose services from the same assembly. These are build-time operations, so both compiler diagnostics and the resulting application behavior matter when validating a change.

This is not evidence that every historical feature or platform is supported by a particular package used with Prism 9. In particular, a similarly named source branch or matching package name does not establish a compatible release. Do not assume the newer generator-only implementation, C# 14 property syntax, or newer startup APIs apply to the installed package.

## Working with an existing application

1. Identify the Magician package version restored by the project, including centrally managed versions and transitive dependencies.
2. Check its Prism dependencies and the analyzer, build-target, and weaving assets supplied by that exact package. Preserve its required build configuration when moving the application between developer machines and CI.
3. After a package or toolchain change, perform a clean build and inspect build diagnostics. Exercise view-model resolution, navigation, dialogs, and module/service registration that depend on generated or woven code.
4. If compatibility is unclear, keep those registrations explicit using the [container registration APIs](../dependency-injection/registering-types.md), [view-model locator](../mvvm/viewmodel-locator.md), and [dialog registration](../dialogs/index.md) supported by your Prism application.

Magician is optional. Prism's normal registration and MVVM APIs remain available without it. Avoid mixing inferred automatic registrations with explicit registrations for the same type until you understand which implementation and ordering your application actually uses.

## Historical source reference

The source below is a November 2023 development snapshot, not a verified Prism 9.0 package release. Its package project still describes Prism 8 and bundles both Roslyn and Fody tooling. Access requires permission to the private Prism.Magician repository.

- [Historical feature description](https://github.com/PrismLibrary/Prism.Magician/blob/a2b1c5c668d37c9b9ce9cb13f6912b69483d2e2f/ReadMe.md)
- [Package build and tooling assets](https://github.com/PrismLibrary/Prism.Magician/blob/a2b1c5c668d37c9b9ce9cb13f6912b69483d2e2f/src/Prism.Magician/Prism.Magician.csproj)

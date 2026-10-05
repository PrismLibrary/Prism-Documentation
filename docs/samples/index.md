---
sidebar_position: 1
title: Reference applications
---

# Build an application, then follow the decisions

These five reference applications show how Prism fits into everyday product work: calculating a result, planning a project, editing a quote, saving a read, or composing a message. Each has a UI-free application layer and separate WPF, .NET MAUI, and Uno Platform heads.

The walkthroughs connect visible behavior to the source that owns it. Start with one workflow, then compare how the three heads present the same application rules.

## Choose a starting point

| Application | Try it for | Follow the engineering story |
| --- | --- | --- |
| [Calculator](calculator.md) | Decimal calculations, history, and unit conversion | A shared session, adaptive regions, command state, and an independent feature module |
| [Planner](planner.md) | Projects, task editing, and personal notes | Dependent modules, validated dialogs, durable snapshots, and coordinated dirty-close decisions |
| [Sales Desk](sales-desk.md) | Customers, products, and several editable quotes | Document identity, optimistic revisions, reusable selectors, and atomic multi-document saves |
| [Learning Hub](learning-hub.md) | Offline essays, bookmarks, collections, and reading progress | Cancellable discovery, persistent reading state, original artwork, and adaptive reading layouts |
| [Mail](mail.md) | A fictional inbox, contacts, calendar, and drafts | Account boundaries, on-demand modules, typed public configuration, and cautious provider integration |

Calculator, Planner, Sales Desk, and Learning Hub are in the reviewed samples `master` tree. Mail is an **unmerged review sample**; its page links to the reviewed branch and identifies the remaining provider limitations. Source links require access to the [Prism samples repository](https://github.com/PrismLibrary/samples).

## What is shared, and what belongs to a head?

`Shared` projects are ordinary .NET libraries. They contain domain models, application services, Prism commands, view models, and logical navigation contracts. They do not reference WPF, MAUI, Uno controls, or platform target frameworks.

Each head owns its XAML, resources, view/view-model registrations, startup, dialogs, and navigation adapter. A shared view model requests a logical route such as `Planner.Tasks`; it never needs the native view's type or name. The same module relationship is declared separately in each host's `PrismStartup`.

| Presentation head | Developer focus |
| --- | --- |
| WPF | A desktop shell with named regions, keyboard-accessible commands, native dialog windows, and explicit window lifetime. Runtime test renders exercise the real WPF control tree. |
| .NET MAUI | Builder composition with an explicit Microsoft container, a registered shell page, page/region lifetime, touch-sized controls, and compact versus wide native views. Windows build or composition results do not qualify Android interactions. |
| Uno Platform | A Prism application and Uno-native XAML with head-specific resources, compiled bindings where declared, and separate Desktop, BrowserWasm, Android, and WinUI targets. One successful head does not qualify the others. |

The applications use explicit Prism registrations. They demonstrate Essentials storage and platform boundaries where the feature needs them; they are not demonstrations of every plugin or of Magician-generated startup.

## Run from the existing repository

Start with the [repository setup and templates](https://github.com/PrismLibrary/samples/blob/88efab29a85f986877ec4cff7bc37770c0d4327b/README.md). Keep its root build properties, central package versions, Uno SDK selection, and authorized feed configuration. The reference applications use the Microsoft container and Essentials packages from Commercial Plus.

- Select the application's WPF, MAUI, or Uno solution from its README.
- Install/use the workload and native toolchain for the selected target.
- Use the root `DotNetVersion` property with a matching target framework rather than adding a sample-specific SDK lock or package-version override.
- Run the portable tests separately from native-head builds and actual UI workflows.
- Use the [Hello World platform templates](https://github.com/PrismLibrary/samples/tree/88efab29a85f986877ec4cff7bc37770c0d4327b/sample-template) when you want a minimal starting point rather than a complete reference application. The templates' container choice is separate from these apps' explicit Microsoft-container composition.

## Read the evidence accurately

The images currently shown are **real WPF application renders made by the native test host**, with synthetic or app-owned data. They are labeled by platform and source checkpoint. They are not design mockups, operating-system screenshots, Android screenshots, or evidence of an Uno browser run.

See [runtime capture coverage](runtime-coverage.md) for the exact image provenance and the separate Windows, Android-emulator, Uno browser, and Linux-desktop capture status. iOS and macOS captures are deferred. Native test automation, OS input, screen-reader testing, and deployment qualification remain different forms of evidence.

## NativeAOT and production boundaries

All five applications select the Microsoft container. Generated JSON metadata and statically visible registrations are useful prerequisites; they do not establish a NativeAOT release for every head. None of these walkthroughs claims a qualified NativeAOT UI deployment. WPF is not a NativeAOT target. Follow the [Prism 9.1 NativeAOT guide](../dependency-injection/native-aot.md) for supported container, framework, and publish/run requirements.

The samples do not depend on the unmerged DeviceDisplay or new files/camera/share work, and they do not hide the persisted background-task metadata limitation by enabling reflection. Logging should likewise be judged by actual registration and emitted diagnostics: the reviewed baseline does **not** yet demonstrate a Prism Logging pipeline in these five applications.

---
sidebar_position: 1
title: Sample Applications
sidebar_label: Overview
---

# Sample Applications

These five reference applications show how Prism fits into everyday product work: calculating a result, planning a project, editing a quote, saving a read, or composing a message. Each has a UI-free application layer and separate WPF, .NET MAUI, and Uno Platform heads.

Choose an app, then select WPF, .NET MAUI, Uno, or Avalonia. Each framework tab contains its own screenshots, setup, source patterns, and walkthrough. Your framework choice follows you between pages; Avalonia is clearly marked Coming soon.

## Choose a starting point

| Application | Try it for | Follow the engineering story |
| --- | --- | --- |
| [Calculator](calculator.md) | Decimal calculations, history, and unit conversion | A shared session, adaptive regions, command state, and an independent feature module |
| [Planner](planner.md) | Projects, task editing, and personal notes | Dependent modules, validated dialogs, durable snapshots, and coordinated dirty-close decisions |
| [Sales Desk](sales-desk.md) | Customers, products, and several editable quotes | Document identity, optimistic revisions, reusable selectors, and atomic multi-document saves |
| [Learning Hub](learning-hub.md) | Offline essays, bookmarks, collections, and reading progress | Cancellable discovery, persistent reading state, original artwork, and adaptive reading layouts |
| [Mail](mail.md) | A fictional inbox, contacts, calendar, and drafts | Account boundaries, on-demand modules, typed public configuration, and cautious provider integration |

All five applications are in the reviewed samples `master` tree at `02f8e351`, including workflow logging, visual polish, Mail MAUI startup/dialog repairs, Calendar range handling and Uno Android Accounts navigation. Mail still has the functional and provider limitations identified in its walkthrough. Source links require access to the [Prism samples repository](https://github.com/PrismLibrary/samples).

## Suggested learning path

1. **[Calculator](calculator.md): commands and state.** Follow one calculation through the evaluator, session, history dialog, and independent conversion module.
2. **[Planner](planner.md): edits and persistence.** Trace validation, a proposed snapshot, save failure, undo, and coordinated close decisions.
3. **[Learning Hub](learning-hub.md): asynchronous presentation.** Follow search cancellation into saved reading progress and a collection dialog.
4. **[Sales Desk](sales-desk.md): document identity.** Open independent revisions of the same quote and trace conflict/replay behavior through an atomic commit.
5. **[Prism Mail](mail.md): account and provider boundaries.** Start offline, then inspect typed public configuration, secure storage, session changes, and uncertain submission outcomes.

Within each app, choose your framework, try the four-step workflow, then expand the startup/module code and storage/diagnostics notes. Each step links to the concrete source that owns the behavior.

## Shared logic, native presentation

`Shared` projects are ordinary .NET libraries. They contain domain models, application services, Prism commands, view models, and logical navigation contracts. They do not reference WPF, MAUI, Uno controls, or platform target frameworks.

Each head owns its XAML, resources, view/view-model registrations, startup, dialogs, and navigation adapter. A shared view model requests a logical route such as `Planner.Tasks`; it never needs the native view's type or name. The same module relationship is declared separately in each host's `PrismStartup`.

The head-specific stories live in each app's framework tabs. The apps use explicit Prism registrations, UI-free shared view models, Essentials where a feature needs platform services, and typed local Logging. They do not demonstrate every plugin or Magician-generated startup.

## Run from the existing repository

Start with the [repository setup and templates](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/README.md). Keep its root build properties, central package versions, Uno SDK selection, and authorized feed configuration. The reference applications use the Microsoft container and Essentials packages from Commercial Plus.

- Select the application's WPF, MAUI, or Uno solution from its README.
- Install/use the workload and native toolchain for the selected target.
- Use the root `DotNetVersion` property with a matching target framework rather than adding a sample-specific SDK lock or package-version override.
- Run the portable tests separately from native-head builds and actual UI workflows.
- Use the [Hello World platform templates](https://github.com/PrismLibrary/samples/tree/02f8e351ff20356e0ff2cc656f8bb201f65fff97/sample-template) when you want a minimal starting point rather than a complete reference application. The templates' container choice is separate from these apps' explicit Microsoft-container composition.

## Diagnose real workflows with Prism Logging

The five apps log real persistence and session outcomes through a filtered local Prism provider. Open the details for the operation map, privacy rules, and source links.

<details>
<summary>Workflow diagnostics and privacy</summary>


All five apps inject Prism's `ILogger<T>` into their shared application services. Every WPF, MAUI, and Uno composition root registers the same filtered, local console output before application services. The logging describes useful boundaries rather than merely proving that a package can be resolved:

| Application | Recorded workflow |
| --- | --- |
| Calculator | History restore/save/clear, preference saves, and protected-store skips |
| Planner | Loading, task save/delete/undo, project and note saves, cancellation, and retry outcomes |
| Sales Desk | Quote load/commit, idempotent replay, rejected stale revisions, and cancelled writes |
| Learning Hub | Library restore/save, bookmarks, reading progress, and collection changes |
| Mail | Account changes, mail/contact/calendar operations, drafts, and send-submission outcomes |

The sample's own registration helper is [RegisterSampleLogging](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/shared/Logging/LocalLoggingRegistration.cs). For example, each Planner head calls:

```csharp
using PrismSamples.Diagnostics;

registry.RegisterSampleLogging("PrismPlanner");
```

This is a source-linked sample helper, not an additional Prism API. It composes Prism's aggregate logger with `LocalLogProvider`; `ConsoleLoggingService` is that provider's private output dependency. Typed loggers receive provider scopes, so the provider registrations remain transient. Register the helper once per application container; repeated registration on that container is ignored.

### Keep diagnostics useful without copying application data

[WorkflowLog.Record](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/shared/Logging/WorkflowLog.cs) accepts fixed operation/outcome categories and an optional exception. The [output filter](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/shared/Logging/LocalLogProvider.cs) also covers messages, scopes, analytics, exception reporting, and Essentials' automatic error forwarding. Only the fixed application name, allowlisted categories, and bounded error-type names reach local output. Expressions, task notes, customer/quote content, mail addresses/bodies, contacts, appointments, tokens, arbitrary messages, exception text/stacks, and caller paths are discarded.

Do not add a raw `AddConsole` or remote provider alongside this filter and assume the policy still holds: that creates a second output path. These samples configure no network logging destination, credentials, persistent log file, or user identity. Capture standard output through the IDE or launch tool; a GUI launch without a captured stream may show no diagnostics. This is developer diagnostics, not a durable audit trail.

Outcomes are recorded at the operation boundary. A failed save stays failed, cancellation remains distinct, and a later retry has its own outcome. Mail's uncertain send stays `Uncertain`; logging neither retransmits it nor claims a definite delivery result. See the [shared diagnostics guide](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/shared/Logging/README.md) for privacy tests and extension rules.

</details>

## Read the evidence accurately

The galleries contain **63 untouched images**: 32 real WPF application-owned test renders and 31 actual Android emulator captures. Each framework tab shows only its own evidence, with device and screen pickers limited to captured combinations. The Android scenes cover all five applications, with explicit limits such as Planner MAUI launch-only coverage and incomplete Sales Desk MAUI quote editing. Source checkpoints remain attached to each image; a newer source walkthrough does not upgrade older runtime evidence.

See [runtime capture coverage](runtime-coverage.md) for the exact image provenance and the separate Windows, Android-emulator, Uno browser, and Linux-desktop capture status. iOS and macOS captures are deferred. Native test automation, OS input, screen-reader testing, and deployment qualification remain different forms of evidence.

## NativeAOT and production boundaries

All five applications select the Microsoft container. Generated JSON metadata and statically visible registrations are useful prerequisites; they do not establish a NativeAOT release for every head. None of these walkthroughs claims a qualified NativeAOT UI deployment. WPF is not a NativeAOT target. Follow the [Prism 10.0 NativeAOT guide](../dependency-injection/native-aot.md) for supported container, framework, and publish/run requirements.

The samples do not depend on the unmerged DeviceDisplay or new files/camera/share work, and they do not hide the persisted background-task metadata limitation by enabling reflection. The earlier Logging qualification and newer Android workflow captures are separate evidence at their recorded revisions. Neither establishes browser, Apple, or NativeAOT qualification.

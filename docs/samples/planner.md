---
sidebar_position: 3
title: Planner
hide_table_of_contents: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SampleGallery from '@site/src/components/SampleGallery';
import {sampleCaptures} from '@site/src/data/sampleCaptures';

# Planner

Plan a project, edit tasks, and keep personal notes. Follow a local-first workspace through validation, cancelled edits, failed saves, and coordinated dirty-close decisions.

PlanningBoard depends on ProjectCatalog; PersonalNotes is independent. Shared transactions and logical routes remain separate from native views and dialog hosts.

Choose your framework. Source links require access to the private [samples repository](https://github.com/PrismLibrary/samples). The source walkthrough follows merged checkpoint `02f8e351`; every image retains its own captured revision.

<Tabs groupId="platform" queryString="platform" defaultValue="wpf" className="sample-platform-tabs" lazy>

<TabItem value="wpf" label="WPF">

### WPF experience

The desktop shell combines project, board, and detail regions. Keyboard commands and the window-close path are owned by the WPF head.

<SampleGallery label="Planner WPF" captures={sampleCaptures["planner"].wpf} />

The original WPF workflows remain at `7ffdd4c7`. A separate `75b63e8d` render shows the improved Dark task editor with readable fields and both actions fully visible. Each image keeps its own source and [capture provenance](runtime-coverage.md).

### Set up and run {#wpf-run}

Run from the repository root using its existing package versions, entitled [Commercial Plus feed](../pipelines/commercial-plus.md), and the matching SDK/workloads.

On Windows:

```sh
dotnet run --project samples/prism-planner/WPF/PrismPlanner.Wpf/PrismPlanner.Wpf.csproj
```

### Guided walkthrough {#wpf-walkthrough}

1. **Open Notes first, then return Home and open Planner.** PersonalNotes initializes alone; Planner loads ProjectCatalog before PlanningBoard. Read the [on-demand composition](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-planner/WPF/PrismPlanner.Wpf/PrismStartup.cs).

2. **Edit a task, including its date, stage, priority, and tags.** Invalid values keep the editor open; a dirty Cancel offers Keep editing or Discard. Read the [validated dialog result](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-planner/Shared/PlanningBoard/ViewModels/EditTaskViewModel.cs).

3. **Delete a task with confirmation, then undo it.** The proposed snapshot is persisted before the visible workspace changes. Read the [transaction boundary](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-planner/Shared/Storage/Services/PlannerWorkspace.cs).

4. **Make more than one document dirty and attempt closure.** Cancelling a later decision must preserve earlier documents. Read the [close-all coordination](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-planner/Shared/Editing/CloseAllCoordinator.cs).

<details>
<summary>Trace the WPF startup and module code</summary>


The [WPF App class](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-planner/WPF/PrismPlanner.Wpf/App.xaml.cs) owns native startup and shell creation. Excerpt (retain its remaining lifecycle methods):

```csharp
protected override IContainerExtension CreateContainerExtension()
    => new MicrosoftContainerExtension();

protected override Window CreateShell()
    => Container.Resolve<MainWindow>();

protected override void RegisterTypes(IContainerRegistry registry)
    => PrismStartup.RegisterTypes(registry);
```

The head's [PrismStartup](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-planner/WPF/PrismPlanner.Wpf/PrismStartup.cs) registers the real on-demand graph:

```csharp
catalog.AddModule<ProjectCatalogModule>(PlannerModules.ProjectCatalog, InitializationMode.OnDemand);
catalog.AddModule<PlanningBoardModule>(PlannerModules.PlanningBoard, InitializationMode.OnDemand, PlannerModules.ProjectCatalog);
catalog.AddModule<PersonalNotesModule>(PlannerModules.PersonalNotes, InitializationMode.OnDemand);
```


Follow [the shared application rules](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-planner/Shared/Storage/Services/PlannerWorkspace.cs) next, then the head's feature view registrations. Shared view models request logical routes; only the head references native view types. The loader checks dependency completion before navigation and does not claim to repair every module-manager failure mode.

</details>

<details>
<summary>Essentials, persistence, and private-by-default diagnostics</summary>


Each head registers PlannerJsonContext, the generated IPlannerPreferences store, and Essentials IFileSystem. Tasks use atomic, versioned AppData snapshots; small preferences use the settings contract. WPF sets a stable application identity before store registration.


PlannerWorkspace receives `ILogger<PlannerWorkspace>`. Load, task save/delete/undo, project/note saves, cancelled work, and retries have distinct outcomes. Titles, notes, and project data are excluded.


The filtered Prism Console provider also covers Essentials error forwarding. Only fixed operation/outcome categories and bounded error types reach local standard output. No remote provider, credentials, persistent log file, or user identity is configured. See [the diagnostics guide](index.md#diagnose-real-workflows-with-prism-logging).

</details>

### Validation and limits {#wpf-validation}

Native WPF workflows exercise actual containers, modules, bound controls, and dialogs. The images are live app-owned test renders, not OS screenshots or assistive-technology certification. WPF is not a NativeAOT target. Check [the sample README](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-planner/README.md), [capture provenance](runtime-coverage.md), and [Prism 10.0 NativeAOT requirements](../dependency-injection/native-aot.md) before extending the sample.

</TabItem>

<TabItem value="maui" label=".NET MAUI">

### .NET MAUI experience

The registered shell page contains native regions; reusable editors use Prism’s built-in MAUI dialog container and shared validation.

<SampleGallery label="Planner .NET MAUI" captures={sampleCaptures["planner"].maui} />

The Android capture at `8093ba7d` establishes the branded home only. Opening Planner failed to create `Planner.Projects`, and opening Notes raised a XAML namespace error. The source walkthrough below explains the intended composition; that Android checkpoint does not complete the journey. No newer Planner MAUI runtime repair is established by the supplied evidence.

### Set up and run {#maui-run}

Run from the repository root using its existing package versions, entitled [Commercial Plus feed](../pipelines/commercial-plus.md), and the matching SDK/workloads.

Build the Android head with the installed Android SDK/JDK and MAUI workload:

```sh
dotnet build samples/prism-planner/Maui/PrismPlanner.Maui/PrismPlanner.Maui.csproj -p:TargetFrameworks=net10.0-android
```

Open [this MAUI project](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-planner/Maui/PrismPlanner.Maui/PrismPlanner.Maui.csproj) in your IDE, select an Android emulator/device, and run it. On Windows, select the Windows target instead.

<details>
<summary>Windows build command</summary>

```sh
dotnet build samples/prism-planner/Maui/PrismPlanner.Maui/PrismPlanner.Maui.csproj -p:TargetFrameworks=net10.0-windows10.0.19041.0
```

</details>

### Guided walkthrough {#maui-walkthrough}

1. **Open Notes first, then return Home and open Planner.** PersonalNotes initializes alone; Planner loads ProjectCatalog before PlanningBoard. Read the [on-demand composition](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-planner/Maui/PrismPlanner.Maui/PrismStartup.cs).

2. **Edit a task, including its date, stage, priority, and tags.** Invalid values keep the editor open; a dirty Cancel offers Keep editing or Discard. Read the [validated dialog result](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-planner/Shared/PlanningBoard/ViewModels/EditTaskViewModel.cs).

3. **Delete a task with confirmation, then undo it.** The proposed snapshot is persisted before the visible workspace changes. Read the [transaction boundary](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-planner/Shared/Storage/Services/PlannerWorkspace.cs).

4. **Make more than one document dirty and attempt closure.** Cancelling a later decision must preserve earlier documents. Read the [close-all coordination](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-planner/Shared/Editing/CloseAllCoordinator.cs).

<details>
<summary>Trace the .NET MAUI startup and module code</summary>


The [MAUI composition root](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-planner/Maui/PrismPlanner.Maui/MauiProgram.cs) selects the Microsoft container and the logical shell route. Excerpt (retain the rest of the app's startup):

```csharp
builder.UseMauiApp<App>()
    .UsePrism(new MicrosoftContainerExtension(), PrismStartup.Configure);
```

The head's [PrismStartup](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-planner/Maui/PrismPlanner.Maui/PrismStartup.cs) registers the real on-demand graph:

```csharp
catalog.AddModule<ProjectCatalogModule>(PlannerModules.ProjectCatalog, InitializationMode.OnDemand);
catalog.AddModule<PlanningBoardModule>(PlannerModules.PlanningBoard, InitializationMode.OnDemand, PlannerModules.ProjectCatalog);
catalog.AddModule<PersonalNotesModule>(PlannerModules.PersonalNotes, InitializationMode.OnDemand);
```


Follow [the shared application rules](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-planner/Shared/Storage/Services/PlannerWorkspace.cs) next, then the head's feature view registrations. Shared view models request logical routes; only the head references native view types. The loader checks dependency completion before navigation and does not claim to repair every module-manager failure mode.

</details>

<details>
<summary>Essentials, persistence, and private-by-default diagnostics</summary>


Each head registers PlannerJsonContext, the generated IPlannerPreferences store, and Essentials IFileSystem. Tasks use atomic, versioned AppData snapshots; small preferences use the settings contract. WPF sets a stable application identity before store registration.


PlannerWorkspace receives `ILogger<PlannerWorkspace>`. Load, task save/delete/undo, project/note saves, cancelled work, and retries have distinct outcomes. Titles, notes, and project data are excluded.


The filtered Prism Console provider also covers Essentials error forwarding. Only fixed operation/outcome categories and bounded error types reach local standard output. No remote provider, credentials, persistent log file, or user identity is configured. See [the diagnostics guide](index.md#diagnose-real-workflows-with-prism-logging).

</details>

### Validation and limits {#maui-validation}

Selected MAUI Windows builds passed; the Android runtime scope and remaining limitations are described above. Build success does not complete an interactive journey. iOS/Mac Catalyst work is deferred; no all-head NativeAOT qualification is claimed. Check [the sample README](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-planner/README.md), [capture provenance](runtime-coverage.md), and [Prism 10.0 NativeAOT requirements](../dependency-injection/native-aot.md) before extending the sample.

</TabItem>

<TabItem value="uno-platform" label="Uno">

### Uno experience

The Uno head owns its XAML, resource states, and region adapter. Task selection and durable state remain in shared services when layout changes.

<SampleGallery label="Planner Uno" captures={sampleCaptures["planner"].uno} />

Actual Android captures at `8093ba7d` show a new task increasing the board count to four and a personal note saved on the device. The task editor action was partly clipped but tappable, and the attempted Dark capture remained Light. This is useful local-save evidence with remaining layout/theme work, not a full acceptance pass.

### Set up and run {#uno-run}

Run from the repository root using its existing package versions, entitled [Commercial Plus feed](../pipelines/commercial-plus.md), and the matching SDK/workloads.

Select the Desktop target on a supported desktop host:

```sh
dotnet run --project samples/prism-planner/Uno/PrismPlanner.Uno/PrismPlanner.Uno.csproj -f net10.0-desktop -p:TargetFrameworks=net10.0-desktop --launch-profile "PrismPlanner.Uno (Desktop)"
```

<details>
<summary>Run the browser target</summary>

With the matching WebAssembly workload, select the separately declared browser head:

```sh
dotnet run --project samples/prism-planner/Uno/PrismPlanner.Uno/PrismPlanner.Uno.csproj -f net10.0-browserwasm -p:TargetFrameworks=net10.0-browserwasm -p:TargetFramework=net10.0-browserwasm --launch-profile "PrismPlanner.Uno (WebAssembly)"
```

These are source-backed target-selection commands, not a claim that a new browser run was completed for this walkthrough.

</details>

### Guided walkthrough {#uno-walkthrough}

1. **Open Notes first, then return Home and open Planner.** PersonalNotes initializes alone; Planner loads ProjectCatalog before PlanningBoard. Read the [on-demand composition](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-planner/Uno/PrismPlanner.Uno/PrismStartup.cs).

2. **Edit a task, including its date, stage, priority, and tags.** Invalid values keep the editor open; a dirty Cancel offers Keep editing or Discard. Read the [validated dialog result](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-planner/Shared/PlanningBoard/ViewModels/EditTaskViewModel.cs).

3. **Delete a task with confirmation, then undo it.** The proposed snapshot is persisted before the visible workspace changes. Read the [transaction boundary](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-planner/Shared/Storage/Services/PlannerWorkspace.cs).

4. **Make more than one document dirty and attempt closure.** Cancelling a later decision must preserve earlier documents. Read the [close-all coordination](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-planner/Shared/Editing/CloseAllCoordinator.cs).

<details>
<summary>Trace the Uno startup and module code</summary>


The [Uno App class](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-planner/Uno/PrismPlanner.Uno/App.xaml.cs) owns native startup and shell creation. Excerpt (retain its remaining lifecycle methods):

```csharp
protected override IContainerExtension CreateContainerExtension()
    => new MicrosoftContainerExtension();

protected override UIElement CreateShell()
    => Container.Resolve<MainPage>();

protected override void RegisterTypes(IContainerRegistry registry)
    => PrismStartup.RegisterTypes(registry);
```

The head's [PrismStartup](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-planner/Uno/PrismPlanner.Uno/PrismStartup.cs) registers the real on-demand graph:

```csharp
catalog.AddModule<ProjectCatalogModule>(PlannerModules.ProjectCatalog, InitializationMode.OnDemand);
catalog.AddModule<PlanningBoardModule>(PlannerModules.PlanningBoard, InitializationMode.OnDemand, PlannerModules.ProjectCatalog);
catalog.AddModule<PersonalNotesModule>(PlannerModules.PersonalNotes, InitializationMode.OnDemand);
```


Follow [the shared application rules](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-planner/Shared/Storage/Services/PlannerWorkspace.cs) next, then the head's feature view registrations. Shared view models request logical routes; only the head references native view types. The loader checks dependency completion before navigation and does not claim to repair every module-manager failure mode.

</details>

<details>
<summary>Essentials, persistence, and private-by-default diagnostics</summary>


Each head registers PlannerJsonContext, the generated IPlannerPreferences store, and Essentials IFileSystem. Tasks use atomic, versioned AppData snapshots; small preferences use the settings contract. WPF sets a stable application identity before store registration.


PlannerWorkspace receives `ILogger<PlannerWorkspace>`. Load, task save/delete/undo, project/note saves, cancelled work, and retries have distinct outcomes. Titles, notes, and project data are excluded.


The filtered Prism Console provider also covers Essentials error forwarding. Only fixed operation/outcome categories and bounded error types reach local standard output. No remote provider, credentials, persistent log file, or user identity is configured. See [the diagnostics guide](index.md#diagnose-real-workflows-with-prism-logging).

</details>

### Validation and limits {#uno-validation}

Selected Uno Windows builds passed. Android, Desktop, browser, and Apple retain their own runtime boundaries; iOS/macOS capture work is deferred. WebAssembly AOT and desktop NativeAOT are different deployment paths. Check [the sample README](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-planner/README.md), [capture provenance](runtime-coverage.md), and [Prism 10.0 NativeAOT requirements](../dependency-injection/native-aot.md) before extending the sample.

</TabItem>

<TabItem value="avalonia" label="Avalonia">

### Coming soon

Planner does not yet have an Avalonia application head, runnable walkthrough, or captured UI. Prism supports Avalonia APIs; this particular sample head and its Essentials integration are still to come.

Continue with one of the available framework tabs, or explore the [Avalonia starter template](https://github.com/PrismLibrary/samples/tree/02f8e351ff20356e0ff2cc656f8bb201f65fff97/sample-template/Avalonia).

</TabItem>

</Tabs>

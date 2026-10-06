---
sidebar_position: 5
title: Learning Hub
hide_table_of_contents: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SampleGallery from '@site/src/components/SampleGallery';
import {sampleCaptures} from '@site/src/data/sampleCaptures';

# Learning Hub

Discover an original offline essay, bookmark it, organize a collection, and resume reading. Twelve essays and five original illustrations make this a complete reading experience without accounts or video services.

Collections depends on ContentCatalog; ReadingTools is independent. Shared cancellation and a durable LearningSession keep search, progress, and preferences independent of transient native views.

Choose your framework. Source links require access to the private [samples repository](https://github.com/PrismLibrary/samples).

<Tabs groupId="platform" queryString="platform" defaultValue="wpf" className="sample-platform-tabs" lazy>

<TabItem value="wpf" label="WPF">

### WPF experience

The root region hosts discovery and reading views; a native dialog window edits collections. Bounded virtualizing lists, focus, image decoding, and large-text scrolling have native test coverage.

<SampleGallery label="Learning Hub WPF" captures={sampleCaptures["learning-hub"].wpf} />

Original WPF application-owned runtime renders; source and capture method are recorded in the gallery and [runtime coverage](runtime-coverage.md).

### Set up and run {#wpf-run}

Run from the repository root using its existing package versions, entitled [Commercial Plus feed](../pipelines/commercial-plus.md), and the matching SDK/workloads.

On Windows:

```sh
dotnet run --project samples/prism-learning-hub/WPF/PrismLearningHub.Wpf/PrismLearningHub.Wpf.csproj
```

### Guided walkthrough {#wpf-walkthrough}

1. **Search by text and topic, cancel, and clear the query.** Only the newest live search can publish results, errors, or busy state. Read the [request ownership](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-learning-hub/Shared/ContentCatalog/ViewModels/CatalogViewModel.cs).

2. **Open an essay, advance a section, and return to the catalog.** The next visit restores progress after the save has succeeded. Read the [reading-state persistence](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-learning-hub/Shared/Settings/Services/LearningSession.cs).

3. **Create a collection, add the read, and rename the selected collection.** Selection survives the update; dirty cancellation preserves the editor draft. Read the [collection state](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-learning-hub/Shared/Collections/ViewModels/CollectionsViewModel.cs).

4. **Open Reading tools first in a fresh session and change text size or theme.** The independent module loads without ContentCatalog; the head adapts its native presentation. Read the [module catalog](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-learning-hub/WPF/PrismLearningHub.Wpf/PrismStartup.cs).

<details>
<summary>Trace the WPF startup and module code</summary>


The [WPF App class](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-learning-hub/WPF/PrismLearningHub.Wpf/App.xaml.cs) owns native startup and shell creation. Excerpt (retain its remaining lifecycle methods):

```csharp
protected override IContainerExtension CreateContainerExtension()
    => new MicrosoftContainerExtension();

protected override Window CreateShell()
    => Container.Resolve<ShellWindow>();

protected override void RegisterTypes(IContainerRegistry registry)
    => PrismStartup.RegisterTypes(registry);
```

The head's [PrismStartup](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-learning-hub/WPF/PrismLearningHub.Wpf/PrismStartup.cs) registers the real on-demand graph:

```csharp
catalog.AddModule<ContentCatalogModule>(LearningModules.ContentCatalog, InitializationMode.OnDemand);
catalog.AddModule<CollectionsModule>(LearningModules.Collections, InitializationMode.OnDemand, LearningModules.ContentCatalog);
catalog.AddModule<ReadingToolsModule>(LearningModules.ReadingTools, InitializationMode.OnDemand);
```


Follow [the shared application rules](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-learning-hub/Shared/Settings/Services/LearningSession.cs) next, then the head's feature view registrations. Shared view models request logical routes; only the head references native view types. The loader checks dependency completion before navigation and does not claim to repair every module-manager failure mode.

</details>

<details>
<summary>Essentials, persistence, and private-by-default diagnostics</summary>


LearningStore writes a versioned generated-JSON snapshot through Essentials settings. A failed write retains previous state; unreadable or unsupported data pauses writes. Original bundled artwork has bounded raster derivatives, with titles retained if an image fails.


LearningSession receives `ILogger<LearningSession>` and records restore/save, bookmarks, progress, and collection changes at the persistence boundary. Collection names, essay selections, and state values are excluded.


The filtered Prism Console provider also covers Essentials error forwarding. Only fixed operation/outcome categories and bounded error types reach local standard output. No remote provider, credentials, persistent log file, or user identity is configured. See [the diagnostics guide](index.md#diagnose-real-workflows-with-prism-logging).

</details>

### Validation and limits {#wpf-validation}

Native WPF workflows exercise actual containers, modules, bound controls, and dialogs. The images are live app-owned test renders, not OS screenshots or assistive-technology certification. WPF is not a NativeAOT target. Check [the sample README](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-learning-hub/README.md), [capture provenance](runtime-coverage.md), and [Prism 10.0 NativeAOT requirements](../dependency-injection/native-aot.md) before extending the sample.

</TabItem>

<TabItem value="maui" label=".NET MAUI">

### .NET MAUI experience

A shell page and touch-friendly region views present the same catalog and reading session. Native layout, font sizing, and appearance stay in this head.

<SampleGallery label="Learning Hub .NET MAUI" captures={sampleCaptures["learning-hub"].maui} />

.NET MAUI runtime captures are pending. Windows builds are verified; Android and other native journeys need their own capture and interaction evidence.

### Set up and run {#maui-run}

Run from the repository root using its existing package versions, entitled [Commercial Plus feed](../pipelines/commercial-plus.md), and the matching SDK/workloads.

Build the Android head with the installed Android SDK/JDK and MAUI workload:

```sh
dotnet build samples/prism-learning-hub/Maui/PrismLearningHub.Maui/PrismLearningHub.Maui.csproj -p:TargetFrameworks=net10.0-android
```

Open [this MAUI project](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-learning-hub/Maui/PrismLearningHub.Maui/PrismLearningHub.Maui.csproj) in your IDE, select an Android emulator/device, and run it. On Windows, select the Windows target instead.

<details>
<summary>Windows build command</summary>

```sh
dotnet build samples/prism-learning-hub/Maui/PrismLearningHub.Maui/PrismLearningHub.Maui.csproj -p:TargetFrameworks=net10.0-windows10.0.19041.0
```

</details>

### Guided walkthrough {#maui-walkthrough}

1. **Search by text and topic, cancel, and clear the query.** Only the newest live search can publish results, errors, or busy state. Read the [request ownership](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-learning-hub/Shared/ContentCatalog/ViewModels/CatalogViewModel.cs).

2. **Open an essay, advance a section, and return to the catalog.** The next visit restores progress after the save has succeeded. Read the [reading-state persistence](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-learning-hub/Shared/Settings/Services/LearningSession.cs).

3. **Create a collection, add the read, and rename the selected collection.** Selection survives the update; dirty cancellation preserves the editor draft. Read the [collection state](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-learning-hub/Shared/Collections/ViewModels/CollectionsViewModel.cs).

4. **Open Reading tools first in a fresh session and change text size or theme.** The independent module loads without ContentCatalog; the head adapts its native presentation. Read the [module catalog](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-learning-hub/Maui/PrismLearningHub.Maui/PrismStartup.cs).

<details>
<summary>Trace the .NET MAUI startup and module code</summary>


The [MAUI composition root](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-learning-hub/Maui/PrismLearningHub.Maui/MauiProgram.cs) selects the Microsoft container and the logical shell route. Excerpt (retain the rest of the app's startup):

```csharp
builder.UseMauiApp<App>()
    .UsePrism(new MicrosoftContainerExtension(), prism => prism
        .RegisterTypes(PrismStartup.RegisterTypes)
        .ConfigureModuleCatalog(PrismStartup.ConfigureModules)
        .CreateWindow(LearningRoutes.Shell));
```

The head's [PrismStartup](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-learning-hub/Maui/PrismLearningHub.Maui/PrismStartup.cs) registers the real on-demand graph:

```csharp
catalog.AddModule<ContentCatalogModule>(LearningModules.ContentCatalog, InitializationMode.OnDemand);
catalog.AddModule<CollectionsModule>(LearningModules.Collections, InitializationMode.OnDemand, LearningModules.ContentCatalog);
catalog.AddModule<ReadingToolsModule>(LearningModules.ReadingTools, InitializationMode.OnDemand);
```


Follow [the shared application rules](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-learning-hub/Shared/Settings/Services/LearningSession.cs) next, then the head's feature view registrations. Shared view models request logical routes; only the head references native view types. The loader checks dependency completion before navigation and does not claim to repair every module-manager failure mode.

</details>

<details>
<summary>Essentials, persistence, and private-by-default diagnostics</summary>


LearningStore writes a versioned generated-JSON snapshot through Essentials settings. A failed write retains previous state; unreadable or unsupported data pauses writes. Original bundled artwork has bounded raster derivatives, with titles retained if an image fails.


LearningSession receives `ILogger<LearningSession>` and records restore/save, bookmarks, progress, and collection changes at the persistence boundary. Collection names, essay selections, and state values are excluded.


The filtered Prism Console provider also covers Essentials error forwarding. Only fixed operation/outcome categories and bounded error types reach local standard output. No remote provider, credentials, persistent log file, or user identity is configured. See [the diagnostics guide](index.md#diagnose-real-workflows-with-prism-logging).

</details>

### Validation and limits {#maui-validation}

Selected MAUI Windows builds passed. The capture and interaction scope above is separate from build success. iOS/Mac Catalyst work is deferred; no all-head NativeAOT qualification is claimed. Check [the sample README](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-learning-hub/README.md), [capture provenance](runtime-coverage.md), and [Prism 10.0 NativeAOT requirements](../dependency-injection/native-aot.md) before extending the sample.

</TabItem>

<TabItem value="uno-platform" label="Uno">

### Uno experience

The Uno shell supplies native templates and image presentation while sharing the catalog, session, and module graph. Each WinUI, Desktop, browser, or mobile head needs its own runtime check.

<SampleGallery label="Learning Hub Uno" captures={sampleCaptures["learning-hub"].uno} />

Uno runtime captures are pending. Windows builds are verified; Android and other native journeys need their own capture and interaction evidence.

### Set up and run {#uno-run}

Run from the repository root using its existing package versions, entitled [Commercial Plus feed](../pipelines/commercial-plus.md), and the matching SDK/workloads.

Select the Desktop target on a supported desktop host:

```sh
dotnet run --project samples/prism-learning-hub/Uno/PrismLearningHub.Uno/PrismLearningHub.Uno.csproj -f net10.0-desktop -p:TargetFrameworks=net10.0-desktop --launch-profile "PrismLearningHub.Uno (Desktop)"
```

<details>
<summary>Run the browser target</summary>

With the matching WebAssembly workload, select the separately declared browser head:

```sh
dotnet run --project samples/prism-learning-hub/Uno/PrismLearningHub.Uno/PrismLearningHub.Uno.csproj -f net10.0-browserwasm -p:TargetFrameworks=net10.0-browserwasm -p:TargetFramework=net10.0-browserwasm --launch-profile "PrismLearningHub.Uno (WebAssembly)"
```

These are source-backed target-selection commands, not a claim that a new browser run was completed for this walkthrough.

</details>

### Guided walkthrough {#uno-walkthrough}

1. **Search by text and topic, cancel, and clear the query.** Only the newest live search can publish results, errors, or busy state. Read the [request ownership](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-learning-hub/Shared/ContentCatalog/ViewModels/CatalogViewModel.cs).

2. **Open an essay, advance a section, and return to the catalog.** The next visit restores progress after the save has succeeded. Read the [reading-state persistence](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-learning-hub/Shared/Settings/Services/LearningSession.cs).

3. **Create a collection, add the read, and rename the selected collection.** Selection survives the update; dirty cancellation preserves the editor draft. Read the [collection state](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-learning-hub/Shared/Collections/ViewModels/CollectionsViewModel.cs).

4. **Open Reading tools first in a fresh session and change text size or theme.** The independent module loads without ContentCatalog; the head adapts its native presentation. Read the [module catalog](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-learning-hub/Uno/PrismLearningHub.Uno/PrismStartup.cs).

<details>
<summary>Trace the Uno startup and module code</summary>


The [Uno App class](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-learning-hub/Uno/PrismLearningHub.Uno/App.xaml.cs) owns native startup and shell creation. Excerpt (retain its remaining lifecycle methods):

```csharp
protected override IContainerExtension CreateContainerExtension()
    => new MicrosoftContainerExtension();

protected override UIElement CreateShell()
    => _shell = Container.Resolve<ShellPage>();

protected override void RegisterTypes(IContainerRegistry registry)
    => PrismStartup.RegisterTypes(registry);
```

The head's [PrismStartup](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-learning-hub/Uno/PrismLearningHub.Uno/PrismStartup.cs) registers the real on-demand graph:

```csharp
catalog.AddModule<ContentCatalogModule>(LearningModules.ContentCatalog, InitializationMode.OnDemand);
catalog.AddModule<CollectionsModule>(LearningModules.Collections, InitializationMode.OnDemand, LearningModules.ContentCatalog);
catalog.AddModule<ReadingToolsModule>(LearningModules.ReadingTools, InitializationMode.OnDemand);
```


Follow [the shared application rules](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-learning-hub/Shared/Settings/Services/LearningSession.cs) next, then the head's feature view registrations. Shared view models request logical routes; only the head references native view types. The loader checks dependency completion before navigation and does not claim to repair every module-manager failure mode.

</details>

<details>
<summary>Essentials, persistence, and private-by-default diagnostics</summary>


LearningStore writes a versioned generated-JSON snapshot through Essentials settings. A failed write retains previous state; unreadable or unsupported data pauses writes. Original bundled artwork has bounded raster derivatives, with titles retained if an image fails.


LearningSession receives `ILogger<LearningSession>` and records restore/save, bookmarks, progress, and collection changes at the persistence boundary. Collection names, essay selections, and state values are excluded.


The filtered Prism Console provider also covers Essentials error forwarding. Only fixed operation/outcome categories and bounded error types reach local standard output. No remote provider, credentials, persistent log file, or user identity is configured. See [the diagnostics guide](index.md#diagnose-real-workflows-with-prism-logging).

</details>

### Validation and limits {#uno-validation}

Selected Uno Windows builds passed. Android, Desktop, browser, and Apple retain their own runtime boundaries; iOS/macOS capture work is deferred. WebAssembly AOT and desktop NativeAOT are different deployment paths. Check [the sample README](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-learning-hub/README.md), [capture provenance](runtime-coverage.md), and [Prism 10.0 NativeAOT requirements](../dependency-injection/native-aot.md) before extending the sample.

</TabItem>

<TabItem value="avalonia" label="Avalonia">

### Coming soon

Learning Hub does not yet have an Avalonia application head, runnable walkthrough, or captured UI. Prism supports Avalonia APIs; this particular sample head and its Essentials integration are still to come.

Continue with one of the available framework tabs, or explore the [Avalonia starter template](https://github.com/PrismLibrary/samples/tree/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/sample-template/Avalonia).

</TabItem>

</Tabs>

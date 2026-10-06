---
sidebar_position: 2
title: Calculator
hide_table_of_contents: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SampleGallery from '@site/src/components/SampleGallery';
import {sampleCaptures} from '@site/src/data/sampleCaptures';

# Calculator

Calculate with decimals, reuse a history result, and convert units. This is the smallest complete application in the collection, with a custom calculator icon and one shared calculation session.

History depends on CalculationCore; UnitConversion is independent. Shared models, services, commands, and view models contain no UI-framework types.

Choose your framework. Source links require access to the private [samples repository](https://github.com/PrismLibrary/samples). The source walkthrough follows merged checkpoint `02f8e351`; every image retains its own captured revision.

<Tabs groupId="platform" queryString="platform" defaultValue="wpf" className="sample-platform-tabs" lazy>

<TabItem value="wpf" label="WPF">

### WPF experience

Wide windows show history beside the keypad; compact windows navigate through the main region. Both layouts use the same singleton session.

<SampleGallery label="Calculator WPF" captures={sampleCaptures["calculator"].wpf} />

Original WPF application-owned runtime renders; source and capture method are recorded in the gallery and [runtime coverage](runtime-coverage.md).

### Set up and run {#wpf-run}

Run from the repository root using its existing package versions, entitled [Commercial Plus feed](../pipelines/commercial-plus.md), and the matching SDK/workloads.

On Windows:

```sh
dotnet run --project samples/prism-calculator/WPF/PrismCalculator.Wpf/PrismCalculator.Wpf.csproj
```

### Guided walkthrough {#wpf-walkthrough}

1. **Enter `2 + 3 * 4`, then press equals again.** Expect `14`, then `26`; try `0.1 + 0.2` for an exact decimal result. Read the [arithmetic contract](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-calculator/Shared/CalculationCore/Services/ExpressionEvaluator.cs).

2. **Open a history item, cancel, then reopen and reuse its result.** The selected result returns to the same session; cancellation does not mutate it. Read the [history commands](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-calculator/Shared/History/ViewModels/HistoryViewModel.cs).

3. **Open Convert before Calculation in a fresh session.** UnitConversion loads independently; History loads CalculationCore first. Read the [module catalog](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-calculator/WPF/PrismCalculator.Wpf/PrismStartup.cs).

4. **Change preferences, close, and reopen on a qualified host.** Trace restore/save outcomes and protected-store behavior without logging expressions. Read the [persistence and logging](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-calculator/Shared/CalculationCore/Services/CalculatorState.cs).

<details>
<summary>Trace the WPF startup and module code</summary>


The [WPF App class](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-calculator/WPF/PrismCalculator.Wpf/App.xaml.cs) owns native startup and shell creation. Excerpt (retain its remaining lifecycle methods):

```csharp
protected override IContainerExtension CreateContainerExtension()
    => new MicrosoftContainerExtension();

protected override Window CreateShell()
    => Container.Resolve<ShellWindow>();

protected override void RegisterTypes(IContainerRegistry registry)
    => PrismStartup.RegisterTypes(registry);
```

The head's [PrismStartup](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-calculator/WPF/PrismCalculator.Wpf/PrismStartup.cs) registers the real on-demand graph:

```csharp
catalog.AddModule<CalculationCoreModule>(CalculatorModules.CalculationCore, InitializationMode.OnDemand);
catalog.AddModule<HistoryModule>(CalculatorModules.History, InitializationMode.OnDemand, CalculatorModules.CalculationCore);
catalog.AddModule<UnitConversionModule>(CalculatorModules.UnitConversion, InitializationMode.OnDemand);
```


Follow [the shared application rules](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-calculator/Shared/CalculationCore/Services/CalculationSession.cs) next, then the head's feature view registrations. Shared view models request logical routes; only the head references native view types. The loader checks dependency completion before navigation and does not claim to repair every module-manager failure mode.

</details>

<details>
<summary>Essentials, persistence, and private-by-default diagnostics</summary>


Essentials supplies clipboard and version tracking. CalculatorStore writes a versioned snapshot through IKeyValueStoreFactory with generated JSON metadata. Corrupt or newer-format state is retained with a temporary-session warning; a cancelled clipboard wait cannot promise to undo an OS write.


CalculatorState receives `ILogger<CalculatorState>` and records history restore/save/clear, preference saves, and protected-store skips. Expression text and history values are excluded.


The filtered Prism Console provider also covers Essentials error forwarding. Only fixed operation/outcome categories and bounded error types reach local standard output. No remote provider, credentials, persistent log file, or user identity is configured. See [the diagnostics guide](index.md#diagnose-real-workflows-with-prism-logging).

</details>

### Validation and limits {#wpf-validation}

Native WPF workflows exercise actual containers, modules, bound controls, and dialogs. The images are live app-owned test renders, not OS screenshots or assistive-technology certification. WPF is not a NativeAOT target. Check [the sample README](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-calculator/README.md), [capture provenance](runtime-coverage.md), and [Prism 10.0 NativeAOT requirements](../dependency-injection/native-aot.md) before extending the sample.

</TabItem>

<TabItem value="maui" label=".NET MAUI">

### .NET MAUI experience

The native shell page owns compact touch layouts and the region views. Shared commands retain the same arithmetic and history behavior.

<SampleGallery label="Calculator .NET MAUI" captures={sampleCaptures["calculator"].maui} />

The Android light-theme capture is a limited checkpoint: launch, result `14`, and history were verified. The recorded dark-theme text contrast issue remains a limitation. Windows screenshots are pending.

### Set up and run {#maui-run}

Run from the repository root using its existing package versions, entitled [Commercial Plus feed](../pipelines/commercial-plus.md), and the matching SDK/workloads.

Build the Android head with the installed Android SDK/JDK and MAUI workload:

```sh
dotnet build samples/prism-calculator/Maui/PrismCalculator.Maui/PrismCalculator.Maui.csproj -p:TargetFrameworks=net10.0-android
```

Open [this MAUI project](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-calculator/Maui/PrismCalculator.Maui/PrismCalculator.Maui.csproj) in your IDE, select an Android emulator/device, and run it. On Windows, select the Windows target instead.

<details>
<summary>Windows build command</summary>

```sh
dotnet build samples/prism-calculator/Maui/PrismCalculator.Maui/PrismCalculator.Maui.csproj -p:TargetFrameworks=net10.0-windows10.0.19041.0
```

</details>

### Guided walkthrough {#maui-walkthrough}

Explore the source behavior below; the current MAUI Android images validate only the limited Light checkpoint described above.

1. **Enter `2 + 3 * 4`, then press equals again.** Expect `14`, then `26`; try `0.1 + 0.2` for an exact decimal result. Read the [arithmetic contract](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-calculator/Shared/CalculationCore/Services/ExpressionEvaluator.cs).

2. **Open a history item, cancel, then reopen and reuse its result.** The selected result returns to the same session; cancellation does not mutate it. Read the [history commands](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-calculator/Shared/History/ViewModels/HistoryViewModel.cs).

3. **Open Convert before Calculation in a fresh session.** UnitConversion loads independently; History loads CalculationCore first. Read the [module catalog](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-calculator/Maui/PrismCalculator.Maui/PrismStartup.cs).

4. **Change preferences, close, and reopen on a qualified host.** Trace restore/save outcomes and protected-store behavior without logging expressions. Read the [persistence and logging](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-calculator/Shared/CalculationCore/Services/CalculatorState.cs).

<details>
<summary>Trace the .NET MAUI startup and module code</summary>


The [MAUI composition root](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-calculator/Maui/PrismCalculator.Maui/MauiProgram.cs) selects the Microsoft container and the logical shell route. Excerpt (retain the rest of the app's startup):

```csharp
builder.UseMauiApp<App>()
    .UsePrism(new MicrosoftContainerExtension(), prism => prism
        .RegisterTypes(PrismStartup.RegisterTypes)
        .ConfigureModuleCatalog(PrismStartup.ConfigureModules)
        .CreateWindow(CalculatorRoutes.Shell));
```

The head's [PrismStartup](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-calculator/Maui/PrismCalculator.Maui/PrismStartup.cs) registers the real on-demand graph:

```csharp
catalog.AddModule<CalculationCoreModule>(CalculatorModules.CalculationCore, InitializationMode.OnDemand);
catalog.AddModule<HistoryModule>(CalculatorModules.History, InitializationMode.OnDemand, CalculatorModules.CalculationCore);
catalog.AddModule<UnitConversionModule>(CalculatorModules.UnitConversion, InitializationMode.OnDemand);
```


Follow [the shared application rules](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-calculator/Shared/CalculationCore/Services/CalculationSession.cs) next, then the head's feature view registrations. Shared view models request logical routes; only the head references native view types. The loader checks dependency completion before navigation and does not claim to repair every module-manager failure mode.

</details>

<details>
<summary>Essentials, persistence, and private-by-default diagnostics</summary>


Essentials supplies clipboard and version tracking. CalculatorStore writes a versioned snapshot through IKeyValueStoreFactory with generated JSON metadata. Corrupt or newer-format state is retained with a temporary-session warning; a cancelled clipboard wait cannot promise to undo an OS write.


CalculatorState receives `ILogger<CalculatorState>` and records history restore/save/clear, preference saves, and protected-store skips. Expression text and history values are excluded.


The filtered Prism Console provider also covers Essentials error forwarding. Only fixed operation/outcome categories and bounded error types reach local standard output. No remote provider, credentials, persistent log file, or user identity is configured. See [the diagnostics guide](index.md#diagnose-real-workflows-with-prism-logging).

</details>

### Validation and limits {#maui-validation}

Selected MAUI Windows builds passed. The capture and interaction scope above is separate from build success. iOS/Mac Catalyst work is deferred; no all-head NativeAOT qualification is claimed. Check [the sample README](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-calculator/README.md), [capture provenance](runtime-coverage.md), and [Prism 10.0 NativeAOT requirements](../dependency-injection/native-aot.md) before extending the sample.

</TabItem>

<TabItem value="uno-platform" label="Uno">

### Uno experience

The Uno shell maps the same logical routes to Uno controls. Desktop, browser, and Android are separate runtime targets with different clipboard and storage behavior.

<SampleGallery label="Calculator Uno" captures={sampleCaptures["calculator"].uno} />

The Android captures cover their labeled source checkpoint, including arithmetic, history/dialogs, and settings after restart. Desktop and browser screenshots remain pending; these are separate runtime targets.

### Set up and run {#uno-run}

Run from the repository root using its existing package versions, entitled [Commercial Plus feed](../pipelines/commercial-plus.md), and the matching SDK/workloads.

Select the Desktop target on a supported desktop host:

```sh
dotnet run --project samples/prism-calculator/Uno/PrismCalculator.Uno/PrismCalculator.Uno.csproj -f net10.0-desktop -p:TargetFrameworks=net10.0-desktop --launch-profile "PrismCalculator.Uno (Desktop)"
```

<details>
<summary>Run the browser target</summary>

With the matching WebAssembly workload, select the separately declared browser head:

```sh
dotnet run --project samples/prism-calculator/Uno/PrismCalculator.Uno/PrismCalculator.Uno.csproj -f net10.0-browserwasm -p:TargetFrameworks=net10.0-browserwasm -p:TargetFramework=net10.0-browserwasm --launch-profile "PrismCalculator.Uno (WebAssembly)"
```

These are source-backed target-selection commands, not a claim that a new browser run was completed for this walkthrough.

</details>

### Guided walkthrough {#uno-walkthrough}

1. **Enter `2 + 3 * 4`, then press equals again.** Expect `14`, then `26`; try `0.1 + 0.2` for an exact decimal result. Read the [arithmetic contract](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-calculator/Shared/CalculationCore/Services/ExpressionEvaluator.cs).

2. **Open a history item, cancel, then reopen and reuse its result.** The selected result returns to the same session; cancellation does not mutate it. Read the [history commands](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-calculator/Shared/History/ViewModels/HistoryViewModel.cs).

3. **Open Convert before Calculation in a fresh session.** UnitConversion loads independently; History loads CalculationCore first. Read the [module catalog](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-calculator/Uno/PrismCalculator.Uno/PrismStartup.cs).

4. **Change preferences, close, and reopen on a qualified host.** Trace restore/save outcomes and protected-store behavior without logging expressions. Read the [persistence and logging](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-calculator/Shared/CalculationCore/Services/CalculatorState.cs).

<details>
<summary>Trace the Uno startup and module code</summary>


The [Uno App class](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-calculator/Uno/PrismCalculator.Uno/App.xaml.cs) owns native startup and shell creation. Excerpt (retain its remaining lifecycle methods):

```csharp
protected override IContainerExtension CreateContainerExtension()
    => new MicrosoftContainerExtension();

protected override UIElement CreateShell()
    => _shell = Container.Resolve<ShellPage>();

protected override void RegisterTypes(IContainerRegistry registry)
    => PrismStartup.RegisterTypes(registry);
```

The head's [PrismStartup](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-calculator/Uno/PrismCalculator.Uno/PrismStartup.cs) registers the real on-demand graph:

```csharp
catalog.AddModule<CalculationCoreModule>(CalculatorModules.CalculationCore, InitializationMode.OnDemand);
catalog.AddModule<HistoryModule>(CalculatorModules.History, InitializationMode.OnDemand, CalculatorModules.CalculationCore);
catalog.AddModule<UnitConversionModule>(CalculatorModules.UnitConversion, InitializationMode.OnDemand);
```


Follow [the shared application rules](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-calculator/Shared/CalculationCore/Services/CalculationSession.cs) next, then the head's feature view registrations. Shared view models request logical routes; only the head references native view types. The loader checks dependency completion before navigation and does not claim to repair every module-manager failure mode.

</details>

<details>
<summary>Essentials, persistence, and private-by-default diagnostics</summary>


Essentials supplies clipboard and version tracking. CalculatorStore writes a versioned snapshot through IKeyValueStoreFactory with generated JSON metadata. Corrupt or newer-format state is retained with a temporary-session warning; a cancelled clipboard wait cannot promise to undo an OS write.


CalculatorState receives `ILogger<CalculatorState>` and records history restore/save/clear, preference saves, and protected-store skips. Expression text and history values are excluded.


The filtered Prism Console provider also covers Essentials error forwarding. Only fixed operation/outcome categories and bounded error types reach local standard output. No remote provider, credentials, persistent log file, or user identity is configured. See [the diagnostics guide](index.md#diagnose-real-workflows-with-prism-logging).

</details>

### Validation and limits {#uno-validation}

Selected Uno Windows builds passed. Android, Desktop, browser, and Apple retain their own runtime boundaries; iOS/macOS capture work is deferred. WebAssembly AOT and desktop NativeAOT are different deployment paths. Check [the sample README](https://github.com/PrismLibrary/samples/blob/02f8e351ff20356e0ff2cc656f8bb201f65fff97/samples/prism-calculator/README.md), [capture provenance](runtime-coverage.md), and [Prism 10.0 NativeAOT requirements](../dependency-injection/native-aot.md) before extending the sample.

</TabItem>

<TabItem value="avalonia" label="Avalonia">

### Coming soon

Calculator does not yet have an Avalonia application head, runnable walkthrough, or captured UI. Prism supports Avalonia APIs; this particular sample head and its Essentials integration are still to come.

Continue with one of the available framework tabs, or explore the [Avalonia starter template](https://github.com/PrismLibrary/samples/tree/02f8e351ff20356e0ff2cc656f8bb201f65fff97/sample-template/Avalonia).

</TabItem>

</Tabs>

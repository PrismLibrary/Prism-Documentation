---
sidebar_position: 4
title: Sales Desk
hide_table_of_contents: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SampleGallery from '@site/src/components/SampleGallery';
import {sampleCaptures} from '@site/src/data/sampleCaptures';

# Sales Desk

Edit fictional customers, products, and quotes in a multi-document workspace. Learn how document identity and revisions preserve unsaved work when the same quote is opened twice.

Quotes depends on CustomerCatalog; ProductCatalog is independent. The shared repository owns validation, revisions, and atomic commits. No order, payment, email, or external CRM action is performed.

Choose your framework. Source links require access to the private [samples repository](https://github.com/PrismLibrary/samples).

<Tabs groupId="platform" queryString="platform" defaultValue="wpf" className="sample-platform-tabs" lazy>

<TabItem value="wpf" label="WPF">

### WPF experience

Named regions combine customer navigation, quote selection, document tabs, and the active editor. Native selectors and dirty-close dialogs return explicit results.

<SampleGallery label="Sales Desk WPF" captures={sampleCaptures["sales-desk"].wpf} />

Original WPF application-owned runtime renders; source and capture method are recorded in the gallery and [runtime coverage](runtime-coverage.md).

### Set up and run {#wpf-run}

Run from the repository root using its existing package versions, entitled [Commercial Plus feed](../pipelines/commercial-plus.md), and the matching SDK/workloads.

On Windows:

```sh
dotnet run --project samples/prism-sales-desk/WPF/PrismSalesDesk.Wpf/PrismSalesDesk.Wpf.csproj
```

### Guided walkthrough {#wpf-walkthrough}

1. **Open Product catalog first, then Quotes.** Products loads independently; CustomerCatalog initializes before Quotes. Read the [module ownership](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-sales-desk/WPF/PrismSalesDesk.Wpf/PrismStartup.cs).

2. **Choose a quote, customer, and product through the native selectors.** Logical dialog keys return validated results to shared commands. Read the [document workflow](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-sales-desk/Shared/Quotes/ViewModels/QuotesViewModel.cs).

3. **Choose Open another instance, save one revision, then save the stale revision.** The second document retains its edits and shows a conflict. Read the [revision and replay rules](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-sales-desk/Shared/Quotes/Services/QuoteRepository.cs).

4. **Make two documents dirty and choose Close all; cancel the later decision.** Nothing is saved or closed until the complete set of decisions is accepted. Read the [close-all transaction](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-sales-desk/Shared/Quotes/ViewModels/QuotesViewModel.cs).

<details>
<summary>Trace the WPF startup and module code</summary>


The [WPF App class](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-sales-desk/WPF/PrismSalesDesk.Wpf/App.xaml.cs) owns native startup and shell creation. Excerpt (retain its remaining lifecycle methods):

```csharp
protected override IContainerExtension CreateContainerExtension()
    => new MicrosoftContainerExtension();

protected override Window CreateShell()
    => Container.Resolve<ShellWindow>();

protected override void RegisterTypes(IContainerRegistry registry)
    => PrismStartup.RegisterTypes(registry);
```

The head's [PrismStartup](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-sales-desk/WPF/PrismSalesDesk.Wpf/PrismStartup.cs) registers the real on-demand graph:

```csharp
catalog.AddModule<CustomerCatalogModule>(SalesModules.CustomerCatalog, InitializationMode.OnDemand);
catalog.AddModule<QuotesModule>(SalesModules.Quotes, InitializationMode.OnDemand, SalesModules.CustomerCatalog);
catalog.AddModule<ProductCatalogModule>(SalesModules.ProductCatalog, InitializationMode.OnDemand);
```


Follow [the shared application rules](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-sales-desk/Shared/Quotes/Services/QuoteRules.cs) next, then the head's feature view registrations. Shared view models request logical routes; only the head references native view types. The loader checks dependency completion before navigation and does not claim to repair every module-manager failure mode.

</details>

<details>
<summary>Essentials, persistence, and private-by-default diagnostics</summary>


Essentials supplies clipboard, version tracking, file storage, and appearance preferences. Quote snapshots use bounded AppData files with generated JSON and atomic replacement, rather than large settings values. Clipboard summaries carry a sample-data disclaimer.


QuoteRepository receives `ILogger<QuoteRepository>`. It distinguishes commit success, idempotent replay, rejected stale revisions, cancellation, and storage failure. Customer identities, quote contents, document IDs, and prices are excluded.


The filtered Prism Console provider also covers Essentials error forwarding. Only fixed operation/outcome categories and bounded error types reach local standard output. No remote provider, credentials, persistent log file, or user identity is configured. See [the diagnostics guide](index.md#diagnose-real-workflows-with-prism-logging).

</details>

### Validation and limits {#wpf-validation}

Native WPF workflows exercise actual containers, modules, bound controls, and dialogs. The images are live app-owned test renders, not OS screenshots or assistive-technology certification. WPF is not a NativeAOT target. Check [the sample README](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-sales-desk/README.md), [capture provenance](runtime-coverage.md), and [Prism 10.0 NativeAOT requirements](../dependency-injection/native-aot.md) before extending the sample.

</TabItem>

<TabItem value="maui" label=".NET MAUI">

### .NET MAUI experience

Compact list/detail and wide layouts share the same quote workspace. The existing Windows composition test checks identity through repeated activation, separately from full touch workflows.

<SampleGallery label="Sales Desk .NET MAUI" captures={sampleCaptures["sales-desk"].maui} />

.NET MAUI runtime captures are pending. Windows builds are verified; Android and other native journeys need their own capture and interaction evidence.

### Set up and run {#maui-run}

Run from the repository root using its existing package versions, entitled [Commercial Plus feed](../pipelines/commercial-plus.md), and the matching SDK/workloads.

Build the Android head with the installed Android SDK/JDK and MAUI workload:

```sh
dotnet build samples/prism-sales-desk/Maui/PrismSalesDesk.Maui/PrismSalesDesk.Maui.csproj -p:TargetFrameworks=net10.0-android
```

Open [this MAUI project](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-sales-desk/Maui/PrismSalesDesk.Maui/PrismSalesDesk.Maui.csproj) in your IDE, select an Android emulator/device, and run it. On Windows, select the Windows target instead.

<details>
<summary>Windows build command</summary>

```sh
dotnet build samples/prism-sales-desk/Maui/PrismSalesDesk.Maui/PrismSalesDesk.Maui.csproj -p:TargetFrameworks=net10.0-windows10.0.19041.0
```

</details>

### Guided walkthrough {#maui-walkthrough}

1. **Open Product catalog first, then Quotes.** Products loads independently; CustomerCatalog initializes before Quotes. Read the [module ownership](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-sales-desk/Maui/PrismSalesDesk.Maui/PrismStartup.cs).

2. **Choose a quote, customer, and product through the native selectors.** Logical dialog keys return validated results to shared commands. Read the [document workflow](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-sales-desk/Shared/Quotes/ViewModels/QuotesViewModel.cs).

3. **Choose Open another instance, save one revision, then save the stale revision.** The second document retains its edits and shows a conflict. Read the [revision and replay rules](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-sales-desk/Shared/Quotes/Services/QuoteRepository.cs).

4. **Make two documents dirty and choose Close all; cancel the later decision.** Nothing is saved or closed until the complete set of decisions is accepted. Read the [close-all transaction](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-sales-desk/Shared/Quotes/ViewModels/QuotesViewModel.cs).

<details>
<summary>Trace the .NET MAUI startup and module code</summary>


The [MAUI composition root](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-sales-desk/Maui/PrismSalesDesk.Maui/MauiProgram.cs) selects the Microsoft container and the logical shell route. Excerpt (retain the rest of the app's startup):

```csharp
builder.UseMauiApp<App>()
    .UsePrism(new MicrosoftContainerExtension(), prism => prism
        .RegisterTypes(PrismStartup.RegisterTypes)
        .ConfigureModuleCatalog(PrismStartup.ConfigureModules)
        .CreateWindow(SalesRoutes.Shell));
```

The head's [PrismStartup](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-sales-desk/Maui/PrismSalesDesk.Maui/PrismStartup.cs) registers the real on-demand graph:

```csharp
catalog.AddModule<CustomerCatalogModule>(SalesModules.CustomerCatalog, InitializationMode.OnDemand);
catalog.AddModule<QuotesModule>(SalesModules.Quotes, InitializationMode.OnDemand, SalesModules.CustomerCatalog);
catalog.AddModule<ProductCatalogModule>(SalesModules.ProductCatalog, InitializationMode.OnDemand);
```


Follow [the shared application rules](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-sales-desk/Shared/Quotes/Services/QuoteRules.cs) next, then the head's feature view registrations. Shared view models request logical routes; only the head references native view types. The loader checks dependency completion before navigation and does not claim to repair every module-manager failure mode.

</details>

<details>
<summary>Essentials, persistence, and private-by-default diagnostics</summary>


Essentials supplies clipboard, version tracking, file storage, and appearance preferences. Quote snapshots use bounded AppData files with generated JSON and atomic replacement, rather than large settings values. Clipboard summaries carry a sample-data disclaimer.


QuoteRepository receives `ILogger<QuoteRepository>`. It distinguishes commit success, idempotent replay, rejected stale revisions, cancellation, and storage failure. Customer identities, quote contents, document IDs, and prices are excluded.


The filtered Prism Console provider also covers Essentials error forwarding. Only fixed operation/outcome categories and bounded error types reach local standard output. No remote provider, credentials, persistent log file, or user identity is configured. See [the diagnostics guide](index.md#diagnose-real-workflows-with-prism-logging).

</details>

### Validation and limits {#maui-validation}

Selected MAUI Windows builds passed. The capture and interaction scope above is separate from build success. iOS/Mac Catalyst work is deferred; no all-head NativeAOT qualification is claimed. Check [the sample README](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-sales-desk/README.md), [capture provenance](runtime-coverage.md), and [Prism 10.0 NativeAOT requirements](../dependency-injection/native-aot.md) before extending the sample.

</TabItem>

<TabItem value="uno-platform" label="Uno">

### Uno experience

The responsive region workspace uses Uno-native bindings and theme resources. The head owns busy-state presentation and view reuse; the repository owns revisions.

<SampleGallery label="Sales Desk Uno" captures={sampleCaptures["sales-desk"].uno} />

Uno runtime captures are pending. Windows builds are verified; Android and other native journeys need their own capture and interaction evidence.

### Set up and run {#uno-run}

Run from the repository root using its existing package versions, entitled [Commercial Plus feed](../pipelines/commercial-plus.md), and the matching SDK/workloads.

Select the Desktop target on a supported desktop host:

```sh
dotnet run --project samples/prism-sales-desk/Uno/PrismSalesDesk.Uno/PrismSalesDesk.Uno.csproj -f net10.0-desktop -p:TargetFrameworks=net10.0-desktop --no-launch-profile
```

<details>
<summary>Run the browser target</summary>

With the matching WebAssembly workload, select the separately declared browser head:

```sh
dotnet run --project samples/prism-sales-desk/Uno/PrismSalesDesk.Uno/PrismSalesDesk.Uno.csproj -f net10.0-browserwasm -p:TargetFrameworks=net10.0-browserwasm -p:TargetFramework=net10.0-browserwasm --no-launch-profile
```

These are source-backed target-selection commands, not a claim that a new browser run was completed for this walkthrough.

</details>

### Guided walkthrough {#uno-walkthrough}

1. **Open Product catalog first, then Quotes.** Products loads independently; CustomerCatalog initializes before Quotes. Read the [module ownership](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-sales-desk/Uno/PrismSalesDesk.Uno/PrismStartup.cs).

2. **Choose a quote, customer, and product through the native selectors.** Logical dialog keys return validated results to shared commands. Read the [document workflow](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-sales-desk/Shared/Quotes/ViewModels/QuotesViewModel.cs).

3. **Choose Open another instance, save one revision, then save the stale revision.** The second document retains its edits and shows a conflict. Read the [revision and replay rules](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-sales-desk/Shared/Quotes/Services/QuoteRepository.cs).

4. **Make two documents dirty and choose Close all; cancel the later decision.** Nothing is saved or closed until the complete set of decisions is accepted. Read the [close-all transaction](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-sales-desk/Shared/Quotes/ViewModels/QuotesViewModel.cs).

<details>
<summary>Trace the Uno startup and module code</summary>


The [Uno App class](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-sales-desk/Uno/PrismSalesDesk.Uno/App.xaml.cs) owns native startup and shell creation. Excerpt (retain its remaining lifecycle methods):

```csharp
protected override IContainerExtension CreateContainerExtension()
    => new MicrosoftContainerExtension();

protected override UIElement CreateShell()
    => _shell = Container.Resolve<ShellPage>();

protected override void RegisterTypes(IContainerRegistry registry)
    => PrismStartup.RegisterTypes(registry);
```

The head's [PrismStartup](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-sales-desk/Uno/PrismSalesDesk.Uno/PrismStartup.cs) registers the real on-demand graph:

```csharp
catalog.AddModule<CustomerCatalogModule>(SalesModules.CustomerCatalog, InitializationMode.OnDemand);
catalog.AddModule<QuotesModule>(SalesModules.Quotes, InitializationMode.OnDemand, SalesModules.CustomerCatalog);
catalog.AddModule<ProductCatalogModule>(SalesModules.ProductCatalog, InitializationMode.OnDemand);
```


Follow [the shared application rules](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-sales-desk/Shared/Quotes/Services/QuoteRules.cs) next, then the head's feature view registrations. Shared view models request logical routes; only the head references native view types. The loader checks dependency completion before navigation and does not claim to repair every module-manager failure mode.

</details>

<details>
<summary>Essentials, persistence, and private-by-default diagnostics</summary>


Essentials supplies clipboard, version tracking, file storage, and appearance preferences. Quote snapshots use bounded AppData files with generated JSON and atomic replacement, rather than large settings values. Clipboard summaries carry a sample-data disclaimer.


QuoteRepository receives `ILogger<QuoteRepository>`. It distinguishes commit success, idempotent replay, rejected stale revisions, cancellation, and storage failure. Customer identities, quote contents, document IDs, and prices are excluded.


The filtered Prism Console provider also covers Essentials error forwarding. Only fixed operation/outcome categories and bounded error types reach local standard output. No remote provider, credentials, persistent log file, or user identity is configured. See [the diagnostics guide](index.md#diagnose-real-workflows-with-prism-logging).

</details>

### Validation and limits {#uno-validation}

Selected Uno Windows builds passed. Android, Desktop, browser, and Apple retain their own runtime boundaries; iOS/macOS capture work is deferred. WebAssembly AOT and desktop NativeAOT are different deployment paths. Check [the sample README](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-sales-desk/README.md), [capture provenance](runtime-coverage.md), and [Prism 10.0 NativeAOT requirements](../dependency-injection/native-aot.md) before extending the sample.

</TabItem>

<TabItem value="avalonia" label="Avalonia">

### Coming soon

Sales Desk does not yet have an Avalonia application head, runnable walkthrough, or captured UI. Prism supports Avalonia APIs; this particular sample head and its Essentials integration are still to come.

Continue with one of the available framework tabs, or explore the [Avalonia starter template](https://github.com/PrismLibrary/samples/tree/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/sample-template/Avalonia).

</TabItem>

</Tabs>

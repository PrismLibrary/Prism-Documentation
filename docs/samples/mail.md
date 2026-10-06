---
sidebar_position: 6
title: Prism Mail
hide_table_of_contents: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SampleGallery from '@site/src/components/SampleGallery';
import {sampleCaptures} from '@site/src/data/sampleCaptures';

# Prism Mail

Explore a fictional inbox, contacts, calendar, and editable drafts. The useful offline journey needs no credentials; live provider configuration and authorization remain separate, bounded features.

Mail depends on Contacts for recipient selection; Calendar is independent. Shared contracts and WorkspaceSession enforce account boundaries without referencing native views. Demo sends affect only the in-memory Sent folder.

Choose your framework. Source links require access to the private [samples repository](https://github.com/PrismLibrary/samples).

<Tabs groupId="platform" queryString="platform" defaultValue="wpf" className="sample-platform-tabs" lazy>

<TabItem value="wpf" label="WPF">

### WPF experience

Folders, list, and plain-text reader form a three-pane desktop workspace with compact flows and native recipient/discard dialogs. Tests use synthetic accounts and isolated stores.

<SampleGallery label="Prism Mail WPF" captures={sampleCaptures["mail"].wpf} />

Original WPF application-owned runtime renders; source and capture method are recorded in the gallery and [runtime coverage](runtime-coverage.md).

### Set up and run {#wpf-run}

Run from the repository root using its existing package versions, entitled [Commercial Plus feed](../pipelines/commercial-plus.md), and the matching SDK/workloads.

On Windows:

```sh
dotnet run --project samples/prism-mail/WPF/PrismMail/PrismMail.WPF.csproj
```

### Guided walkthrough {#wpf-walkthrough}

1. **Search the inbox, load another page, and toggle read state.** Stale reads cannot publish into a newly selected account. Read the [session boundary](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-mail/Shared/Accounts/WorkspaceSession.cs).

2. **Reply or forward, choose a contact, save a draft, and reopen it.** The dialog uses shared recipient rules; attachment rows remain metadata only. Read the [routes and dialog registration](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-mail/WPF/PrismMail/PrismStartup.cs).

3. **Cancel a dirty composer, then inspect Calendar’s day/week/agenda ranges.** Keep editing retains the draft; demo event times are explicitly UTC. Read the [offline walkthrough](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-mail/README.md).

4. **Inspect configuration and submission outcomes before enabling any live connection.** Dummy public settings leave live access disabled; an uncertain send is never automatically repeated. Read the [submission semantics](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-mail/Shared/Accounts/WorkspaceSession.cs).

<details>
<summary>Trace the WPF startup and module code</summary>


The [WPF App class](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-mail/WPF/PrismMail/App.xaml.cs) owns native startup and shell creation. Excerpt (retain its remaining lifecycle methods):

```csharp
protected override IContainerExtension CreateContainerExtension()
    => new MicrosoftContainerExtension();

protected override Window CreateShell()
    => Container.Resolve<MainWindow>();

protected override void RegisterTypes(IContainerRegistry registry)
    => PrismStartup.RegisterTypes(registry);
```

The head's [PrismStartup](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-mail/WPF/PrismMail/PrismStartup.cs) registers the real on-demand graph:

```csharp
catalog.AddModule<ContactsModule>(MailModules.Contacts, InitializationMode.OnDemand);
catalog.AddModule<MailModule>(MailModules.Mail, InitializationMode.OnDemand, MailModules.Contacts);
catalog.AddModule<CalendarModule>(MailModules.Calendar, InitializationMode.OnDemand);
```


Follow [the shared application rules](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-mail/Shared/Accounts/WorkspaceSession.cs) next, then the head's feature view registrations. Shared view models request logical routes; only the head references native view types. The loader checks dependency completion before navigation and does not claim to repair every module-manager failure mode.

</details>

<details>
<summary>Essentials, persistence, and private-by-default diagnostics</summary>


Essentials provides platform services and a generated secure-store manifest. Runtime tokens require the secure backend and fail closed without a preferences fallback. Mobile.BuildTools generates typed public-client settings from safe dummy defaults; build constants are not secret storage.


The container creates WorkspaceSession with `ILogger<WorkspaceSession>`; provider aliases share that instance. Fixed account/read/mutation/draft/submission outcomes exclude addresses, content, contacts, appointments, tokens, and provider responses. An ambiguous send remains Uncertain.


The filtered Prism Console provider also covers Essentials error forwarding. Only fixed operation/outcome categories and bounded error types reach local standard output. No remote provider, credentials, persistent log file, or user identity is configured. See [the diagnostics guide](index.md#diagnose-real-workflows-with-prism-logging).

</details>

### Validation and limits {#wpf-validation}

Native WPF workflows exercise actual containers, modules, bound controls, and dialogs. The images are live app-owned test renders, not OS screenshots or assistive-technology certification. WPF is not a NativeAOT target. Live provider interoperability, mobile/browser authorization, and runtime IMAP connection UI remain incomplete. Use the offline demo for this walkthrough. Check [the sample README](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-mail/README.md), [capture provenance](runtime-coverage.md), and [Prism 10.0 NativeAOT requirements](../dependency-injection/native-aot.md) before extending the sample.

</TabItem>

<TabItem value="maui" label=".NET MAUI">

### .NET MAUI experience

The native page/region views share the offline models and modules. Mobile authorization remains incomplete; a desktop loopback flow is not a substitute for the correct mobile integration.

<SampleGallery label="Prism Mail .NET MAUI" captures={sampleCaptures["mail"].maui} />

.NET MAUI runtime captures are pending. Windows builds are verified; Android and other native journeys need their own capture and interaction evidence.

### Set up and run {#maui-run}

Run from the repository root using its existing package versions, entitled [Commercial Plus feed](../pipelines/commercial-plus.md), and the matching SDK/workloads.

Build the Android head with the installed Android SDK/JDK and MAUI workload:

```sh
dotnet build samples/prism-mail/Maui/PrismMail/PrismMail.Maui.csproj -p:TargetFrameworks=net10.0-android
```

Open [this MAUI project](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-mail/Maui/PrismMail/PrismMail.Maui.csproj) in your IDE, select an Android emulator/device, and run it. On Windows, select the Windows target instead.

<details>
<summary>Windows build command</summary>

```sh
dotnet build samples/prism-mail/Maui/PrismMail/PrismMail.Maui.csproj -p:TargetFrameworks=net10.0-windows10.0.19041.0
```

</details>

### Guided walkthrough {#maui-walkthrough}

1. **Search the inbox, load another page, and toggle read state.** Stale reads cannot publish into a newly selected account. Read the [session boundary](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-mail/Shared/Accounts/WorkspaceSession.cs).

2. **Reply or forward, choose a contact, save a draft, and reopen it.** The dialog uses shared recipient rules; attachment rows remain metadata only. Read the [routes and dialog registration](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-mail/Maui/PrismMail/PrismStartup.cs).

3. **Cancel a dirty composer, then inspect Calendar’s day/week/agenda ranges.** Keep editing retains the draft; demo event times are explicitly UTC. Read the [offline walkthrough](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-mail/README.md).

4. **Inspect configuration and submission outcomes before enabling any live connection.** Dummy public settings leave live access disabled; an uncertain send is never automatically repeated. Read the [submission semantics](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-mail/Shared/Accounts/WorkspaceSession.cs).

<details>
<summary>Trace the .NET MAUI startup and module code</summary>


The [MAUI composition root](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-mail/Maui/PrismMail/MauiProgram.cs) selects the Microsoft container and the logical shell route. Excerpt (retain the rest of the app's startup):

```csharp
builder.UseMauiApp<App>()
    .UsePrism(new MicrosoftContainerExtension(), prism => prism
        .RegisterTypes(PrismStartup.RegisterTypes)
        .ConfigureModuleCatalog(PrismStartup.ConfigureModules)
        .CreateWindow(MailRoutes.Shell));
```

The head's [PrismStartup](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-mail/Maui/PrismMail/PrismStartup.cs) registers the real on-demand graph:

```csharp
catalog.AddModule<ContactsModule>(MailModules.Contacts, InitializationMode.OnDemand);
catalog.AddModule<MailModule>(MailModules.Mail, InitializationMode.OnDemand, MailModules.Contacts);
catalog.AddModule<CalendarModule>(MailModules.Calendar, InitializationMode.OnDemand);
```


Follow [the shared application rules](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-mail/Shared/Accounts/WorkspaceSession.cs) next, then the head's feature view registrations. Shared view models request logical routes; only the head references native view types. The loader checks dependency completion before navigation and does not claim to repair every module-manager failure mode.

</details>

<details>
<summary>Essentials, persistence, and private-by-default diagnostics</summary>


Essentials provides platform services and a generated secure-store manifest. Runtime tokens require the secure backend and fail closed without a preferences fallback. Mobile.BuildTools generates typed public-client settings from safe dummy defaults; build constants are not secret storage.


The container creates WorkspaceSession with `ILogger<WorkspaceSession>`; provider aliases share that instance. Fixed account/read/mutation/draft/submission outcomes exclude addresses, content, contacts, appointments, tokens, and provider responses. An ambiguous send remains Uncertain.


The filtered Prism Console provider also covers Essentials error forwarding. Only fixed operation/outcome categories and bounded error types reach local standard output. No remote provider, credentials, persistent log file, or user identity is configured. See [the diagnostics guide](index.md#diagnose-real-workflows-with-prism-logging).

</details>

### Validation and limits {#maui-validation}

Selected MAUI Windows builds passed. The capture and interaction scope above is separate from build success. iOS/Mac Catalyst work is deferred; no all-head NativeAOT qualification is claimed. Live provider interoperability, mobile/browser authorization, and runtime IMAP connection UI remain incomplete. Use the offline demo for this walkthrough. Check [the sample README](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-mail/README.md), [capture provenance](runtime-coverage.md), and [Prism 10.0 NativeAOT requirements](../dependency-injection/native-aot.md) before extending the sample.

</TabItem>

<TabItem value="uno-platform" label="Uno">

### Uno experience

The Uno head presents the same offline workspace. Browser sign-in remains unavailable and browser code cannot assume desktop raw-socket IMAP/SMTP capability.

<SampleGallery label="Prism Mail Uno" captures={sampleCaptures["mail"].uno} />

Uno runtime captures are pending. Windows builds are verified; Android and other native journeys need their own capture and interaction evidence.

### Set up and run {#uno-run}

Run from the repository root using its existing package versions, entitled [Commercial Plus feed](../pipelines/commercial-plus.md), and the matching SDK/workloads.

Select the Desktop target on a supported desktop host:

```sh
dotnet run --project samples/prism-mail/Uno/PrismMail/PrismMail.Uno.csproj -f net10.0-desktop -p:TargetFrameworks=net10.0-desktop --launch-profile "PrismMail.Uno (Desktop)"
```

<details>
<summary>Run the browser target</summary>

With the matching WebAssembly workload, select the separately declared browser head:

```sh
dotnet run --project samples/prism-mail/Uno/PrismMail/PrismMail.Uno.csproj -f net10.0-browserwasm -p:TargetFrameworks=net10.0-browserwasm -p:TargetFramework=net10.0-browserwasm --launch-profile "PrismMail.Uno (WebAssembly)"
```

These are source-backed target-selection commands, not a claim that a new browser run was completed for this walkthrough.

</details>

### Guided walkthrough {#uno-walkthrough}

1. **Search the inbox, load another page, and toggle read state.** Stale reads cannot publish into a newly selected account. Read the [session boundary](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-mail/Shared/Accounts/WorkspaceSession.cs).

2. **Reply or forward, choose a contact, save a draft, and reopen it.** The dialog uses shared recipient rules; attachment rows remain metadata only. Read the [routes and dialog registration](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-mail/Uno/PrismMail/PrismStartup.cs).

3. **Cancel a dirty composer, then inspect Calendar’s day/week/agenda ranges.** Keep editing retains the draft; demo event times are explicitly UTC. Read the [offline walkthrough](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-mail/README.md).

4. **Inspect configuration and submission outcomes before enabling any live connection.** Dummy public settings leave live access disabled; an uncertain send is never automatically repeated. Read the [submission semantics](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-mail/Shared/Accounts/WorkspaceSession.cs).

<details>
<summary>Trace the Uno startup and module code</summary>


The [Uno App class](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-mail/Uno/PrismMail/App.xaml.cs) owns native startup and shell creation. Excerpt (retain its remaining lifecycle methods):

```csharp
protected override IContainerExtension CreateContainerExtension()
    => new MicrosoftContainerExtension();

protected override UIElement CreateShell()
    => _shell = Container.Resolve<MainPage>();

protected override void RegisterTypes(IContainerRegistry registry)
    => PrismStartup.RegisterTypes(registry);
```

The head's [PrismStartup](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-mail/Uno/PrismMail/PrismStartup.cs) registers the real on-demand graph:

```csharp
catalog.AddModule<ContactsModule>(MailModules.Contacts, InitializationMode.OnDemand);
catalog.AddModule<MailModule>(MailModules.Mail, InitializationMode.OnDemand, MailModules.Contacts);
catalog.AddModule<CalendarModule>(MailModules.Calendar, InitializationMode.OnDemand);
```


Follow [the shared application rules](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-mail/Shared/Accounts/WorkspaceSession.cs) next, then the head's feature view registrations. Shared view models request logical routes; only the head references native view types. The loader checks dependency completion before navigation and does not claim to repair every module-manager failure mode.

</details>

<details>
<summary>Essentials, persistence, and private-by-default diagnostics</summary>


Essentials provides platform services and a generated secure-store manifest. Runtime tokens require the secure backend and fail closed without a preferences fallback. Mobile.BuildTools generates typed public-client settings from safe dummy defaults; build constants are not secret storage.


The container creates WorkspaceSession with `ILogger<WorkspaceSession>`; provider aliases share that instance. Fixed account/read/mutation/draft/submission outcomes exclude addresses, content, contacts, appointments, tokens, and provider responses. An ambiguous send remains Uncertain.


The filtered Prism Console provider also covers Essentials error forwarding. Only fixed operation/outcome categories and bounded error types reach local standard output. No remote provider, credentials, persistent log file, or user identity is configured. See [the diagnostics guide](index.md#diagnose-real-workflows-with-prism-logging).

</details>

### Validation and limits {#uno-validation}

Selected Uno Windows builds passed. Android, Desktop, browser, and Apple retain their own runtime boundaries; iOS/macOS capture work is deferred. WebAssembly AOT and desktop NativeAOT are different deployment paths. Live provider interoperability, mobile/browser authorization, and runtime IMAP connection UI remain incomplete. Use the offline demo for this walkthrough. Check [the sample README](https://github.com/PrismLibrary/samples/blob/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/samples/prism-mail/README.md), [capture provenance](runtime-coverage.md), and [Prism 10.0 NativeAOT requirements](../dependency-injection/native-aot.md) before extending the sample.

</TabItem>

<TabItem value="avalonia" label="Avalonia">

### Coming soon

Prism Mail does not yet have an Avalonia application head, runnable walkthrough, or captured UI. Prism supports Avalonia APIs; this particular sample head and its Essentials integration are still to come.

Continue with one of the available framework tabs, or explore the [Avalonia starter template](https://github.com/PrismLibrary/samples/tree/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57/sample-template/Avalonia).

</TabItem>

</Tabs>

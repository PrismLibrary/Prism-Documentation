---
sidebar_position: 6
title: Background tasks
---

# Background tasks

Background tasks are an optional Essentials add-on for scheduled work and foreground-coordinated polling. They are not included in `UsePrismEssentials()`.

| Host | Package |
| --- | --- |
| Shared contracts | `Prism.Plugin.Essentials.BackgroundTasks` |
| MAUI | `Prism.Plugin.Essentials.BackgroundTasks.Maui` |
| WPF | `Prism.Plugin.Essentials.BackgroundTasks.Wpf` |
| Uno WinUI | `Prism.Plugin.Essentials.BackgroundTasks.Uno.WinUI` |
| Uno Skia | `Prism.Plugin.Essentials.BackgroundTasks.Uno.Skia.WinUI` |

## Implement and register work

Keep the task cancellable and safe to retry. This example delegates to an application-owned synchronization service:

```csharp
using Prism.Plugin.Essentials.ApplicationModel.BackgroundTasks;

public interface IOrderSync
{
    Task RunAsync(CancellationToken token);
}

public sealed class SyncOrdersTask(IOrderSync sync) : IBackgroundTask
{
    public Task ExecuteAsync(BackgroundTaskContext context, CancellationToken token)
        => sync.RunAsync(token);
}
```

Register the application's `IOrderSync` implementation, then configure the scheduler in the host's existing registration callback:

```csharp
using Prism.Plugin.Essentials;
using Prism.Plugin.Essentials.ApplicationModel.BackgroundTasks;

registry.RegisterSerializer(AppJsonContext.Default, BackgroundTaskStore.SerializationContext);
registry.UsePrismEssentials();
registry.RegisterBackgroundTasks(tasks =>
    tasks.Add<SyncOrdersTask>(
        "SyncOrders",
        runWhileInForeground: true,
        network: BackgroundNetworkRequirement.Any));
```

The scheduler requires Essentials' connectivity, battery, serializer, and associated store services. MAUI must also call `UsePrismBackgroundTasksLifecycle()` on its `MauiAppBuilder` after `UseMauiApp`. WPF and Uno registration wire their application lifecycle. Uno must also start the coordinator after Prism builds the host, in the application's existing `OnInitialized` override:

```csharp
using Prism.Plugin.Essentials;

protected override void OnInitialized()
{
    this.StartPrismBackgroundTasks();
    // Retain the rest of your application initialization.
}
```

Resume callbacks reuse that initialized host. Do not wait for `LeavingBackground` to start first-launch work, or resolve the host before Prism has built it. Use the same setup whether NativeAOT is enabled or disabled.

Inject `IBackgroundTaskScheduler` to call `RunAsync(identifier, token)`, inspect registrations, or cancel them. Observe `TaskStarted` and `TaskFinished` only with an owned, disposable subscription. Inspect the returned result rather than assuming that a request means work completed successfully.

## Scheduling boundaries

| Target | Scheduling behavior |
| --- | --- |
| Android | WorkManager for periodic work, with a minimum periodic interval of 15 minutes and OS-controlled constraints. |
| iOS / Mac Catalyst | BGTaskScheduler processing tasks with required background mode and permitted identifiers; the OS decides delivery. Simulator foreground/manual execution does not prove native scheduling. |
| MAUI / Uno Windows WinUI heads | In-process coordination; do not infer WPF Task Scheduler behavior from a Windows TFM. |
| WPF | Windows Task Scheduler can relaunch the executable for non-foreground work; foreground polling uses the WPF dispatcher. |
| Uno Skia Desktop | Windows Task Scheduler, macOS launchd, or Linux systemd user timers; unavailable/failed native scheduling can fall back to an in-process timer. |
| Uno BrowserWasm | In-process while the tab can run; foreground polling stops when hidden. There is no service-worker scheduler or durable background process. |

On Apple platforms, configure `UIBackgroundModes` with `processing` and `BGTaskSchedulerPermittedIdentifiers`. With the default prefix, permitted identifiers are `com.prism.essentials.backgroundtask.default`, `.charging`, `.network`, and `.chargingnetwork` (each suffix appended to `com.prism.essentials.backgroundtask`). If you customize `BackgroundTaskSchedulerOptions.IdentifierPrefix`, keep declarations aligned.

Desktop OS jobs launch the application with `--prism-essentials-bg=<identifier>`. Preserve the normal scheduler startup path and account for the fact that the application process starts to execute the task. Native registration failure and in-process fallback do not provide the same closed-app behavior.

## Generated persistence metadata and NativeAOT

Merged Plugins #184 exposes `BackgroundTaskStore.SerializationContext` for the plugin's private persistence DTOs. Compose it with `AppJsonContext.Default` in the first `RegisterSerializer` call, as above, before Essentials and scheduler registration. An application context alone does not describe those DTOs. A second registration will preserve the existing serializer rather than extend it.

This supplies JSON metadata without reflection fallback. It does not independently preserve every task type: persisted registrations still reload task types from stored names with `Type.GetType`. Keep tasks statically registered/resolvable in the container, preserve any types needed after trimming, and verify task recovery after restart. Include metadata for your own parameter value shapes. The [Microsoft-container NativeAOT setup](../../../dependency-injection/native-aot.md) and actual OS scheduling/relaunch tests remain required. Generated metadata is supported source behavior; fresh native scheduling, relaunch, and NativeAOT runtime acceptance remain validation work.

## Design for interruption

Use stable operation IDs or checkpoints to avoid duplicate external effects. Handle offline and low-battery conditions, partially completed work, OS revocation, overlapping triggers, cancellation, and application restart. Requested intervals are not delivery guarantees; use an appropriate server-side mechanism when the feature needs stronger timing or closed-app guarantees.

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`docs/Prism.Plugin.Essentials.BackgroundTasks.md`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/docs/Prism.Plugin.Essentials.BackgroundTasks.md)
- [`src/Prism.Plugin.Essentials.BackgroundTasks/ApplicationModel/BackgroundTasks/IBackgroundTaskScheduler.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials.BackgroundTasks/ApplicationModel/BackgroundTasks/IBackgroundTaskScheduler.cs)
- [`src/Prism.Plugin.Essentials.BackgroundTasks/ApplicationModel/BackgroundTasks/BackgroundTaskStore.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials.BackgroundTasks/ApplicationModel/BackgroundTasks/BackgroundTaskStore.cs)
- [`src/Prism.Plugin.Essentials.BackgroundTasks.Uno.WinUI/EssentialsBackgroundTasksRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials.BackgroundTasks.Uno.WinUI/EssentialsBackgroundTasksRegistrationExtensions.cs)

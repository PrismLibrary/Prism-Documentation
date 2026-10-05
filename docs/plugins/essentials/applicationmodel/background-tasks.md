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

registry.UsePrismEssentials();
registry.RegisterBackgroundTasks(tasks =>
    tasks.Add<SyncOrdersTask>(
        "SyncOrders",
        runWhileInForeground: true,
        network: BackgroundNetworkRequirement.Any));
```

The scheduler requires Essentials' connectivity, battery, serializer, and associated store services. MAUI must also call `UsePrismBackgroundTasksLifecycle()` on its `MauiAppBuilder` after `UseMauiApp`. WPF and Uno registration wire their own application lifecycle; ensure registration happens while that application lifecycle is available.

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

## NativeAOT persistence limitation

:::warning
The current background-task persistence path is not qualified for NativeAOT. It serializes private registration DTOs and reloads task types from stored type names. Adding the application's ordinary `JsonSerializerContext` cannot provide metadata for those private DTOs or guarantee type-name resolution.
:::

Do not assume that the [Microsoft container's NativeAOT support](../../../dependency-injection/native-aot.md) makes persisted scheduling compatible. Use a verified non-NativeAOT deployment for this feature until an appropriate plugin persistence/type-resolution path has been validated. Do not suppress warnings or re-enable reflection to imply support.

## Design for interruption

Use stable operation IDs or checkpoints to avoid duplicate external effects. Handle offline and low-battery conditions, partially completed work, OS revocation, overlapping triggers, cancellation, and application restart. Requested intervals are not delivery guarantees; use an appropriate server-side mechanism when the feature needs stronger timing or closed-app guarantees.

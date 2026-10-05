---
sidebar_position: 2
title: Host capabilities and lifetimes
---

# Host capabilities and lifetimes

Essentials exposes portable contracts through host-specific implementations. A package or service registration is not a promise that the OS, hardware, browser, or current user permissions support every operation.

## Platform matrix

| Head | Integration and capability boundaries |
| --- | --- |
| MAUI Android / iOS / Mac Catalyst / Windows | Use `Prism.Plugin.Essentials.Maui` assets matching the target. Native services need the activity/window lifecycle, declarations, and OS capabilities for the operation. Package assets do not independently qualify a head for NativeAOT. |
| WPF | Use `Prism.Plugin.Essentials.Wpf`; implementations use Windows desktop services. OS features such as biometrics and location may be unavailable or denied. WPF does not become NativeAOT-capable through Essentials. |
| Uno mobile / WinUI | Use the appropriate Uno integration and `ConfigurePrismEssentials` host/window setup. Match package assets, Uno SDK, and the selected platform head. |
| Uno Skia Desktop | Uses Windows, macOS, or Linux implementations where provided. Some features need OS utilities or keychain/biometric services. Handle unavailable backends. |
| Uno BrowserWasm | Browser implementations are subject to browser support, permissions, tab visibility, and browser storage behavior. They are not equivalent to native OS services or a durable background process. |
| Avalonia | There is no dedicated Essentials host package in the reviewed 9.1 source. An application must supply verified adapters; Prism.Avalonia support alone does not provide them. |

For [geolocation](devices/sensors/geolocation.md) and [background tasks](applicationmodel/background-tasks.md), install their separate host packages. The base `Prism.Plugin.Essentials` reference used by a shared library does not supply every host registration.

## Registration lifetimes

The baseline host registrations use `TryRegister` APIs, allowing an application registration made first to remain in place.

| Typical default lifetime | Services |
| --- | --- |
| Singleton | Battery, browser, connectivity, device information, email, file system, latest version, launcher, permissions, phone dialer, version tracking, main thread, and toasts |
| Transient | Clipboard, action sheets, alerts, prompts, the composite notifications service, and biometrics when registered |
| Singleton generated contract | Application stores registered with `RegisterStore<T>()` |

These are service lifetimes, not permission grants or ownership of a UI screen. Do not capture a page-scoped navigation service or view in an application singleton. When replacing a default, preserve its thread, lifetime, and native ownership requirements.

## Cancellation and subscriptions

- `IToasts.DisplayAsync` accepts a cancellation token and returns a `ToastResult`, including `Cancelled` and `Replaced`.
- `IPermissionsManager` operations do not accept cancellation tokens. Do not invent an overload or promise to dismiss an OS permission prompt by cancelling application work.
- `IConnectivity.State()` and GPS readings are observables. Hold and dispose subscriptions; subscription disposal and stopping an owned GPS listener are separate responsibilities.
- `IFileSystem.OpenFileAsync` and `FileExistsAsync` do not accept cancellation tokens. A subsequent `Stream.CopyToAsync` can use your operation token.
- Use `IMainThread.InvokeOnMainThreadAsync` when an operation must be awaited on the UI thread. A queued `BeginInvokeOnMainThread` call has no completion result.

## Secure storage

Choose `[SecureStore]` only with a verified backend and an explicit recovery plan. Its default fallback is `None`. A fallback to ordinary settings changes the security properties; a memory fallback is ephemeral.

Browser storage does not provide the same protection as an OS keychain and is exposed to same-origin script compromise and profile clearing. Desktop keychains can be locked or absent. Handle these cases rather than silently changing storage backends. See [stores](io/stores.md).

## Features still awaiting publication

The current guide does not advertise DeviceDisplay, portable picked-file references, or the new camera/share contracts as generally available. Their API and platform guidance will be added after review, merge, and package availability are confirmed. The existing [camera](media/camera.md) and [share](applicationmodel/datatransfer/share.md) pages identify that boundary.

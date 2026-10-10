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
| Avalonia | There is no dedicated Essentials host package in the reviewed source. An application must supply verified adapters; Prism.Avalonia support alone does not provide them. |

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

## Display, media, and sharing boundaries

[Device display](devices/display.md) is included by `UsePrismEssentials()` and has Android/iOS backends. Its other registered hosts throw `FeatureNotSupportedException`; desktop monitor support is not implied.

[Portable files](io/file-references.md), [media](media/index.md), and [sharing](applicationmodel/datatransfer/share.md) document Plugins #167's `154cd86` source contract while merge/publication and fresh device acceptance remain pending. `RegisterMedia()` and `RegisterShare()` are separate opt-ins and each includes file services. Media uses `IMedia.PickAsync` / `CaptureAsync`; Share uses `IShare.RequestAsync` independently. Android/iOS have native routes; other registered MAUI/Uno/WPF targets report no media/share capabilities. Desktop cameras, manual controls, and owned camera sessions are unsupported.

Merged Plugins #184's serializer and startup guidance uses master `22bf2ff`. Explicit serializer setup applies to all builds, and Uno background tasks start from `OnInitialized` after the host is built. Use the normal app path in AOT and ordinary builds; runtime qualification remains separate. [Custom permission gaps](permissions/permissions-manager.md#permission-metadata-and-custom-permissions) are tracked in #185.

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Wpf/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials.Wpf/EssentialRegistrationExtensions.cs)

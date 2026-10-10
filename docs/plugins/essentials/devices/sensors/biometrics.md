---
sidebar_position: 1
uid: Plugins.Essentials.Devices.Sensors.Biometrics
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Biometrics

`IBiometrics` checks local biometric availability and requests native authentication. Its namespace is `Prism.Plugin.Essentials.Devices.Sensors`. Registration is transient: WPF's `UsePrismEssentials()` includes it; MAUI and Uno must opt in with `registry.RegisterBiometrics()` after their [host setup](../../index.md).

```csharp
using Prism.Plugin.Essentials.Devices.Sensors;

public sealed class LocalUnlock(IBiometrics biometrics)
{
    public async Task<BiometricAuthenticationResult> AuthenticateAsync(
        CancellationToken cancellationToken)
    {
        var request = new AuthenticationRequestConfiguration(
            "Unlock", "Confirm your identity to continue")
        {
            AllowAlternativeAuthentication = false
        };
        return await biometrics.AuthenticateAsync(request, cancellationToken);
    }
}
```

Call from the active foreground UI. Continue only when `result.Authenticated` is `true`; it means `Status == Succeeded`. Keep `Canceled`, `Denied`, `NotAvailable`, `FallbackRequested`, and failed attempts distinct in the UI. A requested fallback is not successful authentication. Do not log raw biometric error text as user identity.

## Availability and cancellation

`GetAvailabilityAsync(bool allowAlternativeAuthentication = false)` returns a `BiometricAvailability` value such as `Available`, `NoPermission`, `NoSensor`, or `NoFingerprint`. `IsAvailableAsync` is its Boolean convenience form. `GetAuthenticationTypeAsync()` describes the available type. These checks do not take cancellation tokens; `AuthenticateAsync` does.

The shared authentication base rechecks availability before presenting the prompt. A preflight may become stale, and native cancellation behavior differs. Handle both the returned cancellation status and a canceled task from the selected backend. Own the cancellation source for the operation and cancel when its UI owner ends; do not start overlapping prompts.

`AuthenticationRequestConfiguration` contains a title/reason, cancel/fallback captions, `AllowAlternativeAuthentication`, Android help text, and Android `ConfirmationRequired`. Alternative authentication is a deliberate policy choice: enabling it may allow a device PIN/password on supported backends.

<Tabs groupId="platform">
<TabItem value="maui" label=".NET MAUI">

Android requires a current `FragmentActivity`, a nonempty title, and the appropriate `USE_BIOMETRIC` (or legacy `USE_FINGERPRINT`) manifest declaration. Resolve the service after an Activity exists. Apple uses LocalAuthentication; for Face ID include an app-specific [NSFaceIDUsageDescription](https://developer.apple.com/documentation/bundleresources/information-property-list/nsfaceidusagedescription) in Info.plist. Hardware, enrollment, and user denial remain runtime conditions. Windows native availability must be checked on the target machine.

</TabItem>
<TabItem value="wpf" label="WPF">

The desktop backend uses Windows Biometric Framework fingerprint identification. It is not a general Windows Hello PIN/face adapter. Missing hardware, enrollment, or system service can make it unavailable. Do not promise that `AllowAlternativeAuthentication` enables a desktop PIN fallback.

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

Native mobile heads share the Android/Apple setup. Skia Desktop has separate Windows, macOS, and Linux implementations whose availability depends on native services and hardware. BrowserWasm explicitly returns `NoSensor` / `AuthenticationType.None` and an unavailable result. It does not implement passkeys or WebAuthn.

</TabItem>
</Tabs>

A local success is not remote account authentication, authorization, or encryption of persisted data. Use your application's identity and [secure-storage](../../io/stores.md) policies for those responsibilities.

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Essentials/Devices/Sensors/Biometrics/IBiometrics.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials/Devices/Sensors/Biometrics/IBiometrics.cs)
- [`src/Prism.Plugin.Essentials/Devices/Sensors/Biometrics/AuthenticationRequestConfiguration.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials/Devices/Sensors/Biometrics/AuthenticationRequestConfiguration.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/Desktop/Win32/Devices/BiometricImplementation.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials.Uno.WinUI/Desktop/Win32/Devices/BiometricImplementation.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/Wasm/Devices/BiometricImplementation.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials.Uno.WinUI/Wasm/Devices/BiometricImplementation.cs)

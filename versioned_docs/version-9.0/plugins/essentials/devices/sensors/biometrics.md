---
sidebar_position: 1
uid: Plugins.Essentials.Devices.Sensors.Biometrics
description: "Request local biometric authentication on supported native Prism Essentials 9.0 hosts."
---

# Biometrics

`IBiometrics` checks local biometric availability and requests native authentication. MAUI and supported native Uno heads must opt in with `RegisterBiometrics()` from `Prism.Plugin.Essentials`; the service is transient and is not included in `UsePrismEssentials()`. WPF's 9.0 host has no biometrics registration.

```csharp
using Prism.Plugin.Essentials.Devices.Sensors;

public sealed class LocalUnlock(IBiometrics biometrics)
{
    public Task<BiometricAuthenticationResult> AuthenticateAsync(
        CancellationToken cancellationToken)
    {
        var request = new AuthenticationRequestConfiguration(
            "Unlock", "Confirm your identity to continue")
        {
            AllowAlternativeAuthentication = false
        };
        return biometrics.AuthenticateAsync(request, cancellationToken);
    }
}
```

Continue only when `result.Authenticated` is true, which corresponds to `Status == Succeeded`. Cancellation, unavailability, denial, and a fallback request are distinct outcomes. A completed task alone is not a successful authentication.

## Availability and host setup

`GetAvailabilityAsync()` returns a `BiometricAvailability`; `IsAvailableAsync()` is its Boolean convenience form. `GetAuthenticationTypeAsync()` describes the available type. These checks have no cancellation-token parameter; `AuthenticateAsync` does.

Android needs an active `FragmentActivity`, a nonempty prompt title, and the applicable biometric/fingerprint manifest declaration. Apple uses LocalAuthentication and requires a Face ID usage description when that capability is used. The Windows backend uses `UserConsentVerifier`; OS configuration and enrolled credentials affect availability.

`AllowAlternativeAuthentication` controls fallback where the backend supports it. Treat enabling a device PIN/password fallback as an explicit authentication-policy choice. Keep the cancellation source with the UI operation and avoid overlapping prompts. Native cancellation behavior must be checked on the actual target.

A local success does not authenticate a remote account, authorize a server action, or encrypt data. Complete [host setup](../../index.md) before resolving native services.

## Source reference

These pinned source links describe the Plugins 9.0 baseline and require authorized access to the Prism.Plugins repository.

- [`src/Prism.Plugin.Essentials/Devices/Sensors/Biometrics/IBiometrics.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Devices/Sensors/Biometrics/IBiometrics.cs)
- [`src/Prism.Plugin.Essentials/Devices/Sensors/Biometrics/AuthenticationRequestConfiguration.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Devices/Sensors/Biometrics/AuthenticationRequestConfiguration.cs)
- [`src/Prism.Plugin.Essentials/Devices/Sensors/Biometrics/BiometricAuthenticationResult.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Devices/Sensors/Biometrics/BiometricAuthenticationResult.cs)
- [`src/Prism.Plugin.Essentials/Devices/Sensors/Biometrics/BiometricImplementation.android.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Devices/Sensors/Biometrics/BiometricImplementation.android.cs)
- [`src/Prism.Plugin.Essentials/Devices/Sensors/Biometrics/BiometricImplementation.apple.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Devices/Sensors/Biometrics/BiometricImplementation.apple.cs)
- [`src/Prism.Plugin.Essentials/Devices/Sensors/Biometrics/BiometricImplementation.windows.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Devices/Sensors/Biometrics/BiometricImplementation.windows.cs)
- [`src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs)

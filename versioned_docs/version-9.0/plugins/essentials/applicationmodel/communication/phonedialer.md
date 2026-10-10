---
sidebar_position: 2
uid: Plugins.Essentials.ApplicationModel.Communication.PhoneDialer
description: "Open a phone dialer on supported Prism Essentials 9.0 targets."
---

# Phone Dialer

`IPhoneDialer` opens a telephone number through the platform's dialer. Register it with `RegisterPhoneDialer()` or supported [Essentials setup](../../index.md), then inject `Prism.Plugin.Essentials.ApplicationModel.Communication.IPhoneDialer`.

```csharp
using Prism.Plugin.Essentials.ApplicationModel.Communication;

public sealed class DialerAction(IPhoneDialer dialer)
{
    public bool Open(string number)
    {
        if (!dialer.IsSupported)
            return false;

        dialer.Open(number);
        return true;
    }
}
```

Android and iOS have native implementations. Other targets in this baseline, including WPF, use an unsupported fallback: `IsSupported` is false and `Open` throws `PlatformNotSupportedException`. Registration therefore does not prove that dialing is available.

Validate the number and launch only from an intentional user action. Handle native launch exceptions. `Open` returns void; it has no cancellation token, call result, or connection status. The example's true result only means the synchronous request returned, not that a call connected.

For supported URI handlers see [Launcher](../launcher.md).

## Source reference

These pinned source links describe the Plugins 9.0 baseline and require authorized access to the Prism.Plugins repository.

- [`src/Prism.Plugin.Essentials/ApplicationModel/Communication/PhoneDialer/IPhoneDialer.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/ApplicationModel/Communication/PhoneDialer/IPhoneDialer.cs)
- [`src/Prism.Plugin.Essentials/ApplicationModel/Communication/PhoneDialer/PhoneDialer.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/ApplicationModel/Communication/PhoneDialer/PhoneDialer.cs)
- [`src/Prism.Plugin.Essentials/ApplicationModel/Communication/PhoneDialer/PhoneDialer.android.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/ApplicationModel/Communication/PhoneDialer/PhoneDialer.android.cs)
- [`src/Prism.Plugin.Essentials/ApplicationModel/Communication/PhoneDialer/PhoneDialer.ios.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/ApplicationModel/Communication/PhoneDialer/PhoneDialer.ios.cs)

---
sidebar_position: 2
uid: Plugins.Essentials.ApplicationModel.Communication.PhoneDialer
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Phone dialer

`Prism.Plugin.Essentials.ApplicationModel.Communication.IPhoneDialer` opens a telephone number through the platform. It does not place or monitor a call. Register the host's `UsePrismEssentials()` or `RegisterPhoneDialer()` and inject the singleton.

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

Validate the number and invoke this only from an intentional user action. Handle launch exceptions in the caller. `Open` returns `void`: there is no cancellation token, call result, or connection status. Even the example's `true` only means the synchronous request returned.

<Tabs groupId="platform">
<TabItem value="maui" label=".NET MAUI">

Android and iOS provide native dialer implementations. Other MAUI targets use an unsupported fallback whose `IsSupported` is `false` and whose `Open` throws. Device capabilities and installed handlers still matter.

</TabItem>
<TabItem value="wpf" label="WPF">

The WPF implementation reports `IsSupported == true` and attempts shell execution of a `tel:` URI. That is not proof a telephone handler is installed or that the machine can make calls. Shell failures can throw.

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

Android/iOS use the native dialer. Skia Desktop reports `true` and launches `tel:` through the shell. BrowserWasm reports `true` and starts an asynchronous URI launch without exposing its result. WinUI/other native fallback targets may report unsupported. Handle the selected backend's actual behavior rather than using the framework name as a capability check.

</TabItem>
</Tabs>

See [Launcher](../launcher.md) for an asynchronous URI-launch contract and [host setup](../../index.md) for unsupported integrations, including Avalonia.

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Essentials/ApplicationModel/Communication/PhoneDialer/IPhoneDialer.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials/ApplicationModel/Communication/PhoneDialer/IPhoneDialer.cs)
- [`src/Prism.Plugin.Essentials/ApplicationModel/Communication/PhoneDialer/PhoneDialer.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials/ApplicationModel/Communication/PhoneDialer/PhoneDialer.cs)
- [`src/Prism.Plugin.Essentials.Wpf/ApplicationModel/Communication/PhoneDialerImplementation.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials.Wpf/ApplicationModel/Communication/PhoneDialerImplementation.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/Wasm/ApplicationModel/PhoneDialerImplementation.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials.Uno.WinUI/Wasm/ApplicationModel/PhoneDialerImplementation.cs)

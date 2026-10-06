---
sidebar_position: 1
uid: Plugins.Essentials.ApplicationModel.Communication.Email
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Email

`IEmailer` opens the user's mail composer with an `EmailMessage`. It does not send mail through a server. The singleton is included by `UsePrismEssentials()` or can be added with `RegisterEmailer()` after the [host setup](../../index.md).

```csharp
using Prism.Plugin.Essentials.ApplicationModel.Communication;

public sealed class SupportEmail(IEmailer emailer)
{
    public async Task<bool> ComposeAsync()
    {
        if (!emailer.IsComposeSupported)
            return false;

        await emailer.ComposeAsync(new EmailMessage(
            "Support request",
            "Please describe the issue here.",
            "support@example.com")
        {
            BodyFormat = EmailBodyFormat.PlainText
        });
        return true;
    }
}
```

Replace the example recipient with your support address. Let the user initiate composition and review the content. Do not attach diagnostics, account details, or clipboard content automatically. `ComposeAsync` has no cancellation token or delivery result; returning from it does not tell you whether the user sent or discarded the message.

`EmailMessage` supports `Subject`, `Body`, `BodyFormat`, and `To`, `Cc`, and `Bcc` recipient lists. The current contract does not expose attachments. Passing `null` requests an empty composer.

## Host behavior

<Tabs groupId="platform">
<TabItem value="maui" label=".NET MAUI">

The Android and Apple heads use native composition facilities. Android handler discovery is subject to package visibility; configure a query matching your email intent when required. Apple requires an available configured mail composer. Windows uses the Windows email API and converts HTML to plain text. Start composition from the active UI and handle a missing mail app or platform exception.

</TabItem>
<TabItem value="wpf" label="WPF">

Support is determined from the Windows `mailto` registration. The implementation launches an escaped `mailto:` URI and converts HTML to plain text. A registered protocol can still fail at launch; this is reported as an exception.

</TabItem>
<TabItem value="uno-platform" label="Uno Platform">

Skia Desktop launches a `mailto:` URI. Its `IsComposeSupported` is always `true`, so it cannot guarantee that a mail client is installed. BrowserWasm also reports `true` and uses Uno's mailto composer, flattening HTML. Prefer plain text across heads and handle launch failures even after preflight.

</TabItem>
</Tabs>

For Android manifest visibility, see [the platform guidance](https://developer.android.com/training/package-visibility/declaring). For broader platform registration and unsupported hosts, see [host capabilities](../../platform-support.md).

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Essentials/ApplicationModel/Communication/Email/IEmailer.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials/ApplicationModel/Communication/Email/IEmailer.cs)
- [`src/Prism.Plugin.Essentials/ApplicationModel/Communication/Email/EmailMessage.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials/ApplicationModel/Communication/Email/EmailMessage.cs)
- [`src/Prism.Plugin.Essentials.Wpf/ApplicationModel/Communication/EmailerImplementation.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials.Wpf/ApplicationModel/Communication/EmailerImplementation.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/Desktop/EmailerImplementation.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials.Uno.WinUI/Desktop/EmailerImplementation.cs)

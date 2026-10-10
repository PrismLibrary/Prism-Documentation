---
sidebar_position: 1
uid: Plugins.Essentials.ApplicationModel.Communication.Email
description: "Open the mail composer with IEmailer and distinguish composition from delivery."
---

# Email

`IEmailer` opens the user's mail composer with an `EmailMessage`. Register it with the supported host's `RegisterEmailer()` or [Essentials setup](../../index.md), then inject the singleton. It does not send messages through a mail server.

```csharp
using Prism.Plugin.Essentials.ApplicationModel.Communication;

public sealed class SupportEmail(IEmailer emailer)
{
    public async Task<bool> ComposeAsync()
    {
        if (!emailer.IsComposeSupported)
            return false;

        await emailer.ComposeAsync(new EmailMessage(
            "Support request", "Please describe the issue.",
            "support@example.com")
        {
            BodyFormat = EmailBodyFormat.PlainText
        });
        return true;
    }
}
```

Replace the example recipient with your support address. Invoke composition from the active UI, and handle a missing mail application or launch exception even after checking support. Returning from `ComposeAsync` does not tell you whether the user sent or discarded the message.

`EmailMessage` supports subject, body, body format, and To/Cc/Bcc recipient lists. The 9.0 contract does not expose attachments. A null message requests an empty composer, and there is no cancellation-token overload.

## Host behavior

Android and Apple use native composition facilities; their handler visibility and mail-account setup affect availability. Windows uses the Windows email API. WPF tests for a registered `mailto` handler and launches an escaped `mailto:` URI. Windows and WPF convert HTML to plain text, so prefer plain text for shared templates.

Uno's 9.0 registration is conditional on its native platform target. Do not infer a desktop or browser composer from the presence of `IEmailer` in shared code. Let the user review recipients and content before sending; a composition helper provides no delivery receipt.

## Source reference

These pinned source links describe the Plugins 9.0 baseline and require authorized access to the Prism.Plugins repository.

- [`src/Prism.Plugin.Essentials/ApplicationModel/Communication/Email/IEmailer.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/ApplicationModel/Communication/Email/IEmailer.cs)
- [`src/Prism.Plugin.Essentials/ApplicationModel/Communication/Email/EmailMessage.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/ApplicationModel/Communication/Email/EmailMessage.cs)
- [`src/Prism.Plugin.Essentials.Wpf/ApplicationModel/Communication/EmailerImplementation.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Wpf/ApplicationModel/Communication/EmailerImplementation.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs)

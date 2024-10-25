---
uid: Plugins.Essentials.ApplicationModel.Communication.PhoneDialer
---

# Phone Dialer

The `IPhoneDialer` provides a cross platform API to open a Phone number on Android and iOS. This API is exposed on all Prism platforms and will provide a default implementation where `IsSupported` will provide a value of false. You should check this before attempting to open a phone number.

```cs
public interface IPhoneDialer
{
    bool IsSupported { get; }

    void Open(string number);
}
```
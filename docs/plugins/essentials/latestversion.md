---
uid: Plugins.Essentials.LatestVersion
---

# Latest Version

The `ILatestVersion` provides a cross platform and cross framework API to check if your app is up to date. By default this is Support on Android, iOS, MacCatalyst and WinUI. The interface is also resolvable for WPF and the remaining Uno Platform targets. For the unsupported targets `SupportsAppStore` will return false. `IsUsingLatestVersion` will return true and `GetLatestVersionNumber` will return the current app version. `OpenAppInStore` will throw a `PlatformNotSupportedException`.

```cs
public interface ILatestVersion
{
    string CountryCode { get; set; }

    string InstalledVersionNumber { get; }

    bool SupportsAppStore { get; }

    Task<bool> IsUsingLatestVersion();

    Task<string> GetLatestVersionNumber();
    
    Task OpenAppInStore();
}
```

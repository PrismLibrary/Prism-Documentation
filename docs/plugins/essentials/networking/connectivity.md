---
sidebar_position: 1
uid: Plugins.Essentials.Networking.Connectivity
---

# Connectivity

## API

```cs
public interface IConnectivity
{
    IEnumerable<ConnectionProfile> ConnectionProfiles { get; }

    NetworkAccess NetworkAccess { get; }

    IObservable<ConnectionState> State();
}
```


## Registration and subscription lifetime

Call the host's `UsePrismEssentials()` or `RegisterConnectivity()`, then inject `Prism.Plugin.Essentials.Networking.IConnectivity`. It is registered as a singleton.

`State()` provides observable connection state. Retain and dispose the subscription when its screen or service ends, and use `IMainThread` for bound UI updates. Network access is a useful hint, not proof that your server is reachable or that a particular request will succeed. Keep timeouts, cancellation, retry limits, and error handling on the actual network operation.

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Essentials/Networking/IConnectivity.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/f0abcbb95c9e865dc909966cfe8ad9883c42d5d5/src/Prism.Plugin.Essentials/Networking/IConnectivity.cs)

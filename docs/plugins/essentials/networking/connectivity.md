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

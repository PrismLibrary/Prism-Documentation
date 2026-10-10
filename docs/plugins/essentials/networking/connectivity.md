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

`State()` provides the current network access and connection profiles on subscription, followed by changes to either. The stream replays its current snapshot; own subscriptions across navigation and reconnect after their screen resumes. Retain and dispose the subscription when its screen or service ends, and use `IMainThread` for bound UI updates. Network access is a useful hint, not proof that your server is reachable or that a particular request will succeed. Keep timeouts, cancellation, retry limits, and error handling on the actual network operation.

## Source reference

The following pinned Prism source links require authorized access to the private Prism.Plugins repository. Package availability must be checked in your authorized feed.

- [`src/Prism.Plugin.Essentials/Networking/IConnectivity.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials/Networking/IConnectivity.cs)
- [`src/Prism.Plugin.Essentials/Networking/ConnectivityBase.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/22bf2ff10cbbc52fe00f9332530e1aac1b420ff4/src/Prism.Plugin.Essentials/Networking/ConnectivityBase.cs)

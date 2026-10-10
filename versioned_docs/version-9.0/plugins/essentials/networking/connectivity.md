---
sidebar_position: 1
uid: Plugins.Essentials.Networking.Connectivity
description: "Read network-access hints and manage Prism 9.0 connectivity subscriptions."
---

# Connectivity

## API

```csharp
public interface IConnectivity
{
    IEnumerable<ConnectionProfile> ConnectionProfiles { get; }
    NetworkAccess NetworkAccess { get; }
    IObservable<ConnectionState> State();
}
```

The contract is in `Prism.Plugin.Essentials.Networking`. Register it with the supported host's `RegisterConnectivity()` or [Essentials setup](../index.md), then inject the singleton.

## Read and observe connection state

Read `NetworkAccess` and `ConnectionProfiles` for the current host's network hint. `State()` is the observable contract for connection state. Keep its subscription with the screen/service that creates it, dispose it at teardown, and use [IMainThread](../threading/mainthread.md) for bound UI updates. Test initial values, disconnect/reconnect, and disposal on the actual package/host rather than assuming identical notification timing across heads.

Network access does not establish that a particular server is reachable. A connected adapter may be behind a captive portal, have no route to your endpoint, or lose access before the next request. Keep timeouts, cancellation, bounded retries, and error handling on the network operation itself.

The WPF implementation derives its hint from network-adapter state. MAUI and Uno native integrations use their platform-specific connectivity implementations; a shared reference does not register a browser/desktop service where the host registration is conditional.

## Source reference

These pinned source links describe the Plugins 9.0 baseline and require authorized access to the Prism.Plugins repository.

- [`src/Prism.Plugin.Essentials/Networking/IConnectivity.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Networking/IConnectivity.cs)
- [`src/Prism.Plugin.Essentials/Networking/ConnectivityBase.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/Networking/ConnectivityBase.cs)
- [`src/Prism.Plugin.Essentials.Wpf/Networking/Connectivity.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Wpf/Networking/Connectivity.cs)
- [`src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Maui/EssentialRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Uno.WinUI/EssentialRegistrationExtensions.cs)

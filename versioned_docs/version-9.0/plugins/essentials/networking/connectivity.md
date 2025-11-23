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


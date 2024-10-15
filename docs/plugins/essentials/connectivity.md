---
uid: Plugins.Essentials.Connectivity
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

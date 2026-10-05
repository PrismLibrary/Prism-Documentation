---
sidebar_position: 2
uid: Plugins.Essentials.Stores
---

# Stores

Generated stores give application code an injectable interface for settings, secure values, or temporary state. Reference `Prism.Plugin.Essentials` in the assembly declaring the interface and use the [matching host integration](../index.md) in the application.

## Declare and register a store

```csharp
using System.ComponentModel;
using Prism.Plugin.Essentials.IO;

[SettingsStore]
public partial interface IAppPreferences
{
    string? Theme { get; set; }

    [DefaultValue(true)]
    bool ShowHints { get; set; }
}
```

The interface must be partial. The Essentials generator creates its implementation, property-change notifications, and a `Clear()` member that clears this contract's properties. A handwritten test fake must implement the complete generated interface, including `Clear()`.

In the host's existing registration callback:

```csharp
using Prism.Ioc;

registry.RegisterStore<IAppPreferences>();
```

Inject `IAppPreferences` into your view model or service. Registration uses a singleton implementation; do not create a new store per page or resolve a generated implementation by its internal name.

## Choose the storage behavior

| Attribute | Purpose and limits |
| --- | --- |
| `[MemoryStore]` | Temporary in-process state. Values do not survive a restart. |
| `[SettingsStore]` | Persistent, non-sensitive application preferences. |
| `[SecureStore]` | Uses a secure-store backend where available. OS, browser, and recovery behavior differ by host. |

The default secure-store fallback is `None`. Choosing settings or memory as a fallback is an explicit application decision: settings does not preserve the same security property, and memory is not durable. Do not silently change the fallback to make an unsupported target work. Browser storage does not provide an OS-keychain security guarantee; see [host capabilities](../platform-support.md).

`Clear()` on a generated contract does not clear every unrelated key in the backing store. Clearing a backing `IKeyValueStore` directly has a broader effect.

## Generated mappings and NativeAOT

The 9.1 Essentials generator emits an assembly mapping from each store interface to its internal implementation. `RegisterStore<T>()` reads that mapping and retains the normal singleton registration. You do not need to make generated classes public, guess their names, or register them manually.

When upgrading, rebuild **every assembly that declares store interfaces** with the updated Essentials analyzer enabled. Updating only the executable cannot repair a previously compiled contracts assembly. A missing mapping produces a `TypeLoadException` identifying the interface and assembly to rebuild.

Mapping preservation covers store construction. The underlying backend and serialized data also need to support the deployment target.

### Supply JSON metadata before Essentials registration

For trimming or NativeAOT, define a context for the data actually used by your application. For the preferences above and version-tracking history:

```csharp
using System.Collections.Generic;
using System.Text.Json.Serialization;

[JsonSerializable(typeof(string))]
[JsonSerializable(typeof(bool))]
[JsonSerializable(typeof(List<string>))]
public partial class AppJsonContext : JsonSerializerContext
{
}
```

In your existing composition callback:

```csharp
using Prism.Ioc;
using Prism.Plugin.Essentials;

registry.RegisterSerializer(AppJsonContext.Default);
registry.RegisterStore<IAppPreferences>();
registry.UsePrismEssentials();
```

Add metadata for every other runtime type, collection shape, nullable value, and converter your enabled features serialize. This example is not a universal context for all Plugins. Missing metadata fails without a reflection fallback. You can register your own AOT-compatible `Prism.Plugin.Essentials.Serialization.ISerializer` first instead; Essentials preserves an existing registration.

The parameterless default serializer uses reflection. Do not re-enable reflection or suppress publish diagnostics as a substitute for metadata. [Background-task persistence](../applicationmodel/background-tasks.md) has additional constraints that an ordinary application context cannot solve.

## WPF settings identity

WPF's default settings identity is derived from the application assembly name and public-key token, or the entry assembly when no concrete application exists. It is stable across version and installation-path changes, but unsigned applications with the same assembly name can collide.

For a unique publisher/application identity, use the WPF-specific overload **before** any store services, `UsePrismEssentials()`, or version tracking are registered:

```csharp
registry.RegisterSerializer(AppJsonContext.Default);
registry.RegisterStore<IAppPreferences>("com.example.orders");
registry.UsePrismEssentials();
```

Additional contracts use `RegisterStore<T>()` without another identity. Keep the identifier stable across upgrades. Changing it selects a different store; existing files are not automatically migrated. Blank identifiers and late identity changes are rejected. This overload is not shared by every host.

## Verify behavior

Test first launch, defaults, updates, `Clear()`, restart, and unavailable storage on each target. Keep platform operations out of view-model constructors when native startup is not ready. For NativeAOT, publish and execute a consumer of the actual generated contracts assembly using the [supported Microsoft-container path](../../../dependency-injection/native-aot.md).

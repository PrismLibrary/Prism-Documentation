---
sidebar_position: 2
uid: Plugins.Essentials.Stores
description: "Generate and register typed memory, settings, and secure stores with the Prism 9.0 APIs."
---

# Stores

Stores expose application state through an injectable interface. Reference `Prism.Plugin.Essentials` in the assembly declaring the interface, and a [matching Essentials host package](../index.md) in the application.

## Available Stores

- `[MemoryStore]` keeps temporary values in the process.
- `[SettingsStore]` selects the host's settings backend for non-sensitive preferences.
- `[SecureStore]` selects a secure backend where one is registered.

The default secure-store fallback is `FallbackStrategy.None`. Explicit alternatives are `Memory`, `Settings`, and `Default`. A settings fallback does not preserve the security property of a secure backend; a memory fallback does not preserve values across restart. Uno BrowserWasm does not register the secure backend in this baseline.

## Creating a store

```csharp
using Prism.Plugin.Essentials.IO;

[SettingsStore]
public partial interface IAppPreferences
{
    string? Theme { get; set; }
}
```

The interface must be partial, with readable/writable properties that the generator can implement. Keep the Essentials analyzer enabled in the assembly containing the interface.

### What The Source Generator will do

The generator creates an implementation with property-change notifications and adds `Clear()` to the interface. The generated `Clear()` removes this interface's property keys, not every unrelated value in the backing store. A handwritten test fake must implement the generated members as well.

## Registering your Store

Register serialization and the generated contract in the host's existing container callback:

```csharp
using Prism.Ioc;
using Prism.Plugin.Essentials;

containerRegistry.RegisterSerializer();
containerRegistry.RegisterStore<IAppPreferences>();
```

The registration extension is in `Prism.Ioc`. It registers the generated implementation as a singleton and adds the host's store factory/backends. Inject `IAppPreferences` into the service or view model that owns the state.

Prism 9.0 locates generated implementations by runtime type name. It does not have the newer generated assembly-mapping or JSON-context registration APIs. Do not use newer overloads as a recipe for this package generation. Missing generated code can cause a `TypeLoadException`; rebuild the interface assembly with its analyzer enabled.

## Providing Default Values

Use `System.ComponentModel.DefaultValueAttribute` when the contract needs an explicit default:

```csharp
using System.ComponentModel;
using Prism.Plugin.Essentials.IO;

[SettingsStore]
public partial interface IDisplayPreferences
{
    [DefaultValue(true)]
    bool ShowHints { get; set; }
}
```

Test defaults, updates, null values, `Clear()`, process restart, and unavailable storage on every target used by the application. Storage scope and retention depend on the backend; do not use a settings store as an application database or a transaction log. Changing an interface/property name can change the generated storage keys and requires a migration plan.

## Source reference

These pinned source links describe the Plugins 9.0 baseline and require authorized access to the Prism.Plugins repository.

- [`src/Prism.Plugin.Essentials/IO/Stores/SecureStoreAttribute.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/IO/Stores/SecureStoreAttribute.cs)
- [`src/Prism.Plugin.Essentials/IO/Stores/FallbackStrategy.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/IO/Stores/FallbackStrategy.cs)
- [`src/Prism.Plugin.Essentials/IO/Stores/Internals/StoreRegistrationHelper.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/IO/Stores/Internals/StoreRegistrationHelper.cs)
- [`src/Prism.Plugin.Essentials/UniqueName.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/UniqueName.cs)
- [`src/Prism.Plugin.Essentials.Analyzers/KeyStoreStoreGenerator.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Analyzers/KeyStoreStoreGenerator.cs)
- [`src/Prism.Plugin.Essentials.Maui/Ioc/StoreRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Maui/Ioc/StoreRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials.Uno.WinUI/Ioc/StoreRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials.Uno.WinUI/Ioc/StoreRegistrationExtensions.cs)
- [`src/Prism.Plugin.Essentials/EssentialsRegistrationExtensions.cs`](https://github.com/PrismLibrary/Prism.Plugins/blob/bbafa527a111fb05f0078a86e810bc6e77c1807a/src/Prism.Plugin.Essentials/EssentialsRegistrationExtensions.cs)

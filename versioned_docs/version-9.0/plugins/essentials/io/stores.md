---
sidebar_position: 2
uid: Plugins.Essentials.Stores
---

# Stores

The concept of Stores is borrowed from one of our favorite .NET Libraries [Shiny.NET](https://shinylib.net/), however we've made a few enhancements and provided implementations for all of your Prism applications. One of the root concepts of Stores is that the store implementation should be decoupled from any logic around how it is used. This means that unit testing is particularly easy.

To get started you will need a reference to `Prism.Plugin.Essentials`. Note that this could be a transitive reference from the platform specific package for `Prism.Plugin.Essentials`. However you may use the root package for libraries that you wish to keep decoupled from platform specific references. The first thing to consider when building a store is what properties you may want to expose.

```cs
public interface IMyStore
{
    string MyProperty { get; set; }
}
```

## Available Stores

We currently support 3 stores by default. You can choose the store that makes the most sense for your specific application, and you can have multiple interfaces which utilize the same or different stores throughout your application.

- Memory Store - This is particular helpful for scenarios where you only need the values to remain in scope during the lifecycle of the application and you can revert back to a default state the next time the app is launched.
- Settings Store - This is useful for a wide degree of persistent values that you want to store and which do not present security concerns.
- Secure Store - This is useful for that last scenario where you need both persistence and to take advantage of the platform's built in ability to secure values. (NOTE: While this is implemented across all Prism platforms, some heads such as WASM do not support a Secure Store)

## Creating a store

As you noticed from the example above our store does not implement anything. In fact it simply needs to be an interface with properties that have both a get and set. However to actually make use of the store we must do 2 things.

1. We must provide an attribute for the Store type that we want to have implemented.
2. We must make the interface partial

```cs
[SecureStore]
public partial interface IMyStore
{
    string MyProperty { get; set; }
}
```

### What The Source Generator will do

Under the covers a source generator will provide both an implementation for your interface using the specified store type, and it will provide a class that implements `INotifyPropertyChanged` so that you can actually Bind directly to any property on your Store.

The next thing it will do is provide a Clear method. In the implementation it will clear out ONLY the properties specified as part of the interface. This means that other code that may be making use of the given store will never directly lose their values when you call clear unless you specifically get the KeyValueStore from the `IKeyValueStoreFactory` and clear all of the values for that specific store.

## Registering your Store

As mentioned you will need to be sure to have the platform specific package when registering the Store, however you do not need it for the Store itself. In order to register your store you can simply call the extension

```cs
containerRegistry.RegisterStore<IMyStore>();
```

## Providing Default Values

You may want to provide a default value for your properties. You can do this with the DefaultValue attribute from System.ComponentModel.

```cs
[SettingsStore]
public partial interface IMyStore
{
    [DefaultValue(true)]
    bool RememberMe { get; set; }
}
```


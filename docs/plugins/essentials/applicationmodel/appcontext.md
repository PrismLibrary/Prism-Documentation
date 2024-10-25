---
uid: Plugins.Essentials.ApplicationModel.AppContext
---

# AppContext

The default implementation of the `IAppContext` interface is available by registering Prism Essentials or by specifically Registering the AppContext.

```cs
containerRegistry.UsePrismEssentials();

// OR Specifically
containerRegistry.RegisterAppContext();
```

## API

```cs
public interface IAppContext
{
    string PackageName { get; }

    string Name { get; }

    string VersionString { get; }

    Version Version { get; }

    string BuildString { get; }

    void ShowSettingsUI();

    AppTheme RequestedTheme { get; }

    AppPackagingModel PackagingModel { get; }

    LayoutDirection RequestedLayoutDirection { get; }
}
```

## Read the app information

The IAppContext interface exposes the following properties:

- Name — The application name.
- PackageName — The package name or application identifier, such as com.prismlibrary.myapp.
- VersionString — The application version, such as 1.0.0.
- Version — The application version, as a Version object.
- BuildString — The build number of the version, such as 1000.
- RequestedTheme — The detected theme of the system or application.
- PackagingModel — The packaging model of the application.
- RequestedLayoutDirection — The requested layout direction of the system or application.

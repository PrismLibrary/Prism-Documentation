## Handling Resolution Errors

> [!NOTE]
> This feature was introduced in Prism 8 and does not apply if your app is targeting an earlier version

Exceptions happen for a variety of reasons. Some common errors developers run into is a Service that was not registered or invalid XAML that generates an Exception when the View is resolved. The Prism Container Extensions now are very intentional about catching any underlying container exception and throwing a `ContainerResolutionException`. The goal of the ContainerResolutionException is simple... shorten the dev loop by giving you the information you need to diagnose and fix problems in your code.

The `ContainerResolutionException` contains a number of constant messages like `MissingRegistration`, `CannotResolveAbstractType`, or `CyclicalDependency`. In addition to those constants, it exposes properties for the ServiceName and/or ServiceType that was being resolved.

```csharp
public class ModuleA : IModule
{
    private IServiceIForgotToRegister IAmADunce { get; }

    public ModuleA(IServiceIForgotToRegister iAmADummy)
    {
        IAmADunce = iAmADummy;
    }
}
```

Looking at the above code snippet we can see that I have a service I'm injecting into ModuleA as a hard dependency. Unfortunately I forgot to register it. We can of course hook into the LoadModuleCompleted event in the ModuleManager so that we can see what happens when the modules get loaded like shown here:

```csharp
protected override void InitializeModules()
{
    var manager = Container.Resolve<IModuleManager>();
    manager.LoadModuleCompleted += LoadModuleCompleted;
    manager.Run();
}

private void LoadModuleCompleted(object sender, LoadModuleCompletedEventArgs e)
{
    LoadModuleCompleted(e.ModuleInfo, e.Error, e.IsErrorHandled);
}

protected virtual void LoadModuleCompleted(IModuleInfo moduleInfo, Exception error, bool isHandled)
{
    if (error != null)
    {
        // Do Something
    }
}
```

In this example, I'm going to see that the error is a ContainerResolutionException and that the ServiceType is ModuleA with no ServiceName. But that doesn't really give me quite enough information. Luckily the `ContainerResolutionException` also has a `GetErrors()` method on it that provides us the ability to see what the type is and what the error is:

```csharp
protected virtual void LoadModuleCompleted(IModuleInfo moduleInfo, Exception error, bool isHandled)
{
    if (error != null && error is ContainerResolutionException cre)
    {
        var errors = cre.GetErrors();
        foreach((var type, var ex) in errors)
        {
            Console.WriteLine($"Error with: {type.FullName}");
            Console.WriteLine($"{ex.GetType().Name}: {ex.Message}");
        }
    }
}
```

When we run this we should see something like the following output:

```
Error with: MyProject.Services.IServiceIForgotToRegister
ContainerResolutionException: No Registration was found in the container for the specified type
```
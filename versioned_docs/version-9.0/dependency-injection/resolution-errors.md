---
sidebar_position: 5
uid: DependencyInjection.HandlingResolutionErrors
description: "Investigate Prism container resolution failures without losing the original exception or diagnostic context."
---

# Diagnosing resolution errors {#handling-resolution-errors}

`Prism.Ioc.ContainerResolutionException` adds the requested `ServiceType`, optional `ServiceName`, and the underlying container exception to a failed resolution. Common causes include a missing registration, a constructor dependency cycle, invalid XAML, or a constructor that throws.

This resolution-diagnostics feature was introduced in Prism 8. The examples here use the container contracts shipped with Prism 9.0.

## Inspect the first failure

Start with the original exception and its inner-exception chain in the debugger. Check:

1. The service contract and any registration name match the requested type/key.
2. The module that owns the registration has loaded before the consumer is created.
3. Each constructor dependency is available in the same intended scope.
4. The view and view-model pair is registered using the host's navigation/dialog API.
5. The failure is not inside application construction or XAML initialization.

Avoid network, permission prompts or asynchronous work in constructors. They complicate resolution and can leave an incompletely initialized graph.

## Detailed development diagnostics

In a development build, `GetErrors()` can inspect dependencies and return type/error pairs:

```csharp
catch (ContainerResolutionException exception)
{
    foreach (var (type, error) in exception.GetErrors())
        System.Diagnostics.Debug.WriteLine($"{type.FullName}: {error.GetType().Name}");
    throw;
}
```

Use this around an explicit development resolution boundary, or when examining a failure provided by the host's navigation/module result. Preserve the original failure rather than replacing it with an empty screen or claiming a failed module loaded successfully.

:::warning Diagnostic side effects
The 9.0 implementation of `GetErrors()` inspects runtime-discovered constructors and can attempt additional resolutions/constructor invocation. It is not a passive production logger. Inspect the original `InnerException` and service metadata first, and keep diagnostics within the application's privacy policy. Verify reflection-dependent diagnostics separately if the application trims assemblies.
:::

Avoid publishing full exception messages, file paths, connection strings or user data to telemetry. An error-type category and operation identifier are often enough for the user-facing failure path; detailed diagnostics should remain in an appropriately controlled development environment.

## Prevent regressions

Add a small composition test for the failed graph and a host-level test for the action that exposed it. A view-model constructor test alone does not verify XAML, a named dialog host, or the current page's navigation scope. Check the application's actual deployment configuration as well as the development build.

Source: [ContainerResolutionException](https://github.com/PrismLibrary/Prism.Containers/blob/3e2b38b767397b7595542369ab8e9e21e3c6cdcb/src/Prism.Container.Abstractions/ContainerResolutionException.cs) and [diagnostic tests](https://github.com/PrismLibrary/Prism.Containers/blob/3e2b38b767397b7595542369ab8e9e21e3c6cdcb/tests/Prism.Container.Shared/Tests/ContainerResolutionExceptionFixture.cs), requiring authorized repository access.

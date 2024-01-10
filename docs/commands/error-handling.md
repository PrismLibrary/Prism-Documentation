---
uid: Commands.ErrorHandling
---

# Error Handling

Prism 9 introduced better Error Handling for all Commands including the [AsyncDelegateCommand](xref:Commands.AsyncDelegateCommand). This provides several useful opportunities for app developers.

1. Avoid needing to wrap every method in a `try/catch`.
2. Provide multiple handlers to provide specific logic based on the type of Exception encountered.
3. Share error handling logic across multiple commands.

```cs
new DelegateCommand(() => { })
    .Catch<NullReferenceException>(nullReferenceException => {
        // Provide specific handling for the specified Exception Type
    })
    .Catch(exception => {
        // Handle any exception thrown
    })
```

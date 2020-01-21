# Initializing your ViewModels

Initializing your ViewModels is considered a ONE TIME task. This is only done after the ViewModel Page has been created. You should never place logic inside of the Initialization methods which you expect to execute each time the View is navigated to such as when you Navigate back from another Page.

> [!NOTE]
> If upgrading to Prism 7.2 from a previous version, you will need to change any refernces to OnNavigatingTo to `IInitialize.Initialize`

## When to use IInitialize

TODO

> [!Video https://www.youtube.com/embed/uGDflfthMeA]

## When to use IInitializeAsync

TODO

## Additional References

- [Confirm Navigation](confirming-navigation.md)
- [Auto Initialization](../auto-initialization.md)
- [Sample App - ViewModel Initialization](https://github.com/PrismLibrary/Prism-Samples-Forms/tree/master/13-ViewModelInitialization)
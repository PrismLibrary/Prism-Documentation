---
sidebar_position: 9
---

# PrismNavigationPage

`Prism.Controls.PrismNavigationPage` derives from MAUI `NavigationPage` and integrates system Back handling with Prism navigation. Use it when the navigation stack should respect Prism confirmation and lifecycle callbacks.

## Default route

At startup, Prism registers `PrismNavigationPage` under the navigation key `NavigationPage` if that name is not already registered. Registering a different navigation-page type under a different key does not by itself suppress this default route.

```cs
prism.CreateWindow("/NavigationPage/HomePage");
```

To replace the route deliberately, register a custom type derived from `PrismNavigationPage` using the name `NavigationPage` before initial navigation:

```cs
container.RegisterForNavigation<MyNavigationPage>("NavigationPage");
```

Keep its XAML root consistent with its C# base type if it is XAML-defined. If you register several navigation-page routes, explicitly name the desired route rather than relying on the builder's last-match selection.

## Back and dismissal behavior

The class seals `OnBackButtonPressed`, delegates to Prism's back-navigation helper, and returns `true` so Prism owns that request. This lets navigation confirmation run before the Prism-managed transition. The current implementation also handles an iOS navigation page disappearing after a non-full-screen modal is swiped away; native dismissal has different timing from a command-driven Back request.

Do not assume every platform gesture can be cancelled before native UI changes. Test toolbar Back, Android hardware/system Back, iOS modal dismissal, and returning from background on the targets you ship. A plain MAUI `NavigationPage`, manual stack edits, or direct `PopAsync` calls may bypass the intended Prism path.

A temporary disappearance is not page destruction. Use [page lifecycle](../appmodel/pagelifecycleaware.md) and navigation cleanup for their separate purposes.

## Source reference

- [Default route registration](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/PrismAppBuilder.cs)
- [Back interception and iOS disappearance handling](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Controls/PrismNavigationPage.cs)
- [Navigation helper behavior](https://github.com/PrismLibrary/Prism/blob/b8f00b5091063feea127a2417fc72d6b299ee16c/src/Maui/Prism.Maui/Common/MvvmHelpers.cs)

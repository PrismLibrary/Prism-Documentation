---
uid: Plugins.Popups
---

# Getting Started

The `Prism.Plugin.Popups` package for Xamarin.Forms has been hugely popular, enabling developers to leverage `PopupPage` from the Rg.Plugins.Popup library. Following the introduction of the [IDialogService](xref:Dialogs.GettingStarted), the Popup Plugin was updated to transition `PopupPage` usage to dialogs. This change helps developers avoid strong dependencies on libraries like Rg.Plugins.Popup, as the `IDialogService` offers flexible implementation options should community packages become unmaintained.

For .NET MAUI developers, the Popup Plugin will no longer be publicly available on NuGet.org. Instead, it will be exclusively provided to those with a Commercial Plus license. This decision supports the project’s long-term sustainability, as maintaining and enhancing the plugin demands significant resources. Restricting access to licensed users allows us to allocate these resources effectively, ensuring continued development and improved support for our customers.

If you’re updating your Xamarin.Forms app—especially from older versions of the Popup Plugin where `INavigationService` was used to navigate to `PopupPage` instances—you’ll need to re-architect portions of your code to utilize the [IDialogService](xref:Dialogs.GettingStarted) instead.

---

## Setup

To integrate `Prism.Plugin.Popups.Maui` into your .NET MAUI project, follow these steps:

1. **Install the NuGet Package**  
   Add the `Prism.Plugin.Popups.Maui` package to your .NET MAUI project using NuGet Package Manager or by running:
   ```
   dotnet add package Prism.Plugin.Popups.Maui
   ```

2. **Register the Plugin**  
   In your `MauiProgram.cs`, configure Prism to use the plugin by adding the following code:
   ```csharp
   builder.UseMauiApp<App>()
       .UsePrism(prism => prism.ConfigureMopupDialogs());
   ```

3. **Register Your Dialog Views**  
   Dialogs must be registered with Prism’s dialog service (not navigated to like regular pages). For example:
   ```csharp
   containerRegistry.RegisterDialog<MyDialog>();
   ```
   This registers a dialog view named `MyDialog` with the Prism container.

---

## Creating a Dialog View

A dialog view typically inherits from `ContentView` or a similar base class. You can use XAML to define the content and customize its behavior with attached properties from the `PopupDialogLayout` class.

Here’s a basic template:
```xaml
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:prism="http://prismlibrary.com"
             x:Class="YourNamespace.YourDialog">
    <!-- Your popup content here -->
</ContentView>
```

---

## Attached Properties

The `PopupDialogLayout` class provides several attached properties to customize popup dialogs. Below is a list of these properties, their purposes, and examples:

### `HasSystemPadding`
- **Type**: `bool`
- **Default**: `true`
- **Description**: Controls whether the popup respects system padding (e.g., status bar, navigation bar). Set to `false` for full-screen popups.
- **Example**:
  ```xaml
  prism:PopupDialogLayout.HasSystemPadding="False"
  ```

### `SystemPadding`
- **Type**: `Thickness`
- **Default**: `0,0,0,0`
- **Description**: Specifies custom padding around the popup, overriding system padding if needed.
- **Example**:
  ```xaml
  prism:PopupDialogLayout.SystemPadding="20,40,20,20"
  ```

### `Animation`
- **Type**: `IPopupAnimation`
- **Default**: `ScaleAnimation`
- **Description**: Defines the animation for popup appearance/disappearance. Use Mopups library animations (e.g., `MoveAnimation`) or custom ones.
- **Example**:
  ```xaml
  <prism:PopupDialogLayout.Animation>
      <animation:MoveAnimation PositionIn="Top" PositionOut="Bottom" />
  </prism:PopupDialogLayout.Animation>
  ```

### `IsAnimationEnabled`
- **Type**: `bool`
- **Default**: `true`
- **Description**: Enables/disables animations. Set to `false` for instant popup display.
- **Example**:
  ```xaml
  prism:PopupDialogLayout.IsAnimationEnabled="False"
  ```

### `SystemPaddingSides`
- **Type**: `PaddingSide`
- **Default**: `PaddingSide.All`
- **Description**: Specifies which sides receive system padding (e.g., `All`, `Top`, `Bottom`, `Left`, `Right`).
- **Example**:
  ```xaml
  prism:PopupDialogLayout.SystemPaddingSides="Top,Bottom"
  ```

### `BackgroundInputTransparent`
- **Type**: `bool`
- **Default**: `false`
- **Description**: If `true`, taps pass through to the background UI; if `false`, the background captures taps.
- **Example**:
  ```xaml
  prism:PopupDialogLayout.BackgroundInputTransparent="True"
  ```

### `HasKeyboardOffset`
- **Type**: `bool`
- **Default**: `true`
- **Description**: Adjusts the popup position when the keyboard appears. Set to `false` if no adjustment is needed.
- **Example**:
  ```xaml
  prism:PopupDialogLayout.HasKeyboardOffset="False"
  ```

### `KeyboardOffset`
- **Type**: `double`
- **Default**: `0`
- **Description**: Adds an extra offset (in pixels) when the keyboard appears.
- **Example**:
  ```xaml
  prism:PopupDialogLayout.KeyboardOffset="10"
  ```

---

## Example Dialog View

Here’s a complete example combining several attached properties:
```xaml
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:prism="http://prismlibrary.com"
             xmlns:animation="clr-namespace:Mopups.Animations;assembly=Mopups"
             prism:PopupDialogLayout.HasSystemPadding="False"
             prism:PopupDialogLayout.IsAnimationEnabled="True"
             x:Class="MauiApp2.MyDialog">
    <prism:PopupDialogLayout.Animation>
        <animation:MoveAnimation PositionIn="Top" PositionOut="Bottom" />
    </prism:PopupDialogLayout.Animation>
    <VerticalStackLayout>
        <Label Text="Welcome to .NET MAUI!"
               VerticalOptions="Center"
               HorizontalOptions="Center" />
    </VerticalStackLayout>
</ContentView>
```

In this example:
- `HasSystemPadding="False"` makes the popup full-screen.
- `IsAnimationEnabled="True"` activates animations.
- `MoveAnimation` slides the popup from the top in and out to the bottom.

---

## Showing the Dialog

Use Prism’s `IDialogService` to display the dialog from a view model:
```csharp
public class MyViewModel
{
    private readonly IDialogService _dialogService;

    public MyViewModel(IDialogService dialogService)
    {
        _dialogService = dialogService;
    }

    public async Task ShowDialogAsync()
    {
        await _dialogService.ShowDialogAsync("MyDialog");
    }
}
```
- Inject `IDialogService` via constructor.
- Call `ShowDialogAsync` with the registered dialog name.

---

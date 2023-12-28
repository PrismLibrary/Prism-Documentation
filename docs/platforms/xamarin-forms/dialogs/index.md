# Application Dialogs

Applications have a variety of reasons to display a dialog. Starting with Prism 7.2 we have 2 Dialog Services that each provide you a way to provide dialogs in your app. Each of these services operate in very different ways and have different purposes.

## Legacy IPageDialogService

Sometimes you just need a quick and dirty dialog such as an Alert Dialog where you need to display some message for the the user to say "OK" or perhaps get a boolean response to your a question. Other times you may have a list of items that need to be displayed in an Action Sheet. For each of these the legacy IPageDialogService is a great option as it simply uses the System dialogs provided by Xamarin.Forms.

- [Using IPageDialogService](page-dialog-service.md)

## Getting Started with the IDialogService

Many times you may desire to have a dialog that requires custom logic and a look and feel that matches the styling of your app. For these times you can use the new IDialogService to provide rich dialogs that follow the same MVVM pattern with Dependency Injection that you're used to using throughout your app.

- [Using IDialogService](dialog-service.md)

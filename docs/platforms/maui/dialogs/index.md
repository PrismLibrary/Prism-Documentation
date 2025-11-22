---
sidebar_position: 1
uid: Platforms.Maui.Dialogs.GettingStarted
title: Dialogs
---

# Dialogs

Prism.Maui has 2 different types of Dialog Services. While at first glance this may seem redundant, it is not. Each of these serve very specific purposes and you should use the appropriate Dialog Service for the task at hand.

- [IPageDialogService](xref:Platforms.Maui.Dialogs.PageDialogs): The Page Dialog Service is implemented to provide a way to easily access the same sort of basic dialogs that are available from a MAUI Page while providing a layer of abstraction to the developer that helps you to provide the proper separation of concerns between your View & your ViewModel. These are going to provide dialogs that are very much native to the System.
- [IDialogService](xref:Dialogs.GettingStarted): While not currently implemented in Prism.Maui, the Dialog Service was originally introduced in Prism.Forms 7.2 as a way to provide highly customizable Dialogs that utilize Views designed and styled by you that still follow an MVVM pattern and look and feel like they are native to your app!


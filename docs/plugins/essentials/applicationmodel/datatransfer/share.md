---
sidebar_position: 2
uid: Plugins.Essentials.ApplicationModel.DataTransfer.Share
---

# Share

:::note Availability
The new portable files, camera, and sharing contracts are still undergoing review and are not documented here as generally available APIs. Package availability and supported hosts must be confirmed after merge and release.
:::

For current file access, use the [file-system service](../../io/filesystem.md). It opens application-package assets and exposes app directories; it is not a native picker, camera, or share-sheet API.

If your application needs this capability now, put an application-owned interface in shared code and implement it with a verified host API. Keep its permission, cancellation, and file-ownership behavior explicit so you can adopt the Prism implementation when it becomes available.

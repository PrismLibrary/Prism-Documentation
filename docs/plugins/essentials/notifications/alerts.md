---
sidebar_position: 2
uid: Plugins.Essentials.Notifications.Alerts
---

# Alerts

To display an Alert you can use the `IAlerts` interface directly or through the aggregate service `INotifications` as follows:

```cs
await notifications.Alert.DisplayAsync("Alert", "You have been alerted");
```

![Simple Alert](./images/simple-alert.png)

The Alert can also be used to prompt a user for a boolean (yes/no) response.

```cs
await notifications.Alert.DisplayAsync("Question?", "Would you like to play a game", "Yes", "No");
```

![Two Button Alert](./images/two-button-alert.png)


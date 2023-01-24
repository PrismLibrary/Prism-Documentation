﻿# Introduction to Prism

Prism is a framework for building loosely coupled, maintainable, and testable XAML applications in WPF, and Xamarin Forms. Separate releases are available for each platform and those will be developed on independent timelines. Prism provides an implementation of a collection of design patterns that are helpful in writing well-structured and maintainable XAML applications, including MVVM, dependency injection, commands, EventAggregator, and others. Prism's core functionality is a shared code base in a Cross-Compiled .NET Standard and .NET 4.5/4.8 Library. Those things that need to be platform-specific are implemented in the respective libraries for the target platform. Prism also provides great integration of these patterns with the target platform. For example, Prism for Xamarin Forms allows you to use an abstraction for navigation that is unit-testable, but that layers on top of the platform concepts and APIs for navigation so that you can fully leverage what the platform itself has to offer, but done in the MVVM way.

Prism 8 is a fully open-source version of the Prism guidance originally produced by Microsoft patterns & practices. The core team members were all part of the P&P team that developed Prism 1 through 5, and the effort has now been turned over to the open-source community to keep it alive and thriving to support the .NET community. There are thousands of companies who have adopted previous versions of Prism for WPF, Silverlight, and Windows Runtime, and we hope they will continue to move along with us as we continue to evolve and enhance the framework to keep pace with current platform capabilities and requirements.

At the current time, Prism supports WPF, Xamarin Forms and UNO. We have no plans to create new versions of the library for Silverlight, Windows 8/8.1/WP8.1 or for UWP. For those you can still use the previous releases from Microsoft p&p [here](https://docs.microsoft.com/en-us/previous-versions/msp-n-p/gg430869(v=pandp.40)) and [here](http://prismwindowsruntime.codeplex.com/) or previous releases of this library in the [GitHub Repo](https://github.com/PrismLibrary/Prism/tree/Prism.v6.3.0).

## Help Support Prism

As most of you know, it takes a lot of time and effort for our small team to manage and maintain Prism in our spare time. Even though Prism is open source and hosted on GitHub, there are a number of costs associated with maintaining a project such as Prism.  Please be sure to Star the Prism repo and help sponsor Dan and Brian on GitHub.

Don't forget both Brian and Dan stream live on Twitch and host recorded content on their YouTube Channels. Be sure to Subscribe and Ring that Bell for notifications when they go live or post new content.

| | Sponsor | Twitter | Twitch | YouTube |
|:-:|:--:|:--:|:--:|:--:|
| Brian Lagunas | [![GitHub][OctoSponsor]][BrianSponsor] | [![Twitter][TwitterLogo]][BrianTwitter]<br /><span style="font-size:9px">Follow</span> | [![Twitch][TwitchLogo]][BrianTwitch]<br /><span style="font-size:9px">Follow & Subscribe</span> | [![YouTube][YouTubeLogo]][BrianYouTube]<br /><span style="font-size:9px">Subcribe & Ring the Bell</span>
| Dan Siegel | [![GitHub][OctoSponsor]][DanSponsor] | [![Twitter][TwitterLogo]][DanTwitter]<br /><span style="font-size:9px">Follow</span> | [![Twitch][TwitchLogo]][DanTwitch]<br /><span style="font-size:9px">Follow & Subscribe</span> | [![YouTube][YouTubeLogo]][DanYouTube]<br /><span style="font-size:9px">Subscribe & Ring the Bell</span>

[BrianTwitter]: https://twitter.com/brianlagunas
[BrianYouTube]: https://youtube.com/brianlagunas
[BrianTwitch]: https://twitch.tv/brianlagunas
[BrianSponsor]: https://xam.dev/sponsor-prism-brian

[DanTwitter]: https://twitter.com/DanJSiegel
[DanYouTube]: https://youtube.com/dansiegel
[DanTwitch]: https://twitch.tv/dansiegel
[DanSponsor]: https://xam.dev/sponsor-prism-dan

[TwitterLogo]: https://dansiegelgithubsponsors.blob.core.windows.net/images/twitter.png
[TwitchLogo]: https://dansiegelgithubsponsors.blob.core.windows.net/images/twitch.png
[YouTubeLogo]: https://dansiegelgithubsponsors.blob.core.windows.net/images/youtube.png
[OctoSponsor]: https://dansiegelgithubsponsors.blob.core.windows.net/images/octosponsor.png

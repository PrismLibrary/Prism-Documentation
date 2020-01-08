# NuGet Packages

Official Prism releases are available on NuGet.

> [!NOTE]
**Continuous Integration Builds** - If you want to take advantage of a new feature as soon as they are merged into the code base, or if there are critical bugs you need fixed, we invite you to try the packages on our continuous integration feed. Simply add `https://www.myget.org/F/prism/api/v3/index.json` as a package source to either Visual Studio or Visual Studio for Mac.

## Core Packages

These are the base packages for each platform, together with the Prism's Core assembly as a cross-platform PCL.

| Platform | Assembly | Package | NuGet | MyGet |
| -------- | -------- | ------- | ------- | ----- |
| PCL | Prism.dll | [Prism.Core][CoreNuGet] | [![CoreNuGetShield]][CoreNuGet] | [![CoreMyGetShield]][CoreMyGet] |
| WPF | Prism.Wpf.dll | [Prism.Wpf][WpfNuGet] | [![WpfNuGetShield]][WpfNuGet] | [![WpfMyGetShield]][WpfNuGet] |
| Xamarin.Forms | Prism.Forms.dll | [Prism.Forms][FormsNuGet] | [![FormsNuGetShield]][FormsNuGet] | [![FormsMyGetShield]][FormsMyGet] |

## Container-specific packages

Each supported IoC container has its own package assisting in the setup and usage of that container together with Prism. The assembly is named using this convention: Prism.*Container.Platform*.dll, e.g. **Prism.Unity.Wpf.dll**. Starting with version 7.0, Prism is moving to separate packages for each platform. Be sure to install the package for the Container and the Platform of your choice.

> [!NOTE]
Adding the container-specific package to your project, will also pull in the correct platform-specific package and the core PCL library. E.g. when you'd like to use Unity in a WPF project, add the Prism.Unity package and the rest will be pulled in as well.

#### WPF

| Package | NuGet | MyGet |
|---------|-------|-------|
| [Prism.DryIoc][DryIocWpfNuGet] | [![DryIocWpfNuGetShield]][DryIocWpfNuGet] | [![DryIocWpfMyGetShield]][DryIocWpfNuGet] |
| [Prism.Ninject][NinjectWpfNuGet] | [![NinjectWpfNuGetShield]][NinjectWpfNuGet] | [![NinjectWpfMyGetShield]][NinjectWpfNuGet] |
| [Prism.Unity][UnityWpfNuGet] | [![UnityWpfNuGetShield]][UnityWpfNuGet] | [![UnityWpfMyGetShield]][UnityWpfNuGet] |

#### Xamarin Forms

| Package | NuGet | MyGet |
|---------|-------|-------|
| [Prism.DryIoc.Forms][DryIocFormsNuGet] | [![DryIocFormsNuGetShield]][DryIocFormsNuGet] | [![DryIocFormsMyGetShield]][DryIocFormsMyGet] |
| [Prism.Unity.Forms][UnityFormsNuGet] | [![UnityFormsNuGetShield]][UnityFormsNuGet] | [![UnityFormsMyGetShield]][UnityFormsMyGet] |

## Overview of assemblies

To recapitulate the packages described above, this is the list of all assemblies added to your solution by Prism 6 depending on the container and platform used.

#### Prism Core

| Assembly | Package |
| -------- | ------- |
| Prism.dll | [Prism.Core][1] |

#### WPF

| Assembly | Package |
| -------- | ------- |
| Prism.Wpf.dll | [Prism.Wpf][2] |
| Prism.Unity.Wpf.dll | [Prism.Unity][5] |
| Prism.Ninject.Wpf.dll | [Prism.Ninject][9] |
| Prism.DryIoc.Wpf.dll | [Prism.DryIoc][14] |

#### Xamarin.Forms

| Assembly | Package |
| -------- | ------- |
| Prism.Forms.dll | [Prism.Forms][3] |
| Prism.Unity.Forms.dll | [Prism.Unity.Forms][10] |
| Prism.DryIoc.Forms.dll | [Prism.DryIoc.Forms][13] |


[1]: https://www.nuget.org/packages/Prism.Core/
[2]: https://www.nuget.org/packages/Prism.Wpf/
[3]: https://www.nuget.org/packages/Prism.Forms/
[5]: https://www.nuget.org/packages/Prism.Unity/
[9]: https://www.nuget.org/packages/Prism.Ninject/
[10]: https://www.nuget.org/packages/Prism.Unity.Forms/
[13]: https://www.nuget.org/packages/Prism.DryIoc.Forms/
[14]: https://www.nuget.org/packages/Prism.DryIoc/

[CoreNuGet]: https://www.nuget.org/packages/Prism.Core/
[WpfNuGet]: https://www.nuget.org/packages/Prism.Wpf/
[FormsNuGet]: https://www.nuget.org/packages/Prism.Forms/

[DryIocWpfNuGet]: https://www.nuget.org/packages/Prism.DryIoc/
[NinjectWpfNuGet]: https://www.nuget.org/packages/Prism.Ninject/
[UnityWpfNuGet]: https://www.nuget.org/packages/Prism.Unity/

[UnityFormsNuGet]: https://www.nuget.org/packages/Prism.Unity.Forms/
[DryIocFormsNuGet]: https://www.nuget.org/packages/Prism.DryIoc.Forms/

[CoreNuGetShield]: https://img.shields.io/nuget/vpre/Prism.Core.svg
[WpfNuGetShield]: https://img.shields.io/nuget/vpre/Prism.Wpf.svg
[FormsNuGetShield]: https://img.shields.io/nuget/vpre/Prism.Forms.svg

[DryIocWpfNuGetShield]: https://img.shields.io/nuget/vpre/Prism.DryIoc.svg
[NinjectWpfNuGetShield]: https://img.shields.io/nuget/vpre/Prism.Ninject.svg
[UnityWpfNuGetShield]: https://img.shields.io/nuget/vpre/Prism.Unity.svg

[DryIocFormsNuGetShield]: https://img.shields.io/nuget/vpre/Prism.DryIoc.Forms.svg
[UnityFormsNuGetShield]: https://img.shields.io/nuget/vpre/Prism.Unity.Forms.svg

[CoreMyGet]: https://www.myget.org/feed/prism/package/nuget/Prism.Core
[WpfMyGet]: https://www.myget.org/feed/prism/package/nuget/Prism.Wpf/
[FormsMyGet]: https://www.myget.org/feed/prism/package/nuget/Prism.Forms/

[UnityFormsMyGet]: https://www.myget.org/feed/prism/package/nuget/Prism.Unity.Forms/
[DryIocFormsMyGet]: https://www.myget.org/feed/prism/package/nuget/Prism.DryIoc.Forms/

[CoreMyGetShield]: https://img.shields.io/myget/prism/vpre/Prism.Core.svg
[WpfMyGetShield]: https://img.shields.io/myget/prism/vpre/Prism.Wpf.svg
[FormsMyGetShield]: https://img.shields.io/myget/prism/vpre/Prism.Forms.svg

[DryIocWpfMyGetShield]: https://img.shields.io/myget/prism/vpre/Prism.DryIoc.svg
[NinjectWpfMyGetShield]: https://img.shields.io/myget/prism/vpre/Prism.Ninject.svg
[UnityWpfMyGetShield]: https://img.shields.io/myget/prism/vpre/Prism.Unity.svg

[DryIocFormsMyGetShield]: https://img.shields.io/myget/prism/vpre/Prism.DryIoc.Forms.svg
[UnityFormsMyGetShield]: https://img.shields.io/myget/prism/vpre/Prism.Unity.Forms.svg
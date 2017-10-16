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
| Windows 10 UWP | Prism.Windows.dll | [Prism.Windows][UWPNuGet] | [![UWPNuGetShield]][UWPNuGet] | [![UWPMyGetShield]][UWPMyGet] |

## Container-specific packages

Each supported IoC container has its own package assisting in the setup and usage of that container together with Prism. The assembly is named using this convention: Prism.*Container.Platform*.dll, e.g. **Prism.Unity.Wpf.dll**. Starting with version 7.0, Prism is moving to separate packages for each platform. Be sure to install the package for the Container and the Platform of your choice.

> [!NOTE]
Adding the container-specific package to your project, will also pull in the correct platform-specific package and the core PCL library. E.g. when you'd like to use Unity in a WPF project, add the Prism.Unity package and the rest will be pulled in as well.

#### WPF

| Package | NuGet | MyGet |
|---------|-------|-------|
| [Prism.Autofac][AutofacWpfNuGet] | [![AutofacWpfNuGetShield]][AutofacWpfNuGet] | [![AutofacWpfMyGetShield]][AutofacWpfNuGet] |
| [Prism.DryIoc][DryIocWpfNuGet] | [![DryIocWpfNuGetShield]][DryIocWpfNuGet] | [![DryIocWpfMyGetShield]][DryIocWpfNuGet] |
| [Prism.Mef][MefWpfNuGet] | [![MefWpfNuGetShield]][MefWpfNuGet] | [![MefMyGetShield]][MefWpfNuGet] |
| [Prism.Ninject][NinjectWpfNuGet] | [![NinjectWpfNuGetShield]][NinjectWpfNuGet] | [![NinjectWpfMyGetShield]][NinjectWpfNuGet] |
| [Prism.StructureMap][StructureMapWpfNuGet] | [![StructureMapWpfNuGetShield]][StructureMapWpfNuGet] | [![StructureMapWpfMyGetShield]][StructureMapWpfNuGet] |
| [Prism.Unity][UnityWpfNuGet] | [![UnityWpfNuGetShield]][UnityWpfNuGet] | [![UnityWpfMyGetShield]][UnityWpfNuGet] |

#### UWP

| Package | NuGet | MyGet |
|---------|-------|-------|
| [Prism.Autofac.Windows][AutofacUWPNuGet] | [![AutofacUWPNuGetShield]][AutofacUWPNuGet] | [![AutofacUWPMyGetShield]][AutofacUWPMyGet] |
| [Prism.SimpleInjector.Windows][SimpleInjectorUWPNuGet] | [![SimpleInjectorUWPNuGetShield]][SimpleInjectorUWPNuGet] | [![SimpleInjectorUWPMyGetShield]][SimpleInjectorUWPMyGet] |
| [Prism.Unity.Windows][UnityUWPNuGet] | [![UnityUWPNuGetShield]][UnityUWPNuGet] | [![UnityUWPMyGetShield]][UnityUWPMyGet] |

#### Xamarin Forms

| Package | NuGet | MyGet |
|---------|-------|-------|
| [Prism.Autofac.Forms][AutofacFormsNuGet] | [![AutofacFormsNuGetShield]][AutofacFormsNuGet] | [![AutofacFormsMyGetShield]][AutofacFormsMyGet] |
| [Prism.DryIoc.Forms][DryIocFormsNuGet] | [![DryIocFormsNuGetShield]][DryIocFormsNuGet] | [![DryIocFormsMyGetShield]][DryIocFormsMyGet] |
| [Prism.Ninject.Forms][NinjectFormsNuGet] | [![NinjectFormsNuGetShield]][NinjectFormsNuGet] | [![NinjectFormsMyGetShield]][NinjectFormsMyGet] |
| [Prism.Unity.Forms][UnityFormsNuGet] | [![UnityFormsNuGetShield]][UnityFormsNuGet] | [![UnityFormsMyGetShield]][UnityFormsMyGet] |

> [!IMPORTANT]
MEF is supported with WPF for compatibility with previous versions. It will not be added to Windows 10 UWP or Xamarin Forms.

## Overview of assemblies

To recapitulate the packages described above, this is the list of all assemblies added to your solution by Prism 6 depending on the container and platform used.

#### Prism PCL

| Assembly | Package |
| -------- | ------- |
| Prism.dll | [Prism.Core][1] |

#### WPF

| Assembly | Package |
| -------- | ------- |
| Prism.Wpf.dll | [Prism.Wpf][2] |
| Prism.Unity.Wpf.dll | [Prism.Unity][5] |
| Prism.Mef.Wpf.dll | [Prism.Mef][6] |
| Prism.Autofac.Wpf.dll | [Prism.Autofac][7] |
| Prism.StructureMap.Wpf.dll | [Prism.StructureMap][8] |
| Prism.Ninject.Wpf.dll | [Prism.Ninject][9] |
| Prism.DryIoc.Wpf.dll | [Prism.DryIoc][14] |

#### Xamarin.Forms

| Assembly | Package |
| -------- | ------- |
| Prism.Forms.dll | [Prism.Forms][3] |
| Prism.Unity.Forms.dll | [Prism.Unity.Forms][10] |
| Prism.Ninject.Forms.dll | [Prism.Ninject.Forms][11] |
| Prism.Autofac.Forms.dll | [Prism.Autofac.Forms][11] |
| Prism.DryIoc.Forms.dll | [Prism.DryIoc.Forms][11] |

#### Universal Windows Platform

| Assembly | Package |
| -------- | ------- |
| Prism.Windows.dll | [Prism.Windows][4] |
| Prism.Unity.Windows.dll | [Prism.Unity][5] |
| Prism.Autofac.Windows.dll | [Prism.Autofac][7] |


[1]: https://www.nuget.org/packages/Prism.Core/
[2]: https://www.nuget.org/packages/Prism.Wpf/
[3]: https://www.nuget.org/packages/Prism.Forms/
[4]: https://www.nuget.org/packages/Prism.Windows/
[5]: https://www.nuget.org/packages/Prism.Unity/
[6]: https://www.nuget.org/packages/Prism.Mef/
[7]: https://www.nuget.org/packages/Prism.Autofac/
[8]: https://www.nuget.org/packages/Prism.StructureMap/
[9]: https://www.nuget.org/packages/Prism.Ninject/
[10]: https://www.nuget.org/packages/Prism.Unity.Forms/
[11]: https://www.nuget.org/packages/Prism.Ninject.Forms/
[12]: https://www.nuget.org/packages/Prism.Autofac.Forms/
[13]: https://www.nuget.org/packages/Prism.DryIoc.Forms/
[14]: https://www.nuget.org/packages/Prism.DryIoc/

[CoreNuGet]: https://www.nuget.org/packages/Prism.Core/
[WpfNuGet]: https://www.nuget.org/packages/Prism.Wpf/
[FormsNuGet]: https://www.nuget.org/packages/Prism.Forms/
[UWPNuGet]: https://www.nuget.org/packages/Prism.Windows/

[AutofacWpfNuGet]: https://www.nuget.org/packages/Prism.Autofac/
[DryIocWpfNuGet]: https://www.nuget.org/packages/Prism.DryIoc/
[MefWpfNuGet]: https://www.nuget.org/packages/Prism.Mef/
[NinjectWpfNuGet]: https://www.nuget.org/packages/Prism.Ninject/
[StructureMapWpfNuGet]: https://www.nuget.org/packages/Prism.StructureMap/
[UnityWpfNuGet]: https://www.nuget.org/packages/Prism.Unity/

[AutofacUWPNuGet]: https://www.nuget.org/packages/Prism.Autofac/
[SimpleInjectorUWPNuGet]: https://www.nuget.org/packages/Prism.SimpleInjector/
[UnityUWPNuGet]: https://www.nuget.org/packages/Prism.Unity/

[UnityFormsNuGet]: https://www.nuget.org/packages/Prism.Unity.Forms/
[NinjectFormsNuGet]: https://www.nuget.org/packages/Prism.Ninject.Forms/
[AutofacFormsNuGet]: https://www.nuget.org/packages/Prism.Autofac.Forms/
[DryIocFormsNuGet]: https://www.nuget.org/packages/Prism.DryIoc.Forms/


[CoreNuGetShield]: https://img.shields.io/nuget/vpre/Prism.Core.svg
[WpfNuGetShield]: https://img.shields.io/nuget/vpre/Prism.Wpf.svg
[FormsNuGetShield]: https://img.shields.io/nuget/vpre/Prism.Forms.svg
[UWPNuGetShield]: https://img.shields.io/nuget/vpre/Prism.Windows.svg

[AutofacWpfNuGetShield]: https://img.shields.io/nuget/vpre/Prism.Autofac.svg
[DryIocWpfNuGetShield]: https://img.shields.io/nuget/vpre/Prism.DryIoc.svg
[MefWpfNuGetShield]: https://img.shields.io/nuget/vpre/Prism.Mef.svg
[NinjectWpfNuGetShield]: https://img.shields.io/nuget/vpre/Prism.Ninject.svg
[StructureMapWpfNuGetShield]: https://img.shields.io/nuget/vpre/Prism.StructureMap.svg
[UnityWpfNuGetShield]: https://img.shields.io/nuget/vpre/Prism.Unity.svg

[AutofacUWPNuGetShield]: https://img.shields.io/nuget/vpre/Prism.Autofac.svg
[SimpleInjectorUWPNuGetShield]: https://img.shields.io/nuget/vpre/Prism.SimpleInjector.svg
[UnityUWPNuGetShield]: https://img.shields.io/nuget/vpre/Prism.Unity.svg

[AutofacFormsNuGetShield]: https://img.shields.io/nuget/vpre/Prism.Autofac.Forms.svg
[DryIocFormsNuGetShield]: https://img.shields.io/nuget/vpre/Prism.DryIoc.Forms.svg
[NinjectFormsNuGetShield]: https://img.shields.io/nuget/vpre/Prism.Ninject.Forms.svg
[UnityFormsNuGetShield]: https://img.shields.io/nuget/vpre/Prism.Unity.Forms.svg


[CoreMyGet]: https://www.myget.org/feed/prism/package/nuget/Prism.Core
[WpfMyGet]: https://www.myget.org/feed/prism/package/nuget/Prism.Wpf/
[FormsMyGet]: https://www.myget.org/feed/prism/package/nuget/Prism.Forms/
[UWPMyGet]: https://www.myget.org/feed/prism/package/nuget/Prism.Windows/

[AutofacUWPMyGet]: https://www.myget.org/feed/prism/package/nuget/Prism.Autofac.Windows/
[SimpleInjectorUWPMyGet]: https://www.myget.org/feed/prism/package/nuget/Prism.SimpleInjector.Windows/
[UnityUWPMyGet]: https://www.myget.org/feed/prism/package/nuget/Prism.Unity.Windows/

[UnityFormsMyGet]: https://www.myget.org/feed/prism/package/nuget/Prism.Unity.Forms/
[NinjectFormsMyGet]: https://www.myget.org/feed/prism/package/nuget/Prism.Ninject.Forms/
[AutofacFormsMyGet]: https://www.myget.org/feed/prism/package/nuget/Prism.Autofac.Forms/
[DryIocFormsMyGet]: https://www.myget.org/feed/prism/package/nuget/Prism.DryIoc.Forms/

[CoreMyGetShield]: https://img.shields.io/myget/prism/vpre/Prism.Core.svg
[WpfMyGetShield]: https://img.shields.io/myget/prism/vpre/Prism.Wpf.svg
[UWPMyGetShield]: https://img.shields.io/myget/prism/vpre/Prism.Windows.svg
[FormsMyGetShield]: https://img.shields.io/myget/prism/vpre/Prism.Forms.svg

[AutofacWpfMyGetShield]: https://img.shields.io/myget/prism/vpre/Prism.Autofac.svg
[DryIocWpfMyGetShield]: https://img.shields.io/myget/prism/vpre/Prism.DryIoc.svg
[MefMyGetShield]: https://img.shields.io/myget/prism/vpre/Prism.Mef.svg
[NinjectWpfMyGetShield]: https://img.shields.io/myget/prism/vpre/Prism.Ninject.svg
[StructureMapWpfMyGetShield]: https://img.shields.io/myget/prism/vpre/Prism.StructureMap.svg
[UnityWpfMyGetShield]: https://img.shields.io/myget/prism/vpre/Prism.Unity.svg

[AutofacUWPMyGetShield]: https://img.shields.io/myget/prism/vpre/Prism.Autofac.Windows.svg
[SimpleInjectorUWPMyGetShield]: https://img.shields.io/myget/prism/vpre/Prism.SimpleInjector.Windows.svg
[UnityUWPMyGetShield]: https://img.shields.io/myget/prism/vpre/Prism.Unity.Windows.svg

[AutofacFormsMyGetShield]: https://img.shields.io/myget/prism/vpre/Prism.Autofac.Forms.svg
[DryIocFormsMyGetShield]: https://img.shields.io/myget/prism/vpre/Prism.DryIoc.Forms.svg
[NinjectFormsMyGetShield]: https://img.shields.io/myget/prism/vpre/Prism.Ninject.Forms.svg
[UnityFormsMyGetShield]: https://img.shields.io/myget/prism/vpre/Prism.Unity.Forms.svg
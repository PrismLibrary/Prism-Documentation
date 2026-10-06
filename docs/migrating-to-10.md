---
sidebar_position: 2
title: Prism 10.0 migration and readiness
sidebar_label: Moving to 10.0
---

# Moving to Prism 10.0

Prism 10.0 is the next release line. These docs cover the source being prepared for it, including NativeAOT readiness, current container integration and platform-specific application composition. The package rollout is not complete. This page is a migration checklist, not a claim that every 10.0 package is already available or a complete breaking-change inventory.

## Check package readiness first

The release dependency order is Containers, then Prism using the published Containers packages, then Plugins using the published upstream packages. A merged version change or a successful source build does not itself prove feed availability. Verify the package assets and dependency constraints you will actually restore before updating an application.

- Update the platform package and its container integration as a compatible set.
- Check the target frameworks in the resolved package, not only those declared at a source checkpoint.
- Keep the actual package references authoritative. Package versions and build numbers across Prism, Containers, Plugins and Magician are independent; do not assign one guessed version to every package.
- Keep the [Commercial Plus feed](pipelines/commercial-plus.md) configured for packages that require it. Do not replace its credentials or add new source configuration simply to work around an unavailable package.

Earlier 9.1 prerelease source, test runs and sample screenshots remain historical evidence. Their recorded versions and commits should not be renamed to 10.0. Likewise, the 9.0 documentation available from the version selector describes that released line; it has not been rewritten as part of this preparation.

## Review the application composition

| Area | What to verify |
| --- | --- |
| Host startup | Use the current [WPF, MAUI, Uno or Avalonia setup](platforms/index.md), including the correct application base/builder, XAML namespace and shell/window lifecycle. |
| Container | Use the current [instance-based locator contract](dependency-injection/container-locator.md), registration APIs and explicit scopes. Avoid a second provider that duplicates singletons. |
| View models | Prefer explicit [view/view-model mappings](mvvm/viewmodel-locator.md). Keep page-scoped navigation dependencies associated with their owner. |
| Navigation | Review [region](navigation/regions/index.md) versus [page](platforms/maui/navigation/page-navigation.md) navigation, result handling, parameter access, view reuse and cleanup. |
| Dialogs | Use the existing Prism 9+ [DialogCloseListener contract](dialogs/dialog-aware.md); do not restore the obsolete close event or assume a universal desktop window interface. |
| Modules | Check registration/initialization order and failure handling on the real host. Rebuild statically linked [module assemblies](modularity/index.md). |
| Generated code | Rebuild projects containing [Magician](magician/index.md) registrations, [Essentials stores](plugins/essentials/io/stores.md), or container preservation roots. Inspect diagnostics and generated output. |
| Diagnostics | Configure [logging providers](plugins/logging/index.md) deliberately and preserve the application's data/privacy boundary. |

Several APIs documented here existed before the 10.0 release line. Updating the release name does not mean each API was introduced in 10.0. Treat the source-linked contracts and your installed package as the evidence for a particular feature.

## Establish ordinary runtime behavior

Restore and build the application with its normal configuration first. Exercise startup, initial navigation, a repeat navigation, a dialog result, a module dependency, cancellation, persistence and shutdown. Test each selected host independently; a portable test suite cannot prove a native UI lifecycle.

The [reference applications](samples/index.md) provide guided workflows. Their package/source checkpoints and captured UI states remain explicit. They are learning material, not a blanket acceptance result for a newly restored 10.0 application.

## Then qualify NativeAOT where supported

Prism 10.0 (vNext) is planned as the first NativeAOT-ready Prism release. **The supported NativeAOT path requires `Prism.Container.Microsoft`, available with Commercial Plus.** Another adapter passing managed benchmarks or a narrow trimming probe does not establish equivalent support.

Rebuild generated registration/preservation metadata, keep module activation statically visible, supply serializer metadata and inspect all trimming/AOT diagnostics. Publish for the actual framework/RID and execute that output. WPF is not a NativeAOT target; MAUI, Uno and Avalonia retain their own platform/toolchain/dependency requirements. Follow the [NativeAOT guide](dependency-injection/native-aot.md) rather than setting `PublishAot` on every head.

## Keep release and application acceptance separate

Package publication, successful compilation, an automated test, a runtime screenshot and a NativeAOT deployment answer different questions. Record which has actually happened. Pending Plugins APIs remain pending until their own review, merge and package release; the 10.0 documentation label does not make them available early.

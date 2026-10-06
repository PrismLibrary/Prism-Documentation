---
sidebar_position: 7
title: Runtime capture coverage
---

# Runtime capture coverage

A screenshot identifies one application, presentation framework, operating system, source checkpoint, and UI state. It does not prove that the other heads ran, that the UI passed an accessibility audit, or that the application was published with NativeAOT.

## Current coverage

| Application | WPF / Windows | MAUI / Windows | MAUI / Android emulator | Uno / Windows | Uno / Linux Desktop | Uno / BrowserWasm | Uno / Android emulator |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Calculator | Runtime test render | Capture pending | Capture pending | Capture pending | Capture blocked | Capture pending | Capture pending |
| Planner | Runtime test render | Capture pending | Capture pending | Capture pending | Capture blocked | Capture pending | Capture pending |
| Sales Desk | Runtime test render | Capture pending | Capture pending | Capture pending | Capture blocked | Capture pending | Capture pending |
| Learning Hub | Runtime test render | Capture pending | Capture pending | Capture pending | Capture blocked | Capture pending | Capture pending |
| Mail | Runtime test render | Capture pending | Capture pending | Capture pending | Capture blocked | Capture pending | Capture pending |

“Capture pending” means no qualified image from that application/head is included here. It does not mean that the target is unsupported. Linux capture is currently blocked before a runnable application is available; no substitute image is presented as Linux output. Browser execution and an Android emulator must likewise be verified before their rows change.

**iOS and macOS capture work is deferred.** No Apple runtime or screenshot acceptance is implied. Avalonia application heads are outside this five-app showcase; the separate starter template is not an Essentials-qualified replacement for them.

Some native Windows builds and composition tests already exist in the sample READMEs. Those results retain their exact source checkpoints and do not fill an interactive screenshot row automatically. Updated screenshots should record the actual current head that was launched.

## Included WPF images

These original PNGs were produced on Windows by live application-owned WPF windows running in an STA/Dispatcher test host. The tests create the real Prism container, modules, regions, dialogs, and bound controls, with isolated app data. `RenderTargetBitmap` captures the application visual tree. These images are **not operating-system screen captures** and do not show OS keyboard, pointer, or assistive-technology automation.

| Application and scene | Source checkpoint | Image |
| --- | --- | --- |
| Calculator, decimal result with history | Commit `89f3a5b2da69a9b0eb7fbbbcaaa98f31c694c961` | [Light workspace](images/calculator-wpf-light.png) |
| Planner, project/task/detail workspace | Commit `7ffdd4c76a8dab96969ef23012a2b61b3258d2c1` | [Task board](images/planner-wpf-board.png) |
| Learning Hub, discovery catalog | Commit `dc814b3a6da1e3f8eb237007945f884406d9f066` | [Catalog](images/learning-hub-wpf-catalog.png) |
| Learning Hub, scrolled large-text reader | Same `dc814b3` checkpoint | [Dark reader](images/learning-hub-wpf-reader-dark.png) |
| Sales Desk, quote workspace | Qualified tree `eae806326ddba3739357f120570fdc41314504e2`, based on commit `75c467cf7ef7db56424ae3ae12df7bce2204a91e` with the validated theme/binding corrections | [Quote editor](images/sales-desk-wpf-quotes.png) |
| Mail, fictional inbox and reader | Commit `53894e9dc8def51791de6bb541b63a9beed6187b` | [Inbox](images/mail-wpf-inbox.png) |
| Mail, compact dark compose | Same `53894e9` checkpoint | [Compose](images/mail-wpf-compose-dark.png) |

Captured on 5 October 2026. The original capture records do not establish a normalized UTC timestamp, so none is invented. Pixel dimensions, full source identifiers, SHA-256 hashes, data isolation, and capture method are recorded in the [image provenance manifest](images/runtime-provenance.json). Original bytes, including transparent non-client margins, are preserved; no image was generated or retouched to represent a running application.

The image checkpoints may precede the source revision linked by a walkthrough. A source link describes the reviewed code; an image describes its labeled captured revision. Mail's merged source and these earlier offline images remain separate evidence. The Logging changes did not modify the UI assets or XAML, so the images remain pinned to their original captured checkpoints.

## What a new platform capture must establish

1. Identify the exact commit and head, target framework/RID, operating system or emulator image, and SDK used.
2. Launch the real application with safe demo data and record the command or application profile.
3. Complete the app's primary journey: calculation/history, task editing, quote editing, essay/progress, or offline mail/draft.
4. Inspect both layout and interaction: useful content in view, correct bindings, no clipped primary actions, readable contrast, and completed navigation/dialog state.
5. Capture the actual browser, native application window, or emulator. Label the method and source. Preserve the untouched image with its hash.
6. Record what was not exercised. A build, a resized WPF window, an app-owned render, and an OS screenshot are different results.

No live mail sign-in, consent, mailbox access, or real send is needed to capture the offline Mail app. Never substitute a configured real account for its synthetic demo data.

## Source baselines

All five applications, including merged Mail and Logging, were reviewed at [samples master `9c31a9ce`](https://github.com/PrismLibrary/samples/tree/9c31a9ce1a1fd55cc15c2cba4fc4a6338fd98b57). Mail's merge is [PR #9](https://github.com/PrismLibrary/samples/pull/9); the Logging integration is [PR #15](https://github.com/PrismLibrary/samples/pull/15). Source access is required for these repository links. The [walkthrough overview](index.md) describes the composition and privacy boundaries.

The Logging qualification used source `5aa5302bcd65da01376c48292bd5d70e931d3d00`, whose file tree matches the merge:

- The 561-test portable suite passed on both .NET 10 and .NET 11.
- 21 native WPF tests passed, including the five actual host startup/logger-composition checks.
- All ten selected MAUI/Uno Windows builds passed with zero errors and the existing package-source mapping warnings.

Those checks verify the real Logging integration, privacy filtering, and tested application boundaries. They do not constitute new screenshots, complete MAUI/Uno interactive journeys, Android/browser runtime checks, Apple acceptance, or NativeAOT publication. Pending capture rows above therefore remain pending.

---
sidebar_position: 7
title: Runtime capture coverage
---

# Runtime capture coverage

A screenshot identifies one application, presentation framework, operating system, source checkpoint, and UI state. It does not prove that the other heads ran, that the UI passed an accessibility audit, or that the application was published with NativeAOT.

## Current coverage

| Application | WPF / Windows | MAUI / Windows | MAUI / Android emulator | Uno / Windows | Uno / Linux Desktop | Uno / BrowserWasm | Uno / Android emulator |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Calculator | 5 runtime test renders | Capture pending | 2 Light captures; limited checkpoint | Capture pending | Capture held | Capture pending | 6 source-qualified captures |
| Planner | 4 runtime test renders | Capture pending | Capture pending | Capture pending | Capture held | Capture pending | Capture pending |
| Sales Desk | 6 runtime test renders | Capture pending | Capture pending | Capture pending | Capture held | Capture pending | Capture pending |
| Learning Hub | 6 runtime test renders | Capture pending | Capture pending | Capture pending | Capture held | Capture pending | Capture pending |
| Mail | 6 runtime test renders | Capture pending | Capture pending | Capture pending | Capture held | Capture pending | Capture pending |

“Capture pending” means no qualified image from that application/head is included here. It does not mean that the target is unsupported. Linux capture remains held before a runnable application is available; no substitute image is presented as Linux output. Only Calculator has the Android evidence listed here. Other applications and browser execution remain pending.

**iOS and macOS capture work is deferred.** No Apple runtime or screenshot acceptance is implied. Avalonia application heads are outside this five-app showcase; the separate starter template is not an Essentials-qualified replacement for them.

Some native Windows builds and composition tests already exist in the sample READMEs. Those results retain their exact source checkpoints and do not fill an interactive screenshot row automatically. Updated screenshots should record the actual current head that was launched.

## Included galleries and provenance

| App / framework | Included scenes | Verified source |
| --- | --- | --- |
| [Calculator / WPF](calculator.md?platform=wpf) | Calculation/history, detail and clear dialogs, converter, dark layout | `89f3a5b` |
| [Planner / WPF](planner.md?platform=wpf) | Home, task board, editor dialog, compact dark board | `7ffdd4c` |
| [Sales Desk / WPF](sales-desk.md?platform=wpf) | Quote workspace, products, customer and dirty-close dialogs, compact/dark layouts | Base `75c467c` plus qualified tree `eae8063` |
| [Learning Hub / WPF](learning-hub.md?platform=wpf) | Catalog, reader, collection state/confirmation, reading tools, compact catalog | `dc814b3` |
| [Prism Mail / WPF](mail.md?platform=wpf) | Inbox, compose, recipients, contacts, calendar, compact reader | `d03d63a`, with unchanged earlier render bytes where recorded |
| [Calculator / Uno Android](calculator.md?platform=uno-platform) | Arithmetic, memory, history detail, number format, restored history | `5c048dc` |
| [Calculator / MAUI Android](calculator.md?platform=maui) | Light calculator showing `14` and single-entry history | `89f3a5b` |

The gallery contains **35 untouched PNGs**: 27 WPF renders and eight Android captures. The [provenance manifest](images/runtime-provenance.json) records full source/qualified-tree identifiers, SHA-256 hashes, dimensions, capture method, verified interactions, and limitations. A filesystem modification timestamp is identified as such; it is not invented as an embedded capture time.

### WPF capture method

The live application-owned WPF windows ran in an STA/Dispatcher test host on Windows, using real Prism containers, modules, regions, dialogs, and bound controls with isolated app data. `RenderTargetBitmap` captured the visual tree. These images are not operating-system screenshots and do not demonstrate OS mouse/keyboard or screen-reader automation. Original transparent non-client margins are retained.

### Android capture method and limits

Calculator ran on a portrait Android 15 / API 35 x86_64 emulator. The images are untouched full framebuffer captures, including Android chrome. They are emulator evidence, not physical-device qualification.

- **Uno `5c048dc`:** arithmetic `14`, repeat `26`, parentheses `20`, decimal `0.3`, error recovery, memory, history/dialogs, and Dark/French/history persistence were exercised. Some dark Android status icons have poor contrast, and dark detail/clear dialogs retain white surfaces. Normal scrolling exposes the lower keypad row. The captions preserve these boundaries.
- **MAUI `89f3a5b`:** launch, keypad result `14`, a single history entry, and readable Light appearance were verified. Repeat-equals `26` and full MAUI persistence were not established. Four Dark captures with pale shell text on a white background are excluded from the polished gallery. An inherited task-owned setting under the shared application ID is not independent MAUI restart evidence.
- These captures do not qualify the current Logging head, other applications on Android, alternate widths, high contrast, definitive keyboard/clipboard completion, or all-platform parity.

A source link describes the code under discussion; an image describes its labeled capture or verified checkpoint. The walkthroughs follow merged source `9c31a9ce`, while gallery images retain their exact earlier runtime evidence.

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

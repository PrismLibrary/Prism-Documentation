---
sidebar_position: 7
title: Runtime capture coverage
---

# Runtime capture coverage

A screenshot identifies one application, framework, operating system, source checkpoint and UI state. It does not prove that another head ran, that accessibility was certified, or that the application was published with NativeAOT. The walkthrough source follows merged `02f8e351`; each image retains its actual earlier runtime checkpoint.

## Current coverage

| Application | WPF / Windows | MAUI / Windows | MAUI / Android emulator | Uno / Windows | Uno / Linux Desktop | Uno / BrowserWasm | Uno / Android emulator |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Calculator | 5 runtime test renders | Capture pending | 2 Light captures; limited checkpoint | Capture pending | Capture pending | Capture pending | 6 source-qualified captures |
| Planner | 5 runtime test renders | Capture pending | 1 home capture; navigation blocked | Capture pending | Capture pending | Capture pending | 2 local-save captures; layout/theme limits |
| Sales Desk | 7 runtime test renders | Capture pending | 3 captures; full quote completion unqualified | Capture pending | Capture pending | Capture pending | 2 captures; customer revision saved |
| Learning Hub | 6 runtime test renders | Capture pending | 3 catalog/reader/collection captures | Capture pending | Capture pending | Capture pending | 3 restored-state/preferences captures |
| Mail | 9 runtime test renders | Capture pending | 6 captures; startup/dialog/Accounts checks passed | Capture pending | Capture pending | Capture pending | 3 captures; Accounts/Refresh/return passed |

“Capture pending” means no qualified image from that application/head is included here. A native build is separate from a runtime journey. Earlier Linux Desktop attempts did not reach a runnable application; Windows renders do not stand in for Linux, Android or browser output. The Android rows describe bounded workflows, with remaining failures listed below.

**iOS and macOS capture work is deferred.** No Apple runtime or screenshot acceptance is implied. Avalonia application heads are outside this five-app showcase; the separate starter template is not an Essentials-qualified replacement for them.

## Included galleries and provenance

The galleries contain **63 untouched PNGs**: 32 WPF renders and 31 Android captures. The [provenance manifest](images/runtime-provenance.json) records full source/qualified-tree identifiers, SHA-256 hashes, dimensions, capture methods, observed interactions and limits. All 35 earlier files retain their original bytes and attribution; 28 curated scenes add useful evidence without repeating identical cancellation or refresh frames.

| App / framework | Included scenes | Actual source checkpoint |
| --- | --- | --- |
| [Calculator / WPF](calculator.md?platform=wpf) | Calculation/history, detail and clear dialogs, converter, Dark layout | `89f3a5b2` |
| [Planner / WPF](planner.md?platform=wpf) | Home, task board, editor, compact board; newer readable Dark editor | `7ffdd4c7`; Dark editor `75b63e8d` |
| [Sales Desk / WPF](sales-desk.md?platform=wpf) | Quote workspace, products, selectors, confirmations and compact/Dark layouts; newer welcome artwork | Base `75c467c` plus qualified tree `eae8063`; welcome `75b63e8d` |
| [Learning Hub / WPF](learning-hub.md?platform=wpf) | Catalog, reader, collection state/confirmation and reading tools | `dc814b3a` |
| [Mail / WPF](mail.md?platform=wpf) | Inbox/navigation glyphs, compact empty search, adjacent Agenda range; earlier compose/contacts/reader scenes | `e4041f67`, `946cd75e`; earlier `d03d63a7` evidence remains labeled |
| [Calculator / MAUI Android](calculator.md?platform=maui) | Light calculator result `14` and history | `89f3a5b2` |
| [Calculator / Uno Android](calculator.md?platform=uno-platform) | Arithmetic, memory, history detail, number format and restored history | `5c048dc4` |
| [Planner / MAUI Android](planner.md?platform=maui) | Branded home only | `8093ba7d` |
| [Planner / Uno Android](planner.md?platform=uno-platform) | New-task count and saved personal note | `8093ba7d` |
| [Sales Desk / MAUI Android](sales-desk.md?platform=maui) | Home, product catalog and empty-draft validation | `8093ba7d` |
| [Sales Desk / Uno Android](sales-desk.md?platform=uno-platform) | Home and locally saved customer change | `8093ba7d` |
| [Learning Hub / MAUI Android](learning-hub.md?platform=maui) | Offline catalog, reader and saved collection state | `8093ba7d` |
| [Learning Hub / Uno Android](learning-hub.md?platform=uno-platform) | Restored section/collection and saved Dark preferences | `8093ba7d` |
| [Mail / MAUI Android](mail.md?platform=maui) | Cold inbox, contacts, Week templates, opaque dialogs and Accounts controls | `eb38cd21`, tree `87d441da` |
| [Mail / Uno Android](mail.md?platform=uno-platform) | Cold inbox, Accounts and scrolled connection controls | `a8c5633d`, tree `fcc5b0c5` |

### WPF capture method

The application-owned native WPF windows ran in an STA/Dispatcher test host on Windows with real Prism containers, modules, regions, dialogs and bound controls. `RenderTargetBitmap` captured the visual tree using synthetic app data. These are not operating-system screenshots or OS mouse/keyboard and screen-reader qualification. Original transparent non-client margins are retained.

The `75b63e8d` qualification passed Planner's four and Sales Desk's four WPF scenarios. Mail's focused visual recheck at `e4041f67` passed five scenarios, including geometry/content-fit assertions for its navigation glyphs and empty guidance. Mail's later `946cd75e` run passed all five WPF scenarios including Cancel/Continue protection, thirty-day Agenda stepping, editor date reset and local save in the adjacent range. It does not establish Android calendar behavior.

### Android capture method

These are full, untouched ADB framebuffer captures from a portrait Android 15 / API 35 x86_64 emulator, including Android chrome. The newer emulator runs used 1080 × 2400 pixels at 420 dpi, SDK 10.0.401 and `net10.0-android/android-x64` Debug builds. They are not physical-device or release-build qualification. Sales Desk and Learning Hub MAUI reused recorded `8093ba7d` APKs; their APK identities were retained rather than inferred from the later capture time.

The evidence bundles record capture timestamps and app foreground state. Where an older WPF bundle supplies only filesystem modification time, the manifest labels that proxy; where no capture time is supplied, none is invented.

## Verified Android benefits and remaining gaps

- **Calculator / Uno `5c048dc4`:** arithmetic `14`, repeat `26`, parentheses `20`, decimal `0.3`, error recovery, memory, history/dialogs and Dark/French/history persistence were exercised. Some Dark Android status icons have poor contrast and Dark detail/clear dialogs retain white surfaces. Scrolling exposes the lower keypad row.
- **Calculator / MAUI `89f3a5b2`:** launch, result `14`, one history entry and readable Light appearance passed. Repeat-equals `26` and full persistence were not established. Four Dark frames with pale shell text on white are excluded from the gallery. Inherited data under the shared application ID does not independently qualify MAUI restart behavior.
- **Planner / Uno `8093ba7d`:** creating a task changed the board from three to four tasks and showed Saved; a personal note showed Saved on this device. The editor action was partly clipped but tappable. The attempted Dark frame duplicated Light pixels, so no Dark pass is claimed.
- **Planner / MAUI `8093ba7d`:** the branded home rendered, but project navigation failed to create `Planner.Projects` and note navigation raised an undeclared `note` namespace error. The single home image is explicitly launch-only evidence; a complete Android journey remains blocked at that checkpoint.
- **Sales Desk / Uno `8093ba7d`:** Q-1042 changed customer to Northline Works and saved locally as revision 2. No order was placed. Customer selection contrast remains poor; requested Catalog and Appearance transitions were not verified.
- **Sales Desk / MAUI `8093ba7d`:** home, catalog, fictional customers, seeded quotes and an empty draft rendered. Save correctly rejected the empty draft. The customer dialog clips horizontally and product/subtotal controls were outside the observed editor viewport; no successful complete new quote is claimed.
- **Learning Hub / MAUI and Uno `8093ba7d`:** MAUI opened bundled content, bookmarked an article and created a collection. Uno subsequently reopened Section 2 and the named collection using the same retained app data. This establishes that bounded state transfer, not an independent clean install or complete persistence matrix. Uno Dark preferences saved with readable app text; selected Light catalog text and Dark status icons have contrast limitations. Mark-complete outcome was not established.
- **Mail / MAUI `eb38cd21`:** the newer build cold-starts into twelve fictional messages; explicit local commands populate People and Calendar. Light recipient/confirmation surfaces are opaque and readable, and Cancel returns to unchanged compose. Accounts scrolling exposes the full network caption and lower controls; Refresh and return to Mail pass. Cancel sign-in and Disconnect remain disabled as expected without an active account. This supersedes the older `8093ba7d` startup failure for the qualified repair. No discard, draft save, send, Dark-theme or later calendar-range acceptance is claimed by this focused run.
- **Mail / Uno `a8c5633d`:** cold start, Accounts, network status, Refresh and return to the populated inbox pass after adding `ACCESS_NETWORK_STATE`. This supersedes the earlier Accounts construction failure. The later calendar-integrated source was not rebuilt for these frames. Selected inbox contrast and status-bar overlap remain visible; no complete theme or provider acceptance is claimed.

No real mail sign-in, consent, mailbox access or send is needed for these journeys. All application data shown is synthetic. Remaining Mail attachment/selection, provider concurrency/recovery, configuration and qualification work is tracked in [issue #5](https://github.com/PrismLibrary/samples/issues/5#issuecomment-6009427317); the merged fixes do not close that broader issue.

## Source and validation checkpoints

The source walkthroughs were checked against [samples master `02f8e351`](https://github.com/PrismLibrary/samples/tree/02f8e351ff20356e0ff2cc656f8bb201f65fff97). Its merged work includes [visual polish #17](https://github.com/PrismLibrary/samples/pull/17), [MAUI Mail startup/dialogs #18](https://github.com/PrismLibrary/samples/pull/18), [Calendar ranges #19](https://github.com/PrismLibrary/samples/pull/19) and [Uno Accounts #20](https://github.com/PrismLibrary/samples/pull/20). Repository access is required for these links.

The Calendar repair's qualification records 273 portable Mail tests plus the five native WPF scenarios. The subsequent calendar-integrated Accounts source records 274 portable tests. The Accounts/manifest bytes were checked against the earlier successful `a8c5633d` run; its images remain labeled `a8c5633d`, not the later merge. Portable tests and matching code do not turn an earlier screenshot into a new runtime capture.

The separate earlier Logging qualification used `5aa5302bcd65da01376c48292bd5d70e931d3d00`, whose tree matched the Logging merge: 561 portable tests on both .NET 10 and .NET 11, 21 native WPF tests including five host/logger-composition checks, and ten selected MAUI/Uno Windows builds passed. Those results verify their recorded integration and privacy boundaries; they do not establish a later all-head or NativeAOT pass.

## What a new platform capture must establish

1. Identify the exact commit/head, target framework/RID, operating system or emulator image, and SDK.
2. Launch the real application with safe demo data and record the command or application profile.
3. Complete the relevant primary journey: calculation/history, task editing, quote editing, reading/progress, or offline mail/draft.
4. Inspect layout and interaction: useful content, correct bindings, reachable actions, readable contrast, completed navigation and dialog cancellation.
5. Preserve the original browser, native-window, app-render or emulator image with its hash. Name the capture method accurately.
6. State unrun paths and unresolved failures. A build, resized WPF window, application-owned render and OS screenshot are different results.

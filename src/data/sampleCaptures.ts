import type {SampleCapture} from '@site/src/components/SampleGallery';

export const sampleCaptures: Record<string, {wpf: readonly SampleCapture[]; maui: readonly SampleCapture[]; uno: readonly SampleCapture[]}> = {
  "calculator": {
    "wpf": [
      {
        "id": "calculator-wpf-1",
        "title": "Calculation and history",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/calculator-wpf-light.png').default,
        "alt": "Calculator WPF: Calculation and history",
        "caption": "App-owned WPF runtime test render. Light desktop layout showing 0.1 + 0.2 = 0.3 and prior results 14, 26 and 20.",
        "sourceLabel": "89f3a5b2",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/89f3a5b2da69a9b0eb7fbbbcaaa98f31c694c961"
      },
      {
        "id": "calculator-wpf-4",
        "title": "History detail dialog",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/gallery/calculator/wpf/history-detail.png').default,
        "alt": "Calculator WPF: History detail dialog",
        "caption": "App-owned WPF runtime test render. History detail shows the stored decimal calculation with a comma-formatted result and Cancel / Reuse result actions.",
        "sourceLabel": "89f3a5b2",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/89f3a5b2da69a9b0eb7fbbbcaaa98f31c694c961"
      },
      {
        "id": "calculator-wpf-3",
        "title": "Clear-history confirmation",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/gallery/calculator/wpf/history-clear.png').default,
        "alt": "Calculator WPF: Clear-history confirmation",
        "caption": "App-owned WPF runtime test render. Clear-history dialog requires an explicit acknowledgement before removing saved calculations; current result and memory are retained.",
        "sourceLabel": "89f3a5b2",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/89f3a5b2da69a9b0eb7fbbbcaaa98f31c694c961"
      },
      {
        "id": "calculator-wpf-2",
        "title": "Unit converter",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/gallery/calculator/wpf/converter.png').default,
        "alt": "Calculator WPF: Unit converter",
        "caption": "App-owned WPF runtime test render. Length conversion from 1500 metres to 1.5 kilometres.",
        "sourceLabel": "89f3a5b2",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/89f3a5b2da69a9b0eb7fbbbcaaa98f31c694c961"
      },
      {
        "id": "calculator-wpf-0",
        "title": "Dark calculation workspace",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/gallery/calculator/wpf/calculator-wide-dark.png').default,
        "alt": "Calculator WPF: Dark calculation workspace",
        "caption": "App-owned WPF runtime test render. Dark desktop layout showing the decimal result and adjacent history. The keypad continues below the current viewport.",
        "sourceLabel": "89f3a5b2",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/89f3a5b2da69a9b0eb7fbbbcaaa98f31c694c961"
      }
    ],
    "maui": [
      {
        "id": "calculator-maui-33",
        "title": "Light calculator",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/calculator/maui/07-light-repeat.png').default,
        "alt": "Calculator MAUI: Light calculator",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. Readable Light calculator showing 2 + 3 × 4 = 14. Repeat-equals is not verified by this MAUI capture.",
        "sourceLabel": "89f3a5b2",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/89f3a5b2da69a9b0eb7fbbbcaaa98f31c694c961"
      },
      {
        "id": "calculator-maui-34",
        "title": "Light history",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/calculator/maui/08-history.png').default,
        "alt": "Calculator MAUI: Light history",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. Light history screen containing the synthetic calculation 2 + 3 × 4 = 14.",
        "sourceLabel": "89f3a5b2",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/89f3a5b2da69a9b0eb7fbbbcaaa98f31c694c961"
      }
    ],
    "uno": [
      {
        "id": "calculator-uno-29",
        "title": "History detail dialog",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/calculator/uno/12-clear-history-prompt.png').default,
        "alt": "Calculator Uno: History detail dialog",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. The history item for 14 opens with Cancel and Reuse result actions.",
        "sourceLabel": "5c048dc4",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/5c048dc495e4881b20fe8d47a141b62f304e9a02"
      },
      {
        "id": "calculator-uno-27",
        "title": "Keypad precedence",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/calculator/uno/04-keypad-precedence.png').default,
        "alt": "Calculator Uno: Keypad precedence",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. Android keypad interaction evaluates 2 + 3 × 4 to 14.",
        "sourceLabel": "5c048dc4",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/5c048dc495e4881b20fe8d47a141b62f304e9a02"
      },
      {
        "id": "calculator-uno-30",
        "title": "Decimal arithmetic",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/calculator/uno/19-decimal-correct.png').default,
        "alt": "Calculator Uno: Decimal arithmetic",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. The decimal keypad calculation 0.1 + 0.2 produces 0.3.",
        "sourceLabel": "5c048dc4",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/5c048dc495e4881b20fe8d47a141b62f304e9a02"
      },
      {
        "id": "calculator-uno-28",
        "title": "Store and recall memory",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/calculator/uno/06-memory.png').default,
        "alt": "Calculator Uno: Store and recall memory",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. The value 26 has been stored and recalled, with M 26 visible.",
        "sourceLabel": "5c048dc4",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/5c048dc495e4881b20fe8d47a141b62f304e9a02"
      },
      {
        "id": "calculator-uno-31",
        "title": "Dark appearance and number formats",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/calculator/uno/23-culture-options-dark.png').default,
        "alt": "Calculator Uno: Dark appearance and number formats",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. Dark mode with the number-format selector open; Android status icons have low contrast in this capture.",
        "sourceLabel": "5c048dc4",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/5c048dc495e4881b20fe8d47a141b62f304e9a02"
      },
      {
        "id": "calculator-uno-32",
        "title": "History after restart",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/calculator/uno/26-history-after-restart.png').default,
        "alt": "Calculator Uno: History after restart",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. The synthetic calculation history remains available after restart in Dark mode. Android status icons have low contrast.",
        "sourceLabel": "5c048dc4",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/5c048dc495e4881b20fe8d47a141b62f304e9a02"
      }
    ]
  },
  "planner": {
    "wpf": [
      {
        "id": "planner-wpf-6",
        "title": "Project task board",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/planner-wpf-board.png').default,
        "alt": "Planner WPF: Project task board",
        "caption": "App-owned WPF runtime test render. Wide project board with task search, task list and selected-task details.",
        "sourceLabel": "7ffdd4c7",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/7ffdd4c76a8dab96969ef23012a2b61b3258d2c1"
      },
      {
        "id": "planner-wpf-5",
        "title": "Planner home",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/gallery/planner/wpf/01-home-light.png').default,
        "alt": "Planner WPF: Planner home",
        "caption": "App-owned WPF runtime test render. Light home screen with links to the planner and notes.",
        "sourceLabel": "7ffdd4c7",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/7ffdd4c76a8dab96969ef23012a2b61b3258d2c1"
      },
      {
        "id": "planner-wpf-7",
        "title": "Task editor dialog",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/gallery/planner/wpf/03-task-editor-light.png').default,
        "alt": "Planner WPF: Task editor dialog",
        "caption": "App-owned WPF runtime test render. Native task editor with title, project, details, priority, stage, date and tags.",
        "sourceLabel": "7ffdd4c7",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/7ffdd4c76a8dab96969ef23012a2b61b3258d2c1"
      },
      {
        "id": "planner-wpf-8",
        "title": "Compact dark board",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/gallery/planner/wpf/04-board-compact-dark.png').default,
        "alt": "Planner WPF: Compact dark board",
        "caption": "App-owned WPF runtime test render. Compact dark board with the edited task, show-completed control and restored-task status.",
        "sourceLabel": "7ffdd4c7",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/7ffdd4c76a8dab96969ef23012a2b61b3258d2c1"
      },
      {
        "id": "planner-wpf-dark-editor-75b63e8d",
        "title": "Dark task editor",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/gallery/planner/wpf/dark-editor-75b63e8d.png').default,
        "alt": "Planner WPF: Dark task editor",
        "caption": "App-owned WPF runtime test render. Readable native dark editor with its fields and both Cancel and Save task actions visible.",
        "sourceLabel": "75b63e8d",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/75b63e8d28e6152042af282d08e5d480fe2a5263"
      }
    ],
    "maui": [
      {
        "id": "planner-maui-home-8093ba7d",
        "title": "Planner home · limited checkpoint",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/planner/maui/home-8093ba7d.png').default,
        "alt": "Planner MAUI: Planner home · limited checkpoint",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. Branded home with planner and note entry actions. This checkpoint could not navigate to the project board or create a note; it is launch evidence only.",
        "sourceLabel": "8093ba7d",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/8093ba7d7b1e62a80564e71e5c47451588fefe8b"
      }
    ],
    "uno": [
      {
        "id": "planner-uno-task-saved-8093ba7d",
        "title": "Task saved locally",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/planner/uno/task-saved-8093ba7d.png').default,
        "alt": "Planner Uno: Task saved locally",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. The board count increases from three to four tasks and reports Saved after creating a synthetic task. The task list is not readable in this frame.",
        "sourceLabel": "8093ba7d",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/8093ba7d7b1e62a80564e71e5c47451588fefe8b"
      },
      {
        "id": "planner-uno-note-saved-8093ba7d",
        "title": "Save a personal note",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/planner/uno/note-saved-8093ba7d.png').default,
        "alt": "Planner Uno: Save a personal note",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. A synthetic Android local thought is selected with Saved on this device visible.",
        "sourceLabel": "8093ba7d",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/8093ba7d7b1e62a80564e71e5c47451588fefe8b"
      }
    ]
  },
  "sales-desk": {
    "wpf": [
      {
        "id": "sales-desk-wpf-welcome-dark-75b63e8d",
        "title": "Compact dark welcome",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/gallery/sales-desk/wpf/welcome-dark-75b63e8d.png').default,
        "alt": "Sales Desk WPF: Compact dark welcome",
        "caption": "App-owned WPF runtime test render. Original app artwork, wrapped introductory text and both workspace actions are visible in the compact dark desktop shell.",
        "sourceLabel": "75b63e8d",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/75b63e8d28e6152042af282d08e5d480fe2a5263"
      },
      {
        "id": "sales-desk-wpf-14",
        "title": "Quote workspace",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/sales-desk-wpf-quotes.png').default,
        "alt": "Sales Desk WPF: Quote workspace",
        "caption": "App-owned WPF runtime test render. Light desktop quote workspace with quote list, selected customer and editable line item.",
        "sourceLabel": "eae80632 (qualified tree)",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/eae806326ddba3739357f120570fdc41314504e2"
      },
      {
        "id": "sales-desk-wpf-9",
        "title": "Product catalog",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/gallery/sales-desk/wpf/sales-catalog-light.png').default,
        "alt": "Sales Desk WPF: Product catalog",
        "caption": "App-owned WPF runtime test render. Light product catalog containing fictional products, descriptions and prices.",
        "sourceLabel": "eae80632 (qualified tree)",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/eae806326ddba3739357f120570fdc41314504e2"
      },
      {
        "id": "sales-desk-wpf-10",
        "title": "Customer selection dialog",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/gallery/sales-desk/wpf/sales-customer-selection.png').default,
        "alt": "Sales Desk WPF: Customer selection dialog",
        "caption": "App-owned WPF runtime test render. Searchable customer-selection dialog with fictional customers.",
        "sourceLabel": "eae80632 (qualified tree)",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/eae806326ddba3739357f120570fdc41314504e2"
      },
      {
        "id": "sales-desk-wpf-11",
        "title": "Unsaved quote confirmation",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/gallery/sales-desk/wpf/sales-dirty-confirmation.png').default,
        "alt": "Sales Desk WPF: Unsaved quote confirmation",
        "caption": "App-owned WPF runtime test render. Dirty-document dialog offers Keep working, Discard and Save locally.",
        "sourceLabel": "eae80632 (qualified tree)",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/eae806326ddba3739357f120570fdc41314504e2"
      },
      {
        "id": "sales-desk-wpf-12",
        "title": "Compact quote editing",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/gallery/sales-desk/wpf/sales-quotes-compact.png').default,
        "alt": "Sales Desk WPF: Compact quote editing",
        "caption": "App-owned WPF runtime test render. Narrower desktop viewport retaining quote navigation, customer details and line-item editing; this is a WPF render, not a phone capture.",
        "sourceLabel": "eae80632 (qualified tree)",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/eae806326ddba3739357f120570fdc41314504e2"
      },
      {
        "id": "sales-desk-wpf-13",
        "title": "Dark quote workspace",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/gallery/sales-desk/wpf/sales-quotes-wide-dark.png').default,
        "alt": "Sales Desk WPF: Dark quote workspace",
        "caption": "App-owned WPF runtime test render. Dark quote workspace with the same open quote and local-save controls.",
        "sourceLabel": "eae80632 (qualified tree)",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/eae806326ddba3739357f120570fdc41314504e2"
      }
    ],
    "maui": [
      {
        "id": "sales-desk-maui-home-8093ba7d",
        "title": "Sales workspace home",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/sales-desk/maui/home-8093ba7d.png').default,
        "alt": "Sales Desk MAUI: Sales workspace home",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. The Light phone shell opens the fictional quote workspace with Quotes, Customers and Catalog navigation.",
        "sourceLabel": "8093ba7d",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/8093ba7d7b1e62a80564e71e5c47451588fefe8b"
      },
      {
        "id": "sales-desk-maui-catalog-8093ba7d",
        "title": "Product catalog",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/sales-desk/maui/catalog-8093ba7d.png').default,
        "alt": "Sales Desk MAUI: Product catalog",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. The native phone catalog displays bundled products, descriptions and synthetic USD prices.",
        "sourceLabel": "8093ba7d",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/8093ba7d7b1e62a80564e71e5c47451588fefe8b"
      },
      {
        "id": "sales-desk-maui-draft-validation-8093ba7d",
        "title": "Empty draft validation",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/sales-desk/maui/draft-validation-8093ba7d.png').default,
        "alt": "Sales Desk MAUI: Empty draft validation",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. Saving an empty draft reports Add between 1 and 100 products; the document remains unsaved. This is validation evidence, not a successful quote save.",
        "sourceLabel": "8093ba7d",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/8093ba7d7b1e62a80564e71e5c47451588fefe8b"
      }
    ],
    "uno": [
      {
        "id": "sales-desk-uno-home-8093ba7d",
        "title": "Sales workspace home",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/sales-desk/uno/home-8093ba7d.png').default,
        "alt": "Sales Desk Uno: Sales workspace home",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. The native Uno phone shell introduces the offline customer, product and quote workflow.",
        "sourceLabel": "8093ba7d",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/8093ba7d7b1e62a80564e71e5c47451588fefe8b"
      },
      {
        "id": "sales-desk-uno-customer-saved-8093ba7d",
        "title": "Customer change saved",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/sales-desk/uno/customer-saved-8093ba7d.png').default,
        "alt": "Sales Desk Uno: Customer change saved",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. Q-1042 now belongs to the fictional Northline Works customer, with Saved locally · revision 2 and the explicit No order was placed status.",
        "sourceLabel": "8093ba7d",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/8093ba7d7b1e62a80564e71e5c47451588fefe8b"
      }
    ]
  },
  "learning-hub": {
    "wpf": [
      {
        "id": "learning-hub-wpf-16",
        "title": "Learning catalog",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/learning-hub-wpf-catalog.png').default,
        "alt": "Learning Hub WPF: Learning catalog",
        "caption": "App-owned WPF runtime test render. Wide light discovery catalog with bundled offline articles and topic/search controls.",
        "sourceLabel": "dc814b3a",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/dc814b3a6da1e3f8eb237007945f884406d9f066"
      },
      {
        "id": "learning-hub-wpf-18",
        "title": "Dark large-text reader",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/learning-hub-wpf-reader-dark.png').default,
        "alt": "Learning Hub WPF: Dark large-text reader",
        "caption": "App-owned WPF runtime test render. Dark reader with larger text, scrolled to section content and reading actions.",
        "sourceLabel": "dc814b3a",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/dc814b3a6da1e3f8eb237007945f884406d9f066"
      },
      {
        "id": "learning-hub-wpf-19",
        "title": "Updated selected collection",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/gallery/learning-hub/wpf/learning-selected-collection-updated.png').default,
        "alt": "Learning Hub WPF: Updated selected collection",
        "caption": "App-owned WPF runtime test render. The selected Weekend focus collection remains visible with its added article.",
        "sourceLabel": "dc814b3a",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/dc814b3a6da1e3f8eb237007945f884406d9f066"
      },
      {
        "id": "learning-hub-wpf-17",
        "title": "Collection discard confirmation",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/gallery/learning-hub/wpf/learning-discard-confirmation.png').default,
        "alt": "Learning Hub WPF: Collection discard confirmation",
        "caption": "App-owned WPF runtime test render. Create-collection dialog with an embedded unsaved-changes confirmation.",
        "sourceLabel": "dc814b3a",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/dc814b3a6da1e3f8eb237007945f884406d9f066"
      },
      {
        "id": "learning-hub-wpf-20",
        "title": "Reading preferences",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/gallery/learning-hub/wpf/learning-tools-dark.png').default,
        "alt": "Learning Hub WPF: Reading preferences",
        "caption": "App-owned WPF runtime test render. Dark reading-tools screen with appearance, text size and reduced-motion preferences.",
        "sourceLabel": "dc814b3a",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/dc814b3a6da1e3f8eb237007945f884406d9f066"
      },
      {
        "id": "learning-hub-wpf-15",
        "title": "Compact catalog after scrolling",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/gallery/learning-hub/wpf/learning-catalog-compact-scrolled.png').default,
        "alt": "Learning Hub WPF: Compact catalog after scrolling",
        "caption": "App-owned WPF runtime test render. Compact catalog viewport after scrolling to another article; footer and open-read action remain visible.",
        "sourceLabel": "dc814b3a",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/dc814b3a6da1e3f8eb237007945f884406d9f066"
      }
    ],
    "maui": [
      {
        "id": "learning-hub-maui-discover-8093ba7d",
        "title": "Offline reading catalog",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/learning-hub/maui/discover-8093ba7d.png').default,
        "alt": "Learning Hub MAUI: Offline reading catalog",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. The phone catalog presents 12 bundled reads, topic search, original artwork and a selected article.",
        "sourceLabel": "8093ba7d",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/8093ba7d7b1e62a80564e71e5c47451588fefe8b"
      },
      {
        "id": "learning-hub-maui-reader-8093ba7d",
        "title": "Read a bundled article",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/learning-hub/maui/reader-8093ba7d.png').default,
        "alt": "Learning Hub MAUI: Read a bundled article",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. The article opens at Section 1 of 4 with readable text and its original illustration. Further content is reached by scrolling.",
        "sourceLabel": "8093ba7d",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/8093ba7d7b1e62a80564e71e5c47451588fefe8b"
      },
      {
        "id": "learning-hub-maui-collection-saved-8093ba7d",
        "title": "Bookmark and collection saved",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/learning-hub/maui/collection-saved-8093ba7d.png').default,
        "alt": "Learning Hub MAUI: Bookmark and collection saved",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. Collections shows the bookmarked article and Collection saved after creating Android local. The later Uno picker confirms that named collection persisted.",
        "sourceLabel": "8093ba7d",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/8093ba7d7b1e62a80564e71e5c47451588fefe8b"
      }
    ],
    "uno": [
      {
        "id": "learning-hub-uno-reader-restored-8093ba7d",
        "title": "Restored reading position",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/learning-hub/uno/reader-restored-8093ba7d.png').default,
        "alt": "Learning Hub Uno: Restored reading position",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. Uno reopens Section 2 of 4 from the local state previously saved through MAUI on the same emulator and application ID.",
        "sourceLabel": "8093ba7d",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/8093ba7d7b1e62a80564e71e5c47451588fefe8b"
      },
      {
        "id": "learning-hub-uno-collection-restored-8093ba7d",
        "title": "Restored collection",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/learning-hub/uno/collection-restored-8093ba7d.png').default,
        "alt": "Learning Hub Uno: Restored collection",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. The picker contains Android local, created through MAUI, while the bookmarked article remains visible.",
        "sourceLabel": "8093ba7d",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/8093ba7d7b1e62a80564e71e5c47451588fefe8b"
      },
      {
        "id": "learning-hub-uno-dark-preferences-8093ba7d",
        "title": "Dark reading preferences",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/learning-hub/uno/dark-preferences-8093ba7d.png').default,
        "alt": "Learning Hub Uno: Dark reading preferences",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. Dark appearance and Reading preferences saved are visible with readable app text. Android status icons have poor contrast.",
        "sourceLabel": "8093ba7d",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/8093ba7d7b1e62a80564e71e5c47451588fefe8b"
      }
    ]
  },
  "mail": {
    "wpf": [
      {
        "id": "mail-wpf-inbox-e4041f67",
        "title": "Inbox with fitted navigation icons",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/gallery/mail/wpf/inbox-e4041f67.png').default,
        "alt": "Mail WPF: Inbox with fitted navigation icons",
        "caption": "App-owned WPF runtime test render. The visual recheck shows the wide offline inbox and complete navigation, theme and search glyphs inside their controls.",
        "sourceLabel": "e4041f67",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/e4041f67655b4d72a4579f60987953943921effb"
      },
      {
        "id": "mail-wpf-empty-search-e4041f67",
        "title": "Compact empty search",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/gallery/mail/wpf/empty-search-e4041f67.png').default,
        "alt": "Mail WPF: Compact empty search",
        "caption": "App-owned WPF runtime test render. The dark empty state keeps its original artwork and full search guidance readable at a compact desktop width.",
        "sourceLabel": "e4041f67",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/e4041f67655b4d72a4579f60987953943921effb"
      },
      {
        "id": "mail-wpf-calendar-range-946cd75e",
        "title": "Save in the next Agenda range",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/gallery/mail/wpf/calendar-range-946cd75e.png').default,
        "alt": "Mail WPF: Save in the next Agenda range",
        "caption": "App-owned WPF runtime test render. The November 4 range and the saved local event agree with the 09:00–10:00 UTC editor values. The native workflow also verified Cancel preserves unsaved edits.",
        "sourceLabel": "946cd75e",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/946cd75e9ad91dd9454bb6c4744b96919137df58"
      },
      {
        "id": "mail-wpf-21",
        "title": "Inbox and reader",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/mail-wpf-inbox.png').default,
        "alt": "Mail WPF: Inbox and reader",
        "caption": "App-owned WPF runtime test render. Wide light inbox with fictional messages and the selected message in its reader pane.",
        "sourceLabel": "d03d63a7",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/d03d63a75c3be1c44c48e5f2e56f39b410a9f91f"
      },
      {
        "id": "mail-wpf-24",
        "title": "Compose a local draft",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/mail-wpf-compose-dark.png').default,
        "alt": "Mail WPF: Compose a local draft",
        "caption": "App-owned WPF runtime test render. Compact dark composer with a synthetic draft; the capture does not show a real message being sent.",
        "sourceLabel": "d03d63a7",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/d03d63a75c3be1c44c48e5f2e56f39b410a9f91f"
      },
      {
        "id": "mail-wpf-23",
        "title": "Recipient dialog",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/gallery/mail/wpf/04-recipient-dialog-dark.png').default,
        "alt": "Mail WPF: Recipient dialog",
        "caption": "App-owned WPF runtime test render. Dark recipient-selection dialog populated with synthetic contacts.",
        "sourceLabel": "d03d63a7",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/d03d63a75c3be1c44c48e5f2e56f39b410a9f91f"
      },
      {
        "id": "mail-wpf-25",
        "title": "Contact details",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/gallery/mail/wpf/09-contacts-compact-dark.png').default,
        "alt": "Mail WPF: Contact details",
        "caption": "App-owned WPF runtime test render. Compact dark synthetic contact editor.",
        "sourceLabel": "d03d63a7",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/d03d63a75c3be1c44c48e5f2e56f39b410a9f91f"
      },
      {
        "id": "mail-wpf-26",
        "title": "Calendar event details",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/gallery/mail/wpf/10-calendar-compact-dark.png').default,
        "alt": "Mail WPF: Calendar event details",
        "caption": "App-owned WPF runtime test render. Compact dark editor for a synthetic local calendar event.",
        "sourceLabel": "d03d63a7",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/d03d63a75c3be1c44c48e5f2e56f39b410a9f91f"
      },
      {
        "id": "mail-wpf-22",
        "title": "Compact dark reader",
        "device": "Windows desktop",
        "src": require('@site/docs/samples/images/gallery/mail/wpf/03-mail-compact-reader-dark.png').default,
        "alt": "Mail WPF: Compact dark reader",
        "caption": "App-owned WPF runtime test render. Compact dark message reader with navigation and reply/forward/read controls.",
        "sourceLabel": "d03d63a7",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/d03d63a75c3be1c44c48e5f2e56f39b410a9f91f"
      }
    ],
    "maui": [
      {
        "id": "mail-maui-cold-inbox-eb38cd21",
        "title": "Offline inbox after cold start",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/mail/maui/cold-inbox-eb38cd21.png').default,
        "alt": "Mail MAUI: Offline inbox after cold start",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. The actual Android cold start reaches a populated 12-message offline inbox after the startup/template repair.",
        "sourceLabel": "eb38cd21",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/eb38cd21bd8117a5dbd3c7c6c49d80c682cb9600"
      },
      {
        "id": "mail-maui-people-eb38cd21",
        "title": "Local contacts",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/mail/maui/people-eb38cd21.png').default,
        "alt": "Mail MAUI: Local contacts",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. An explicit local Search populates the three fictional contacts. No provider account is connected.",
        "sourceLabel": "eb38cd21",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/eb38cd21bd8117a5dbd3c7c6c49d80c682cb9600"
      },
      {
        "id": "mail-maui-calendar-week-eb38cd21",
        "title": "Local Week events",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/mail/maui/calendar-week-eb38cd21.png').default,
        "alt": "Mail MAUI: Local Week events",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. The Week command populates synthetic event templates. This frame predates the later calendar-range repair.",
        "sourceLabel": "eb38cd21",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/eb38cd21bd8117a5dbd3c7c6c49d80c682cb9600"
      },
      {
        "id": "mail-maui-recipient-eb38cd21",
        "title": "Opaque recipient picker",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/mail/maui/recipient-eb38cd21.png').default,
        "alt": "Mail MAUI: Opaque recipient picker",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. The Light recipient dialog has a readable opaque surface and demo contacts. Cancel was verified to return to the unchanged blank composer.",
        "sourceLabel": "eb38cd21",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/eb38cd21bd8117a5dbd3c7c6c49d80c682cb9600"
      },
      {
        "id": "mail-maui-confirmation-eb38cd21",
        "title": "Cancel draft discard",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/mail/maui/confirmation-eb38cd21.png').default,
        "alt": "Mail MAUI: Cancel draft discard",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. The opaque confirmation shows readable Continue and Cancel controls. Cancel returned to the unchanged blank composer; Continue was not invoked.",
        "sourceLabel": "eb38cd21",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/eb38cd21bd8117a5dbd3c7c6c49d80c682cb9600"
      },
      {
        "id": "mail-maui-accounts-eb38cd21",
        "title": "Accounts controls after scrolling",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/mail/maui/accounts-eb38cd21.png').default,
        "alt": "Mail MAUI: Accounts controls after scrolling",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. The full network caption and lower account controls are reachable. Refresh preserves offline mode and returning to Mail restores the populated inbox.",
        "sourceLabel": "eb38cd21",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/eb38cd21bd8117a5dbd3c7c6c49d80c682cb9600"
      }
    ],
    "uno": [
      {
        "id": "mail-uno-cold-inbox-a8c5633d",
        "title": "Offline inbox after cold start",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/mail/uno/cold-inbox-a8c5633d.png').default,
        "alt": "Mail Uno: Offline inbox after cold start",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. The published network-permission fix launches the 12-message offline inbox. The selected row still has poor contrast.",
        "sourceLabel": "a8c5633d",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/a8c5633dcb0f4bcbf4ed0a7a11efd386145fb39d"
      },
      {
        "id": "mail-uno-accounts-a8c5633d",
        "title": "Accounts opens successfully",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/mail/uno/accounts-a8c5633d.png').default,
        "alt": "Mail Uno: Accounts opens successfully",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. Accounts opens the offline demo and provider-configuration screen after the ACCESS_NETWORK_STATE fix. No provider login is performed.",
        "sourceLabel": "a8c5633d",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/a8c5633dcb0f4bcbf4ed0a7a11efd386145fb39d"
      },
      {
        "id": "mail-uno-accounts-scrolled-a8c5633d",
        "title": "Reachable connection status",
        "device": "Android phone",
        "src": require('@site/docs/samples/images/gallery/mail/uno/accounts-scrolled-a8c5633d.png').default,
        "alt": "Mail Uno: Reachable connection status",
        "caption": "Actual Android 15/API 35 x86_64 emulator framebuffer. Scrolling reveals the complete network caption and enabled Refresh action. Refresh and return to the populated Mail inbox passed.",
        "sourceLabel": "a8c5633d",
        "sourceUrl": "https://github.com/PrismLibrary/samples/tree/a8c5633dcb0f4bcbf4ed0a7a11efd386145fb39d"
      }
    ]
  }
};

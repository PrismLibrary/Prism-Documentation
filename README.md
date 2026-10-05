# Prism Documentation

This is the official documentation repository for [Prism](https://github.com/PrismLibrary/Prism), a framework for maintainable, testable XAML applications using WPF, .NET MAUI, Uno Platform, and Avalonia.

Read the [documentation](https://prismlibrary.com/docs/current). The `docs/` directory contains the current 9.1 documentation; `versioned_docs/version-9.0/` is the 9.0 snapshot.

Prism 9.1 is the first NativeAOT-ready Prism release. The supported NativeAOT path requires the Microsoft container, available with Commercial Plus. See the [NativeAOT guide](docs/dependency-injection/native-aot.md) for setup and platform boundaries.

## Working on the documentation

Use a Node.js version supported by `package.json`, then run:

```sh
npm ci
npm start
```

Before submitting a change, run the existing checks:

```sh
npm run typecheck
npm run verify-links
npm run build
```

Keep internal documentation links relative, including their `.md` extension. Update `docs/` for the current version; change the 9.0 snapshot only when correcting documentation that applies to 9.0. Code examples should name their platform and required packages without prescribing stale package-version pins.

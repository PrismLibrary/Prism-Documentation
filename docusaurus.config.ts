import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Prism Library',
  tagline: 'Build cohesive, testable XAML apps across every platform with Prism 9.',
  favicon: 'img/logo-prism-symbol@2x.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://prismlibrary.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'PrismLibrary', // Usually your GitHub org/user name.
  projectName: 'Prism', // Usually your repo name.

  onBrokenLinks: 'warn', // Warn about broken links so we can fix them

  // Localization disabled for now
  // i18n: {
  //   defaultLocale: 'en',
  //   locales: ['en', 'pt-BR'],
  //   localeConfigs: {
  //     'pt-BR': {
  //       label: 'Português (Brasil)',
  //       direction: 'ltr',
  //       htmlLang: 'pt-BR',
  //       calendar: 'gregory',
  //     },
  //   },
  // },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/PrismLibrary/Prism-Documentation/edit/master/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          exclude: ['tutorial-basics/**', 'tutorial-extras/**'],
          // Versioning configuration
          versions: {
            current: {
              label: '9.1',
              path: 'current',
            },
            '9.0': {
              label: '9.0',
              path: '9.0',
            },
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        // Options for the search plugin
        hashed: true,
        language: ['en'], // Temporarily English only - add 'pt-BR' after installing lunr-languages
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        indexBlog: false,
        indexPages: false,
        docsRouteBasePath: '/docs',
      },
    ],
  ],

  themeConfig: {
    image: 'img/prism-logo.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Prism Library',
      logo: {
        alt: 'Prism Library',
        src: 'img/prism-logo.png',
        srcDark: 'img/prism-logo.png',
        width: 150,
        height: 32,
      },
      hideOnScroll: false,
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'search',
          position: 'right',
        },
        {
          type: 'html',
          position: 'right',
          value: '<div class="separator" aria-hidden></div>',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
        },
        // {
        //   type: 'localeDropdown',
        //   position: 'right',
        // },
        {
          type: 'html',
          position: 'right',
          value: '<a href="https://x.com/prismlib" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" class="navbar__item navbar__link navbar-icon-link navbar-icon-x"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>',
        },
        {
          type: 'html',
          position: 'right',
          value: '<a href="https://github.com/PrismLibrary/Prism" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository" class="navbar__item navbar__link navbar-icon-link navbar-icon-github"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: 'docs',
            },
            {
              label: 'Navigation',
              to: 'docs/navigation',
            },
            {
              label: 'Commands',
              to: 'docs/commands/commanding',
            },
            {
              label: 'Dependency Injection',
              to: 'docs/dependency-injection',
            },
          ],
        },
        {
          title: 'Platforms',
          items: [
            {
              label: '.NET MAUI',
              to: 'docs/platforms/maui',
            },
            {
              label: 'WPF',
              to: 'docs/platforms/wpf/getting-started',
            },
            {
              label: 'Uno Platform',
              to: 'docs/platforms/uno',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/PrismLibrary/Prism',
            },
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/PrismLibrary/Prism/discussions',
            },
            {
              label: 'X (Twitter)',
              href: 'https://x.com/prismlib',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Prism Website',
              href: 'https://prismlibrary.com/',
            },
            {
              label: 'Commercial License',
              href: 'https://prismlibrary.com/#pricing',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Prism Software, LLC.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['csharp', 'powershell', 'markup'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

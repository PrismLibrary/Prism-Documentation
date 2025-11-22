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

  onBrokenLinks: 'warn', // TODO: Fix broken links to tutorial files or remove them

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

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
          remarkPlugins: [
            require('./plugins/remark-xref-links.js'),
          ],
          rehypePlugins: [
            require('./plugins/rehype-strip-index.js'),
          ],
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
        language: ['en'],
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
          href: 'https://github.com/PrismLibrary/Prism',
          label: 'GitHub',
          position: 'right',
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
              to: '/docs',
            },
            {
              label: 'Navigation',
              to: '/docs/navigation',
            },
            {
              label: 'Commands',
              to: '/docs/commands/commanding',
            },
            {
              label: 'Dependency Injection',
              to: '/docs/dependency-injection',
            },
          ],
        },
        {
          title: 'Platforms',
          items: [
            {
              label: '.NET MAUI',
              to: '/docs/platforms/maui',
            },
            {
              label: 'WPF',
              to: '/docs/platforms/wpf/getting-started',
            },
            {
              label: 'Uno Platform',
              to: '/docs/platforms/uno',
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

import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import prismTheme from './prism-theme';

// This runs in Node.js: no browser APIs and no JSX here.

const config: Config = {
  title: 'CommyPanel',
  tagline: 'Run your own apps, domains and databases on one server you own.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // GitHub Pages address. When the docs get a domain of their own, set `url`
  // to it and `baseUrl` to '/'.
  url: 'https://commypanel.github.io',
  baseUrl: '/docs/',

  organizationName: 'CommyPanel',
  projectName: 'docs',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  markdown: {
    // Plain Markdown (CommonMark), so text like <app> or {name} in prose is never read as JSX.
    format: 'detect',
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  headTags: [
    // The panel's third theme ("dark", true black) is a tone of Docusaurus's dark mode. Applied
    // before the first paint so there is no flash from dim to black.
    {
      tagName: 'script',
      attributes: {},
      innerHTML:
        "try{if(localStorage.getItem('commypanel-docs-tone')==='black')document.documentElement.setAttribute('data-tone','black')}catch(e){}",
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/CommyPanel/docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        docsRouteBasePath: '/',
        indexBlog: false,
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'CommyPanel',
      logo: {
        alt: 'CommyPanel',
        src: 'img/logo.svg',
      },
      items: [
        {type: 'docSidebar', sidebarId: 'docs', position: 'left', label: 'Docs'},
        {to: '/reference/cli', label: 'Reference', position: 'left'},
        {to: '/releases/v0.6.0', label: 'Releases', position: 'left'},
        {
          href: 'https://github.com/CommyPanel/panel',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Learn',
          items: [
            {label: 'Install', to: '/getting-started/install'},
            {label: 'Deploy your first app', to: '/getting-started/first-app'},
            {label: 'Known limitations', to: '/known-limitations'},
          ],
        },
        {
          title: 'Reference',
          items: [
            {label: 'Command line', to: '/reference/cli'},
            {label: 'Configuration', to: '/reference/configuration'},
            {label: 'API', to: '/reference/api'},
          ],
        },
        {
          title: 'Project',
          items: [
            {label: 'GitHub', href: 'https://github.com/CommyPanel/panel'},
            {label: 'Issues', href: 'https://github.com/CommyPanel/panel/issues'},
            {label: 'Contributing', to: '/contributing'},
          ],
        },
      ],
      copyright: `CommyPanel is open source under the MIT license. It is pre-1.0 and under heavy development.`,
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
    prism: {
      theme: prismTheme,
      darkTheme: prismTheme,
      additionalLanguages: ['bash', 'php', 'go', 'csharp', 'yaml', 'json', 'docker', 'nginx', 'ini', 'diff'],
    },
    docs: {
      sidebar: {
        hideable: false,
        autoCollapseCategories: false,
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

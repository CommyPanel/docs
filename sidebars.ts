import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    {
      type: 'category',
      label: 'Getting started',
      collapsed: false,
      items: ['getting-started/install', 'getting-started/first-app', 'getting-started/upgrading'],
    },
    {
      type: 'category',
      label: 'Apps',
      collapsed: false,
      items: [
        'apps/deploying',
        'apps/private-repositories',
        'apps/github',
        'apps/deploy-on-push',
        'apps/environment-variables',
        'apps/release-command',
        'apps/volumes',
        'apps/safe-deployments',
        'apps/lifecycle',
        'apps/logs-and-terminal',
        'apps/networks',
        'apps/custom-nginx',
      ],
    },
    {
      type: 'category',
      label: 'Domains and HTTPS',
      collapsed: false,
      items: ['domains/domains-and-https'],
    },
    {
      type: 'category',
      label: 'Databases',
      collapsed: false,
      items: ['databases/servers-and-links', 'databases/tools'],
    },
    {
      type: 'category',
      label: 'Operating the panel',
      collapsed: false,
      items: [
        'operating/users-and-roles',
        'operating/backups',
        'operating/api-and-ci',
        'operating/notifications',
        'operating/maintenance',
      ],
    },
    {
      type: 'category',
      label: 'Concepts',
      collapsed: false,
      items: ['concepts/architecture', 'concepts/zero-downtime', 'concepts/security'],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: false,
      items: [
        'reference/cli',
        'reference/configuration',
        'reference/api',
        'reference/permissions',
        'reference/ports-and-paths',
      ],
    },
    'troubleshooting',
    'known-limitations',
    'faq',
    'contributing',
    {
      type: 'category',
      label: 'Release notes',
      collapsed: true,
      link: {type: 'doc', id: 'releases/index'},
      items: [
        'releases/v0.6.0',
        'releases/v0.5.1',
        'releases/v0.4.2',
        'releases/v0.4.1',
        'releases/v0.4.0',
        'releases/v0.3.0',
        'releases/v0.2.2',
        'releases/v0.2.0',
      ],
    },
  ],
};

export default sidebars;

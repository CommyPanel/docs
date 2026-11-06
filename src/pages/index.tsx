import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import {
  Boxes,
  Database,
  Globe,
  KeyRound,
  Rocket,
  ServerCog,
  ShieldCheck,
  TerminalSquare,
  Webhook,
  type LucideIcon,
} from 'lucide-react';
import styles from './index.module.css';

type Feature = {icon: LucideIcon; title: string; text: string; to: string};

const FEATURES: Feature[] = [
  {
    icon: Rocket,
    title: 'Zero-downtime deploys',
    text: 'The new version starts next to the old one, passes a health check, takes the traffic, and only then does the old one stop. One click rolls back.',
    to: '/concepts/zero-downtime',
  },
  {
    icon: Boxes,
    title: '.NET, Go and Node',
    text: 'Connect a repository or upload a zip. The stack is detected and a Dockerfile is generated. Bring your own and any language works.',
    to: '/apps/deploying',
  },
  {
    icon: Globe,
    title: 'Domains and HTTPS',
    text: 'See exactly which DNS records to create. Let\'s Encrypt certificates are issued and renewed for you.',
    to: '/domains/domains-and-https',
  },
  {
    icon: Database,
    title: 'Databases',
    text: 'PostgreSQL, MySQL and MariaDB in containers. Link one to an app, back it up nightly, and open it in phpMyAdmin or pgAdmin.',
    to: '/databases/servers-and-links',
  },
  {
    icon: Webhook,
    title: 'GitHub, API and CI',
    text: 'One-click GitHub connection, deploy on push, scoped API tokens for pipelines, and messages to Slack or Discord.',
    to: '/apps/github',
  },
  {
    icon: ShieldCheck,
    title: 'Built with care',
    text: 'The web app never runs as root. A small agent does validated host actions only. Roles, 2FA and an audit log are included.',
    to: '/concepts/security',
  },
];

const SHORTCUTS: {icon: LucideIcon; title: string; text: string; to: string}[] = [
  {icon: ServerCog, title: 'Install', text: 'One command on a fresh server.', to: '/getting-started/install'},
  {icon: Rocket, title: 'Deploy your first app', text: 'From a repository to a live URL.', to: '/getting-started/first-app'},
  {icon: TerminalSquare, title: 'Command line', text: 'Upgrade, back up, recover.', to: '/reference/cli'},
  {icon: KeyRound, title: 'API tokens', text: 'Deploy from your pipeline.', to: '/operating/api-and-ci'},
];

export default function Home(): ReactNode {
  const logo = useBaseUrl('/img/logo.svg');
  return (
    <Layout
      title="CommyPanel docs"
      description="Documentation for CommyPanel, a self-hosted server control panel for apps, domains and databases.">
      <header className={styles.hero}>
        <img className={styles.logo} src={logo} alt="" />
        <div>
          <span className={styles.badge}>Pre-1.0, under heavy development</span>
        </div>
        <h1 className={styles.title}>
          Run your own apps on <span className={styles.accent}>your own server</span>
        </h1>
        <p className={styles.lead}>
          CommyPanel is a self-hosted control panel. Deploy from Git with zero downtime, connect domains with
          automatic HTTPS, and run databases, all from one web UI.
        </p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/getting-started/install">
            Get started
          </Link>
          <Link className="button button--secondary button--lg" to="/intro">
            What is CommyPanel?
          </Link>
          <Link className="button button--secondary button--lg" href="https://github.com/CommyPanel/panel">
            GitHub
          </Link>
        </div>
        <div className={styles.install}>
          <CodeBlock language="bash">
            {'curl -fsSL https://github.com/CommyPanel/panel/releases/latest/download/install.sh | sudo bash'}
          </CodeBlock>
          <span className={styles.note}>
            Ubuntu 24.04 / 26.04 or Debian 13, amd64 or arm64. Prints a one-time setup link when it is done.
          </span>
        </div>
      </header>

      <main>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What it does</h2>
          <div className={styles.grid}>
            {FEATURES.map(({icon: Icon, title, text, to}) => (
              <Link key={title} to={to} className={styles.card}>
                <div className={styles.icon}>
                  <Icon size={22} aria-hidden />
                </div>
                <div className={styles.cardTitle}>{title}</div>
                <p className={styles.cardText}>{text}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Start here</h2>
          <div className={styles.grid}>
            {SHORTCUTS.map(({icon: Icon, title, text, to}) => (
              <Link key={title} to={to} className={styles.card}>
                <div className={styles.icon}>
                  <Icon size={22} aria-hidden />
                </div>
                <div className={styles.cardTitle}>{title}</div>
                <p className={styles.cardText}>{text}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.compare}>
            <h2 className={styles.sectionTitle}>Not a Coolify replacement</h2>
            <p>
              CommyPanel is a younger, smaller project for a narrower job: one server, stateless apps first, and a small
              privileged part. If you need several servers, Docker Compose or a catalog of one-click services,{' '}
              <a href="https://coolify.io">Coolify</a> is the better choice.
            </p>
            <p>
              <Link to="/faq">Read the comparison</Link> · <Link to="/known-limitations">Known limitations</Link>
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}

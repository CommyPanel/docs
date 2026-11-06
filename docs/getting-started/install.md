---
title: "Install"
description: "Install CommyPanel on Ubuntu or Debian with one command."
---

# Install

CommyPanel is installed on the server it manages. It controls Docker and nginx on that machine, so use a server you are happy to dedicate to your apps.

## Requirements

- A fresh or lightly used server running **Ubuntu 24.04**, **Ubuntu 26.04** or **Debian 13** (or newer), with systemd. Other systems are refused. Debian 12 is not supported because it ships PHP 8.2 and CommyPanel needs 8.3 or newer.
- `amd64` or `arm64`.
- Root access, and at least **1 GB of RAM** (more if you build large apps on the server).
- Ports **80** and **443** free for your apps, one more for the panel (**8443** by default), and **2053** if you want to use the [database tools](../databases/tools.md).

## Install it

Run this as root:

```bash
curl -fsSL https://github.com/CommyPanel/panel/releases/latest/download/install.sh | sudo bash
```

The installer downloads the release, **checks its SHA-256 checksum** and stops if it does not match, then installs everything and prints a **one-time setup link**. Open it, create your admin account, and you are done. The link works once and expires after an hour; run `sudo commypanel setup-url` for a new one.

Your browser will warn about the panel's certificate. It is self-signed until you give the panel a domain of its own (see [Domains and HTTPS](../domains/domains-and-https.md#the-panels-own-domain)).

Options for the installer: `--panel-port N` to choose another port, `--no-docker` if you manage Docker yourself, `--version X` to install a specific version, `--yes` to skip the question before an upgrade, and `--verbose` to see everything it does instead of the progress display.

Release candidates are published as pre-releases, so the one-line installer only ever installs the latest **stable** release. To try a candidate, use its own installer: `curl -fsSL https://github.com/CommyPanel/panel/releases/download/v0.6.0-rc.1/install.sh | sudo bash -s -- --version 0.6.0-rc.1` (with the version you want).

## Open the firewall

CommyPanel does not change your firewall. Open ports 80, 443, the panel port, and 2053 for the database tools, for example with ufw:

```bash
sudo ufw allow 80,443,8443,2053/tcp
```

## What it installs

| What | Where |
|---|---|
| nginx, PHP (from your distribution), Git, SQLite tools, Docker (Docker's own repository, or the distribution's `docker.io`) | installed with `apt` |
| The panel code, one folder per release | `/opt/commypanel/releases/<version>`; `/opt/commypanel/current` points at the live one |
| Panel data: databases, builds, logs | `/var/lib/commypanel` |
| The agent's private state: TLS keys, certificates | `/var/lib/commypanel-agent` |
| Settings and the panel's own certificate | `/etc/commypanel` |
| nginx sites for your apps (written by the agent) | `/etc/nginx/commypanel` |
| The `commypanel` command | `/usr/local/bin/commypanel` |

It creates a `commypanel` system user for the web app and its workers, and these services:

- **`commypanel-agent`**: the only part that runs as root. It talks to Docker, nginx and Let's Encrypt on the panel's behalf, over a local socket that only the `commypanel` user can use.
- **`commypanel-queue@1`, `commypanel-queue@2`**: run deployments and certificate requests.
- **`commypanel-scheduler`**: re-checks domains, renews certificates and makes the nightly backups.

The panel's PHP code is owned by root and read-only to the panel user. PHP comes from your distribution's packages, so security fixes arrive through normal `apt upgrade` (see [Maintenance](../operating/maintenance.md#php-security-updates)). nginx's default site is disabled, because CommyPanel installs its own catch-all site for certificate validation.

## After the install

1. Open the setup link, create the first admin account, and turn on two-factor authentication when it offers.
2. On the welcome page, accept the Let's Encrypt terms and give the panel a domain of its own if you have one (both can be done later).
3. [Deploy your first app](first-app.md).

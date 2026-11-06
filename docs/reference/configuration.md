---
title: "Configuration"
description: "The settings you can change in /etc/commypanel/env: ports, limits, timeouts, backups and outbound calls."
---

# Configuration

The panel reads its settings from `/etc/commypanel/env`. The installer writes it; you rarely need to edit it. After a change, restart the panel's services so they read it:

```bash
sudo systemctl restart commypanel-queue@1 commypanel-queue@2 commypanel-scheduler
sudo systemctl restart 'php*-fpm'
```

:::warning Keep APP_KEY
`APP_KEY` encrypts the secrets the panel stores (environment variables, tokens, database passwords). **Never change it**, and keep a copy somewhere safe, apart from your backups: a restored database cannot be read without it.
:::

Everything below is optional, and the defaults are fine for most servers. Boolean values are `true` or `false`.

## The panel

| Setting | Default | What it does |
|---|---|---|
| `COMMYPANEL_TOOLS_PORT` | `2053` | The port the [database tools](../databases/tools.md) are served on. |
| `PANEL_INTERNAL_PORT` | `8081` | Loopback-only port where nginx hands requests to the panel. |
| `SESSION_LIFETIME` | `120` | Minutes of inactivity before a sign-in ends. |
| `AUTH_PASSWORD_TIMEOUT` | `10800` | Seconds a [password confirmation](../operating/users-and-roles.md#password-confirmation) stays valid. |
| `DISK_WARN_PERCENT`, `DISK_CRITICAL_PERCENT` | `85`, `95` | Disk usage at which the panel warns and shows an error. |

## Outbound calls

| Setting | Default | What it does |
|---|---|---|
| `COMMYPANEL_UPDATE_CHECK` | `true` | `false` stops every check for new releases, including the manual one. |
| `COMMYPANEL_ADDRESS_LOOKUP` | `true` | `false` stops the one lookup of the server's address through `api.ipify.org`, used only on servers behind a NAT. You then enter the address by hand. |

## Deployments

| Setting | Default | What it does |
|---|---|---|
| `DEPLOY_PORT_START`, `DEPLOY_PORT_END` | `20000`, `29999` | The local ports (on 127.0.0.1) handed to app containers. |
| `DEPLOY_HEALTH_TIMEOUT` | `60` | Seconds to wait for a new container to answer its health check. |
| `DEPLOY_DRAIN_SECONDS` | `10` | Seconds the old container keeps running after the traffic moved. |
| `DEPLOY_KEEP_IMAGES` | `3` | Release images kept per app, so rollbacks stay possible. |
| `DEPLOY_RELEASE_TIMEOUT` | `600` | Seconds a [release command](../apps/release-command.md) may run. |
| `DEPLOY_GIT_TIMEOUT` | `300` | Seconds a `git clone` may take. |
| `UPLOAD_MAX_ARCHIVE_MB` | `64` | Largest accepted upload. nginx and PHP-FPM are configured to match. |
| `UPLOAD_MAX_UNPACKED_MB` | `500` | Largest size an upload may unpack to. |
| `UPLOAD_MAX_FILES` | `20000` | Most files an upload may contain. |

## HTTPS

| Setting | Default | What it does |
|---|---|---|
| `ACME_STAGING` | `false` in production | Use Let's Encrypt's staging CA, whose certificates browsers do not trust. |
| `ACME_RENEW_BEFORE_DAYS` | `30` | Renew a certificate when fewer days than this remain. |
| `ACME_RETRY_AFTER_HOURS` | `6` | Wait this long before retrying a failed issuance. |

## Databases and backups

| Setting | Default | What it does |
|---|---|---|
| `DATABASE_MEMORY_MB` | `1024` | Memory limit of a database server container. |
| `DATABASE_READY_TIMEOUT` | `240` | Seconds a new database server may take to answer its first query. |
| `BACKUPS_KEEP` | `7` | Panel backups kept on the server. |
| `BACKUPS_KEEP_DATABASES` | `7` | Dumps kept of each database. |
| `BACKUPS_KEEP_VOLUMES` | `3` | Archives kept of each volume. |

## Installer settings

These are set when you run the installer, for example `curl ... | sudo COMMYPANEL_ALLOW_UNSUPPORTED=1 bash`.

| Setting | What it does |
|---|---|
| `COMMYPANEL_ALLOW_UNSUPPORTED=1` | Install on a distribution that is not supported, at your own risk. |
| `COMMYPANEL_ALLOW_VULNERABLE_PHP=1` | Install even if the distribution's PHP does not yet have a critical security fix, at your own risk. See [Maintenance](../operating/maintenance.md#php-security-updates). |
| `COMMYPANEL_REPO` | Download releases from another repository, for example a fork. |

---
title: "Ports and paths"
description: "Which ports CommyPanel uses, which files it keeps where, and its services."
---

# Ports and paths

## Ports

| Port | What | Open to the internet? |
|---|---|---|
| **80** | Your apps over HTTP (redirects to HTTPS), and Let's Encrypt validation | Yes |
| **443** | Your apps over HTTPS, and the panel once it has a domain | Yes |
| **8443** | The panel on its own port with a self-signed certificate (change it with the installer's `--panel-port`) | Yes, until the panel has a domain |
| **2053** | The [database tools](../databases/tools.md) (`COMMYPANEL_TOOLS_PORT`) | Only if you use them |
| `8081` | The panel's loopback-only listener behind nginx (`PANEL_INTERNAL_PORT`) | No, 127.0.0.1 only |
| `10000-19999` | One random port per [remote-access](../databases/remote-access.md) database, only while you have opened it | Only while open, only for the addresses you list |
| `20000-29999` | App containers, published on 127.0.0.1 only (`DEPLOY_PORT_START`, `DEPLOY_PORT_END`) | No |

CommyPanel never changes your firewall. Database servers publish **no port at all**, unless you open one with [remote access](../databases/remote-access.md).

## Paths

| Path | What is there |
|---|---|
| `/opt/commypanel/releases/<version>` | The panel code, one folder per release. Owned by root, read-only to the panel. |
| `/opt/commypanel/current` | A link to the live release |
| `/var/lib/commypanel` | Panel data, owned by the `commypanel` user |
| `/var/lib/commypanel/db` | The panel's SQLite databases |
| `/var/lib/commypanel/volumes/<app>/<folder>` | App [volumes](../apps/volumes.md) |
| `/var/lib/commypanel/databases/<server>` | Database server data |
| `/var/lib/commypanel/backups/` | `panel/`, `databases/<server>/` and `volumes/<app>/` backups |
| `/var/lib/commypanel/builds`, `sources` | Build contexts and uploaded sources |
| `/var/lib/commypanel-agent` | The agent's private state: TLS keys, database certificate authorities, certificates, scratch files. Root only. |
| `/run/commypanel-metrics/metrics.sock` | Where nginx reports one line per request, for the [request statistics](../apps/safe-deployments.md#request-statistics) |
| `/etc/commypanel/env` | The settings (see [Configuration](configuration.md)) |
| `/etc/commypanel/` | Also the panel's self-signed certificate and install settings |
| `/etc/nginx/commypanel` | The per-app nginx sites written by the agent |
| `/run/commypanel/agent.sock` | The agent's socket |
| `/var/log/commypanel-install.log` | The installer's full log |
| `/usr/local/bin/commypanel` | The command line |

## Services

| Unit | Role |
|---|---|
| `commypanel-agent` | The privileged agent (root) |
| `commypanel-queue@1`, `commypanel-queue@2` | Queue workers: deployments, certificates, provisioning |
| `commypanel-scheduler` | Scheduled jobs: domain checks, renewals, backups |
| `nginx`, `docker`, `php*-fpm` | From your distribution |

## Docker objects

| Name | What |
|---|---|
| `commypanel/<app>:<n>` | Release images (the last few are kept) |
| `commypanel-<app>` | An app's network |
| `db-<server>`, `commypanel-db-<server>` | A database server container and its network |
| `commypanel-link-*` | The private network of a link |
| `dbtool-*` | A short-lived database tool container |

---
title: "Release notes"
description: "Every CommyPanel release: what is new, what changes on your server, and what to do before you upgrade."
---

# Release notes

Each release has notes that say **what is new**, **what to do before you upgrade** (new ports, permissions, files) and **known limitations**. Read the notes of every version between yours and the one you install.

| Version | Highlights |
|---|---|
| [0.10.0](v0.10.0.md) | A bigger API with an OpenAPI file, the `commy` command and clients for Go, Node, Python, PHP and .NET, a deploy mode that stops the old version first, Python apps |
| [0.9.1](v0.9.1.md) | Search engines are told to ignore every page of the panel |
| [0.9.0](v0.9.0.md) | Ready-made apps (Meilisearch, Typesense, Grafana, Elasticsearch, Kibana), the encryption key page, active sessions, audit log export |
| [0.8.2](v0.8.2.md) | A health check timeout per app, and long builds no longer marked interrupted |
| [0.8.0](v0.8.0.md) | The panel in seven languages, alerts for apps, certificates, disk, backups and databases to six kinds of targets, restore over a database or a volume, nightly volume backups, remote copies list |
| [0.7.0](v0.7.0.md) | Safe deployments (automatic rollback, gradual rollouts), remote access to databases, audit log colours |
| [0.6.0](v0.6.0.md) | Database tools (phpMyAdmin, pgAdmin), API tokens, deployment messages, GitHub connection, Apply changes without redeploying |
| [0.5.1](v0.5.1.md) | Restore from dumps, S3 copies of backups, volume backups, disk warning, automatic server address, waiting pages that follow along, agent security fixes |
| [0.4.2](v0.4.2.md) | Fix for installing and upgrading on Ubuntu 24.04 |
| [0.4.1](v0.4.1.md) | Fix for new installs on Debian 13 |
| [0.4.0](v0.4.0.md) | Database servers, links between apps and databases, a network for each app, backups |
| [0.3.0](v0.3.0.md) | Log viewer, persistent volumes with a file browser, containers and networks view, terminal in a container |
| [0.2.2](v0.2.2.md) | Fix: 0.2.1 could not be installed or upgraded |
| [0.2.0](v0.2.0.md) | Release command, start/stop/restart, private repositories, deploy on push, live usage, per-app nginx editor |

Release candidates (versions with `-rc`) are published as pre-releases on [GitHub](https://github.com/CommyPanel/panel/releases) and share the notes of the version they lead to.

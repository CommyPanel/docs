---
title: "FAQ"
description: "Common questions: what CommyPanel is for, how it differs from Coolify, how safe it is, and what happens when things go wrong."
---

# FAQ

## Is it ready for production?

It is **pre-1.0 and under heavy development**. It is a good fit for side projects, staging and test servers, and for people who want to help shape it. If you use it for something that matters, keep backups (including `APP_KEY`), read the [known limitations](known-limitations.md), and expect to upgrade often.

## How is CommyPanel different from Coolify?

[Coolify](https://coolify.io) is a mature, popular open-source platform for self-hosting apps, databases and services, with a large community and many features. **CommyPanel is not trying to replace it and is not a direct competitor.** It is a younger, much smaller project that makes different trade-offs for a narrower job. This is an honest picture, based on their public documentation at the time of writing; please check theirs for the details.

| | CommyPanel | Coolify |
|---|---|---|
| **Servers** | One server, by design | Many servers from one panel |
| **What you deploy** | Stateless apps in .NET, Go and Node (automatic Dockerfile), or anything with your own Dockerfile | A broad range of apps, frameworks, Docker Compose stacks and a large catalog of one-click services |
| **The panel itself** | Runs on the host under systemd, so it keeps working when Docker does not | Runs as containers |
| **Reverse proxy** | nginx on the host | A proxy in a container (Traefik or Caddy) |
| **Panel storage** | A few SQLite files | A database and cache |
| **Preview deployments** | Not available | Available |
| **License** | MIT | Apache-2.0 |
| **Maturity** | Young, pre-1.0, heavy development | Established |

**Choose Coolify** if you need several servers, Docker Compose, preview deployments or a big catalog of ready-made services, or if you want something battle-tested today.

**Consider CommyPanel** if you have a single server, mostly .NET, Go or Node services plus a database, you prefer a small panel that stays up independently of Docker, and you like the idea of a minimal, auditable privileged part.

## Can I run it next to other things on the server?

It controls Docker and nginx, and takes over nginx's default site, so use a server you are happy to dedicate to your apps. Other containers keep running if they are not named like CommyPanel's, but CommyPanel does not manage them.

## Can I connect to my database from my own computer?

Yes, for a limited time and from addresses you choose: see [Remote access to a database](databases/remote-access.md). It needs TLS, a firewall rule for the port, and the server's own address (not a Cloudflare-proxied name). For anything permanent, a VPN or an SSH tunnel is safer.

## What happens to my apps if the panel goes down?

Nothing. Your apps run as Docker containers behind nginx, and keep running and serving traffic if the panel is stopped, upgraded or removed.

## What happens if Docker goes down?

The panel keeps working and shows a clear warning, with the service state and recent logs, and a button to restart Docker for people who may. Your apps return 502 until Docker is back.

## Does it phone home?

Only for what you switch on or start, all over https and never following redirects: a check for new releases (switchable, and off with `COMMYPANEL_UPDATE_CHECK=false`), a lookup of the server's address on servers behind a NAT (switchable), S3 copies of backups, notification webhooks, and GitHub when you use the GitHub connection. There is no telemetry. See [Security model](concepts/security.md#outbound-calls-are-few-and-guarded).

## Can I use it without Git?

Yes. Choose **I'll upload it myself** and upload a `.zip` or `.tar.gz` of your project, and replace it whenever you like.

## Which languages are supported?

.NET, Go and Node get an automatic Dockerfile. Anything else works if your repository has a **Dockerfile**, which always wins.

## Is my data safe?

Secrets are encrypted at rest and never shown again, the privileged part is small and validated, and everything privileged is audited; see the [security model](concepts/security.md). Backups, however, are your job: see [Backups](operating/backups.md), and copy them off the server.

## How do I get help or report a bug?

Open an issue on [GitHub](https://github.com/CommyPanel/panel/issues). For a security problem, report it privately; see the [security policy](https://github.com/CommyPanel/panel/blob/main/SECURITY.md).

---
title: "Known limitations"
description: "What CommyPanel does not do yet or by design, so you can decide whether it fits."
---

# Known limitations

CommyPanel is pre-1.0 and under heavy development. What you should know before you rely on it:

## Scope

- **One server only.** There is no multi-server support, no Swarm and no Kubernetes, and none is planned.
- **Stateless apps first.** .NET, Go and Node get automatic Dockerfiles. Python, PHP stacks such as Laravel and WordPress, and one-click templates are not supported yet. An app with its **own Dockerfile** works regardless of language. [Persistent volumes](apps/volumes.md) exist for files that must survive deployments.
- **No Docker Compose** and **no preview deployments** per branch.
- **Debian 13 and Ubuntu 24.04 / 26.04 only**, on `amd64` and `arm64`. Debian 12 and RPM-based systems are not supported.

## Certificates and domains

- **No wildcard certificates** yet; they need DNS-01 validation.
- Certificates are validated over HTTP, so every name on a certificate must already point at the server.

## Databases and backups

- A dump is restored into a **new** database only. There is no "replace the existing one" mode.
- Backups copied to S3 storage are **not read back** by the panel. Download and load them by hand, as [Backups](operating/backups.md) shows. Restoring onto a **new server** is manual.
- App volumes are archived on demand and restored by hand.
- **pgAdmin is large** (about 600 MB), so the first time you open a PostgreSQL database it takes a while to download.
- **Remote access** to a database opens a real port on the internet. It needs your firewall and hosting provider to allow the port, does not work through Cloudflare's proxy, and the address list and TLS are all that protects the login. If the server's address changes, open it again so the certificate matches.
- The database tools are served on their **own port** (2053). Browsers share cookies between ports, so a flaw inside a tool could still fill your browser's cookie storage for that host. A separate host name would remove this, and is waiting on wildcard certificates.

## Safe deployments

- Request statistics, the watch and gradual rollouts judge **errors and response times** only, and only for requests that pass nginx. Too little traffic means a watch ends without a verdict and a rollout asks you.
- A gradual rollout runs **two versions at once** against the same database and volumes, and keeps visitors on one version with a cookie. Clients that refuse cookies can switch between versions.
- The statistics are kept **in memory for one hour** and start empty after the agent restarts.

## Integrations and operations

- **GitHub Enterprise Server** is not supported. GitLab, Gitea and Bitbucket work with deploy keys or tokens, without one-click connection.
- Deployment messages are **one webhook** for the whole panel: no email, no per-app targets.
- You cannot upgrade from the UI; you run `sudo commypanel upgrade`.
- Settings such as the app port, health path and resource limits apply from the **next full deployment**. Environment variables, volumes and links can be [applied without one](apps/lifecycle.md#applying-changes-without-a-deployment).
- The panel has **not been run on a wide range of real servers** yet. Please report what you find.

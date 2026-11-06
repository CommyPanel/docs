---
title: "Security model"
description: "How CommyPanel limits what a compromise can do: unprivileged panel, a small validated agent, constrained containers, encrypted secrets and an audit log."
---

# Security model

A server panel effectively holds the keys to the machine, so the design assumes that parts of it can be attacked and limits what that gets an attacker.

## The panel is not root

The web application runs as an unprivileged user, its code is owned by root and read-only to it, and it never touches the Docker socket. Compromising the web app must not give a shell on the host. What it can still do is ask the agent for things the agent allows (deploy containers, open a shell inside managed containers), which is why the agent's checks matter.

## The agent accepts typed actions only

- A **fixed list of actions**, each with a validator and tests. There is no "run this command".
- Every input (names, images, ports, paths, domains) is checked against allow-lists **inside the agent**, independent of the panel.
- Commands run as **argument lists**, never through a shell.
- **nginx** configuration is rendered from templates and validated fields, never accepted as text from the panel, and applied only if `nginx -t` passes. The one user-written part, [custom directives](../apps/custom-nginx.md), is parsed against an allow-list and never pasted into a file.
- It only listens on a local **Unix socket** and checks the caller's identity.
- Its own state (TLS keys, the ACME account key, scratch files, the record of dumps it made) lives in a folder only root can change, outside what the panel can write.

## Containers are constrained

Every container the agent starts gets: not privileged, `no-new-privileges`, a network of its own (never `host`, `bridge` or another container's), localhost-only published ports, a PID limit, memory and CPU limits, and bind mounts only under the volumes folder. Only `commypanel/` images (built on the server) or an official `mariadb`, `mysql` or `postgres` image with a plain version tag can start. Apps cannot reach each other unless you [link them](../databases/servers-and-links.md#links).

## Secrets

Environment variables, database passwords, tokens and keys are **encrypted at rest** and **never shown again**. They are never logged and never written to the audit log. They are never put in a URL or on a command line.

## Who can do what

[Roles and permissions](../operating/users-and-roles.md) are enforced on every route. Dangerous actions need your password again, and everything privileged is written to the **audit log**. Optional two-factor authentication, login rate limiting, and rules that stop anyone from granting more access than they hold.

## Outbound calls are few and guarded

The panel contacts the outside by itself in only a few cases, all switchable or user-started: update checks (GitHub), the server's public address (only behind a NAT), S3 copies, notification webhooks, and GitHub when you use the GitHub connection. These use https, never follow redirects, and refuse this server and reserved addresses.

## Releases

Releases are published with a SHA-256 checksum, and the installer refuses a file that does not match.

## Reporting a problem

Please report vulnerabilities privately; see the [security policy](https://github.com/CommyPanel/panel/blob/main/SECURITY.md).

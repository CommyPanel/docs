---
title: "Permissions"
description: "Every permission in CommyPanel, what it allows, and which role holds it."
---

# Permissions

Permissions are named capabilities such as `apps.deploy`. Every page and action in the panel checks one. People get them through **roles** (see [Users and roles](../operating/users-and-roles.md)). The built-in **admin** role always holds every permission and cannot be edited; the **super user** (the first account) passes every check.

:::note
This page is generated from the permission list in the panel's code, so it matches the version it was written for. The same list, with the same explanations, is under **Permissions** in the panel.
:::

## Apps

| Permission | What it allows |
|---|---|
| `apps.view`<br/>**View apps** | See the list of apps, their releases, logs, settings and domains. Environment variable values are never shown. |
| `apps.create`<br/>**Create apps** | Create new apps with the setup wizard, including connecting a repository or uploading a project. |
| `apps.update`<br/>**Change app settings** | Change an app's name, source, port, health check and resource limits; generate its deploy key; upload a new project archive. |
| `apps.deploy`<br/>**Deploy and roll back** | Start deployments and roll an app back to an earlier release. Deploying runs the app's code on this server. |
| `apps.control`<br/>**Start, stop and restart apps** | Stop an app's running container, start it again and restart it. Its domains stay configured; visitors see an error while it is stopped. |
| `apps.nginx`<br/>**Edit nginx directives** | Add custom nginx directives to an app's site: upload limits, timeouts, headers, redirects and extra locations. Only a list of safe directives is accepted and nginx tests the result before it is applied, but the app's traffic goes through it. |
| `apps.logs`<br/>**Read app logs** | Read and download the output of an app's running container. Apps often print secrets, such as tokens or personal data, into their logs, and a download is recorded in the audit log. |
| `apps.volumes`<br/>**Browse volume files** | See how much space an app's persistent volumes use, look at their files and download them. Volumes often hold databases, uploads and other private data, and a download is recorded in the audit log. |
| `apps.terminal`<br/>**Open a terminal in an app** | Run commands in a shell inside an app's running container, with the app's environment variables (often secrets such as database passwords) and its volumes. Asks for the password unless it was confirmed recently, and opening one is recorded in the audit log. This is close to full control of the app. |
| `apps.deactivate`<br/>**Deactivate and activate apps** | Take an app offline without deleting it, and bring it back. |
| `apps.delete`<br/>**Delete apps** | Permanently delete an app with its releases, images, domains, certificate and variables. |
| `env.manage`<br/>**Manage environment variables** | Add, replace, import and remove an app's environment variables. These often hold secrets such as database passwords. |
| `apps.links`<br/>**Link apps to databases and other apps** | Let an app reach a database, or another app, over a private network made for that link. A linked app can use the database it is given, and its connection details are added to its environment variables. |

## Domains

| Permission | What it allows |
|---|---|
| `domains.view`<br/>**View domains** | See every domain with its DNS and HTTPS state. |
| `domains.manage`<br/>**Manage domains and certificates** | Add domains to apps, set redirects, re-check DNS, remove domains and request certificates. |
| `domains.settings`<br/>**Change HTTPS and server address** | Accept the Let's Encrypt terms, set the server's public address and the panel's own domain. |

## Databases

| Permission | What it allows |
|---|---|
| `databases.view`<br/>**View databases** | See the database servers, the databases on them and which apps use them. Passwords and connection strings are not shown. |
| `databases.manage`<br/>**Manage databases** | Create, start, stop and delete database servers, and create, drop and change the password of databases on them. Deleting a server deletes the data of every database on it. |
| `databases.credentials`<br/>**See database passwords** | Show a database's password and connection string. Asks for the password unless it was confirmed recently, and every time it is shown is recorded in the audit log. |
| `databases.tools`<br/>**Open databases in phpMyAdmin or pgAdmin** | Open a database in phpMyAdmin (MySQL, MariaDB) or pgAdmin (PostgreSQL), logged in as that database's own user: read, change and delete its data, run SQL and import or export dumps. Asks for the password unless it was confirmed recently, and every opening is recorded in the audit log. Treat it like the database's password. |

## Server

| Permission | What it allows |
|---|---|
| `backups.view`<br/>**View backups** | See the list of the panel's backups, when they were made and how big they are. |
| `backups.manage`<br/>**Manage backups** | Take a backup now, download one and delete one. A backup holds everything in the panel's database, including the encrypted secrets of apps and databases, so downloading asks for the password and is recorded in the audit log. |
| `github.manage`<br/>**Connect GitHub** | Create the panel's GitHub App, install it on an account and disconnect it. The app can read the code of the repositories you give it access to on GitHub, and anyone who may create apps can then deploy those repositories. |
| `notifications.manage`<br/>**Manage deployment messages** | Choose where the result of deployments is sent (Slack, Discord or any webhook), send a test message and switch it off. The address is stored encrypted and never shown again; the messages hold the app, commit and error, never logs or secrets. |
| `server.view`<br/>**View the server** | See host resources, service states, Docker and nginx status. |
| `server.manage`<br/>**Manage Docker and nginx** | Reload nginx, test its configuration, remove unused images and read container logs. |

## Access

| Permission | What it allows |
|---|---|
| `tokens.manage`<br/>**Manage own API tokens** | Create and revoke your own API tokens for scripts and CI. A token can only do what you may do yourself (read apps, start deployments), optionally limited to some apps, and stops working if you lose that permission. Creating and revoking ask for your password and are recorded in the audit log. |
| `roles.view`<br/>**View roles** | See the roles and which permissions they grant. |
| `roles.manage`<br/>**Manage roles** | Create, edit and delete roles. A role can only grant permissions you hold yourself. |
| `permissions.view`<br/>**View permissions** | See the list of permissions and what each one allows. |
| `audit.view`<br/>**View the audit log** | Read the record of who did what on this panel. |

## Users

| Permission | What it allows |
|---|---|
| `users.view`<br/>**View users** | See the list of user accounts and their roles. |
| `users.create`<br/>**Create users** | Create accounts. A user can only be given a role that grants no more than the creator has. |
| `users.update`<br/>**Update users** | Change a user's name, email, password and role. Not the super user, and not users with more access than you have. |
| `users.delete`<br/>**Delete users** | Delete accounts. Not the super user, yourself, or users with more access than you have. |

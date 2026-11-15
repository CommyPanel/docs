---
title: "Users, roles and security"
description: "People, roles and permissions, two-factor authentication, password confirmation and the audit log."
---

# Users, roles and security

## The first account

The first account is created through the one-time setup link the installer prints. It is the **super user**: it passes every permission check, and nobody can edit or delete it from the panel, not even itself. If you lose access to it, recover it on the server with [`sudo commypanel admin:reset EMAIL`](../reference/cli.md), which sets a new random password and turns off two-factor authentication.

There is **no public registration**, and after setup there is no way to create an admin from the web other than through the people who may create users.

## Users

People with `users.create` add more accounts under **Users**. Each account has one **role**. Setting a new password for an account, or deleting it, ends that user's open sessions, so a stolen session stops working.

## Language

The panel is available in **English, French, German, Spanish, Russian, Ukrainian and Turkish**. All of them are installed with the panel. The first-run setup page has a language box (it starts with your browser's language when the panel offers it, otherwise English), and that becomes the first admin's language. When you add a user you choose their language, and it starts as your own. Everyone can change theirs in **Settings → Appearance**; it affects only their own account. The login page uses the browser's language, with a box to change it for that visit.

Only the panel's interface is translated. The command line, the documentation, the audit-log action codes and the text saved by background work (such as a deployment's error text and build log) stay in English. English is the fallback: anything not translated yet shows in English. Anyone can improve a translation or add a language; see [Contributing](../contributing.md).

## Roles and permissions

A **role** is a named set of **permissions** (see the [full list](../reference/permissions.md)). Every route and action in the panel checks one.

- The built-in **admin** role always holds every permission and cannot be edited or deleted.
- You can create your own roles, for example *Deployer* with `apps.view` and `apps.deploy`, or *Support* with view permissions only.
- **Nobody can exceed their own access.** A role can only grant permissions its author holds, you cannot give someone a role beyond your own permissions, you cannot touch users who have more access than you, and you cannot change your own role or delete yourself.
- A role that still has users cannot be deleted.
- New permissions arrive with upgrades. The admin role gets them automatically; **roles you made yourself do not** until you grant them (the release notes say which are new).

Some permissions guard data that is secret by nature (`env.manage`, `databases.credentials`, `databases.tools`, `apps.logs`, `apps.volumes`, `apps.terminal`). Treat them like a key and give them sparingly.

## Two-factor authentication

Two-factor authentication is supported and encouraged, never forced. Each user turns it on under **Settings → Security**: scan the QR code with an authenticator app, confirm with a code, and keep the **recovery codes** somewhere safe. Sign-in then asks for a code, and a recovery code works once.

Sign-in attempts are rate limited to 5 a minute, and so are two-factor attempts.

## Password confirmation

Dangerous actions ask you to confirm your password again, unless you did so recently (within 3 hours by default, `AUTH_PASSWORD_TIMEOUT`). That covers things like downloading a backup, showing a database password, opening a terminal or a database tool, creating or revoking an API token, changing the GitHub or notification settings and editing nginx directives.

## The audit log

**Settings → Audit log** records who did what, when and from where: sign-ins and sign-outs, two-factor changes, users and roles, app and database changes, deployments and their results (including those started by a webhook or an API token), domain and certificate events, backups and downloads, terminal and database-tool sessions, and changes to settings. Secrets, tokens, passwords and environment values are never written to it.

Entries are coloured by how much they matter: **red** for high-risk actions (opening a database to the internet or changing who may connect, deleting a database server, a database, an app or a user, turning off two-factor authentication), **orange** for sensitive ones (a password or connection shown, a download, a terminal or database tool opened, access or settings changed, a failure or a rollback) and plain for the rest.

You can **filter** the log by time (today, last 7 days, last month, last year or your own dates) and by risk (high risk, sensitive, routine), and **search** the person, the action or the IP address. The search takes IPv4 and IPv6 addresses, whole or in part, in any spelling (capitals, expanded zeros, brackets), and several words must all match.

The log is read-only. Reading it needs `audit.view`.

**Exporting.** With `audit.export`, the **Export CSV** and **Export JSON** buttons download the entries that match the filters on screen (up to 50,000, newest first) with the time, risk, person, action, address, browser and details. It asks for your password, and the export itself is recorded in the audit log. In the CSV, cells that start with `=`, `+`, `-` or `@` get a leading apostrophe so a spreadsheet does not run them as formulas.

## Sessions

**Your own.** **Settings → Security → Active sessions** lists every browser where you are signed in: the browser and system, the IP address and when it was last active, with **This browser** marked. **Sign out** ends one of them, and **Sign out all other browsers** ends the rest; if you see one you do not recognise, do that and change your password. The list shows browsers active within the session lifetime and only works with the default database session driver. Session ids are never sent to the page.

**Other people's.** With `sessions.view`, the **Sessions** button on the Users page shows where someone else is signed in (every look is audited). With `sessions.revoke` you can also sign them out, one browser or all, after confirming your password. The usual rules apply: you cannot do it to a user with more access than you have, and nobody can do it to the super user.


Sessions last 2 hours of inactivity by default (`SESSION_LIFETIME`, in minutes) and are served only over HTTPS cookies. Behind your panel domain, set `SESSION_SECURE_COOKIE=true` (the installer does).

---
title: "Upgrading"
description: "Upgrade CommyPanel, what happens to your apps meanwhile, and how failed upgrades roll back."
---

# Upgrading

```bash
sudo commypanel upgrade
```

An upgrade downloads and verifies the new release, backs up the panel databases (the five newest backups are kept in `/var/lib/commypanel/backups`), migrates them, switches over and restarts the services. If the new version does not come up healthy, the previous release is started again. Running the installer again does the same thing.

Before it changes anything, it downloads the release, checks it, and asks `Continue with the upgrade? [Y/n]` (Enter means yes). The question says that:

- **the panel is unavailable for a short while** while its services restart and it switches to the new version;
- **your apps stay online**: Docker and your containers are not restarted and nginx is reloaded gracefully. New deployments cannot start meanwhile, and a build in progress is interrupted;
- **a failed upgrade goes back** to the version you had. Database changes the new version already made are kept, and the databases are backed up first.

Answer `n` and nothing is changed. In scripts, add `--yes` (`sudo commypanel upgrade --yes`) to skip the question. Without a terminal the upgrade also goes ahead, with a notice.

To install a specific version, including a release candidate:

```bash
sudo commypanel upgrade --version 0.6.0
```

## Update notifications

When someone signs in, CommyPanel looks in the background for a newer release. If there is one, an **Update** badge appears in the top bar for people who can see the server, and it leads to **Settings → Updates**. That page explains why to upgrade, the steps, what happens to your server while it upgrades, and shows the release notes of every release you have missed.

- **What is sent.** CommyPanel asks GitHub for this project's list of releases, at most once every 6 hours (and again 30 minutes after a failure). GitHub sees the server's address and the CommyPanel version number in the request. Nothing else is sent, and nothing that identifies your apps, domains or users.
- **What is shown.** Only stable releases. Pre-releases and drafts are never offered. Release notes are rendered without raw HTML, scripts or remote images.
- **Switching it off.** The page has a switch for the automatic check (a manual **Check now** still works). To stop every check, set `COMMYPANEL_UPDATE_CHECK=false` in `/etc/commypanel/env`; then nothing is ever sent, not even by hand.

The page does not upgrade anything: you still run `sudo commypanel upgrade` on the server.

## Before you upgrade

Read the [release notes](../releases/index.md) of the versions in between: they say what is new, what changes on your server (new permissions, ports, files) and what to do before you upgrade. Back up `/var/lib/commypanel` as with any upgrade, and keep a copy of your encryption key (see [Backups](../operating/backups.md)).

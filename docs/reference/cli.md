---
title: "Command line"
description: "The commypanel command: set-up link, admin reset, status, logs, upgrade, backup and restore."
---

# Command line

The `commypanel` command is installed at `/usr/local/bin/commypanel` and must be run as root (use `sudo`).

```text
sudo commypanel <command>

  setup-url              Print a one-time link to create the first admin account
  admin:reset EMAIL      Set a new random password for an admin and switch off its 2FA
  status                 Show the version, services and panel address
  logs                   Follow the logs of all CommyPanel services
  upgrade [--version X]  Upgrade to the latest (or a given) release
  backup                 Back up the panel's database now (also done daily)
  restore FILE           Replace the panel's database with a backup (stops the panel briefly)
  version                Print the installed version
  artisan ...            Run a panel console command (advanced)
```

## setup-url

Prints a new one-time setup link for creating the first admin. The link works once and expires after an hour. After setup is complete, it cannot create an admin.

## admin:reset

```bash
sudo commypanel admin:reset admin@example.com
```

Sets a **new random password** for that admin, prints it, and turns off their two-factor authentication. This is the way back in if you lose access. It is the only way to recover the super user, which cannot be changed from the panel.

## status

Shows the installed version, the panel's address, and whether each service is active: `commypanel-agent`, `commypanel-queue@1`, `commypanel-queue@2`, `commypanel-scheduler`, `nginx` and `docker`.

## logs

Follows the journal of the agent, the queue workers and the scheduler (`journalctl -f`). Press Ctrl+C to stop.

## upgrade

```bash
sudo commypanel upgrade                       # the latest stable release
sudo commypanel upgrade --version 0.6.0       # a specific version, including release candidates
sudo commypanel upgrade --yes                 # no question (for scripts)
```

See [Upgrading](../getting-started/upgrading.md).

## backup and restore

```bash
sudo commypanel backup
sudo commypanel restore panel-20261106-033000.sqlite.gz
sudo commypanel restore /root/downloaded-backup.sqlite.gz
```

`restore` takes the name of a backup in `/var/lib/commypanel/backups/panel` or the path of a file you downloaded. It stops the queue workers and the scheduler, checks that the file is a healthy CommyPanel database, keeps the current database as a backup marked `-before`, replaces it, and starts everything again. If the restore fails, the database is not changed. See [Backups](../operating/backups.md).

## artisan

Runs a panel console command as the panel user, for advanced use and diagnosis. For example, `sudo commypanel artisan about` prints the application's environment.

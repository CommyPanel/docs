---
title: "Maintenance"
description: "PHP security updates, the nightly jobs, disk space, Docker outages, and how to uninstall."
---

# Maintenance

## PHP security updates

CommyPanel runs on the PHP that your distribution provides, so PHP security fixes come from `apt`, not from CommyPanel. Ubuntu and Debian ship fixes without changing PHP's version number, so a patched server can still say `PHP 8.5.4` in `php -v`; what matters is the package build.

- **The installer updates PHP.** It brings every PHP package that is installed up to what the distribution offers, instead of only installing the `php-cli` and `php-fpm` meta-packages, which would leave an older `php8.x-fpm` in place.
- **The installer checks that PHP has the fix** for the critical flaws listed in the installer's security list (`installer/php-security.conf` in the panel repository). A PHP counts as fixed when it is at least the first upstream release with the fix, or when the package's changelog names the CVE, or when the installed package is at least the distribution's fixed build (Ubuntu keeps the upstream version `8.5.4`; only the package revision, `8.5.4-0ubuntu1.5`, shows the fix).
- **A fresh install on a PHP without the fix is refused**, with the command to update it. If your distribution has not published the fix yet, wait for it, or set `COMMYPANEL_ALLOW_VULNERABLE_PHP=1` to install anyway, at your own risk. An **upgrade** only warns and goes on, because refusing would leave the server exposed just the same and the release carries extra hardening.
- **The panel's own PHP pool is hardened** against the two request paths named for PHP2Shell (`session.upload_progress.enabled=0`, and `fatal_error_backtraces=0` on PHP 8.5). The panel uses neither. This is a precaution, not a substitute for the update: PHP's own release notice says there is no complete mitigation.

The current entry is **PHP2Shell** (CVE-2026-109618 and CVE-2026-109619, unauthenticated remote code execution, exploited in the wild). Fixed upstream in PHP 8.3.36, 8.4.27 and 8.5.12; in the distributions as Debian 13 `8.4.27-1~deb13u1`, Ubuntu 26.04 `8.5.4-0ubuntu1.5` and Ubuntu 24.04 `8.3.6-0ubuntu0.24.04.13`.

To check a server by hand:

```bash
zcat /usr/share/doc/php8.5-common/changelog.Debian.gz | grep -c CVE-2026-109618   # use your PHP version; 0 means no fix
sudo apt-get update && sudo apt-get upgrade
sudo systemctl restart php8.5-fpm commypanel-queue@1 commypanel-queue@2 commypanel-scheduler
```

## Disk space

The panel warns on every page once the disk that holds its data is **85%** full, and shows an error at **95%** (`DISK_WARN_PERCENT`, `DISK_CRITICAL_PERCENT`). **Server → Disk** shows usage and the biggest app volumes. What fills a disk fastest:

- **Docker images** from builds. CommyPanel keeps only the last 3 per app, and **Server → Docker** can remove unused images.
- **Backups** kept on the server (see [Backups](backups.md)).
- **Volumes and databases** that grow with your data.

## Scheduled jobs

The scheduler (`commypanel-scheduler`) runs, among others: the domain re-check every five minutes, certificate renewals daily, the nightly panel backup at 03:30 and database dumps at 04:00.

## Docker is down

The panel runs outside Docker, so it keeps working when Docker does not. See [When Docker is down](../apps/lifecycle.md#when-docker-is-down).

## Uninstalling

There is no uninstall command yet. Your apps run as Docker containers and keep running if the panel is removed. To remove CommyPanel by hand, stop and disable the `commypanel-*` services, delete their unit files, `/etc/nginx/conf.d/*-commypanel*.conf` and `/etc/nginx/commypanel`, then `/opt/commypanel`. Keep `/var/lib/commypanel` if you may reinstall.

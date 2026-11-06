---
title: "Troubleshooting"
description: "Fixes for the problems people hit most: installing, signing in, deployments, domains, certificates and the database tools."
---

# Troubleshooting

Start with two commands on the server:

```bash
sudo commypanel status                      # which service is down
sudo journalctl -u commypanel-agent -n 50   # why (use the unit that is down)
```

## Installing

- **The installer stops with an error.** The full log is in `/var/log/commypanel-install.log`; the installer prints its end when a step fails. Running it again is safe.
- **"Unsupported system".** Only Ubuntu 24.04 / 26.04 and Debian 13 or newer are supported. Debian 12 is refused because it ships PHP 8.2.
- **"Port 80 is already used by ...".** Another web server is running. Stop and disable it, then run the installer again.
- **"Checksum does not match".** The download was damaged or tampered with. The installer refuses to continue; try again, and report it if it repeats.
- **A fresh install is refused because PHP has no security fix yet.** Your distribution has not published the PHP update. Run `sudo apt-get update && sudo apt-get upgrade`, or wait, or see [Maintenance](operating/maintenance.md#php-security-updates).

## Opening and signing in

- **The panel does not load.** Check the firewall: the panel port (**8443** by default) must be open. `sudo ufw allow 8443/tcp`. Then check `sudo commypanel status`.
- **The browser warns about the certificate.** Expected until the panel has a domain of its own; see [Domains and HTTPS](domains/domains-and-https.md#the-panels-own-domain).
- **The setup link says it expired.** It works once and for an hour. Run `sudo commypanel setup-url` for a new one.
- **Locked out.** `sudo commypanel admin:reset EMAIL` sets a new random password and turns off two-factor authentication for that account.
- **A page says Docker is unavailable.** The panel keeps working when Docker does not. See [When Docker is down](apps/lifecycle.md#when-docker-is-down).

## Deployments

- **Read the log first.** The deployment page shows every step. The failure and its reason are at the end.
- **"The app did not answer on port ... within 60 seconds".** Your app has to listen on the port CommyPanel gives it, from the **`PORT`** environment variable, on **all** addresses (`0.0.0.0`), not only `localhost`. Also check that your **health check path** exists and answers below 500, and that the app really starts: open **Logs** or the Terminal tab on the previous release.
- **"Could not detect the app type".** CommyPanel supports .NET, Go and Node projects, or anything with a `Dockerfile`. Add a Dockerfile, or check that `go.mod`, `package.json` or the `.csproj` is in the repository root.
- **"Found several Go programs / .NET web projects".** Add a Dockerfile to choose which one runs.
- **The build runs out of memory or is killed.** Building needs RAM. On a 1 GB server, add swap or upgrade the server.
- **"Could not fetch the repository".** For a private repository, add a [deploy key or token](apps/private-repositories.md), or use the [GitHub connection](apps/github.md).
- **My new environment variable or volume is not in the app.** A running container cannot gain them. Use **Apply changes** on the app page, or deploy. See [Applying changes](apps/lifecycle.md#applying-changes-without-a-deployment).
- **A failed deployment changed nothing.** That is by design: the old version keeps serving. See [Zero-downtime deployments](concepts/zero-downtime.md).

## Deploy on push

- **Pushes do not deploy.** The Git host must reach the panel over HTTPS, so give the panel a domain. Pushes to other branches, tags, a stopped app, or a deployment already waiting are ignored. For GitHub-connected apps, check that **Deploy on push** is switched on for the app. See [Deploy on push](apps/deploy-on-push.md).
- **GitHub says the signature is wrong.** The secret in the Git host's webhook must match the one shown on the app. Use **New secret** and paste the new one.

## Domains and certificates

- **The domain stays pending.** DNS can take a few minutes to spread. Check the records the page shows. A stale **AAAA** record pointing elsewhere is reported as a problem. Behind Cloudflare's proxy, switch the record to **DNS only** until the certificate has been issued.
- **The certificate was not issued.** The page shows the reason. Check that port **80** is open and reachable from the internet, that every name on the certificate points at this server, and that you accepted the Let's Encrypt terms under **Domains → HTTPS**. Let's Encrypt limits how often you can retry.
- **Browsers distrust the certificate.** You are on the **staging** CA (`ACME_STAGING=true`). Production installs use the real one.
- **A visitor sees 502.** The app's container is not running or not healthy. Check **Usage**, **Logs**, and **Server → Docker**.

## Databases

- **A linked app cannot connect.** Links reach the app when you **Apply changes** or deploy. Check the app received the `DATABASE_*` variables (Environment tab shows the names) and that the database server is running.
- **The database tool does not open.** Port **2053** must be open in your firewall, and if the panel is behind Cloudflare's proxy, use a port Cloudflare passes (2053 is one). The first pgAdmin opening downloads about 600 MB. See [phpMyAdmin and pgAdmin](databases/tools.md).
- **A restore failed.** The new database stays, marked failed with the reason. Delete it and try again, or load the dump by hand (see [Backups](operating/backups.md#copy-backups-off-the-server)).

## Upgrading

- **The upgrade failed.** It goes back to the previous version by itself. Read `/var/log/commypanel-install.log`, and report the error.
- **A new permission is missing for a role.** New permissions go to the built-in admin role only. Grant them to your own roles under **Roles**.

## Still stuck?

Open an issue at [github.com/CommyPanel/panel/issues](https://github.com/CommyPanel/panel/issues) with the version (`sudo commypanel status`), your distribution, what you did and what happened. Remove secrets from anything you paste.

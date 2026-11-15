---
title: "Backups"
description: "What is backed up, where it goes, how to copy it off the server and how to restore the panel, databases and volumes."
---

# Backups

Three kinds of data matter on a CommyPanel server. Each has its own backup, and none of them is useful if it only lives on the disk it protects, so [copy them off the server](#copy-backups-off-the-server).

| What | Backed up | Kept on the server | Restore |
|---|---|---|---|
| **The panel's database** (apps, domains, users, audit log, encrypted secrets) | nightly at 03:30, or on demand | newest 7 (`BACKUPS_KEEP`) | `sudo commypanel restore FILE` |
| **Each database** on a database server | nightly at 04:00, or on demand | newest 7 of each (`BACKUPS_KEEP_DATABASES`) | **Restore** into a new database, or **Restore over…** an existing one |
| **App volumes** | on demand, or nightly if you switch it on for a volume | newest 3 of each (`BACKUPS_KEEP_VOLUMES`) | the **Restore** button on the app's Volumes tab |

## The panel

The panel's own database (apps, domains, users, the audit log, database servers and their encrypted secrets) is backed up every night at 03:30, and the newest 7 are kept in `/var/lib/commypanel/backups/panel`. **Settings → Backups** lists them, takes one now, and downloads or deletes one (downloading asks for your password and is audited). `sudo commypanel backup` takes one from the command line.

A backup does **not** hold the encryption key, `APP_KEY` in `/etc/commypanel/env`: without it the encrypted values in a restored database (environment variables, tokens, database passwords) cannot be read. Keep a copy of the key somewhere safe, apart from the backups. **Settings → Encryption key** shows it (it needs the `server.key` permission and a recent password, and every visit is audited as a high-risk action). It also does not hold files: the files in apps' volumes, the data of database servers and built images. Copy backups off the server, since one on the same disk is lost with it.

To restore, on the server: `sudo commypanel restore FILE`, with the name of a backup in that folder or the path of a file you downloaded. The panel's queue workers and scheduler stop, the file is checked (it must be a healthy CommyPanel database), the current database is kept as a backup marked `-before`, the database is replaced, and everything starts again. To restore onto a new server, install CommyPanel there first and put the old `APP_KEY` into its `/etc/commypanel/env` before restoring.

## Databases

Every database on a running server is dumped each night at 04:00, and from the **Back up** button next to it, with the engine's own tool, to one compressed file in `/var/lib/commypanel/backups/databases/<server>/`. The newest 7 of each are kept (`BACKUPS_KEEP_DATABASES`). The server page lists them; download and delete need a recent password, and downloads are audited. To load a dump back, press **Restore** next to it. It is loaded into a **new** database (you choose its name, such as `shop_restored`), so nothing that exists is changed or overwritten. The new database has its own user and password, shows "Restoring" until it is done, and if loading fails it stays, marked as failed with the reason, so you can look at it or delete it. When it looks right, link it to the app on its **Links** tab, deploy again, and delete the old database.

**Restore over…** replaces an **existing** database instead. Choose the database (it starts as the one the dump came from), read which apps use it, tick that you understand everything in it is replaced, type its name, and confirm your password. CommyPanel first takes a **safety dump** of the database as it is now (it stays in the list), then drops and recreates the database and loads the dump. The dump's engine must match the server: a MySQL dump is not loaded into MariaDB. If loading fails, the safety dump is put back and the page says so; if even that fails, the message names the safety dump so you can load it by hand. Apps linked to the database see errors while it runs. Replacing is recorded in the audit log as a high-risk action. The agent only loads dumps it made itself: it remembers a checksum of each dump it makes and refuses any other file, or one that was changed since, so a restore cannot be used to run someone else's SQL.

## Volumes

**Backing up a volume.** The **Backups** card has a **Back up** button for each volume, and the Volumes tab has a switch **Archive every night** for each volume (off by default; the nightly run is at 03:30 and keeps the newest 3). It makes one compressed archive (a gzipped tar) of the volume's folders and files in `/var/lib/commypanel/backups/volumes/<app>/`, in the background, since a large volume takes a while; the newest 3 of each are kept (`BACKUPS_KEEP_VOLUMES`). Volumes are not archived by themselves unless you switch that on, because they can be large. Links, pipes, sockets and devices are left out, owners are kept as numbers so files go back to the same users, and a volume over 50 GB is refused. Downloading or deleting an archive needs your password and is recorded. The archives stay on this server, so copy them somewhere else now and then. Archives are deleted with the app.

**Restoring a volume.** Press **Restore** next to an archive, read what happens, type the volume's name and confirm your password. CommyPanel takes a safety archive of the volume as it is now, stops the app, replaces the volume's files with the archive (unpacked next to the folder first and swapped in at the end, so a failed unpack leaves the old files), and starts the app again, also when the restore failed. The agent only restores archives it made itself, and refuses while a container still uses the volume. **Archives made before 0.8.0 cannot be restored from the page** because they were not recorded; make a new archive, or unpack the old one by hand with `tar -xzpf FILE -C /var/lib/commypanel/volumes/<app>/<folder>` as root with the app stopped.

## Copy backups off the server

Backups are first stored **on this server**, so a lost disk loses them too. Under **Settings → Backups → Copy to another place (S3)** you can have every new panel backup, database dump and volume archive copied to any **S3-compatible storage**: Hetzner Object Storage, Cloudflare R2, Backblaze B2, Wasabi, MinIO, Amazon S3 and others.

Enter:

- the **https address** of the storage, for example `https://fsn1.your-objectstorage.com` for Hetzner (or `nbg1`, `hel1`),
- the **region** (Hetzner: `fsn1`, `nbg1` or `hel1`; Cloudflare R2: `auto`),
- an existing **bucket**, and an optional **folder** inside it,
- an **access key** and **secret key**. Use a key that may only write to that bucket.

**Test the connection** writes and deletes a small file, so you see problems at once.

How it behaves:

- The secret key is stored **encrypted** and never shown again.
- Copies are made **in the background**, right after each backup, with up to three tries. A failed copy shows on the page.
- The newest **14** copies of each backup are kept in the storage (changeable). Older ones are deleted, and files that are not CommyPanel backups are **never touched**.
- The address must be https and cannot be this server itself or a link-local address; a storage in your private network is fine.
- One upload is limited to **5 GB** (a limit of S3), so a bigger file is not copied and the page says so.
- This is the one place besides update checks where the panel contacts the outside by itself, and only once you switch it on.

### See what is stored there

Once the copy is on, **Settings → Backups** has a **Copies on remote storage** card that lists what is in the bucket (panel backups, database dumps by server, volume archives by app, newest first, up to 500) and lets you download a file through the panel (it asks for your password and is audited). Nothing is restored from it automatically: the agent loads only what it made on this server. To recover a lost server, see below.

### Getting a backup back from the storage

The panel does not read backups from the storage, so this is done by hand. Download the file from your provider. For a **database dump**, create an empty database with the **Add database** button on the server, then load the dump into it on the server:

```bash
# PostgreSQL
gunzip -c FILE | docker exec -i db-<server> psql -U postgres -d NAME

# MariaDB (use mysql and MYSQL_ROOT_PASSWORD for MySQL)
gunzip -c FILE | docker exec -i db-<server> sh -c 'mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" NAME'
```

The same is how you restore onto a **new server**: the **Restore** button only loads dumps that this server's agent made itself, so a dump from another server (or from before a reinstall) has to be loaded this way. For the **panel's own backup**, see [Restoring the panel](#the-panel) and keep the old `APP_KEY`.

## What a backup does not hold

- The panel's backup does **not** hold the encryption key (`APP_KEY` in `/etc/commypanel/env`). Keep a copy of it somewhere safe, apart from the backups.
- It does not hold files: the contents of volumes, the data of database servers, and built images.
- A server's whole disk is the only complete backup of everything. Use your hosting provider's snapshots as well if you can.

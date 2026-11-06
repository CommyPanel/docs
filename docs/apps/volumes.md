---
title: "Persistent volumes"
description: "Keep files across deployments: uploads, SQLite databases and anything else your app writes."
---

# Persistent volumes

Everything an app writes inside its container is gone when the next deployment replaces the container. To keep files (uploads, a SQLite database), add a **persistent volume** on the app's **Volumes** tab with **Add volume**: the path inside the container, such as `/app/uploads`. The files are stored on the server under `/var/lib/commypanel/volumes/<app>/<folder>`. The **How volumes work** button on the tab explains this in the panel.

Two names are involved, and only one has to match your app:

- The **path** (`/app/uploads`) is where the app sees the folder. It must be the path your app reads and writes, and it is case-sensitive. In the images CommyPanel builds for .NET and Node apps the app lives in `/app`, so that is its root folder, and a relative path in your code (`uploads/`) starts there. If you bring your own Dockerfile, use the folder its `WORKDIR` names. A Go app is built into a single file called `/app`, so give it another folder such as `/data`.
- The **folder** on the server (`app-uploads`) is made up from the path and is only a label. It does not have to match anything.

Also worth knowing:

- A change reaches the app when you **apply the changes** (or deploy), to the app and to its release command.
- The old and the new container **share** a volume while a deployment switches over, so both can read and write it. Make sure two versions can run against the same files for a moment.
- A **rollback does not roll back volume data.** The files stay as the running version left them.
- Whatever the image has at that path is **hidden** by the volume, which starts empty.
- **Remove** (on the tab; you type the path to confirm) stops mounting a path but leaves its files on the server, as a volume that is **not attached**. **Deleting the app deletes them.**
- A volume can be **locked**, which stops it being removed; see Locking.
- Up to 8 volumes per app. `/proc`, `/sys` and `/dev` cannot be used.

The folder is writable for whichever user the app runs as, since that differs from image to image. It cannot be reached from anywhere else on the server, because the folders above it belong to root and are closed to everybody else.

## Looking at volumes

The **Volumes** tab lists the app's volumes with a search box, how much space each uses (with a bar to compare them), where it is mounted and whether it is locked. **Browse** opens the volume on a page of its own, read only: the totals (files in the current folder, files in the whole volume, disk space used), the folder as a table with an icon per file type, a `..` row to go up, a preview of text files (the first 256 KB) and a download for anything up to 25 MB. Each folder has its own address, so the back button and links work. Links and special files inside a volume are listed but never opened, because the app that wrote them is not trusted and could point them at the server's own files.

**Backing up a volume.** Below the volumes, the **Backups** card has a **Back up** button for each volume. It makes one compressed archive (a gzipped tar) of the volume's folders and files in `/var/lib/commypanel/backups/volumes/<app>/`, in the background, since a large volume takes a while; the newest 3 of each are kept (`BACKUPS_KEEP_VOLUMES`). It is only made when you ask (nothing is backed up by itself), because volumes can be large. Links, pipes, sockets and devices are left out, owners are kept as numbers so files go back to the same users, and a volume over 50 GB is refused. Downloading or deleting an archive needs your password and is recorded. The archives stay on this server, so copy them somewhere else now and then. To put one back, stop the app and run `tar -xzpf FILE -C /var/lib/commypanel/volumes/<app>/<folder>` as root on the server; CommyPanel never overwrites a volume that may be in use. Archives are deleted with the app.

Volume files are private data (databases, uploads), so browsing needs its own permission, `apps.volumes`. **Roles you made yourself do not have it** until you grant it; the built-in admin role and the super user do. Every download is recorded in the audit log.

A volume you removed shows as **Not attached**, with its files. **Delete data** removes them (it asks for your password first, and is recorded). The agent refuses while any container still has that volume mounted, so deploy the app again first.

## Looking at volumes, backing them up

The **Volumes** tab lists the app's volumes with a search box, how much space each uses (with a bar to compare them), where it is mounted and whether it is locked. **Browse** opens the volume on a page of its own, read only: the totals (files in the current folder, files in the whole volume, disk space used), the folder as a table with an icon per file type, a `..` row to go up, a preview of text files (the first 256 KB) and a download for anything up to 25 MB. Each folder has its own address, so the back button and links work. Links and special files inside a volume are listed but never opened, because the app that wrote them is not trusted and could point them at the server's own files.

**Backing up a volume.** Below the volumes, the **Backups** card has a **Back up** button for each volume. It makes one compressed archive (a gzipped tar) of the volume's folders and files in `/var/lib/commypanel/backups/volumes/<app>/`, in the background, since a large volume takes a while; the newest 3 of each are kept (`BACKUPS_KEEP_VOLUMES`). It is only made when you ask (nothing is backed up by itself), because volumes can be large. Links, pipes, sockets and devices are left out, owners are kept as numbers so files go back to the same users, and a volume over 50 GB is refused. Downloading or deleting an archive needs your password and is recorded. The archives stay on this server, so copy them somewhere else now and then. To put one back, stop the app and run `tar -xzpf FILE -C /var/lib/commypanel/volumes/<app>/<folder>` as root on the server; CommyPanel never overwrites a volume that may be in use. Archives are deleted with the app.

Volume files are private data (databases, uploads), so browsing needs its own permission, `apps.volumes`. **Roles you made yourself do not have it** until you grant it; the built-in admin role and the super user do. Every download is recorded in the audit log.

A volume you removed shows as **Not attached**, with its files. **Delete data** removes them (it asks for your password first, and is recorded). The agent refuses while any container still has that volume mounted, so deploy the app again first.

---
title: "Start, stop, roll back and apply changes"
description: "Control a running app: restart, stop, deactivate, lock, roll back, and apply changed settings without a deployment."
---

# Start, stop, roll back and apply changes

## Start, stop and restart

The **Container** menu on the app page restarts or stops the live version. A stopped app keeps its release and domains; visitors get an error page until you press **Start**, which brings it back at once without a deployment. Pushes do not deploy a stopped app.

This differs from **Deactivate** (Advanced tab), which removes the container and takes the domains offline until you activate the app again.

## Roll back

On the **Deployments** tab, **Roll back** next to an earlier release starts a container from that release's image, without building anything, and switches to it with the same [zero-downtime swap](../concepts/zero-downtime.md) as a deployment. The last 3 images are kept (`DEPLOY_KEEP_IMAGES`). A rollback does **not** roll back [volume](volumes.md) data or databases, and it does not run the [release command](release-command.md) again.

## Applying changes without a deployment

Environment variables, volumes and links are given to a container when it is **made**; a running container cannot gain them, and a plain restart would not either. After you change any of them, the app page shows **Variables, volumes or links changed** with an **Apply changes** button (for people who may deploy). It makes a new container from the version that is **already running**, with the new settings, and swaps traffic exactly like a deployment: the new container starts next to the old one, must pass its health check, takes the traffic, and only then the old one stops. There is **no downtime**, nothing is fetched or built (your code is not updated), and if the new container is not healthy nothing changes. For a short while both containers run at once, so the app must be fine with that. It shows in the Deployments tab as "applied changes". Make as many changes as you like first and apply once.

## Locking

An app, or one of its volumes, can be **locked**. A locked app cannot be deleted, and neither can its volumes' files with it; a locked volume cannot be removed from its app, and deleting the app is refused while one of its volumes is locked. The delete button stays visible but is disabled, with a note saying why, and a lock icon shows next to the name in the lists and beside the title.

Locking is a safety catch against a slip, such as deleting the wrong app. It does not stop deployments, restarts or any other change, and anyone who may change the app (`apps.update`) can unlock it. Locking and unlocking are recorded in the audit log. Lock an app on its **Advanced** tab, and a volume on the **Volumes** tab.

## When Docker is down

The panel runs outside Docker, so it keeps working when Docker does not. Every page then shows a warning, and Server → Docker shows the state of the Docker service and its latest log lines. People with the "Manage Docker and nginx" permission can restart Docker from there after confirming their password. Restarting Docker stops every container for a moment; they come back on their own.

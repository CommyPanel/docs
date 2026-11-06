---
title: "Deploy your first app"
description: "From a Git repository to a live URL in a few minutes."
---

# Deploy your first app

This walks through the **New app** wizard with a small web app. You can use any Go, Node or .NET repository, or one with its own Dockerfile. Your app has to listen on the port CommyPanel gives it, which it receives as the `PORT` environment variable, and ideally answer on a health check path.

:::tip A repository to try
Any small web app will do. A good test app answers `GET /` with a page and `GET /health` with `ok`, and prints its container's hostname, so you can see the container change when you redeploy.
:::

## 1. Basics

Open **Apps → New app**. Give the app a name and choose where the code lives:

- **Git repository**: any `https://` or SSH Git address. Public repositories need nothing more. For a private repository, see [Private repositories](../apps/private-repositories.md), or connect [GitHub](../apps/github.md) once and pick the repository from a list.
- **I'll upload it myself**: a `.zip` or `.tar.gz` of your project.

The app type is detected from your code (leave it on **Detect automatically**), unless your repository has a Dockerfile, which always wins. See [Deploying apps](../apps/deploying.md#how-the-stack-is-detected).

## 2. Repository access

CommyPanel checks that it can read the repository. If it can, you move on. If not, it shows the two ways to give it access: a **deploy key** (an SSH key you add to the repository) or an **access token**. For an upload, you choose the file here instead.

## 3. Settings

- **App port**: the port your app listens on. CommyPanel passes it to your app as `PORT`; make sure your app reads it.
- **Health check path**: the path CommyPanel asks (for example `/health`) to know the new version is ready. Any answer below 500 counts.
- **Memory and CPU limits**: optional. Without them an app gets 512 MB and one core.
- **Release command**: optional, for example database migrations. See [Release command](../apps/release-command.md).

## 4. Domain

Add a domain now or later. If you do, CommyPanel shows the DNS records to create and checks them. See [Domains and HTTPS](../domains/domains-and-https.md).

## Deploy

Finishing the wizard starts the first deployment. You get a live log and a progress list: get the code, build the image, start the container, health check, go live. When it is healthy the app is **running**, and your domain (once its DNS points at the server) shows the app over HTTPS.

From now on, the **Deploy** button on the app page deploys the latest commit of the branch, with [no downtime](../concepts/zero-downtime.md). Older releases stay available for one-click **Roll back**.

## What next?

- Add a [database and link it to the app](../databases/servers-and-links.md).
- Set [environment variables](../apps/environment-variables.md).
- Turn on [deploy on push](../apps/deploy-on-push.md) or [deploy from your pipeline](../operating/api-and-ci.md).
- Keep files across deployments with a [persistent volume](../apps/volumes.md).

---
title: "Deploying apps"
description: "How CommyPanel builds and runs your app: sources, stack detection, the generated Dockerfile and what a deployment does."
---

# Deploying apps

A **deployment** takes your code, builds an image, starts it as a container, checks that it is healthy, and moves the traffic over to it. Each deployment is a numbered **release** with its own log, and you can look at, and roll back to, the recent ones.

## Where the code comes from

- **A Git repository.** Any `https://` or SSH Git address. Public repositories need nothing more; private ones use a [deploy key, an access token](private-repositories.md) or the [GitHub connection](github.md). Only the branch you choose is cloned, with no history.
- **An upload.** A `.zip` or `.tar.gz` of the project. You can replace it later on the app's page and deploy again. Archives are unpacked with strict limits (no path tricks, links or special files; 64 MB packed, 500 MB unpacked and 20,000 files by default, see [Configuration](../reference/configuration.md)).

## How the stack is detected

CommyPanel looks at your repository in this order, and uses the first match:

1. **A `Dockerfile`** in the root of the repository. It always wins, and is used as it is. This is how you run any language, and how you choose exactly what runs.
2. **.NET**: a `.csproj` or `.sln` file. There must be exactly one web project (SDK `Microsoft.NET.Sdk.Web`) targeting .NET 6 or newer. With several, add a Dockerfile to choose one.
3. **Go**: a `go.mod` file. The `main` package is found in the repository root or in a `cmd/<name>` folder; with several programs, add a Dockerfile to choose one.
4. **Node.js**: a `package.json` file with a `start` script or a `main` file.

You can also choose the type by hand when you create the app. If it does not match what is in the repository, the deployment fails with a clear message rather than guessing.

### What is generated

For .NET, Go and Node, CommyPanel writes a **multi-stage Dockerfile** (build stage, then a slim runtime stage that runs as a non-root user). You see its notes at the top of the deployment log.

| Stack | Build | Runtime |
|---|---|---|
| **.NET** | `dotnet publish` with the SDK image for your target framework | the ASP.NET runtime image; listens on `http://+:PORT`; runs as the image's app user from .NET 8 |
| **Go** | `go build` with the Go version in your `go.mod`, without cgo | a distroless static image running as non-root; the binary is `/app` |
| **Node.js** | `npm ci` (or pnpm or yarn, detected from your lockfile or `packageManager`), then `build` if your `package.json` has that script, then production dependencies only | `node:<major>-slim` where the major version comes from `engines.node` or `.nvmrc` (24 by default, 18 at least); `NODE_ENV=production`; runs as the `node` user; starts with your `start` script, or `node <main>` |

Your app must listen on the port CommyPanel gives it, which it passes as the **`PORT`** environment variable. The **app port** setting tells CommyPanel which port to publish; the app should read `PORT`.

## What a deployment does

1. **Get the code**: clone the branch, or unpack the upload.
2. **Build the image**: one build at a time on the server, with CPU and memory limits.
3. **Release command** (optional): run once in a fresh container, for example migrations. See [Release command](release-command.md).
4. **Start**: the new container starts next to the old one.
5. **Health check**: CommyPanel asks your health check path until the app answers (anything below 500 counts), for up to 60 seconds.
6. **Go live**: nginx is pointed at the new container and reloaded gracefully. The old container then stays for a few minutes while CommyPanel [watches the new release](safe-deployments.md) and rolls back by itself if it is clearly worse, and then stops. With a [gradual rollout](safe-deployments.md#gradual-rollout) turned on, only a share of the visitors gets the new release at first.

If any step fails, **the old version keeps serving** and the deployment is marked failed with the reason. See [Zero-downtime deployments](../concepts/zero-downtime.md) for the details.

Older images are kept so that **Roll back** is instant: the last 3 per app by default (`DEPLOY_KEEP_IMAGES`). A rollback starts a container from an older image without building anything. It does not undo changes to [volumes](volumes.md) or databases.

## Settings

On the app page, **Settings** holds the branch, the app port, the health check path, memory and CPU limits and the release command. Changes apply from the next deployment. Environment variables, volumes and links have their own tabs, and take effect when you [apply the changes](lifecycle.md#applying-changes-without-a-deployment).

By default an app gets **512 MB** of memory and **one CPU core**; set limits to change that.

## Who can do what

Creating apps needs `apps.create`, changing settings `apps.update`, and deploying and rolling back `apps.deploy`. See [Permissions](../reference/permissions.md).

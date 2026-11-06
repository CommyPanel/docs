---
title: "Environment variables"
description: "Configure your app with environment variables, stored encrypted and never shown again."
---

# Environment variables

Configuration reaches your app as **environment variables**. Add them on the app's **Environment** tab.

- **Names** use letters, digits and underscores and do not start with a digit (up to 128 characters). `PORT` is set by CommyPanel and cannot be changed.
- **Values** can be up to 32,768 characters. They are **stored encrypted** and **never shown again**: you can replace or remove a variable, but not read it back.
- **Import** takes a pasted `.env` file: blank lines and comments are ignored, `export ` and matching quotes are removed, and `PORT` is skipped.
- **Links** to databases and other apps add their own variables (`DATABASE_URL` and friends). A variable you add yourself with the same name wins. See [Databases and links](../databases/servers-and-links.md#links).
- Variables are given to the app and to its [release command](release-command.md) when their container is made, and are never written to logs or the audit log.

## When changes take effect

A running container cannot gain or lose environment variables, so a change reaches the app when you **apply the changes** (a button appears on the app page, no rebuild and no downtime) or at the next deployment. See [Applying changes without a deployment](lifecycle.md#applying-changes-without-a-deployment).

## Who can do what

Managing variables needs `env.manage`. Because the values are secrets, a role that can deploy apps cannot necessarily read or change their configuration. See [Permissions](../reference/permissions.md).

:::note Secrets in your repository
Keep secrets out of your repository. Put them in environment variables here, and use `.env*` in your `.dockerignore` if you ship your own Dockerfile. The generated Node Dockerfile already leaves `.env*` files out of the image.
:::

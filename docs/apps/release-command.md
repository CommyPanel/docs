---
title: "Release command"
description: "Run a command once per deployment, such as database migrations, before the new version starts."
---

# Release command

An optional command that runs once per deployment, for example database migrations (`npm run migrate`). It runs in a fresh container made from the new image, with the app's environment variables, after the build and before the new version starts.

- If it fails or runs longer than 10 minutes (`DEPLOY_RELEASE_TIMEOUT`), the new version is not started and the old one keeps serving. Its output is in the deployment log.
- The old version keeps serving while it runs, so the changes it makes must still work for the old version.
- It runs without a shell: quotes work, but `&&`, `|`, `;`, `>` and `$VARIABLES` do not. To chain commands, run them through the shell in your image: `sh -c 'npm run migrate && npm run seed'`.
- Rollbacks do not run it again.

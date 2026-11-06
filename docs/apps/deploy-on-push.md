---
title: "Deploy on push"
description: "Deploy automatically when you push to the app's branch."
---

# Deploy on push

For apps connected through the [GitHub connection](github.md), deploy on push is a switch on the app (off by default). For every other Git host, use the app's webhook:

Under Settings → Deploy on push, turn on the webhook and add its URL and secret to your repository (GitHub, GitLab, Bitbucket Cloud, Gitea and Forgejo are supported). Every push to the app's branch then starts a deployment.

- Every call must be signed with the secret (HMAC-SHA256, or GitLab's secret token). Anything else is refused.
- Pushes to other branches, tags and other events are ignored, and so are pushes while the app is stopped or a deployment is already waiting.
- The URL contains a random id, not the app's name. **New secret** replaces the secret at once; turning the webhook off and on gives it a new URL.
- Your Git host must be able to reach the panel. Give the panel its own domain (on the `/welcome` page) so the URL is a stable HTTPS address.

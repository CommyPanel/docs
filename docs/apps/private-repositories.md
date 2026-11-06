---
title: "Private repositories"
description: "Give CommyPanel read access to a private repository with a deploy key or an access token."
---

# Private repositories

CommyPanel needs read access to a private repository. Use one of these:

- **Deploy key.** CommyPanel creates an SSH key; add the public half to the repository as a read-only deploy key. Deployments then clone over SSH.
- **Access token.** Create a read-only token on your Git host and paste it under **Settings → Access token** (or in step 2 of the setup). CommyPanel tests it against the repository before saving it. Deployments then clone over HTTPS.
    - GitHub: a fine-grained personal access token limited to the repository, with Contents set to Read-only.
    - GitLab: a project access token with the Reporter role and the `read_repository` scope.
    - Bitbucket: a repository access token with Repositories: Read.
    - Other Git servers: any token that can read the repository, together with the username it belongs to.

If both are set, the token is used. Tokens are stored encrypted and never shown again. CommyPanel never puts a token in a URL or on a command line; it is handed to Git through its environment, and Git is told not to follow redirects so the token is never sent to another host. This needs Git 2.31 or newer, which every supported system has.

:::tip GitHub
If your code is on GitHub, the [GitHub connection](github.md) is simpler: no key or token to create, and you pick the repository from a list.
:::

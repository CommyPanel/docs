---
title: "The commy command"
description: "Control a CommyPanel server from your own machine or CI with the commy command: deploy, restart, logs and environment variables, through an API token."
---

# The commy command

`commy` is a command-line client for the [API](../reference/api.md). It runs on your own machine or in CI, and talks to your panel over https with an API token. It is **not** a shell on the server and needs no root or SSH, and it cannot do anything the token's abilities do not allow. (It is separate from the `commypanel` command on the server, which installs, upgrades and restores the panel itself; see the [CLI reference](../reference/cli.md).)

## Install

```bash
curl -fsSL https://github.com/commypanel/commy-cli/releases/latest/download/install.sh | bash
```

The script downloads the binary for your system, checks its SHA-256 checksum against the release and installs it to `~/.local/bin`. You can also download a binary and `SHA256SUMS` from the releases page and check it yourself. Builds exist for macOS, Linux and Windows, on amd64 and arm64.

## Sign in

Make a token under **Settings > API tokens**: only the abilities it needs, limited to the apps it needs, with an expiry (see [API tokens and deploying from CI](api-and-ci.md)). Then:

```bash
read -rs COMMY_TOKEN && export COMMY_TOKEN
commy login --url https://panel.example.com
```

`login` checks the token and saves the address and token in `commy/config.json` in your config folder, readable only by you. In CI, skip `login` and set `COMMY_URL` and `COMMY_TOKEN` from your secrets. The token is never accepted as an argument (it would land in the process list and shell history), and a saved token is only sent to the address it was saved with. A panel that still uses its self-signed certificate is refused: give it a domain and a certificate, or pass the certificate authority with `--ca-file`.

## Commands

| Command | What it does | Token ability |
|---|---|---|
| `commy whoami` | What the token is, may do, and until when | any |
| `commy apps`, `commy apps show <app>` | List apps; one app and its latest deployment | `apps:read` |
| `commy deploy <app>` | Deploy and wait for the result | `apps:deploy` |
| `commy apply <app>` | Apply changed variables, volumes and links | `apps:deploy` |
| `commy deployments <app>`, `commy deployment <app> <n> [--log]` | History; one deployment, with its build log | `apps:read` |
| `commy start`, `stop`, `restart <app>` | Control a running app | `apps:control` |
| `commy logs <app> [--tail 200]` | The last lines of the app's output | `apps:logs` |
| `commy env list <app>` | The names of its variables (values are never shown) | `apps:env` |
| `commy env set <app> <KEY>` | Set a variable; the value comes from stdin or `--from-file` | `apps:env` |
| `commy env unset <app> <KEY>` | Remove a variable | `apps:env` |
| `commy logout` | Forget the saved login | none |

```bash
commy deploy shop                      # waits for the result
commy deploy shop --no-wait --json     # queue it and print the deployment
printf %s "$STRIPE_KEY" | commy env set shop STRIPE_KEY && commy apply shop
```

Most commands accept `--json`. A variable you set takes effect with `commy apply` (or the next deployment).

## Exit codes

| Code | Meaning |
|---|---|
| `0` | It worked (a deployment went live) |
| `1` | An error: no access, no such app, the state does not allow it |
| `2` | The command was typed wrongly |
| `3` | A deployment failed or was rolled back |
| `4` | A deployment was still running when `--timeout` ended; it carries on in the panel |

## Safe by design

- https only, TLS always verified, and **redirects are never followed**, so the token cannot be sent to another address.
- No secrets on the command line, and asking for one in a terminal is refused instead of shown.
- The saved login is private to you, and a copy that others can read is refused.
- Text from your apps (logs, commit messages, error sentences) has terminal control characters made visible, so a hostile log line cannot retitle your window or write to your clipboard.
- No telemetry and no self-update.

## From your own code

The same API is available as small libraries for Go (which `commy` is built on), Node.js, Python, PHP and .NET: see [API libraries](api-libraries.md).

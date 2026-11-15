---
title: "API reference"
description: "Endpoints, abilities, response fields, status codes and limits of the CommyPanel API."
---

# API reference

The API starts and follows deployments, controls an app (start, stop, restart), reads its logs and manages its environment variables. It is described by an [OpenAPI file](https://github.com/commypanel/panel/blob/main/docs/openapi.yaml), the contract the official clients are written against. It uses bearer tokens; see [API tokens and deploying from CI](../operating/api-and-ci.md) for how to create one and a complete pipeline example.

All calls are under `/api/v1` on your panel's address. Send `Accept: application/json` and `Authorization: Bearer <token>`. Only https should be used.

## Abilities

| Ability | Allows | Needs the owner to hold |
|---|---|---|
| `apps:read` | List apps, read an app and its deployments | `apps.view` |
| `apps:deploy` | Start a deployment, apply changed variables | `apps.deploy` |
| `apps:control` | Start, stop and restart an app | `apps.control` |
| `apps:logs` | Read the app's logs | `apps.logs` |
| `apps:env` | List variable names, set and remove variables | `env.manage` |

Logs and variables are separate abilities on purpose: logs and variable values often hold secrets. Give a token only what it needs, limit it to one app, and let it expire.
A token can also be limited to some apps. A token is checked against its owner's **current** permissions on every call.

## Endpoints

| Call | Ability | Answer |
|---|---|---|
| `GET /apps` | `apps:read` | `{"data": [app, ...]}`, only the apps the token may see |
| `GET /apps/{slug}` | `apps:read` | `{"data": app}` |
| `POST /apps/{slug}/deployments` | `apps:deploy` | `202` and `{"data": deployment}` |
| `GET /apps/{slug}/deployments` | `apps:read` | `{"data": [deployment, ...]}`, newest first; `?limit=` up to 50 |
| `GET /apps/{slug}/deployments/{number}` | `apps:read` | `{"data": deployment}`; add `?log=1` for the build log |
| `POST /apps/{slug}/apply` | `apps:deploy` | `202` and `{"data": deployment}`: applies changed variables, volumes and links from the running version, with no build |
| `POST /apps/{slug}/start`, `/stop`, `/restart` | `apps:control` | `{"data": app}` after the change; `409` if the state does not allow it |
| `GET /apps/{slug}/logs` | `apps:logs` | `{"data": {"live", "lines", "logs"}}`; `?tail=` from 10 to 5000 (default 200). Every read is recorded in the audit log |
| `GET /apps/{slug}/env` | `apps:env` | `{"data": {"keys": [...], "pending_changes"}}`: names only |
| `PUT /apps/{slug}/env/{KEY}` | `apps:env` | Body `{"value": "..."}`. `201` when created, `200` when replaced; the value is never echoed back |
| `DELETE /apps/{slug}/env/{KEY}` | `apps:env` | `{"data": {"key", "pending_changes"}}`; `404` if there is no such variable |
| `GET /token` | none | What the calling token is: name, abilities, the apps it is limited to, expiry |

A variable change takes effect with `POST /apps/{slug}/apply` (or a normal deployment). Variable **values are write-only**: no call returns them.
## Objects

An **app**:

| Field | Meaning |
|---|---|
| `slug`, `name` | The app's identifier and name |
| `status` | `new`, `deploying`, `running`, `failed`, `stopped` or `deactivated` |
| `stack` | `dotnet`, `go`, `node`, `dockerfile` or `null` |
| `domains` | Connected domain names |
| `live_deployment` | The number of the release that is live, or `null` |
| `latest_deployment` | The newest deployment (a deployment object), or `null` |
| `created_at` | ISO 8601 time |

A **deployment**:

| Field | Meaning |
|---|---|
| `number` | The release number |
| `status` | `queued`, `building`, `starting`, `rollout` (a gradual rollout is proving it), `active`, `superseded`, `rolled_back` (it went live and was rolled back by itself), `failed` or `stopped` |
| `stage` | `fetch`, `build`, `release`, `start`, `health`, `switch` or `done` |
| `finished` | `true` once it is over, whatever the result |
| `succeeded` | `true` if it went live (it is `active`, or was and has been replaced) |
| `commit`, `commit_message` | The short commit and its first line, if known |
| `is_rollback` | `true` for a rollback |
| `error` | The reason, for a failure |
| `created_at`, `finished_at` | ISO 8601 times |
| `url` | The address of this deployment in the API |
| `log` | The build log, only with `?log=1` |

**What the API deliberately does not do:** open a terminal, read or download volume files, show the credentials of ready-made apps or database passwords, manage users, roles, tokens, settings, backups or certificates, or return the value of an environment variable. Anything that asks for your password in the panel is not available here.

Every call a token makes is recorded in the audit log with the token's name.

## Status codes

| Code | Meaning |
|---|---|
| `200`, `202` | Success; `202` means the deployment was queued |
| `401` | No token, a wrong or expired one, or its owner no longer exists |
| `403` | The token lacks the ability, or its owner lost the permission |
| `404` | No such app, deployment or variable, or the app is outside the token's limit |
| `409` | The state does not allow it: a deployment is already in progress (its details are in the answer), the app is stopped, or there is nothing running to apply changes to |
| `422` | A value was not valid (`errors` says which field) |
| `429` | Too many calls; wait for the seconds in the `Retry-After` header |

**One error shape.** Every error answer is JSON with an `error` sentence: `{"error": "The app is already stopped."}`. A `422` also has `errors` (field to sentences), and `409` for a running deployment adds `deployment`.

## Limits

- **60 calls a minute** per token.
- Calls without a valid token get **20 a minute per address**, and failed attempts are counted before the token is looked up, so guessing a token is slow from the first try.
- There is **no CORS**: browsers on other sites cannot call the API. Keep tokens out of front-end code.

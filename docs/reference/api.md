---
title: "API reference"
description: "Endpoints, abilities, response fields, status codes and limits of the CommyPanel API."
---

# API reference

The API starts deployments and reads their results. It uses bearer tokens; see [API tokens and deploying from CI](../operating/api-and-ci.md) for how to create one and a complete pipeline example.

All calls are under `/api/v1` on your panel's address. Send `Accept: application/json` and `Authorization: Bearer <token>`. Only https should be used.

## Abilities

| Ability | Allows | Needs the owner to hold |
|---|---|---|
| `apps:read` | List apps, read an app and its deployments | `apps.view` |
| `apps:deploy` | Start a deployment | `apps.deploy` |

A token can also be limited to some apps. A token is checked against its owner's **current** permissions on every call.

## Endpoints

| Call | Ability | Answer |
|---|---|---|
| `GET /apps` | `apps:read` | `{"data": [app, ...]}`, only the apps the token may see |
| `GET /apps/{slug}` | `apps:read` | `{"data": app}` |
| `POST /apps/{slug}/deployments` | `apps:deploy` | `202` and `{"data": deployment}` |
| `GET /apps/{slug}/deployments/{number}` | `apps:read` | `{"data": deployment}`; add `?log=1` for the build log |

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

The API never returns environment variables, keys, tokens or webhook secrets.

## Status codes

| Code | Meaning |
|---|---|
| `200`, `202` | Success; `202` means the deployment was queued |
| `401` | No token, a wrong or expired one, or its owner no longer exists |
| `403` | The token lacks the ability, or its owner lost the permission |
| `404` | No such app or deployment, or the app is outside the token's limit |
| `409` | A deployment is already in progress (its details are in the answer), or the app is stopped |
| `429` | Too many calls |

## Limits

- **60 calls a minute** per token.
- Calls without a valid token get **20 a minute per address**, and failed attempts are counted before the token is looked up, so guessing a token is slow from the first try.
- There is **no CORS**: browsers on other sites cannot call the API. Keep tokens out of front-end code.

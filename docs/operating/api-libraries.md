---
title: "API libraries"
description: "Call the CommyPanel API from your own code with small libraries for Go, Node.js, Python, PHP and .NET: deploy, control apps, read logs and set environment variables."
---

# API libraries

Besides [the `commy` command](commy-cli.md), the [API](../reference/api.md) has small client libraries for **Go**, **Node.js / TypeScript**, **Python**, **PHP** and **.NET**. Use them for a deploy step in your own tooling, an admin script, or an app that wants to ask CommyPanel for something. Each one lives in its own repository and speaks API `v1` of CommyPanel 0.10 and later.

| Language | Repository | Package |
|---|---|---|
| Go | [commypanel-go](https://github.com/CommyPanel/commypanel-go) | `go get github.com/commypanel/commypanel-go` |
| Node.js / TypeScript | [commypanel-node](https://github.com/CommyPanel/commypanel-node) | `commypanel` (npm) |
| Python | [commypanel-python](https://github.com/CommyPanel/commypanel-python) | `commypanel` (PyPI) |
| PHP | [commypanel-php](https://github.com/CommyPanel/commypanel-php) | `commypanel/commypanel` (Composer) |
| .NET | [commypanel-dotnet](https://github.com/CommyPanel/commypanel-dotnet) | `CommyPanel.Client` (NuGet) |

All five are installable from their registries: `go get` for Go, `npm install commypanel`, `pip install commypanel`, `composer require commypanel/commypanel` and `dotnet add package CommyPanel.Client`. Pin the version you tested.

## What they all do

Every library offers the same operations, named in the style of its language, and is checked against the same [OpenAPI description](https://github.com/CommyPanel/panel/blob/main/docs/openapi.yaml):

| Operation | Needs the token ability |
|---|---|
| What is this token (name, abilities, apps, expiry) | any |
| List apps, get an app, list and get deployments | `apps:read` |
| Start a deployment, apply changed variables, wait for a deployment | `apps:deploy` (and `apps:read` to wait) |
| Start, stop and restart an app | `apps:control` |
| Read an app's logs | `apps:logs` |
| List variable names, set and remove a variable | `apps:env` |

Variable values are write-only: the API never returns them. See [API tokens and deploying from CI](api-and-ci.md) for how to make a token, and give it only the abilities, apps and lifetime the job needs.

## A deployment in each language

```go
client, _ := commypanel.New("https://panel.example.com", os.Getenv("COMMY_TOKEN"))
queued, err := client.StartDeployment(ctx, "shop")
done, err := client.WaitForDeployment(ctx, "shop", queued.Number, 3*time.Second, nil)
if err != nil || !done.Succeeded { /* it failed or was rolled back */ }
```

```js
import { Client } from "commypanel";

const client = new Client("https://panel.example.com", process.env.COMMY_TOKEN);
const queued = await client.startDeployment("shop");
const done = await client.waitForDeployment("shop", queued.number);
if (!done.succeeded) throw new Error(`ended as ${done.status}`);
```

```python
from commypanel import Client

client = Client("https://panel.example.com", os.environ["COMMY_TOKEN"])
queued = client.start_deployment("shop")
done = client.wait_for_deployment("shop", queued.number, timeout=600)
if not done.succeeded:
    raise SystemExit(f"ended as {done.status}")
```

```php
use CommyPanel\Client;

$client = new Client('https://panel.example.com', getenv('COMMY_TOKEN'));
$queued = $client->startDeployment('shop');
$done = $client->waitForDeployment('shop', $queued->number);
if (!$done->succeeded) { exit("ended as {$done->status}\n"); }
```

```csharp
using var client = new CommyPanelClient("https://panel.example.com", Environment.GetEnvironmentVariable("COMMY_TOKEN")!);
var queued = await client.StartDeploymentAsync("shop");
var result = await client.WaitForDeploymentAsync("shop", queued.Number);
if (!result.Succeeded) throw new Exception($"ended as {result.Status}");
```

A deployment can finish as `failed` or be `rolled_back`, so check `succeeded` after waiting. Starting a deployment while one is running is an error you can recognise (a conflict); the error carries the deployment that is already running.

## Safe by design

All five libraries follow the same rules, and have tests for each:

- **https only.** A plain `http` address is refused, except `localhost` when you ask for it (for development). TLS is always verified; there is no switch to skip it. For a panel whose certificate comes from a private authority, give the library that authority.
- **Redirects are never followed**, so the token cannot be sent to another address.
- **The token stays out of sight:** not in errors, logs, `toString` or debug output, not even if a misbehaving server echoes it back.
- **Bounded:** a timeout, a few retries (a write is only retried after a 429, because anything else may already have happened), a cap on the wait after a 429, and a cap on the size of an answer.
- **Names are checked before a request is made**, so an app or variable name cannot change the address that is called.
- **No dependencies at run time** (Go standard library, Node's built-ins, Python's standard library, PHP's `curl` and `json` extensions, .NET's `HttpClient`) and nothing that runs when you install them.

Text that comes back from an app (logs, commit messages) is not cleaned: if you print it to a terminal, remove control characters first, as the `commy` command does.

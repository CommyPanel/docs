---
title: "Safe deployments"
description: "Watch a new release after it goes live and roll back by itself if it is clearly worse, or roll it out to your visitors gradually."
---

# Safe deployments

A health check proves that a new release **starts**. It cannot prove that it **works**: a bug that only shows up with real visitors passes the check and then fails for everybody. Safe deployments close that gap by looking at the real requests your app answers. Open them on the app's **Safe deploys** tab.

Two things are always measured, and two are settings:

| | What it does | Default |
|---|---|---|
| **Request statistics** | Counts the requests, errors and response times of each release, so the two can be compared. | Always on |
| **Watch after the switch** | Keeps the previous release running for a few minutes after the switch and rolls back by itself if the new one is clearly worse. | On, per app |
| **Gradual rollout** | Sends only a share of the visitors to the new release, then more, instead of everybody at once. | Off, per app |

## Request statistics

nginx reports one line per request (the site, the status, the time it took and which container answered) to the agent, which keeps ten-second counts for the last hour in memory. Nothing is written to disk, and **no addresses, paths, headers or cookies** are recorded. The **Usage** tab shows a **Traffic** card with requests, errors and response times, and marks the moment each release went live.

The statistics are per container, so the old and the new release are always compared over the same minutes.

## Watch after the switch

After a release goes live, CommyPanel keeps the **previous container running** for the watch time (5 minutes by default, 1 to 60). During that time it compares the new release with the one before it. If the new release is clearly worse, traffic is moved back **at once** and the release is marked **Rolled back** with the reason.

A release counts as worse when, after at least 30 requests:

- **Errors**: at least 5 errors, a rate at least 2 points higher than before **and** at least twice as high. Without something to compare to, 5% errors is enough.
- **Speed**: at least 50 requests and a 95th-percentile response time at least twice as slow as before and 500 ms slower.

The comparison has to be bad **twice in a row** (the look runs every 15 seconds), so one bad moment does not roll anything back. If the container itself stops, the rollback is immediate. If your app has too little traffic to judge, the watch simply ends and the release is accepted: it never rolls back on a guess.

When the watch ends, or when you press **End the watch**, the previous container is stopped. Starting a new deployment ends it too.

:::note
Watching keeps two containers for a few minutes, and both are connected to the same database and volumes. A migration must keep working for the old release, as it already must during any switch.
:::

### Going live again

A rolled-back release keeps its image. If you think the rollback was wrong, or you have fixed the cause outside the code (a setting, the database), press **Go live again** on that deployment. It goes live with the same image, and that time **it is not watched**.

## Gradual rollout

With a gradual rollout the new release first gets only a share of the visitors, say 10%. If it holds up for the hold time, it gets more, and finally everybody. If it does worse than the old release at any step, everybody is moved back.

It is **off** for every app. Turn it on on the Safe deploys tab; CommyPanel lists what it asks of your app and you have to confirm you understand it.

You choose:

- **Steps**: up to four percentages, for example 10 and 50 (the default). The last step is always everybody.
- **Hold time**: how long each step is held (5 minutes by default, 1 to 120).
- **Automatic or manual**: automatic moves on by itself when a step held up. Manual waits for you at every step.

During a rollout the deployment page shows the share, the time left, and the two releases side by side. You can **move on**, **give everybody the release** or **abort** at any time. Aborting returns everybody to the old release.

### What to keep in mind

- **Two versions run side by side** for the whole rollout (steps times hold time), against the same database and volumes. A migration must work with both: add first, remove later.
- **It needs enough requests.** At 10% a quiet app may not send enough requests to the new release to say anything. CommyPanel then waits longer (up to three times the hold time) and finally asks you instead of guessing.
- **A deployment takes longer.** The release goes live only after the last step. New deployments wait until it ends.
- **Visitors stay on one version.** A cookie (`cp_rollout`, HttpOnly, one day) keeps a visitor on the release they got, and raising the share never moves anybody back. A client that refuses cookies can switch between versions. Requests already in progress, long ones and open connections stay on the version they started on.
- **Memory** for two containers while it runs, and the app needs **a domain** (there is nothing to split without one).
- **Rollbacks and Apply changes stay instant.** They are never gradual.

## Messages and the API

Deployment messages report a rollback as a failure. In the [API](../operating/api-and-ci.md) a deployment can have the status `rollout` (still being proven) or `rolled_back`. A rolled-back release has `succeeded: false`. Because the watch runs **after** the release went live, a CI job that stops at the first `succeeded: true` can miss a rollback minutes later; when that matters, read the app again after the watch time.

## What it cannot do

- It judges **errors and speed** from the outside. It does not know that a button is missing, or that a price is wrong.
- Only requests through nginx are counted. Anything that does not pass the panel's proxy (traffic straight to the container's port, background work) is not.
- One server only: there is no separate "canary" server.

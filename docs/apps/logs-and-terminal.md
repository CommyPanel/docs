---
title: "Logs and terminal"
description: "Read what a running app prints and open a shell inside its container."
---

# Logs and terminal

## Logs

The **Logs** tab shows what the running container printed, newest at the bottom. Choose how many lines to load (200 to 5,000). **Follow** refreshes every 3 seconds and keeps the view at the end; switch it off to read in peace. Search the log with the box above it, or press Cmd/Ctrl+F while the log is focused: matches are highlighted, and Enter and Shift+Enter move between them. **Download** saves the last 5,000 lines as a text file.

Apps often print secrets into their logs, so reading them needs its own permission, `apps.logs`. The built-in admin role and the super user have it; **roles you made yourself do not** until you grant it. Every download is recorded in the audit log. Only the live container's output is shown, not that of earlier releases.

## Usage

The **Usage** tab shows the app's CPU and memory use and a chart over time, so you can compare it with the limits you set. See also [Containers and networks](networks.md).

## Terminal

The **Terminal** tab opens a shell **inside the running container**, as the user the app runs as and with its environment variables. Use it to look around, run a one-off command or check a file.

- It needs its own permission, `apps.terminal`, which custom roles do not have until you grant it. Opening one needs a recent password confirmation and is recorded in the audit log.
- The shell runs in the live container only, not on the server. The container's limits apply.
- A session closes after **15 minutes without input or output**, and after **2 hours** at most. Up to 8 sessions can be open at once.
- Under the hood it is a WebSocket the panel never touches: the panel checks your permission, then hands your browser a single-use ticket (valid for about 30 seconds, for one container) that the agent redeems. Only containers CommyPanel manages can be opened.

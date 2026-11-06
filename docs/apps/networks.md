---
title: "Containers and networks"
description: "See an app's containers and understand how apps are kept apart on their own Docker networks."
---

# Containers and networks

The **Usage** tab lists the app's containers: the live release and, for a moment during a deployment, the previous one. For each it shows the state, the release, the network and address it has, the ports it publishes (only on the server's loopback address; nginx is what reaches them) and the volumes mounted into it. Below that are the networks those containers are on and everything attached to them. **Server → Docker** shows the same for every container, plus all networks CommyPanel created.

## Each app has its own network

Every app's containers join a Docker network of their own, `commypanel-<app>`, created with its first container and removed when the app is deleted. Containers of different apps are on different networks, so one app cannot reach another's containers. The old and the new release of the same app share their network, so a deployment switch needs no change. nginx reaches the app through a port published on the server's loopback address, which does not depend on the network.

Apps deployed before this existed stay on the old shared network, called `commypanel`, until their next deployment. The Usage tab says so, and both pages warn when a network holds more than one app. Deploy those apps again to move them. The old network stays as an empty entry afterwards.

What this does not do: a container can still reach the internet, and the host's own services that listen on all addresses (such as the panel's port or SSH) through the network's gateway address. Services that listen only on `127.0.0.1`, including the ports the apps are published on, cannot be reached from a container.

---
title: "Domains and HTTPS"
description: "Connect a domain to an app, see the DNS records to create, and get Let's Encrypt certificates issued and renewed automatically."
---

# Domains and HTTPS

## Adding a domain

Domains belong to an app. Open the app's **Domains & SSL** tab and add a domain or subdomain. The global **Domains** page lists every domain on the server (read only).

CommyPanel then shows the DNS records to create and checks them:

- an **A** record pointing at the server's IPv4 address, and an **AAAA** record if the server has an IPv6 address, on the name you added. A **CNAME** that leads to a name with those records also works (up to five hops).

A domain is **connected** once its DNS answers with the server's address. An **AAAA** record that points somewhere else is reported as a problem, because it would send IPv6 visitors, and Let's Encrypt, to the wrong server. The page refreshes by itself while you wait, and the server re-checks every five minutes. A domain can belong to one app only, and can never be the panel's own domain.

If you use **Cloudflare's proxy** (the orange cloud), the domain shows as **proxied**: Cloudflare answers with its own addresses, so CommyPanel cannot check where the domain really points. Switch the record to **DNS only** (the grey cloud) until the certificate has been issued.

## www and the bare domain

When you add a domain you can also add its partner (the bare domain and its `www` form) and choose which one is the real address: the other **redirects** to it, so visitors end up in one place. Both names are connected to the app and covered by its certificate.

## HTTPS

CommyPanel gets **Let's Encrypt** certificates for you.

- Turn it on once under **Domains → HTTPS** by accepting the Let's Encrypt Subscriber Agreement. Nothing is requested before that.
- There is **one certificate per app**, covering all of its connected domains. It is issued with the **HTTP-01** challenge, so each name must already point at the server and be reachable on port 80. Only domains whose DNS is verified go on a certificate, because one unreachable name fails the whole order.
- Certificates are **renewed automatically** when fewer than 30 days remain. A failed renewal keeps the still-valid certificate serving, and is retried every 6 hours.
- HTTP redirects to HTTPS, except for the validation path.
- Outside production the **staging** CA is used by default, whose certificates browsers do not trust. Production installs use the real one (`ACME_STAGING=false`).
- Private keys and the account key stay in the agent's own folder, readable only by root. The panel never sees them; it stores only the status and the expiry date.
- **Wildcard certificates** are not supported yet; they need DNS-01 validation.

## The panel's own domain

You can give the panel itself a domain (on the welcome page after installation, or later under **Domains → HTTPS**). The panel then gets its own certificate and is served on port 443 of that name. Until you do, it is served on the panel port (8443 by default) with a self-signed certificate, which is why your browser warns.

Give the panel a domain if you use [deploy on push](../apps/deploy-on-push.md) or the [GitHub connection](../apps/github.md), because the Git host has to reach it over HTTPS.

## The server's address

- **First it reads the server's own network connection.** Most servers (Hetzner, DigitalOcean, bare metal) carry their public address on their network interface, so nothing leaves the machine. Private ranges (10.x, 172.16-31.x, 192.168.x), Docker's and VPN addresses, and carrier-grade NAT addresses are ignored.
- **Only if there is no public address there** (a server behind a NAT, as on some clouds such as AWS or Oracle, where the provider's router owns the public address) it asks `api.ipify.org` once which address it connects from. This is the one place besides update checks and the S3 copy where the panel contacts the outside by itself. Set `COMMYPANEL_ADDRESS_LOOKUP=false` in `/etc/commypanel/env` to never do that and enter the address by hand.
- **If nothing can be found**, the page says so and shows the two fields to fill in. It does not try again for ten minutes.
- **Wrong address?** Everywhere the address is used (Domains → Server address, an app's Domains tab, the first-run page, a domain's page) there is a **Wrong IPs detected?** button that opens the two fields. What you enter is kept as yours and is never replaced by a detection; **Detect again** in the same form looks it up anew. Changing it is recorded in the audit log, with the address it replaced.

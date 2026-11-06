---
title: "Remote access to a database"
description: "Reach a database server from the internet for a limited time, from addresses you list, with TLS, for backups or tools on your own network."
---

# Remote access to a database

Database servers are private by default: only the apps you link to a database can reach it. **Remote access** opens a database server to the internet **on purpose, for a limited time**, so you can connect from your own network with a desktop tool, a backup job or a migration script. It is **closed unless you open it**, and it has a permission of its own (`databases.remote`).

Open it on the server's page, in the **Remote access** card.

## What you choose

- **Allowed IP addresses.** The real, public addresses the connection comes from, one per line: your office, or your VPN server. Ranges such as `198.51.100.0/24` work. There is no "everybody": nothing wider than /16 (IPv4) or /48 (IPv6) is accepted, private addresses are refused, and the list is never empty. Up to 20 entries.
- **How long.** 15 minutes, 30 minutes, 1 hour, 4 hours, 1 day or 7 days, or **never**. When the time is up the port is closed completely and every open connection is cut, **whether or not anyone is using it**. You can change the list or the time while it is open (the time then counts from that moment), and **Close now** ends it at once.
- **Never** leaves it open until you close it. Because that is unsafe, CommyPanel shows a warning in red and asks you to confirm you understand the risk, every time. Use it only for a fixed address you control, such as your own VPN server.

## How it works

- The port is a **random** one from `20000` to `29999`, never the database's usual port. Change the range with `COMMYPANEL_DB_REMOTE_PORTS` (for example `30000-39999`).
- The agent opens the port itself and checks the **source address** of every connection against your list. A connection from anywhere else is closed without a single byte in reply.
- **TLS is required.** The agent makes a certificate authority for the server and a certificate for its public addresses, and the database uses it. A client that does not ask for TLS is refused. The first time you open a server, it **restarts once** to switch TLS on (apps reconnect by themselves). Download the authority's certificate (**Certificate (ca.pem)**) and give it to your client, so it can check it is talking to your server.
- The panel shows the connection address and a ready command for your engine, for example:

```bash
# PostgreSQL
psql "host=203.0.113.9 port=23817 dbname=shop user=shop sslmode=verify-full sslrootcert=ca.pem"

# MySQL
mysql -h 203.0.113.9 -P 23817 -u shop -p --ssl-mode=VERIFY_IDENTITY --ssl-ca=ca.pem

# MariaDB
mariadb -h 203.0.113.9 -P 23817 -u shop -p --ssl --ssl-verify-server-cert --ssl-ca=ca.pem
```

Log in with the database's own user and password (shown from the database list after confirming your password).

## Things to know

- **Use the server's own address, not a proxied name.** Cloudflare's proxy (the orange cloud) does not carry database protocols; use the IP address, or a name with the proxy turned off. The certificate covers the server's public IP addresses and the panel's domain.
- **Open the port in your firewall** for the allowed addresses if the server has one (and at your hosting provider, if it filters ports). CommyPanel does not change firewall rules.
- If the agent restarts, every port is closed until the panel opens it again, within a minute. If the agent is down, nothing is open.
- Opening, changing, closing and a time running out are all in the **audit log**, in red for the dangerous ones, with who did it and the addresses.
- **Prefer a VPN or an SSH tunnel for anything permanent.** An address list is protection, but it is the only protection between the internet and a database login. Use long passwords (the ones CommyPanel makes are).
- Deleting a database server closes its port first.

## Limits

- One public port per server, at most 8 open at once.
- Only MariaDB, MySQL and PostgreSQL servers created in CommyPanel.
- The statistics, firewall and DNS are yours to manage; see [Known limitations](../known-limitations.md).

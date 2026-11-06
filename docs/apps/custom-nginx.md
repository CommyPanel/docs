---
title: "Custom nginx directives"
description: "Add your own upload limits, timeouts, headers, redirects and extra locations to an app's nginx site, safely."
---

# Custom nginx directives

The **Nginx** tab (permission "Edit nginx directives") lets you add your own nginx directives to an app's site: upload limits, timeouts, headers, redirects and extra locations. They are added to the site CommyPanel generates, so they stay when you deploy, change domains or renew the certificate.

- **Save and reload nginx** checks the text, lets nginx test the whole configuration and reloads it. If anything is refused, nothing is saved and the previous configuration keeps running. **Cancel** throws your edits away. Saving needs a recent password confirmation and is recorded in the audit log with the old and new text.
- If the app has no domain or no live release yet, there is no site to apply it to. Your text is saved and applied as soon as there is one.
- The tab shows the generated configuration, read only, so you can see exactly where your directives end up.

nginx runs as root, so the text is never written as typed. It is parsed, every directive and value is checked against a list, and the site is rendered from the result. Anything not on the list, such as `root`, `alias`, `include`, `access_log`, `ssl_*` or a `proxy_pass` to anywhere but this app, is refused with the line it is on.

Supported:

- Limits and timeouts: `client_max_body_size`, `client_body_buffer_size`, `client_header_buffer_size`, `large_client_header_buffers`, `client_body_timeout`, `client_header_timeout`, `send_timeout`, `keepalive_timeout`, `proxy_connect_timeout`, `proxy_read_timeout`, `proxy_send_timeout`, `proxy_buffering`, `proxy_request_buffering`, `proxy_buffer_size`, `proxy_buffers`, `proxy_busy_buffers_size`, `proxy_max_temp_file_size`, `proxy_intercept_errors`.
- Compression: `gzip`, `gzip_vary`, `gzip_min_length`, `gzip_comp_level`, `gzip_types`, `gzip_proxied`.
- Headers and errors: `add_header`, `expires`, `error_page`, `proxy_hide_header`, `charset`.
- Access: `allow`, `deny`, `set_real_ip_from`, `real_ip_header`, `real_ip_recursive`.
- Server behaviour: `server_tokens`, `merge_slashes`, `underscores_in_headers`, `ignore_invalid_headers`, `set`.
- `location` blocks. Inside them you can also use `return`, `rewrite`, `if`, `proxy_set_header`, `proxy_redirect` and `proxy_pass $commypanel_upstream`, which is the address of this app.

`return`, `rewrite` and `if` work only inside a location: at the top level they would run before nginx picks a location and would also catch the Let's Encrypt validation requests. The main `location /` is generated and cannot be redefined, and the Let's Encrypt location always wins over your own. A `proxy_set_header` inside a location replaces the generated ones (`Host`, `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`) for that location, so repeat the ones you need.

```nginx

---
title: "Contributing"
description: "Help improve CommyPanel and these docs: where to start, how to run it locally, and the terms of contribution."
---

# Contributing

CommyPanel is open source under the **MIT license**, and contributions of every size are welcome: bug reports, documentation, tests and code.

## Where to start

- **Try it and tell us what broke.** Real-server feedback is the most valuable thing right now. Open an [issue](https://github.com/CommyPanel/panel/issues/new/choose).
- **Improve these docs.** Every page has an **Edit this page** link at the bottom. The docs live in their own repository, [CommyPanel/docs](https://github.com/CommyPanel/docs).
- **Pick a starter task.** Issues labelled [`good first issue`](https://github.com/CommyPanel/panel/labels/good%20first%20issue) are small and say where to look.

## The full guide

The contributing guide in the panel repository covers how to run the project on your laptop (no Docker or server needed, the host is faked), the checks to run, what a good pull request looks like, the security-sensitive areas, and the **terms of contribution**:

- your contribution is licensed under the MIT license, and you keep your copyright;
- you sign off every commit (`git commit -s`) to certify the Developer Certificate of Origin;
- you agree to the code of conduct.

Read it at [CONTRIBUTING.md](https://github.com/CommyPanel/panel/blob/main/CONTRIBUTING.md), and the [Code of Conduct](https://github.com/CommyPanel/panel/blob/main/CODE_OF_CONDUCT.md).

## Working on these docs

The docs are built with [Docusaurus](https://docusaurus.io) and use the panel's own colors, fonts and themes.

```bash
git clone https://github.com/CommyPanel/docs.git
cd docs
npm install
npm start          # http://localhost:3000/docs/, reloads as you edit
npm run build      # a production build; broken links fail it
```

Pages are plain Markdown in `docs/`. Keep them for the person using the panel: say what to click, what happens, and what to watch out for. Do not document things that do not exist yet; put those under [Known limitations](known-limitations.md) instead.

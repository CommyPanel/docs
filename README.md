# CommyPanel docs

The documentation for [CommyPanel](https://github.com/CommyPanel/panel), a self-hosted server control panel for apps, domains and databases.

Built with [Docusaurus](https://docusaurus.io). The theme uses the panel's own colors, fonts and three themes (light, dim and dark), so the docs and the product look like one thing.

## Run it locally

You need Node.js 20 or newer.

```bash
npm install
npm start          # http://localhost:3000/docs/ , reloads as you edit
```

Build the site the way CI does (broken links fail the build):

```bash
npm run build
npm run serve      # serves the build
npm run typecheck
```

## Writing

- Pages are Markdown in `docs/`, in plain CommonMark (not MDX), so text like `<app>` in prose is fine. Admonitions (`:::tip`, `:::warning`) and Mermaid diagrams work.
- The sidebar is listed by hand in `sidebars.ts`. Add a page there when you add a file.
- Link to other pages with relative file paths (`../apps/volumes.md#anchor`), not URLs, so broken links are caught.
- Write for the person using the panel: what to click, what happens, what to watch out for. Do not document things that do not exist yet; list them under *Known limitations*.
- `docs/reference/permissions.md` is generated from the panel's permission list. Regenerate it when permissions change instead of editing it by hand.
- Release notes in `docs/releases/` are copied from the panel repository (`docs/releases/`).

## The theme

| File | What it does |
|---|---|
| `src/css/custom.css` | The panel's color tokens (same variable names as the panel), the three themes, and the mapping onto Docusaurus. Change colors here, never inline. |
| `prism-theme.ts` | Code highlighting, painted with those tokens |
| `src/theme/ColorModeToggle` | The theme menu: System, Light, Dim and Dark (dark is true black) |
| `src/pages/index.tsx` | The landing page |

The themes are: **light** (`data-theme="light"`), **dim** (`data-theme="dark"`) and **dark** (`data-theme="dark"` with `data-tone="black"`), matching the panel's `commy-light`, `commy-dim` and `commy-dark`.

## Publishing

Pushing to `main` builds the site and publishes it to GitHub Pages (enable it under Settings → Pages → Source: GitHub Actions). The site is served at `https://commypanel.github.io/docs/`. When the docs get a domain of their own, set `url` and `baseUrl` in `docusaurus.config.ts`.

## Contributing

Fixes and improvements are welcome. By contributing you agree that your work is released under the [MIT License](LICENSE) and that you follow the [Code of Conduct](https://github.com/CommyPanel/panel/blob/main/CODE_OF_CONDUCT.md). See the [contributing guide](https://github.com/CommyPanel/panel/blob/main/CONTRIBUTING.md) in the panel repository for the terms, including signing off your commits (`git commit -s`).

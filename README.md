# PTE MIK Info

A BookMD instance: configuration, course registry and content. The engine (`@atom-forge/bookmd`) owns the app, renderer and CLI.

```sh
bun install
bun run dev      # local dev server
bun run check
bun run build    # static site in build/
```

- `portal.config.ts` – title, content root, entry file, base path.
- `content/courses.md` – the course registry. The courses live in `laborci/books` (a private repository, read through the BookMD GitHub App) and are published with the author's approval (`publish: true`).
- Course authors can check a local folder at `/@dev` (local course preview) without running anything.

## Engine

The engine is the published [`@atom-forge/bookmd`](https://www.npmjs.com/package/@atom-forge/bookmd) package; its version is pinned by `bun.lock`. Upgrade it with `bun update @atom-forge/bookmd`, then run `bun run check` and `bun run build`.

Private course sources are read with the "PTE MIK BookMD reader" GitHub App (`BOOKMD_APP_ID`, `BOOKMD_APP_PRIVATE_KEY` Actions secrets); public sources need no credentials.

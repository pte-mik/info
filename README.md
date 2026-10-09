# PTE MIK Info

A BookMD instance: configuration, course registry and content. The engine (`@atom-forge/bookmd`) owns the app, renderer and CLI.

```sh
bun install
bun run dev      # local dev server
bun run check
bun run build    # static site in build/
```

- `portal.config.ts` – title, content root, entry file, base path.
- `content/courses.md` – course registry; `content/demo/` – a minimal demo course.
- Course authors can check a local folder at `/@dev` (local course preview) without running anything.

## Engine dependency (temporary)

The engine package is not published yet. `package.json` points at a sibling checkout of the engine repository (`../book-md/packages/bookmd`); clone it next to this repository before `bun install`. This will change to a versioned dependency once the package is released.

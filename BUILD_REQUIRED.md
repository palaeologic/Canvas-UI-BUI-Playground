# Build required locally

This archive intentionally does **not** include `dist/` or a stale `bun.lock`.

The source now depends on Base UI 1.9.0 (`@base-ui/react`). The execution environment used to prepare this archive does not have Bun and cannot reach the package registry from the shell, so it could not truthfully regenerate the Bun lockfile or production bundle.

From the project root on a machine with Bun installed:

```bash
bun install
bun test
bun run typecheck
bun run build
bun run dev
```

`bun install` will create a fresh `bun.lock` containing Base UI. `bun run build` will create a fresh `dist/` from the same source revision.

Do not copy a `dist/` or `bun.lock` from an older archive into this one.

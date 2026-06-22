## The bug

Not intentional — it's a routing structure mistake.

`src/routes/themes.tsx` is the parent of `src/routes/themes.$slug.tsx`, but it renders the themes index UI directly instead of an `<Outlet />`. When you navigate to `/themes/adversity`, the child route matches but has nowhere to render, so you keep seeing the index list.

The same issue exists for `philosophers.tsx` vs `philosophers.$slug.tsx` — worth fixing in the same pass so individual philosopher pages actually display.

## Fix

1. Rename `src/routes/themes.tsx` → `src/routes/themes.index.tsx` and update its `createFileRoute("/themes")` to `createFileRoute("/themes/")`.
2. Create a new tiny layout `src/routes/themes.tsx` that just renders `<Outlet />` under `createFileRoute("/themes")`.
3. Do the same for philosophers: rename `philosophers.tsx` → `philosophers.index.tsx`, add a new `philosophers.tsx` layout with `<Outlet />`.

No data or content changes — `themes.$slug.tsx` and `philosophers.$slug.tsx` already render correctly; they just need a parent that yields to them.

# url-shortener

A URL shortener: a Hono + `@hono/zod-openapi` API deployed to AWS Lambda (Node 24), and a React UI.

The OpenAPI spec (`apps/api/openapi.json`) is the contract between them. The UI generates its client from it.

## Layout

```
apps/
  api/   Hono API, Drizzle schema and migrations, openapi.json
  ui/    React client: Vite, React, TypeScript, TanStack Router (file-based routes in src/routes)
```

pnpm workspaces; Biome is configured once at the root.

## Architecture

- React based client
- API (Hono Zod Openapi) 
- Lambda & function URL
- Redis layer for re-direct lookup
- PostgresDB (Neon)

## Scripts

From the repo root:

| Command                 | What it does                                             |
| ----------------------- | -------------------------------------------------------- |
| `pnpm dev:api`          | Run the API on http://localhost:3000 with reload          |
| `pnpm dev:ui`           | Run the UI on http://localhost:5174 with Vite             |
| `pnpm typecheck`        | Type-check every app                                     |
| `pnpm build`            | Build every app                                          |
| `pnpm generate:openapi` | Write `apps/api/openapi.json` from the route definitions |
| `pnpm generate:api`     | Generate the UI's TanStack Query client with Orval       |
| `pnpm codegen`          | Both of the above, in order                              |
| `pnpm lint` / `lint:fix`| Biome check (and fix) across the repo                    |

From `apps/api` (`pnpm --filter @url-shortener/api <script>` from the root):

| Command            | What it does                                            |
| ------------------ | ------------------------------------------------------- |
| `pnpm package`     | Build and zip to `dist/function.zip` for Lambda upload  |
| `pnpm db:generate` | Generate a Drizzle migration from `src/db/schema.ts`    |
| `pnpm db:migrate`  | Apply migrations (reads `apps/api/.env.local`)          |
| `pnpm db:studio`   | Open Drizzle Studio                                     |

Run `pnpm codegen` after changing any route and commit the updated `openapi.json`. The UI client in `apps/ui/src/api/generated` is gitignored; it is regenerated on `pnpm install` and `build`.

In dev the UI calls `/api/*`, which Vite proxies to the API on port 3000. For production, set `VITE_API_URL` to the deployed API URL (see `apps/ui/.env.example`).

## Deploying by hand

1. `pnpm --filter @url-shortener/api package`
2. Create a Lambda function with the `nodejs24.x` runtime and handler `index.handler`.
3. Upload `apps/api/dist/function.zip`.
4. Optionally set `NODE_OPTIONS=--enable-source-maps` for readable stack traces.
5. Enable a Function URL (auth type `NONE`) and hit `/health`.

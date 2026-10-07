# url-shortener

A URL shortener: a Hono + `@hono/zod-openapi` API deployed to AWS Lambda (Node 24), and a React UI.

The OpenAPI spec (`apps/api/openapi.json`) is the contract between them. The UI generates its client from it.

## Layout

```
apps/
  api/   Hono API, Drizzle schema and migrations, openapi.json
  ui/    React client (generated API client lives here)
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
| `pnpm typecheck`        | Type-check every app                                     |
| `pnpm build`            | Build every app                                          |
| `pnpm generate:openapi` | Write `apps/api/openapi.json` from the route definitions |
| `pnpm lint` / `lint:fix`| Biome check (and fix) across the repo                    |

From `apps/api` (`pnpm --filter @url-shortener/api <script>` from the root):

| Command            | What it does                                            |
| ------------------ | ------------------------------------------------------- |
| `pnpm package`     | Build and zip to `dist/function.zip` for Lambda upload  |
| `pnpm db:generate` | Generate a Drizzle migration from `src/db/schema.ts`    |
| `pnpm db:migrate`  | Apply migrations (reads `apps/api/.env.local`)          |
| `pnpm db:studio`   | Open Drizzle Studio                                     |

Run `pnpm generate:openapi` after changing any route and commit the updated `openapi.json`.

## Deploying by hand

1. `pnpm --filter @url-shortener/api package`
2. Create a Lambda function with the `nodejs24.x` runtime and handler `index.handler`.
3. Upload `apps/api/dist/function.zip`.
4. Optionally set `NODE_OPTIONS=--enable-source-maps` for readable stack traces.
5. Enable a Function URL (auth type `NONE`) and hit `/health`.

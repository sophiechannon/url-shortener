# url-shortener-api

Hono + `@hono/zod-openapi` API for a URL shortener, deployed to AWS Lambda (Node 24).

The OpenAPI spec (`openapi.json`) is the contract with the frontend, which generates its client from it.

## Architecture

- React based client
- API (Hono Zod Openapi) 
- Lambda & function URL
- Redis layer for re-direct lookup
- PostgresDB (Neon)

## Scripts

| Command                 | What it does                                             |
| ----------------------- | -------------------------------------------------------- |
| `pnpm dev`              | Run locally on http://localhost:3000 with reload          |
| `pnpm typecheck`        | Type-check with `tsc`                                    |
| `pnpm generate:openapi` | Write `openapi.json` from the route definitions          |
| `pnpm build`            | Bundle `src/lambda.ts` to `dist/index.mjs` with esbuild  |
| `pnpm package`          | Build and zip to `dist/function.zip` for Lambda upload   |

Run `pnpm generate:openapi` after changing any route and commit the updated `openapi.json`.

## Deploying by hand

1. `pnpm package`
2. Create a Lambda function with the `nodejs24.x` runtime and handler `index.handler`.
3. Upload `dist/function.zip`.
4. Optionally set `NODE_OPTIONS=--enable-source-maps` for readable stack traces.
5. Enable a Function URL (auth type `NONE`) and hit `/health`.

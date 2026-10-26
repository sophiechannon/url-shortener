// VITE_API_URL is unset for local dev (`pnpm dev`): requests go to /api, which
// Vite proxies to the local API. Set it (e.g. `pnpm dev:lambda`, or for a
// production build) to call a deployed API directly.
const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export const apiBaseUrl = apiUrl ?? "/api";

// Short links redirect from the API root, so they live on the API's origin.
export const shortLinkBaseUrl = `${apiUrl ?? "http://localhost:3000"}/`;

// Every generated request goes through here (see orval.config.ts).
// In dev, VITE_API_URL is unset and requests go to /api, which Vite
// proxies to the local API. In production, set VITE_API_URL to the API's URL.
const baseUrl = import.meta.env.VITE_API_URL ?? "/api";

export class ApiError extends Error {
	readonly status: number;
	readonly data: unknown;

	constructor(status: number, data: unknown) {
		super(`Request failed with status ${status}`);
		this.status = status;
		this.data = data;
	}
}

export const customFetch = async <T>(
	url: string,
	options: RequestInit,
): Promise<T> => {
	const res = await fetch(`${baseUrl}${url}`, options);
	const body = [204, 205, 304].includes(res.status) ? "" : await res.text();
	const data = body ? JSON.parse(body) : undefined;

	// Throw on non-2xx so TanStack Query treats it as an error.
	if (!res.ok) throw new ApiError(res.status, data);

	return { data, status: res.status, headers: res.headers } as T;
};

// Orval uses these to type errors and request bodies in the generated hooks.
export type ErrorType<_Error> = ApiError;
export type BodyType<Body> = Body;

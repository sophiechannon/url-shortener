import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";
import { toast } from "@/components/ui/toast";
import { auth } from "./clerk";
import { db } from "./handlers";
import { server } from "./server";

beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
beforeEach(() => {
	db.reset();
	auth.signOut();
});
afterEach(() => {
	cleanup();
	server.resetHandlers();
	localStorage.clear();
	document.documentElement.className = "";
	// The toast manager is a module singleton, so clear it between tests.
	toast.close();
});
afterAll(() => server.close());

// Tests render signed out unless they call auth.signIn() (see ./clerk).
vi.mock("@clerk/react", () => import("./clerk"));

// jsdom doesn't implement these browser APIs.
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		addListener: vi.fn(),
		removeListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

class NoopObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
	takeRecords() {
		return [];
	}
}
globalThis.ResizeObserver ??= NoopObserver as never;
// Tests that need to trigger intersections use mockIntersectionObserver().
globalThis.IntersectionObserver ??= NoopObserver as never;
// Used by Base UI's scroll area.
Element.prototype.getAnimations ??= () => [];

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";
import { toast } from "@/components/ui/toast";
import { db } from "./handlers";
import { server } from "./server";

beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
beforeEach(() => db.reset());
afterEach(() => {
	cleanup();
	server.resetHandlers();
	localStorage.clear();
	document.documentElement.className = "";
	// The toast manager is a module singleton, so clear it between tests.
	toast.close();
});
afterAll(() => server.close());

// Clerk needs a real publishable key and network access, so tests render as a
// signed-out user with the auth controls stubbed.
vi.mock("@clerk/react", () => ({
	Show: ({ when, children }: { when: string; children: React.ReactNode }) =>
		when === "signed-out" ? children : null,
	SignInButton: ({ children }: { children: React.ReactNode }) => children,
	SignUpButton: ({ children }: { children: React.ReactNode }) => children,
	UserButton: () => null,
	getToken: async () => null,
}));

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

import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(import.meta.dirname, "./src"),
		},
	},
	test: {
		environment: "jsdom",
		setupFiles: ["./src/test/setup.ts"],
		// Node's fetch needs an absolute URL; MSW handlers are registered against this.
		env: { VITE_API_URL: "http://api.test" },
	},
});

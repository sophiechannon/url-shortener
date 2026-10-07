import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		// Must come before react() so route files are transformed first.
		tanstackRouter({ target: "react", autoCodeSplitting: true }),
		react(),
	],
});

import { defineConfig } from "orval";

export default defineConfig({
	api: {
		input: "../api/openapi.json",
		output: {
			target: "src/api/generated",
			mode: "tags-split",
			client: "react-query",
			httpClient: "fetch",
			namingConvention: "kebab-case",
			clean: true,
			override: {
				mutator: {
					path: "src/api/fetcher.ts",
					name: "customFetch",
				},
			},
		},
	},
});

import { z } from "zod";

const clientEnvSchema = z.object({
	VITE_API_URL: z.string().optional(),
	VITE_IS_SHORT: z.stringbool().default(false),
});

const raw = {
	VITE_API_URL: import.meta.env.VITE_API_URL,
	VITE_IS_SHORT: import.meta.env.VITE_IS_SHORT,
} as const;

const parsed = clientEnvSchema.safeParse(raw);
if (!parsed.success) {
	console.error("❌ Invalid client env:", z.treeifyError(parsed.error));
	throw new Error("Invalid client env");
}

export const env = parsed.data;
export type Env = typeof env;

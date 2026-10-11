// import { z } from "zod";

// const clientEnvSchema = z.object({
// 	VITE_API_URL: z.string(),
// });

// const raw = {
// 	VITE_API_URL: import.meta.env.VITE_API_URL,
// } as const;

// const parsed = clientEnvSchema.safeParse(raw);
// if (!parsed.success) {
// 	console.error("❌ Invalid client env:", z.treeifyError(parsed.error));
// 	throw new Error("Invalid client env");
// }

// export const env = parsed.data;
// export type Env = typeof env;

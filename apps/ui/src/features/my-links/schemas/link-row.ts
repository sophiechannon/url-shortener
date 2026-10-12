import { z } from "zod";

export const LinkRowSchema = z.object({
	shortUrl: z.url(),
	originalUrl: z.string(),
});

export type LinkRow = z.infer<typeof LinkRowSchema>;

import { z } from "zod";

export const LinkRowSchema = z.object({
	shortUrl: z.object({ display: z.url(), key: z.string() }),
	originalUrl: z.string(),
});

export type LinkRow = z.infer<typeof LinkRowSchema>;

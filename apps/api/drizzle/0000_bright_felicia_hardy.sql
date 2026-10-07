CREATE TABLE "links" (
	"short_url" text PRIMARY KEY NOT NULL,
	"original_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

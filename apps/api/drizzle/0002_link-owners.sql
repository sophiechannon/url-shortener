-- Links created before sign-in existed have no owner; start fresh.
DELETE FROM "links";--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "user_id" text;--> statement-breakpoint
CREATE INDEX "links_user_id_id_idx" ON "links" USING btree ("user_id","id");
ALTER TABLE "users" ADD COLUMN "working_hours_start" text DEFAULT '09:00';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "working_hours_end" text DEFAULT '17:00';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "work_days" json DEFAULT '[1,2,3,4,5]'::json;
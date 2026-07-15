CREATE TABLE "telegram_login_tokens" (
	"token" text PRIMARY KEY NOT NULL,
	"approved_user_id" text,
	"consumed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "telegram_username" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "knowledge_base" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "agent_instructions" text;--> statement-breakpoint
ALTER TABLE "telegram_login_tokens" ADD CONSTRAINT "telegram_login_tokens_approved_user_id_user_id_fk" FOREIGN KEY ("approved_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
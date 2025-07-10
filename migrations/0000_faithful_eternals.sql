CREATE TABLE "activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "analytics_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"period" text NOT NULL,
	"traffic" integer NOT NULL,
	"conversions" integer NOT NULL,
	"top_keywords" text,
	"top_pages" text,
	"traffic_sources" text,
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "client_configurations" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"openai_api_key" text,
	"google_analytics_id" text,
	"google_places_api_key" text,
	"twilio_account_sid" text,
	"twilio_auth_token" text,
	"facebook_access_token" text,
	"instagram_access_token" text,
	"twitter_api_key" text,
	"linkedin_access_token" text,
	"custom_branding" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"business_type" text NOT NULL,
	"address" text,
	"phone" text,
	"email" text,
	"website" text,
	"timezone" text DEFAULT 'America/New_York',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"service" text NOT NULL,
	"location" text NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_name" text NOT NULL,
	"rating" integer NOT NULL,
	"content" text NOT NULL,
	"platform" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"ai_response" text,
	"response_status" text DEFAULT 'draft',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "seo_keywords" (
	"id" serial PRIMARY KEY NOT NULL,
	"keyword" text NOT NULL,
	"position" integer,
	"previous_position" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "social_media_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"platform" text NOT NULL,
	"post_id" text,
	"impressions" integer DEFAULT 0,
	"engagement" integer DEFAULT 0,
	"clicks" integer DEFAULT 0,
	"shares" integer DEFAULT 0,
	"comments" integer DEFAULT 0,
	"likes" integer DEFAULT 0,
	"reach" integer DEFAULT 0,
	"date_recorded" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "social_media_configs" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"platform" text NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text,
	"expires_at" timestamp,
	"account_id" text,
	"account_name" text,
	"is_active" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "social_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"platform" text NOT NULL,
	"content" text NOT NULL,
	"status" text DEFAULT 'scheduled' NOT NULL,
	"scheduled_for" timestamp,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"progress" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wordpress_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	"meta_description" text,
	"categories" text,
	"tags" text,
	"featured_image" text,
	"seo_score" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "client_configurations" ADD CONSTRAINT "client_configurations_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_media_analytics" ADD CONSTRAINT "social_media_analytics_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_media_configs" ADD CONSTRAINT "social_media_configs_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;
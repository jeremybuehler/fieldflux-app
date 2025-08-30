-- Tenancy core tables
CREATE TABLE IF NOT EXISTS "tenants" (
  "id" serial PRIMARY KEY NOT NULL,
  "slug" text NOT NULL,
  "name" text NOT NULL,
  "primary_domain" text,
  "plan" text DEFAULT 'free',
  "stripe_customer_id" text,
  "created_at" timestamp DEFAULT now()
);
-- statement-breakpoint
CREATE TABLE IF NOT EXISTS "tenant_domains" (
  "id" serial PRIMARY KEY NOT NULL,
  "tenant_id" integer NOT NULL,
  "domain" text NOT NULL,
  "verified" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now()
);
-- statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "tenant_domains_domain_idx" ON "tenant_domains" ("domain");
-- statement-breakpoint
ALTER TABLE "tenant_domains" ADD CONSTRAINT "tenant_domains_tenant_id_tenants_id_fk"
  FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;

-- OAuth connections per tenant
CREATE TABLE IF NOT EXISTS "oauth_connections" (
  "id" serial PRIMARY KEY NOT NULL,
  "tenant_id" integer NOT NULL,
  "provider" text NOT NULL,
  "issuer_url" text,
  "client_id" text,
  "client_secret" text,
  "organization" text,
  "metadata" jsonb,
  "created_at" timestamp DEFAULT now()
);
-- statement-breakpoint
ALTER TABLE "oauth_connections" ADD CONSTRAINT "oauth_connections_tenant_id_tenants_id_fk"
  FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;

-- Add tenant_id to existing domain tables (nullable for gradual rollout)
ALTER TABLE IF EXISTS "wordpress_posts" ADD COLUMN IF NOT EXISTS "tenant_id" integer;
ALTER TABLE IF EXISTS "reviews" ADD COLUMN IF NOT EXISTS "tenant_id" integer;
ALTER TABLE IF EXISTS "analytics_reports" ADD COLUMN IF NOT EXISTS "tenant_id" integer;
ALTER TABLE IF EXISTS "social_posts" ADD COLUMN IF NOT EXISTS "tenant_id" integer;
ALTER TABLE IF EXISTS "leads" ADD COLUMN IF NOT EXISTS "tenant_id" integer;
ALTER TABLE IF EXISTS "tasks" ADD COLUMN IF NOT EXISTS "tenant_id" integer;
ALTER TABLE IF EXISTS "activities" ADD COLUMN IF NOT EXISTS "tenant_id" integer;
ALTER TABLE IF EXISTS "seo_keywords" ADD COLUMN IF NOT EXISTS "tenant_id" integer;
ALTER TABLE IF EXISTS "clients" ADD COLUMN IF NOT EXISTS "tenant_id" integer;
ALTER TABLE IF EXISTS "client_configurations" ADD COLUMN IF NOT EXISTS "tenant_id" integer;
ALTER TABLE IF EXISTS "social_media_configs" ADD COLUMN IF NOT EXISTS "tenant_id" integer;
ALTER TABLE IF EXISTS "social_media_analytics" ADD COLUMN IF NOT EXISTS "tenant_id" integer;

-- Foreign keys to tenants for new columns
ALTER TABLE IF EXISTS "wordpress_posts" ADD CONSTRAINT IF NOT EXISTS "wordpress_posts_tenant_id_tenants_id_fk"
  FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE IF EXISTS "reviews" ADD CONSTRAINT IF NOT EXISTS "reviews_tenant_id_tenants_id_fk"
  FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE IF EXISTS "analytics_reports" ADD CONSTRAINT IF NOT EXISTS "analytics_reports_tenant_id_tenants_id_fk"
  FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE IF EXISTS "social_posts" ADD CONSTRAINT IF NOT EXISTS "social_posts_tenant_id_tenants_id_fk"
  FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE IF EXISTS "leads" ADD CONSTRAINT IF NOT EXISTS "leads_tenant_id_tenants_id_fk"
  FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE IF EXISTS "tasks" ADD CONSTRAINT IF NOT EXISTS "tasks_tenant_id_tenants_id_fk"
  FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE IF EXISTS "activities" ADD CONSTRAINT IF NOT EXISTS "activities_tenant_id_tenants_id_fk"
  FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE IF EXISTS "seo_keywords" ADD CONSTRAINT IF NOT EXISTS "seo_keywords_tenant_id_tenants_id_fk"
  FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE IF EXISTS "clients" ADD CONSTRAINT IF NOT EXISTS "clients_tenant_id_tenants_id_fk"
  FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE IF EXISTS "client_configurations" ADD CONSTRAINT IF NOT EXISTS "client_configurations_tenant_id_tenants_id_fk"
  FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE IF EXISTS "social_media_configs" ADD CONSTRAINT IF NOT EXISTS "social_media_configs_tenant_id_tenants_id_fk"
  FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE IF EXISTS "social_media_analytics" ADD CONSTRAINT IF NOT EXISTS "social_media_analytics_tenant_id_tenants_id_fk"
  FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;


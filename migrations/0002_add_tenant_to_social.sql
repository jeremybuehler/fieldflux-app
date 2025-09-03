-- Add tenant scoping to social media tables
ALTER TABLE social_media_configs
  ADD COLUMN IF NOT EXISTS tenant_id integer REFERENCES tenants(id);

ALTER TABLE social_media_analytics
  ADD COLUMN IF NOT EXISTS tenant_id integer REFERENCES tenants(id);

-- Optional: backfill existing rows to a default tenant (NULL indicates global)
-- UPDATE social_media_configs SET tenant_id = 1 WHERE tenant_id IS NULL;
-- UPDATE social_media_analytics SET tenant_id = 1 WHERE tenant_id IS NULL;

-- Indexes for tenant scoping
CREATE INDEX IF NOT EXISTS idx_social_media_configs_tenant ON social_media_configs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_social_media_analytics_tenant ON social_media_analytics(tenant_id);

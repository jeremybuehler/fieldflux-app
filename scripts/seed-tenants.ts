import 'dotenv/config';
import { db } from '../server/db';
import { tenants, tenantDomains, oauthConnections, users, memberships } from '@shared/schema';

async function main() {
  const slug = process.env.SEED_TENANT_SLUG || 'demo';
  const name = process.env.SEED_TENANT_NAME || 'Demo Company';
  const domain = process.env.SEED_TENANT_DOMAIN || 'localhost';

  const [tenant] = await db
    .insert(tenants)
    .values({ slug, name, primaryDomain: domain })
    .onConflictDoNothing()
    .returning();

  const tenantId = tenant?.id;
  if (!tenantId) {
    console.log('Tenant may already exist, looking up...');
    const rows = await db.select({ id: tenants.id }).from(tenants);
    const found = rows.find((r) => r.id);
    if (!found) throw new Error('Failed to create or find tenant');
  }

  await db
    .insert(tenantDomains)
    .values({ tenantId: tenant?.id!, domain, verified: true })
    .onConflictDoNothing();

  // Seed an admin user + membership
  const adminId = process.env.SEED_ADMIN_USER_ID || (process.env.SEED_ADMIN_EMAIL || '').toLowerCase() || 'admin@example.com';
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  await db
    .insert(users)
    .values({ id: adminId, email: adminEmail, firstName: 'Admin', lastName: 'User' })
    .onConflictDoNothing();
  await db
    .insert(memberships)
    .values({ userId: adminId, tenantId: tenant?.id!, role: 'owner', status: 'active' })
    .onConflictDoNothing();

  if (process.env.OIDC_ISSUER_URL && process.env.OIDC_CLIENT_ID && process.env.OIDC_CLIENT_SECRET) {
    await db
      .insert(oauthConnections)
      .values({
        tenantId: tenant?.id!,
        provider: 'oidc',
        issuerUrl: process.env.OIDC_ISSUER_URL,
        clientId: process.env.OIDC_CLIENT_ID,
        clientSecret: process.env.OIDC_CLIENT_SECRET,
        organization: process.env.OIDC_ORGANIZATION,
      })
      .onConflictDoNothing();
  }

  console.log('Seed complete. Tenant:', slug, 'Domain:', domain);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

# Security

## Authentication

All endpoints require a valid Supabase JWT issued by:

```
https://avugtvhjgtlcilumrvmr.supabase.co/auth/v1
```

Tokens are RS256-signed and validated against the public JWKS endpoint. There are no API keys or session cookies — every request is stateless.

Public endpoints (no auth required):

- `GET /actuator/health`
- `GET /actuator/info`

## Authorization

`SupabaseJwtConverter` maps the JWT `role` claim to a Spring `GrantedAuthority`:

- `authenticated` → `ROLE_AUTHENTICATED`
- `service_role` → `ROLE_SERVICE_ROLE`

Tenant-level authorization is handled by `TenantFilter`, which enforces that a user can only operate within their own `empresa_id`.

## Multi-Tenant Data Isolation

Two independent layers protect tenant data:

### Layer 1 — Spring Application (TenantFilter)

`TenantFilter` runs before every controller. It:
1. Extracts `sub` (user UUID) from the Bearer JWT.
2. Queries `usuarios_empresa` to find the matching `empresa_id`.
3. Stores `empresa_id` in `TenantContext` (thread-local, cleared after response).
4. Repositories use `empresa_id` in all queries.

If no matching record exists in `usuarios_empresa`, access is denied.

### Layer 2 — PostgreSQL RLS

All 10 tables in `public` have RLS enabled. Policies use `get_user_empresa_id()` which reads `auth.uid()` from the current PostgreSQL session.

**Important:** The Spring Boot backend connects as the `postgres` superuser role, which bypasses RLS. RLS protection at the database layer is therefore effective only when clients connect via Supabase PostgREST (REST API) or the Supabase client libraries — not when the Java application runs raw JDBC queries.

**Consequence:** The application layer (TenantFilter + explicit `empresa_id` filters) is the primary security boundary for the Spring Boot API. RLS provides defense-in-depth for direct database or PostgREST access.

## Known Security Advisories (Supabase)

The following issues were identified by the Supabase security advisor on 2026-06-12:

### HIGH PRIORITY

| Issue | Detail | Remediation |
|---|---|---|
| PostgreSQL version outdated | Running 15.8.1.121; security patches available | Upgrade via Supabase Dashboard → Project Settings → Infrastructure |

### MEDIUM PRIORITY

| Issue | Detail | Remediation |
|---|---|---|
| `get_user_empresa_id()` callable by `anon` | The function is SECURITY DEFINER and exposed via PostgREST `/rest/v1/rpc/get_user_empresa_id` | Revoke EXECUTE from `anon` on this function |
| INSERT policies without `WITH CHECK` | All INSERT policies on operational tables lack `WITH CHECK (empresa_id = get_user_empresa_id())` | Add WITH CHECK clauses to prevent cross-tenant INSERT via PostgREST |

### LOW PRIORITY

| Issue | Detail |
|---|---|
| Tables visible in GraphQL schema | All tables are accessible to `authenticated` via pg_graphql; acceptable if GraphQL endpoint is not used by the frontend |
| Leaked password protection disabled | Enable in Supabase Dashboard → Authentication → Password Strength |
| Insufficient MFA options | Enable TOTP MFA in Supabase Dashboard → Authentication → MFA |

## Secrets Management

| Secret | Storage | Status |
|---|---|---|
| Supabase database password | Environment variable (`SUPABASE_DB_PASSWORD`) | ✅ Not committed |
| Production DB credentials | Environment variables (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`) | ✅ Injected by platform |
| Supabase anon key | Frontend only — not needed by backend | — |
| JWT signing key | Supabase-managed (JWKS) | ✅ Auto-rotated |

Previously, `application-dev.properties` contained a hardcoded Neon.tech password (`npg_GMtT3OjU7Cyn`). That credential has been superseded. The file is in `.gitignore` and is no longer committed. All credentials are now read from environment variables.

## CORS

Allowed origins are configured per environment:

- Dev: `http://localhost:5173`
- Prod: `${FRONTEND_URL}` (injected at deploy time)

Wildcard origins (`*`) are never used.

## Dependency Notes

- Spring Boot 3.4.0 — check for CVEs periodically
- PostgreSQL JDBC driver — bundled via Spring Boot BOM
- No known CVEs in current dependency set at time of writing (2026-06-12)

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

If no matching record exists in `usuarios_empresa`, access is denied with HTTP 403.

**All repository methods use compound queries (`findByIdAndEmpresaId`, `findAllByIdInAndEmpresaId`, etc.) — there is no unfiltered cross-entity query in the codebase.**

### Layer 2 — PostgreSQL RLS

All 10 tables in `public` have RLS enabled. Policies use `get_user_empresa_id()` which reads `auth.uid()` from the current PostgreSQL session.

**Important:** The Spring Boot backend connects as the `postgres` superuser role, which bypasses RLS. RLS protection at the database layer is therefore effective only when clients connect via Supabase PostgREST (REST API) or the Supabase client libraries — not when the Java application runs raw JDBC queries.

**Consequence:** The application layer (TenantFilter + explicit `empresa_id` filters) is the primary security boundary for the Spring Boot API. RLS provides defense-in-depth for direct database or PostgREST access.

## RLS Policy Status (verified 2026-06-13)

All INSERT and UPDATE policies include `WITH CHECK (empresa_id = get_user_empresa_id())`.

| Table | SELECT | INSERT (WITH CHECK) | UPDATE (WITH CHECK) | DELETE |
|---|---|---|---|---|
| empresas | ✅ | — | — | — |
| usuarios_empresa | ✅ | — | — | — |
| clientes | ✅ | ✅ | ✅ | ✅ |
| produtos | ✅ | ✅ | ✅ | ✅ |
| receitas | ✅ | ✅ | ✅ | ✅ |
| receitaIngredientes | ✅ | ✅ | ✅ | ✅ |
| insumos | ✅ | ✅ | ✅ | ✅ |
| ingredientes_insumo | ✅ | ✅ | ✅ | ✅ |
| pedidos | ✅ | ✅ | ✅ | ✅ |
| pedidoprodutos | ✅ | ✅ | ✅ | ✅ |

## Cross-Tenant Audit (2026-06-13)

A full audit of all services and repositories was performed. The following vulnerabilities were found and fixed:

### Fixed — HIGH: `OrderServiceImpl` — unfiltered product lookups

`productRepository.findAllById(ids)` was used in 5 locations without an `empresaId` filter:
- `create()`, `verificarMapeamento()`, `verificarEstoque()`, `darBaixaEstoque()`, `toResponse()`

A malicious user could reference product IDs belonging to another tenant, leaking prices and names, and potentially attaching foreign-tenant products to orders.

**Fix:** Added `ProductRepository.findAllByIdInAndEmpresaId(List<Long> ids, UUID empresaId)`. All 5 call sites updated.

### Fixed — MEDIUM: `RecipeServiceImpl` — unfiltered insumo name lookup

`insumoRepository.findAllByIdIn(ids)` used in `findById()` to resolve insumo names for display, without `empresaId` filter. An insumo name from another tenant could appear in a recipe detail response if data corruption led to a cross-tenant mapping.

**Fix:** Added `InsumoRepository.findAllByIdInAndEmpresaId(List<Long> ids, UUID empresaId)`. Old method `findAllByIdIn` removed (was unused after the fix).

### Fixed — MEDIUM: Supabase — `anon` could call `get_user_empresa_id()`

The function was exposed to the `anon` role via PostgREST (`/rest/v1/rpc/get_user_empresa_id`). Although calling it as `anon` returns NULL (since `auth.uid()` is null for unauthenticated requests), the exposure was unnecessary.

**Fix:** Migration `007_revoke_anon_execute_get_user_empresa_id` applied. Verified: `anon_can_execute = false`, `auth_can_execute = true`.

## Remaining Risks

| Risk | Severity | Notes |
|---|---|---|
| PostgreSQL 15.8.1.121 has security patches pending | HIGH | Upgrade via Supabase Dashboard → Settings → Infrastructure |
| Tables visible in GraphQL schema to `authenticated` | LOW | Acceptable if pg_graphql endpoint is not exposed to frontend; RLS still applies |
| Leaked password protection disabled | LOW | Enable in Supabase Dashboard → Auth → Password Strength |
| Insufficient MFA options | LOW | Enable TOTP in Supabase Dashboard → Auth → MFA |
| `RecipeIngredientRepository.findAllByRecipe_Id()` has no `empresaId` filter | LOW | Only called after the parent `Product` (now tenant-filtered) is verified; no direct route from user input |
| Backend connects as `postgres` (bypasses RLS) | Architecture | By design — application layer is primary boundary; see Layer 1 above |

## Secrets Management

| Secret | Storage | Status |
|---|---|---|
| Supabase database password | Environment variable (`SUPABASE_DB_PASSWORD`) | ✅ Not committed |
| Production DB credentials | Environment variables (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`) | ✅ Injected by platform |
| Supabase anon key | Frontend only — not needed by backend | — |
| JWT signing key | Supabase-managed (JWKS) | ✅ Auto-rotated |

Previously, `application-dev.properties` contained a hardcoded Neon.tech password. That credential is superseded. All credentials are now read from environment variables.

## CORS

Allowed origins are configured per environment:

- Dev: `http://localhost:5173`
- Prod: `${FRONTEND_URL}` (injected at deploy time)

Wildcard origins (`*`) are never used.

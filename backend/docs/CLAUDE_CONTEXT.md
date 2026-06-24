# Claude Context

This document is the authoritative entry point for AI agents working on this codebase. Read it before making any changes.

## Project Identity

- **Name:** SoftLanches Backend
- **Type:** Multi-tenant SaaS REST API
- **Domain:** Food-service ERP (clientes, produtos, receitas, insumos, pedidos)
- **Stack:** Spring Boot 3.4 / Java 21 / PostgreSQL 15 (Supabase)
- **Architecture:** See `docs/ARCHITECTURE.md`

## Supabase Project

| Field | Value |
|---|---|
| Project ID | `avugtvhjgtlcilumrvmr` |
| Project Name | mpizanii's Project |
| Region | sa-east-1 (São Paulo) |
| Status | ACTIVE_HEALTHY |
| URL | `https://avugtvhjgtlcilumrvmr.supabase.co` |
| DB Host | `db.avugtvhjgtlcilumrvmr.supabase.co:5432` |

This is the **official development environment**. Always query Supabase MCP to get the current schema state — do not rely on memory or outdated docs.

## Active Spring Profile

Default profile is `dev` (set in `application.properties`). The `application-dev.properties` file is in `.gitignore` — it is not in the repository. Developers must create it from `.env.example`.

## Key Constraints

- **Multi-tenancy is critical.** Every entity must carry `empresa_id`. Every repository query must filter by `empresa_id`. **Never use `findAllById` or `findById` from `JpaRepository` directly** — always use the `*AndEmpresaId` variants defined on each repository.
- **No DDL from Hibernate.** `ddl-auto` must be `validate` (dev) or `none`/`validate` (prod) — never `create`, `create-drop`, or `update`. Schema is owned by Supabase MCP.
- **RLS bypassed by backend.** The backend connects as `postgres` (bypasses RLS). The application layer is the primary security boundary.
- **No secrets in code.** Credentials must be environment variables. `application-dev.properties` and `.env` are gitignored.
- **Flyway baseline.** Schema already exists; Spring Flyway baselines at V1. New migrations start at V2.

## Repository Contract

All repositories must expose compound queries that include `empresaId`. The inherited `JpaRepository` methods (`findById`, `findAll`, `findAllById`) must not be called directly from service code. Prefer:

| Operation | Pattern |
|---|---|
| Fetch by ID | `findByIdAndEmpresaId(id, empresaId)` |
| Fetch all | `findAllByEmpresaId(empresaId)` |
| Fetch by IDs (batch) | `findAllByIdInAndEmpresaId(ids, empresaId)` |
| Delete by ID | First fetch with `findByIdAndEmpresaId`, then `repository.delete(entity)` |

## Security Audit Status (2026-06-13)

Full cross-tenant audit completed. All known vulnerabilities fixed:

| Vulnerability | Location | Status |
|---|---|---|
| `productRepository.findAllById()` without tenant filter | `OrderServiceImpl` (5 sites) | ✅ Fixed — `findAllByIdInAndEmpresaId` |
| `insumoRepository.findAllByIdIn()` without tenant filter | `RecipeServiceImpl` | ✅ Fixed — `findAllByIdInAndEmpresaId` |
| `get_user_empresa_id()` callable by `anon` | Supabase | ✅ Fixed — EXECUTE revoked from anon (migration 007) |
| RLS INSERT policies missing WITH CHECK | Supabase | ✅ Never missing — previous doc was wrong |

Remaining open risk: PostgreSQL 15.8.1.121 has pending security patches — upgrade recommended.

## File Map

```
src/main/resources/
├── application.properties          # Shared config (profile=dev, Flyway, JPA, Supabase JWT)
├── application-dev.properties      # Dev overrides — GITIGNORED, not in repo
├── application-prod.properties     # Prod overrides — GITIGNORED, uses env vars
└── db/migration/                   # Spring Flyway scripts (V2+)

docs/
├── ARCHITECTURE.md                 # Stack, modules, auth flow, multi-tenancy
├── DATABASE.md                     # Tables, columns, RLS, indexes, functions, migration history
├── ENVIRONMENTS.md                 # Dev/Prod environments, env vars, connection details
├── MIGRATION_STATUS.md             # Supabase + Flyway migration history and rules
├── SECURITY.md                     # Auth, tenant isolation, audit findings, remaining risks
└── CLAUDE_CONTEXT.md               # This file
```

## Domain Model Summary

```
empresas (tenant root)
  └── usuarios_empresa (user ↔ empresa, role: admin|operador|visualizador)
  └── clientes
  └── produtos
        └── receitas
              └── receitaIngredientes ← ingredientes_insumo → insumos
  └── pedidos
        └── pedidoprodutos → produtos
```

## What to Do When Making Changes

1. **Schema change** → Use Supabase MCP (`apply_migration`), not Hibernate DDL. Follow the 007+ naming convention for Supabase migrations, V2+ for Spring Flyway.
2. **New entity** → Must extend `TenantAwareEntity` or explicitly include `empresa_id`. Add compound repository methods. Add to `TenantContext` flow.
3. **New repository method** → Never expose an unfiltered version. All fetch methods must include `empresaId` in WHERE clause.
4. **New endpoint** → Must be secured in `SecurityConfig`. Verify tenant isolation in service layer — `TenantContext.getRequiredEmpresaId()` at the top of every service method.
5. **Env variable** → Add to `.env.example` (committed) but never to `.env` (gitignored).
6. **Documentation** → Update the relevant file in `docs/` in the same commit.

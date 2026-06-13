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

- **Multi-tenancy is critical.** Every entity must carry `empresa_id`. Every repository query must filter by `empresa_id`. Never return data without tenant isolation.
- **No DDL from Hibernate.** `ddl-auto` must be `validate` (dev) or `none`/`validate` (prod) — never `create`, `create-drop`, or `update`. Schema is owned by Supabase MCP.
- **RLS bypassed by backend.** The backend connects as `postgres` (bypasses RLS). The application layer is the primary security boundary.
- **No secrets in code.** Credentials must be environment variables. `application-dev.properties` and `.env` are gitignored.
- **Flyway baseline.** Schema already exists; Spring Flyway baselines at V1. New migrations start at V2.

## File Map

```
src/main/resources/
├── application.properties          # Shared config (profile=dev, Flyway, JPA, Supabase JWT)
├── application-dev.properties      # Dev overrides — GITIGNORED, not in repo
├── application-prod.properties     # Prod overrides — GITIGNORED, uses env vars
└── db/migration/                   # Spring Flyway scripts (V2+)

docs/
├── ARCHITECTURE.md                 # Stack, modules, auth flow, multi-tenancy
├── DATABASE.md                     # Tables, columns, RLS, indexes, functions
├── ENVIRONMENTS.md                 # Dev/Prod environments, env vars, connection details
├── MIGRATION_STATUS.md             # Supabase + Flyway migration history
├── SECURITY.md                     # Auth, tenant isolation, known advisories, secrets
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

## Security Advisories (open as of 2026-06-12)

1. PostgreSQL 15.8.1.121 has outstanding security patches — upgrade recommended.
2. `get_user_empresa_id()` is callable by `anon` — revoke EXECUTE from anon.
3. INSERT policies lack `WITH CHECK` — cross-tenant inserts are possible via PostgREST.

## What to Do When Making Changes

1. **Schema change** → Use Supabase MCP (`apply_migration`), not Hibernate DDL. Follow the 007+ naming convention.
2. **New entity** → Must extend `TenantAwareEntity` or explicitly include `empresa_id`. Add to `TenantContext` filter.
3. **New endpoint** → Must be secured in `SecurityConfig`. Verify tenant isolation in service layer.
4. **Env variable** → Add to `.env.example` (committed) but never to `.env` (gitignored).
5. **Documentation** → Update the relevant file in `docs/` in the same commit.

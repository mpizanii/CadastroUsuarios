# Architecture

## Overview

Scalda Backend is a multi-tenant SaaS REST API built with Spring Boot 3.4 / Java 21, backed by Supabase (PostgreSQL 15). It serves as the business logic layer for food-service companies managing customers, products, recipes, inventory, and orders.

## Stack

| Layer | Technology |
|---|---|
| Runtime | Java 21 |
| Framework | Spring Boot 3.4.0 |
| ORM | Spring Data JPA / Hibernate 6 |
| Database | PostgreSQL 15 (Supabase — `avugtvhjgtlcilumrvmr`, sa-east-1) |
| Connection Pool | HikariCP |
| Migrations | Flyway (baseline mode — schema managed by Supabase MCP) |
| Security | Spring Security + OAuth2 Resource Server (Supabase JWT / RS256 via JWKS) |
| Build | Maven 3 |
| Mapping | MapStruct 1.6.3 |

## Module Structure

```
com.scalda
├── customers        — Clientes (CRUD + tenant isolation)
├── products         — Produtos (catálogo + custo por receita)
├── recipes          — Receitas + RecipeIngredients
├── inventory        — Insumos (estoque)
├── orders           — Pedidos + PedidoProdutos (order items)
└── shared
    ├── config       — SecurityConfig, CorsConfig
    ├── security     — SupabaseJwtConverter, JwtDecoderConfig (JWKS)
    ├── tenant       — TenantContext, TenantFilter, TenantResolver
    │                   TenantRepository (usuarios_empresa)
    └── persistence  — TenantAwareEntity (base class with empresa_id)
```

## Authentication Flow

1. Frontend authenticates via Supabase Auth (email/password or OAuth).
2. Supabase issues a signed JWT (RS256).
3. Every API request carries `Authorization: Bearer <jwt>`.
4. Spring Security validates the JWT against the Supabase JWKS endpoint:
   `https://avugtvhjgtlcilumrvmr.supabase.co/auth/v1/.well-known/jwks.json`
5. `SupabaseJwtConverter` extracts the `role` claim and maps it to Spring `GrantedAuthority`.
6. `TenantFilter` extracts `sub` (user UUID) from the JWT, queries `usuarios_empresa` for the matching `empresa_id`, and stores it in `TenantContext` (thread-local).
7. All repository queries use the `empresa_id` from `TenantContext` for data isolation.

## Multi-Tenancy

Tenant isolation is implemented at two independent layers:

- **Database layer (RLS)**: PostgreSQL Row-Level Security policies on every table enforce `empresa_id = get_user_empresa_id()`. Even if the application layer is bypassed, data is protected.
- **Application layer (TenantFilter)**: The Spring filter populates `TenantContext` before any controller executes. Repositories append `AND empresa_id = ?` to every query.

The root tenant entity is `empresas`. Each `auth.users` record is linked to one or more `empresas` via `usuarios_empresa` (many-to-many with role).

## API Design

- REST over HTTP/1.1
- JSON request/response
- All endpoints require a valid Supabase JWT (`authenticated` role minimum)
- Base path: `/api/v1/...`
- Validation: Bean Validation 3 (jakarta.validation)
- Error handling: `GlobalExceptionHandler` returns RFC-7807-style problem responses

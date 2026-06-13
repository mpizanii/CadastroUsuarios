# Database

## Supabase Project

| Field | Value |
|---|---|
| Project Name | mpizanii's Project |
| Project ID | `avugtvhjgtlcilumrvmr` |
| Region | `sa-east-1` (São Paulo) |
| Status | `ACTIVE_HEALTHY` |
| PostgreSQL | 15.8.1.121 |
| Host (direct) | `db.avugtvhjgtlcilumrvmr.supabase.co` |
| API URL | `https://avugtvhjgtlcilumrvmr.supabase.co` |

## Schema: `public`

### `empresas` — Tenant root

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | `gen_random_uuid()` |
| `nome` | varchar | |
| `email` | varchar | UNIQUE |
| `plano` | varchar | CHECK: `basico \| profissional \| enterprise` |
| `ativo` | boolean | Soft-disable flag, default true |
| `created_at` | timestamptz | `now()` |

### `usuarios_empresa` — User ↔ Tenant binding

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | `gen_random_uuid()` |
| `empresa_id` | uuid FK→empresas | |
| `user_id` | uuid FK→auth.users | |
| `role` | varchar | CHECK: `admin \| operador \| visualizador` |
| `created_at` | timestamptz | `now()` |

Unique constraint: `(empresa_id, user_id)`.

### `clientes`

| Column | Type | Notes |
|---|---|---|
| `id` | bigint PK | IDENTITY BY DEFAULT |
| `empresa_id` | uuid FK→empresas | Tenant owner |
| `user_id` | uuid FK→auth.users | `auth.uid()` default |
| `nome` | varchar | CHECK: `trim(nome) length > 0` |
| `email` | varchar | nullable |
| `telefone` | varchar | nullable |
| `endereco` | varchar | nullable |
| `created_at` | timestamptz | `now()` |

### `produtos`

| Column | Type | Notes |
|---|---|---|
| `id` | bigint PK | IDENTITY |
| `empresa_id` | uuid FK→empresas | |
| `nome` | varchar | NOT NULL |
| `preco` | numeric | nullable |
| `custo` | numeric | nullable |
| `receita_id` | bigint FK→receitas | nullable |
| `ativo` | boolean | nullable |
| `created_at` | timestamptz | `now()` |

### `receitas`

| Column | Type | Notes |
|---|---|---|
| `id` | bigint PK | IDENTITY |
| `empresa_id` | uuid FK→empresas | |
| `nome` | varchar | `''` default |
| `modo_preparo` | text | `''` default |
| `created_at` | timestamptz | `now()` |

### `receitaIngredientes` ⚠️ camelCase table name (requires quoting)

| Column | Type | Notes |
|---|---|---|
| `id` | bigint PK | IDENTITY |
| `empresa_id` | uuid FK→empresas | |
| `receita_id` | bigint FK→receitas | nullable |
| `nome` | varchar | NOT NULL |
| `quantidade` | numeric | NOT NULL |
| `unidade` | text | NOT NULL |

> The Java entity uses `` @Table(name = "`receitaIngredientes`") `` — backticks are translated to double quotes by Hibernate for PostgreSQL.

### `insumos`

| Column | Type | Notes |
|---|---|---|
| `id` | bigint PK | IDENTITY |
| `empresa_id` | uuid FK→empresas | |
| `nome` | varchar | `''` default |
| `quantidade` | numeric | NOT NULL |
| `unidade` | varchar | `''` default |
| `validade` | date | nullable |
| `estoque_minimo` | numeric | nullable |
| `status` | varchar | nullable |
| `created_at` | timestamp | nullable, `now()` |

### `ingredientes_insumo` — Recipe ingredient ↔ Inventory mapping

| Column | Type | Notes |
|---|---|---|
| `id` | bigint PK | IDENTITY |
| `empresa_id` | uuid FK→empresas | |
| `ingrediente_id` | bigint FK→receitaIngredientes | NOT NULL |
| `insumo_id` | bigint FK→insumos | NOT NULL |
| `fator_conversao` | numeric | default `1` |

### `pedidos`

| Column | Type | Notes |
|---|---|---|
| `id` | bigint PK | IDENTITY |
| `empresa_id` | uuid FK→empresas | |
| `cliente_id` | bigint FK→clientes | NOT NULL |
| `data` | timestamptz | `now()` |
| `valor` | numeric | NOT NULL |
| `status` | varchar | nullable |
| `observacoes` | text | nullable |

### `pedidoprodutos` — Order line items

| Column | Type | Notes |
|---|---|---|
| `id` | bigint PK | IDENTITY |
| `empresa_id` | uuid FK→empresas | |
| `pedido_id` | bigint FK→pedidos | nullable |
| `produto_id` | bigint FK→produtos | nullable |
| `quantidade` | smallint | nullable |

## Functions

### `public.get_user_empresa_id() → uuid`

```sql
SELECT empresa_id
FROM public.usuarios_empresa
WHERE user_id = (SELECT auth.uid())
LIMIT 1;
```

- Language: SQL, STABLE, SECURITY DEFINER
- Used by all RLS policies to determine the current user's tenant
- ⚠️ Advisory: callable by `anon` role — consider revoking (see SECURITY.md)

## Row-Level Security (RLS)

RLS is enabled on all 10 tables. All policies use `get_user_empresa_id()` as the filter.

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| empresas | `id = get_user_empresa_id()` | — | — | — |
| usuarios_empresa | `empresa_id = get_user_empresa_id()` | — | — | — |
| clientes | ✅ | ✅ (no check) | ✅ | ✅ |
| produtos | ✅ | ✅ (no check) | ✅ | ✅ |
| receitas | ✅ | ✅ (no check) | ✅ | ✅ |
| receitaIngredientes | ✅ | ✅ (no check) | ✅ | ✅ |
| insumos | ✅ | ✅ (no check) | ✅ | ✅ |
| ingredientes_insumo | ✅ | ✅ (no check) | ✅ | ✅ |
| pedidos | ✅ | ✅ (no check) | ✅ | ✅ |
| pedidoprodutos | ✅ | ✅ (no check) | ✅ | ✅ |

> ⚠️ INSERT policies lack `WITH CHECK` clauses — a user could insert records with a foreign `empresa_id`. The application layer must enforce tenant isolation on INSERT. See SECURITY.md.

## Indexes

Key indexes beyond primary keys:

- `idx_*_empresa_id` — on every table (RLS performance)
- `idx_pedidos_data_desc` — descending date for pagination
- `idx_pedidos_status` — filter by status
- `idx_insumos_validade WHERE validade IS NOT NULL` — partial index for expiry queries
- `idx_produtos_ativo WHERE ativo = true` — partial index for active products
- `usuarios_empresa_empresa_id_user_id_key` — unique composite

## Installed Extensions

| Extension | Version | Purpose |
|---|---|---|
| `plpgsql` | 1.0 | Procedural language |
| `pg_graphql` | 1.5.11 | GraphQL API (Supabase built-in) |
| `pg_stat_statements` | 1.10 | Query statistics |
| `pgjwt` | 0.2.0 | JWT functions |
| `uuid-ossp` | 1.1 | UUID generation |
| `pgcrypto` | 1.3 | Cryptographic functions |
| `supabase_vault` | 0.3.1 | Secret management |

## Flyway Migrations (Supabase)

Applied via Supabase MCP (tracked in `supabase_migrations.schema_migrations`):

| Version | Name |
|---|---|
| 20260610144241 | 001_create_empresas_usuarios_empresa |
| 20260610144256 | 002_add_empresa_id_to_all_tables |
| 20260610144313 | 003_create_indexes |
| 20260610144328 | 004_create_helper_function |
| 20260610144354 | 005_rls_policies |
| 20260610144411 | 006_revoke_anon_access |

Spring Boot Flyway (`flyway_schema_history`) is configured with `baseline-on-migrate=true` at version `1`, so it treats the existing Supabase schema as baseline and only manages migrations placed in `src/main/resources/db/migration/`. Future Spring-managed migrations must start at `V2__`.

# Migration Status

## Schema Ownership

The database schema is managed by **Supabase MCP** (applied directly to the Supabase project). Spring Boot Flyway is configured in **baseline mode** — it does not recreate the existing schema, only manages future application-level migrations.

## Supabase-Managed Migrations

Applied to project `avugtvhjgtlcilumrvmr` via Supabase MCP. Tracked in `supabase_migrations.schema_migrations`.

| Version | Name | Applied |
|---|---|---|
| 20260610144241 | 001_create_empresas_usuarios_empresa | ✅ 2026-06-10 |
| 20260610144256 | 002_add_empresa_id_to_all_tables | ✅ 2026-06-10 |
| 20260610144313 | 003_create_indexes | ✅ 2026-06-10 |
| 20260610144328 | 004_create_helper_function | ✅ 2026-06-10 |
| 20260610144354 | 005_rls_policies | ✅ 2026-06-10 |
| 20260610144411 | 006_revoke_anon_access | ✅ 2026-06-10 |

## Spring Boot Flyway Migrations

Files located in `src/main/resources/db/migration/`.

| Version | Name | Status |
|---|---|---|
| V1 (baseline) | Schema pre-existente gerenciado pelo Supabase MCP | Baseline — no file |

No application-managed migrations yet. The next Spring migration must be `V2__<description>.sql`.

## Flyway Configuration

```properties
spring.flyway.baseline-on-migrate=true
spring.flyway.baseline-version=1
spring.flyway.baseline-description=Schema pre-existente gerenciado pelo Supabase MCP
spring.flyway.locations=classpath:db/migration
spring.flyway.enabled=true
```

`baseline-on-migrate=true` means: if `flyway_schema_history` does not exist in the database, Flyway creates it and marks everything up to version 1 as baseline before applying any new scripts. This is correct for a database whose schema was not created by Flyway.

## Rules for Future Migrations

1. Supabase schema changes (RLS, functions, policies, extensions) → apply via Supabase MCP or Supabase CLI, numbered `007_*` and above.
2. Application data model changes (new tables, column additions for Java entities) → create `V2__<name>.sql` in `src/main/resources/db/migration/`.
3. Never modify an already-applied migration file — create a new one.
4. Test migrations locally with a Supabase branch before applying to the main project.

## Known Entity/Schema Notes

- `receitaIngredientes` uses a camelCase table name (PostgreSQL requires quoting). The Java entity uses `` @Table(name = "`receitaIngredientes`") `` which Hibernate translates to double quotes. Verify this works correctly with `ddl-auto=validate`.
- `clientes` primary key index is named `users_pkey` (naming anomaly — does not affect functionality).
- `insumos.created_at` is `timestamp without time zone` while other tables use `timestamptz`. This is inconsistent but not breaking.

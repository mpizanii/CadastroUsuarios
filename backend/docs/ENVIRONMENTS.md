# Environments

## Defined Environments

| Profile | Spring Profile | Purpose |
|---|---|---|
| Development | `dev` (default) | Local development against Supabase dev project |
| Production | `prod` | Deployed backend (Railway / Render / Fly.io) |

There is no staging environment at this time.

---

## Development Environment

### Database

| Field | Value |
|---|---|
| Provider | Supabase |
| Project | mpizanii's Project |
| Project ID | `avugtvhjgtlcilumrvmr` |
| Region | `sa-east-1` (São Paulo) |
| Engine | PostgreSQL 15.8.1.121 |
| Host | `db.avugtvhjgtlcilumrvmr.supabase.co` |
| Port | 5432 (direct connection — recommended for HikariCP) |
| Database | `postgres` |

### Activation

```bash
# The default profile is dev (set in application.properties)
./mvnw spring-boot:run

# Or explicitly:
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Required Environment Variables

Set these in your shell, IDE run configuration, or a local `.env` file.

| Variable | Description |
|---|---|
| `SUPABASE_DB_URL` | JDBC URL — `jdbc:postgresql://db.avugtvhjgtlcilumrvmr.supabase.co:5432/postgres?sslmode=require` |
| `SUPABASE_DB_USERNAME` | Database user (default: `postgres`) |
| `SUPABASE_DB_PASSWORD` | Database password (Supabase Dashboard → Project Settings → Database) |

> Copy `.env.example` to `.env` and fill in the values.
> The `.env` file is listed in `.gitignore` and must never be committed.

### IntelliJ IDEA Setup

1. Open **Run/Debug Configurations** for the Spring Boot application.
2. Under **Environment variables**, add the three `SUPABASE_DB_*` variables.
3. Alternatively, use the EnvFile plugin with the local `.env` file.

---

## Production Environment

### Database

The production database is also Supabase. The project ID and credentials are injected via the hosting platform's environment variables.

### Required Environment Variables

| Variable | Description |
|---|---|
| `DB_URL` | JDBC URL to the production Supabase PostgreSQL |
| `DB_USERNAME` | Database user |
| `DB_PASSWORD` | Database password |
| `FRONTEND_URL` | Allowed CORS origin for the production frontend |

### Activation

```bash
SPRING_PROFILES_ACTIVE=prod java -jar backend.jar
```

---

## Supabase Auth

Both environments share the same Supabase Auth configuration. The JWT validation endpoint is resolved automatically from `supabase.project-id` in `application.properties`:

```
JWKS URI:   https://avugtvhjgtlcilumrvmr.supabase.co/auth/v1/.well-known/jwks.json
Issuer URI: https://avugtvhjgtlcilumrvmr.supabase.co/auth/v1
```

No additional environment variable is needed for JWT validation — the project ID is already committed in `application.properties`.

---

## Multi-Tenant Strategy

All environments use the same tenant isolation strategy:

1. **Database layer** — PostgreSQL RLS policies on every table filter by `empresa_id` using `get_user_empresa_id()` (reads `auth.uid()` from the JWT session).
2. **Application layer** — `TenantFilter` extracts `sub` from the Bearer JWT, resolves `empresa_id` from `usuarios_empresa`, and stores it in `TenantContext` (thread-local).

The Spring Boot backend connects to PostgreSQL as the `postgres` role, which bypasses RLS by default. The application layer must always explicitly apply `empresa_id` filters to prevent cross-tenant data leaks. See SECURITY.md.

---

## Connection Pool Settings

| Setting | Dev | Prod |
|---|---|---|
| `maximum-pool-size` | 5 | 10 |
| `minimum-idle` | 2 | 3 |
| `connection-timeout` | 30 000 ms | 30 000 ms |
| `keepalive-time` | 60 000 ms | — |

Supabase free tier supports ~60 direct connections. Keep pool sizes conservative.

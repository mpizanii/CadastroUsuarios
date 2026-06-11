# SECURITY.md — Segurança SoftLanches

## Visão Geral

O backend Java implementa segurança stateless via **JWT Bearer Token** emitido pelo **Supabase Auth**.
A autenticação ocorre 100% no cliente (React + Supabase JS) e no Supabase Auth Service.
O backend apenas **valida** o token — não emite, não armazena sessões.

---

## Fluxo de Autenticação

```
1. Usuário faz login no Frontend via Supabase JS SDK
2. Supabase Auth verifica credenciais e emite JWT (RS256, assinado com chave privada Supabase)
3. Frontend armazena o JWT (localStorage via Supabase SDK)
4. Em cada request: Frontend envia Authorization: Bearer <jwt>
5. Backend valida JWT via JWKS público do Supabase
6. Backend extrai sub (user UUID) e role do token
7. TenantFilter resolve empresa_id via usuarios_empresa
8. Request prossegue com contexto de tenant preenchido
```

---

## Spring Security

### Configuração (`SecurityConfig.java`)

```java
@EnableWebSecurity
@EnableMethodSecurity  // Habilita @PreAuthorize, @Secured
public class SecurityConfig {
    // Stateless: sem sessão HTTP
    .sessionManagement(STATELESS)
    
    // Endpoints públicos
    .permitAll: /actuator/health, /actuator/info
    
    // Tudo mais exige autenticação
    .anyRequest().authenticated()
    
    // OAuth2 Resource Server com JWT converter customizado
    .oauth2ResourceServer(jwt → jwtConverter)
    
    // TenantFilter executa APÓS a autenticação JWT
    .addFilterAfter(tenantFilter, BearerTokenAuthenticationFilter.class)
}
```

### Ordem dos Filtros (crítica)
```
1. CorsFilter              ← CORS headers
2. BearerTokenAuthFilter   ← Valida JWT, popula SecurityContext
3. TenantFilter            ← Lê SecurityContext, resolve empresa_id
4. Controller              ← Request processada com tenant definido
```

O `TenantFilter` é registrado **após** o `BearerTokenAuthenticationFilter`, garantindo que o JWT
já está validado quando o tenant é resolvido.

---

## JWT Supabase — Detalhes Técnicos

### Algoritmo
- **RS256** (RSA com SHA-256)
- Chave pública disponível em JWKS:
  `https://avugtvhjgtlcilumrvmr.supabase.co/auth/v1/.well-known/jwks.json`

### Claims relevantes
| Claim | Conteúdo | Uso no backend |
|---|---|---|
| `sub` | UUID do usuário Supabase | Lookup de empresa_id em usuarios_empresa |
| `role` | "authenticated" ou "anon" | Convertido para ROLE_AUTHENTICATED |
| `iss` | `https://...supabase.co/auth/v1` | Validado pelo JwtIssuerValidator |
| `exp` | Timestamp de expiração | Validado pelo JwtTimestampValidator |
| `aud` | "authenticated" (string, não array) | **NÃO validado** (razão abaixo) |

### Por que `audience` não é validado?
O Supabase emite `aud: "authenticated"` como string simples. O Spring Security espera `aud` como
lista/array (padrão OAuth2 RFC). Validar o audience causaria rejeição de todos os tokens válidos.
**Decisão:** validar apenas `issuer` + `timestamp`. Isso é seguro pois o issuer é específico do
projeto Supabase.

### `JwtDecoderConfig.java`
```java
NimbusJwtDecoder decoder = NimbusJwtDecoder.withJwkSetUri(jwksUri).build();
decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
    new JwtTimestampValidator(),  // valida exp
    new JwtIssuerValidator(issuerUri)  // valida iss
));
```

### `SupabaseJwtConverter.java`
```java
// Extrai ROLE_<ROLE> das claims do token
// Principal name = sub (UUID do usuário)
return new JwtAuthenticationToken(jwt, authorities, jwt.getSubject());
```

---

## Tenant Isolation (Segurança de Dados)

### Mecanismo

**TenantContext** usa `ThreadLocal<UUID>` para armazenar o `empresa_id` durante o ciclo de vida
de uma request. É a proteção central de isolamento.

```java
// TenantFilter — executado a cada request autenticada
String userId = jwtAuth.getToken().getSubject();
UUID empresaId = tenantResolver.resolveEmpresaId(userId);  // 1 query DB
TenantContext.setEmpresaId(empresaId);

// ... processamento da request ...

TenantContext.clear();  // sempre no finally
```

**TenantContext.getRequiredEmpresaId()** lança `TenantAccessDeniedException` (403) se o contexto
não estiver inicializado — proteção contra chamada fora de request autenticada.

### Nível de Garantia

| Camada | Mecanismo | Responsável |
|---|---|---|
| 1ª linha | TenantContext + filtro por empresa_id nas queries | Backend Java |
| 2ª linha | RLS (Row Level Security) | Supabase PostgreSQL |
| 3ª linha | Conexão com DB como owner | Supabase/Neon config |

O backend Java garante isolamento por aplicação. O RLS do Supabase é uma camada adicional de
defesa em profundidade — se a aplicação tiver um bug, o banco ainda bloqueia.

---

## CORS

Configurado em `CorsConfig.java`:

```java
config.setAllowedOrigins(List.of(allowedOrigins.split(",")));
config.setAllowedMethods(["GET","POST","PUT","PATCH","DELETE","OPTIONS"]);
config.setAllowedHeaders(["Authorization","Content-Type","Accept"]);
config.setAllowCredentials(true);
config.setMaxAge(3600);
```

- **Dev:** `cors.allowed-origins=http://localhost:5173`
- **Prod:** `cors.allowed-origins=${FRONTEND_URL}` (variável de ambiente)

---

## Roles e Autorização

### Roles Supabase (usuarios_empresa)
| Role | Descrição |
|---|---|
| `admin` | Acesso total à empresa |
| `operador` | Operações do dia a dia |
| `visualizador` | Somente leitura |

### Status Atual
- `@EnableMethodSecurity` está habilitado, mas **nenhum `@PreAuthorize` ou `@Secured` foi implementado** nos controllers/services ainda.
- Todos os usuários autenticados com `empresa_id` válido têm acesso igual a todos os endpoints.
- **Próxima evolução:** implementar `@PreAuthorize("hasRole('ADMIN')")` para operações destrutivas.

### Autorização Futura Recomendada
```java
@DeleteMapping("/{id}")
@PreAuthorize("hasAnyRole('ADMIN', 'OPERADOR')")
public ResponseEntity<Void> delete(@PathVariable Long id) { ... }

@GetMapping
@PreAuthorize("isAuthenticated()")  // qualquer role
public ResponseEntity<List<...>> findAll() { ... }
```

---

## Tratamento de Erros de Segurança

| Situação | HTTP | Response |
|---|---|---|
| JWT ausente/inválido | 401 | Spring Security padrão |
| JWT expirado | 401 | Spring Security padrão |
| Usuário sem empresa | 403 | `{"status":403,"message":"Usuário não associado a nenhuma empresa"}` (TenantFilter) |
| Acesso negado (tenant) | 403 | `{"status":403,"message":"Acesso negado"}` (GlobalExceptionHandler) |

---

## Credenciais e Secrets

| Variável | Ambiente | Descrição |
|---|---|---|
| `DB_URL` | Prod (env var) | JDBC URL do Supabase PostgreSQL |
| `DB_USERNAME` | Prod (env var) | Usuário do banco |
| `DB_PASSWORD` | Prod (env var) | Senha do banco |
| `FRONTEND_URL` | Prod (env var) | URL do frontend para CORS |
| `spring.datasource.*` | Dev (`application-dev.properties`) | Neon.tech — **não commitar** |

O arquivo `application-dev.properties` está no `.gitignore` e **nunca deve ser commitado**.
Contém credenciais reais do banco de desenvolvimento.

---

## Superfície de Ataque e Mitigações

| Risco | Mitigação |
|---|---|
| Token forjado | RS256 com JWKS público Supabase — impossível sem chave privada |
| Cross-tenant data access | TenantContext obrigatório em todas as queries |
| SQL Injection | JPA Parameterized queries — não há SQL concatenado |
| CORS bypass | Allowlist explícita de origins |
| Session fixation | Stateless — sem sessão HTTP |
| Brute force | Gerenciado pelo Supabase Auth (rate limiting) |
| Secrets em código | `application-dev.properties` no gitignore |

---

## Estratégias Futuras

1. **Autorização granular por role:** Implementar `@PreAuthorize` nos endpoints conforme necessidade
2. **Planos de acesso:** Restringir features por `empresa.plano` (basico/profissional/enterprise)
3. **Audit log:** Registrar operações críticas (delete, criar pedido) com user_id + empresa_id + timestamp
4. **Rate limiting:** Proteger endpoints de escrita com Spring Security Rate Limiter ou API Gateway
5. **Webhook validation:** Se Supabase enviar webhooks, validar HMAC da assinatura

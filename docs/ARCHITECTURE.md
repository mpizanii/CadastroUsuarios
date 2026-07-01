# ARCHITECTURE.md — Scalda Backend

## Visão Geral do Sistema

**Scalda** é um ERP SaaS para empresas do setor alimentício (lanchonetes, restaurantes, padarias, etc.).
O sistema permite que múltiplas empresas se cadastrem na plataforma e gerenciem de forma isolada:
clientes, produtos, receitas, insumos de estoque e pedidos.

O produto está em **migração ativa** de ASP.NET Core 8 (C#) para Spring Boot 3.4 (Java 21).

---

## Objetivo do Produto

- Gerenciar o cadastro de clientes de cada empresa
- Cadastrar produtos com preço, custo e receita associada
- Descrever receitas com ingredientes e modo de preparo
- Controlar estoque de insumos com alertas automáticos
- Registrar pedidos com baixa automática no estoque
- Mapear ingredientes de receitas para insumos do estoque

---

## Stack de Tecnologias

### Backend (novo — Java)
| Componente | Tecnologia |
|---|---|
| Framework | Spring Boot 3.4.0 |
| Linguagem | Java 21 |
| Build | Maven 3.9.14 |
| JPA/ORM | Spring Data JPA + Hibernate |
| Segurança | Spring Security + OAuth2 Resource Server |
| Auth | Supabase JWT (RS256, JWKS endpoint) |
| Banco (dev) | Neon.tech PostgreSQL |
| Banco (prod) | Supabase PostgreSQL |
| Migrações | Flyway (baseline-on-migrate) |
| Mapeamento | MapStruct 1.6.3 |
| Boilerplate | Lombok 1.18.36 |
| Validação | Jakarta Validation (Bean Validation 3) |
| Monitoramento | Spring Actuator |

### Backend (legado — C#, a ser removido)
| Componente | Tecnologia |
|---|---|
| Framework | ASP.NET Core 8 |
| ORM | Entity Framework Core + Npgsql |
| Auth | Nenhuma (sem autenticação real) |
| Multi-tenant | Nenhum (user_id via body/query) |

### Frontend
| Componente | Tecnologia |
|---|---|
| Framework | React 19 |
| Bundler | Vite 6 |
| UI | Bootstrap 5.3 + React-Bootstrap |
| HTTP | Axios |
| Estado servidor | TanStack Query (React Query v5) |
| Auth client | Supabase JS SDK |
| Roteamento | React Router DOM v7 |

### Infraestrutura
| Componente | Tecnologia |
|---|---|
| Auth Provider | Supabase Auth (Supabase project: avugtvhjgtlcilumrvmr) |
| Banco prod | Supabase PostgreSQL |
| Banco dev | Neon.tech (EP: ep-spring-thunder-a8lzkn3t-pooler) |
| CI/CD | GitHub (branch `dev` → PR → `main`) |
| Deploy backend | Railway / Render / Fly.io (variáveis de ambiente) |

---

## Estrutura Modular (Java)

O backend Java é organizado por módulo de domínio. Cada módulo é um pacote autossuficiente com sua própria camada controller → service → repository → model.

```
com.scalda/
├── ScaldaApplication.java
│
├── shared/                          ← Infraestrutura transversal
│   ├── config/
│   │   ├── SecurityConfig.java      ← Spring Security + JWT + TenantFilter
│   │   └── CorsConfig.java          ← CORS configurável por env var
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java
│   │   ├── BusinessException.java   ← 400
│   │   ├── ResourceNotFoundException.java  ← 404
│   │   └── TenantAccessDeniedException.java ← 403
│   ├── persistence/
│   │   └── TenantAwareEntity.java   ← @MappedSuperclass com empresa_id + created_at
│   ├── security/
│   │   ├── JwtDecoderConfig.java    ← JWKS decoder customizado (Supabase non-standard aud)
│   │   └── SupabaseJwtConverter.java ← sub → principal, role → ROLE_X
│   └── tenant/
│       ├── TenantContext.java       ← ThreadLocal<UUID> com empresaId
│       ├── TenantFilter.java        ← OncePerRequestFilter: JWT → user_id → empresa_id
│       ├── TenantResolver.java      ← Consulta usuarios_empresa para obter empresa_id
│       ├── TenantRepository.java    ← JPA query: userId → empresaId
│       └── model/UsuariosEmpresa.java
│
├── customers/                       ← Módulo Clientes ✅ MIGRADO
│   ├── controller/CustomerController.java    GET/POST/PATCH/DELETE /api/clientes
│   ├── dto/
│   ├── mapper/CustomerMapper.java   ← MapStruct
│   ├── model/Customer.java          ← extends TenantAwareEntity, @Table("clientes")
│   ├── repository/CustomerRepository.java
│   └── service/CustomerService{Impl}.java
│
├── products/                        ← Módulo Produtos ✅ MIGRADO
│   ├── controller/ProductController.java     GET/POST/PATCH/DELETE /api/produtos
│   ├── dto/
│   ├── mapper/ProductMapper.java
│   ├── model/Product.java           ← extends TenantAwareEntity, receita_id nullable
│   ├── repository/ProductRepository.java
│   └── service/ProductService{Impl}.java     ← cascade delete para receita vinculada
│
├── recipes/                         ← Módulo Receitas ✅ MIGRADO
│   ├── controller/RecipeController.java      GET/POST/DELETE /api/receitas
│   ├── dto/
│   ├── mapper/RecipeMapper.java
│   ├── model/
│   │   ├── Recipe.java              ← extends TenantAwareEntity
│   │   ├── RecipeIngredient.java    ← NÃO herda TenantAwareEntity (sem created_at)
│   │   └── IngredientMapping.java   ← NÃO herda TenantAwareEntity (sem created_at)
│   ├── repository/
│   │   ├── RecipeRepository.java    ← JOIN FETCH com N+1 fix
│   │   └── RecipeIngredientRepository.java
│   └── service/RecipeServiceImpl.java ← fix N+1 via JOIN FETCH + IN clause batch
│
├── inventory/                       ← Módulo Insumos ✅ MIGRADO
│   ├── controller/InsumoController.java   GET/POST/PATCH/DELETE /api/insumos + /alertas
│   ├── dto/
│   ├── mapper/InsumoMapper.java     ← calcula statusEstoque
│   ├── model/Insumo.java
│   ├── repository/InsumoRepository.java   ← findAlertasByEmpresaId (filtro no banco)
│   └── service/InsumoService{Impl}.java
│
└── orders/                          ← Módulo Pedidos ✅ MIGRADO
    ├── controller/OrderController.java    GET/POST/PATCH/DELETE + verificar-* + baixa-estoque
    ├── dto/
    ├── model/
    │   ├── Order.java               ← baixaExecutada flag (idempotência)
    │   └── OrderItem.java
    ├── repository/OrderRepository.java    ← findAllByIdInWithItems (batch items)
    └── service/OrderService{Impl}.java    ← N+1 corrigido, batch completo
```

---

## Fluxo de uma Requisição

```
Cliente (React) 
    │
    │ Authorization: Bearer <supabase_jwt>
    ▼
Spring Security (BearerTokenAuthenticationFilter)
    │ ← Valida JWT via JWKS: issuer + timestamp
    │ ← Extrai sub (user UUID) como principal
    ▼
TenantFilter (OncePerRequestFilter)
    │ ← Lê sub do SecurityContext
    │ ← Consulta usuarios_empresa WHERE user_id = sub → empresa_id
    │ ← TenantContext.setEmpresaId(empresaId)
    ▼
Controller
    │ ← Recebe Request
    ▼
Service
    │ ← TenantContext.getRequiredEmpresaId()
    │ ← Filtra queries por empresa_id
    ▼
Repository (Spring Data JPA)
    │ ← SQL com WHERE empresa_id = ?
    ▼
PostgreSQL (Supabase / Neon.tech)
    │ ← RLS habilitado (mas não é a camada principal de isolamento)
    ▼
Response (JSON)
```

---

## Estratégia SaaS Multi-Tenant

Ver `DATABASE.md` para detalhes completos. Em resumo:
- **Modelo:** Shared schema, discriminador por coluna `empresa_id UUID`
- **Isolamento:** Aplicado na camada de serviço via `TenantContext` (ThreadLocal)
- **Resolução:** JWT `sub` → `usuarios_empresa` → `empresa_id` a cada requisição
- **Cleanup:** `TenantContext.clear()` no bloco `finally` do `TenantFilter`
- **RLS:** Habilitado no banco mas o backend conecta como admin (bypass de RLS). RLS serve como segunda linha de defesa.

---

## API Endpoints (Java — em operação)

Todos os endpoints de listagem (`GET /api/*` sem `/{id}`) suportam paginação via `?page=0&size=20&sort=campo,asc`.
A documentação interativa completa está em `/swagger-ui.html`.

| Método | Endpoint | Módulo | Status |
|---|---|---|---|
| GET | `/api/clientes` | customers | ✅ paginado |
| GET | `/api/clientes/{id}` | customers | ✅ |
| POST | `/api/clientes` | customers | ✅ |
| PATCH | `/api/clientes/{id}` | customers | ✅ |
| DELETE | `/api/clientes/{id}` | customers | ✅ |
| GET | `/api/produtos` | products | ✅ paginado |
| GET | `/api/produtos/{id}` | products | ✅ |
| GET | `/api/produtos/receita/{receitaId}` | products | ✅ |
| POST | `/api/produtos` | products | ✅ |
| PUT | `/api/produtos/{id}` | products | ✅ (substituição completa) |
| DELETE | `/api/produtos/{id}` | products | ✅ cascade receita |
| GET | `/api/receitas` | recipes | ✅ paginado |
| GET | `/api/receitas/{id}` | recipes | ✅ com ingredientes+mapeamentos |
| GET | `/api/receitas/{id}/ingredientes` | recipes | ✅ |
| POST | `/api/receitas` | recipes | ✅ |
| DELETE | `/api/receitas/{id}` | recipes | ✅ cascade ingredientes |
| PUT | `/api/receitas/ingredientes/{id}/mapeamento` | recipes | ✅ upsert |
| DELETE | `/api/receitas/ingredientes/{id}/mapeamento` | recipes | ✅ |
| GET | `/api/insumos` | inventory | ✅ paginado |
| GET | `/api/insumos/alertas` | inventory | ✅ filtro no banco |
| GET | `/api/insumos/{id}` | inventory | ✅ |
| POST | `/api/insumos` | inventory | ✅ |
| PATCH | `/api/insumos/{id}` | inventory | ✅ |
| DELETE | `/api/insumos/{id}` | inventory | ✅ |
| GET | `/api/pedidos` | orders | ✅ paginado |
| GET | `/api/pedidos/{id}` | orders | ✅ |
| POST | `/api/pedidos` | orders | ✅ |
| PATCH | `/api/pedidos/{id}/status` | orders | ✅ enum validado |
| DELETE | `/api/pedidos/{id}` | orders | ✅ |
| POST | `/api/pedidos/verificar-mapeamento` | orders | ✅ batch N+1 fix |
| POST | `/api/pedidos/verificar-estoque` | orders | ✅ batch N+1 fix |
| POST | `/api/pedidos/{id}/baixa-estoque` | orders | ✅ idempotente |
| GET | `/actuator/health` | shared | ✅ |
| GET | `/actuator/info` | shared | ✅ |

---

## Decisões Arquiteturais Importantes

### 1. JWT sem validação de `audience`
Supabase emite tokens com `aud: "authenticated"` (string, não lista/array padrão OAuth2).
O `JwtDecoderConfig` valida apenas `timestamp` e `issuer`, omitindo `audience` para evitar falha de validação.

### 2. `ddl-auto=validate` (prod) vs `none` (dev)
Em produção, Hibernate valida que as entidades batem com o schema real.
Em dev (Neon.tech), usa `none` pois o banco pode não ter o schema completo.

### 3. Flyway `baseline-on-migrate=true`, `baseline-version=1`
O schema já existia antes do Spring (gerenciado via Supabase MCP / migrations manuais).
Flyway assume que tudo antes da versão 1 já existe e começa a rastrear a partir daí.

### 4. Cascade delete: Produto → Receita
Ao deletar um `Produto`, o `ProductServiceImpl` deleta a `Receita` vinculada via `recipeRepository.deleteById()`.
Decisão: a receita "pertence" ao produto no contexto de uso.

### 5. Fix N+1 em Receitas
`RecipeRepository` usa `JOIN FETCH r.ingredients LEFT JOIN FETCH i.mapping` para carregar receita+ingredientes+mapeamentos em 1 query.
Os nomes dos insumos são buscados em batch com `IN` clause (1 query).
Total: 2 queries para `findById`, independente do número de ingredientes.

### 6. Módulo `inventory` como stub
O módulo `inventory` contém apenas `Insumo.java` (id + nome) e `InsumoRepository` para que o módulo `recipes` possa buscar nomes de insumos.
Será expandido para o módulo completo quando `inventory` for migrado.

### 7. Porta do servidor
- Backend Java: `8080`
- Backend C# (legado): `5191`
- Frontend: `5173`

---

## Padrões Adotados

- **Controller:** `@RestController`, retorna `ResponseEntity<T>`, sem lógica de negócio
- **Service:** Interface + Impl, `@Transactional` na classe, `@Transactional(readOnly=true)` nos gets
- **Repository:** `JpaRepository<Entity, Long>`, métodos derivados + `@Query` JPQL quando necessário
- **DTO:** Records Java imutáveis para request/response
- **Mapper:** MapStruct com `componentModel = "spring"` (injetado via DI)
- **Exceções:** Hierarquia de exceções customizadas → `GlobalExceptionHandler` → JSON padronizado
- **Tenant:** Sempre via `TenantContext.getRequiredEmpresaId()` nos serviços, nunca parâmetro HTTP
- **Nomenclatura:** Inglês nos arquivos Java, Português nos endpoints (compatibilidade com frontend existente)

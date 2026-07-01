# MIGRATION_STATUS.md — Status da Migração C# → Java

> **Última atualização:** 2026-06-12
> **Branch:** `dev`

---

## Resumo Executivo

| Aspecto | Status |
|---|---|
| Progresso geral (funcional) | ~85% |
| Progresso módulos backend | ~100% |
| Integração frontend | 0% (ainda usa C# API) |
| Próximo módulo | Integração Frontend |
| Módulos restantes | 0 (backend completo) |

---

## Histórico de Commits da Migração

| Commit | Data | O que foi feito |
|---|---|---|
| `db3980f` | Fase inicial | Infraestrutura Spring Boot 3.4 + Security + Multi-tenant + Flyway |
| `2e13c8c` | Fase 2 | Módulo Clientes — CRUD completo, tenant isolation |
| `2e7a206` | Fase 3 | Módulo Produtos — CRUD completo, cascade delete de receita |
| `d054f60` | Fase 4 | Módulo Receitas — CRUD completo, N+1 fix, stub Insumos |

---

## Módulos Migrados (Java)

### ✅ 1. Infraestrutura (commit `db3980f`)

**O que foi feito:**
- Spring Boot 3.4.0, Java 21, Maven 3.9.14
- Package base: `com.scalda`
- Spring Security + OAuth2 Resource Server
- `JwtDecoderConfig` customizado (Supabase audience não-padrão)
- `SupabaseJwtConverter`: sub → principal, role → ROLE_X
- `TenantContext` ThreadLocal + `TenantFilter` + `TenantResolver`
- `TenantAwareEntity` @MappedSuperclass
- `GlobalExceptionHandler` com formatos padronizados (400/403/404/422/500)
- `CorsConfig` configurável por env var
- Flyway `baseline-on-migrate=true, baseline-version=1`
- `application.properties` + `application-dev.properties` (gitignored) + `application-prod.properties`

**Correspondência C#:**
- `Program.cs` → `SecurityConfig.java` + `CorsConfig.java`
- Sem equivalente em C# (não havia auth/multi-tenant no C#)

---

### ✅ 2. Módulo Clientes (commit `2e13c8c`)

**Endpoint:** `GET/POST/PATCH/DELETE /api/clientes`

**O que foi feito:**
- `Customer` extends `TenantAwareEntity` (empresa_id + created_at)
- CRUD completo com isolamento por tenant
- MapStruct mapper
- Validação com `@Valid` no controller

**Mudanças em relação ao C#:**
| Aspecto | C# | Java |
|---|---|---|
| Tenant | `user_id` por linha via query param | `empresa_id` via TenantContext (JWT) |
| GET all | `GET /Clientes/usuario/{userId}` | `GET /api/clientes` (sem userId na URL) |
| Auth | Sem autenticação | JWT obrigatório |

**Dívida pendente:**
- `clientes.user_id` ainda existe no banco (coluna legada) — pode ser removida futuramente

---

### ✅ 3. Módulo Produtos (commit `2e7a206`)

**Endpoint:** `GET/POST/PATCH/DELETE /api/produtos`

**O que foi feito:**
- `Product` extends `TenantAwareEntity`
- CRUD completo com isolamento por tenant
- `findByReceitaId` para busca por receita vinculada
- Cascade delete: ao deletar produto com receita, a receita é deletada

**Mudanças em relação ao C#:**
| Aspecto | C# | Java |
|---|---|---|
| Update | `PUT` (replace completo) | `PATCH` (partial update) |
| Delete + receita | Sem cascade | Cascade via `recipeRepository.deleteById()` |
| Tenant | Sem isolamento | `empresa_id` obrigatório |

---

### ✅ 4. Módulo Receitas + Stub Inventory (commit `d054f60`)

**Endpoint:** `GET/POST/DELETE /api/receitas`

**O que foi feito:**
- `Recipe` extends `TenantAwareEntity`
- `RecipeIngredient` — ingredientes com empresa_id (sem created_at, não herda TenantAwareEntity)
- `IngredientMapping` — mapeamento ingrediente→insumo (sem created_at)
- JOIN FETCH para corrigir N+1: receita + ingredientes + mapeamentos em 1 query
- Batch query para nomes de insumos (IN clause — 1 query)
- `RecipeController` com `GET /{id}/ingredientes` (endpoint corrigido em relação ao C#)
- Stub `Insumo` (apenas id + nome) para recipes usar

**Mudanças em relação ao C#:**
| Aspecto | C# | Java |
|---|---|---|
| N+1 em findById | Múltiplos FindAsync em loop | JOIN FETCH + IN batch (2 queries fixas) |
| Save receita + ingredientes | 2 saves separados sem transação | 1 save com CascadeType.ALL |
| GET ingredientes | `GET /api/Ingredientes/{receitaId}` (rota errada) | `GET /api/receitas/{id}/ingredientes` |
| Delete cascade | Sem cascade para ingredientes | CascadeType.ALL + orphanRemoval=true |

**Ainda não migrado no módulo Receitas:**
- Endpoint de **criar/atualizar mapeamento** (POST mapeamento para um ingrediente)
- Endpoint de **remover mapeamento**
- (O model `IngredientMapping` existe, mas sem controller/service dedicado)

---

## Módulos Migrados — continuação

### ✅ 5. Módulo Inventory — Insumos (commit a seguir)

**Endpoints implementados:**
```
GET    /api/insumos           ← findAll (com statusEstoque calculado)
GET    /api/insumos/alertas   ← insumos com status ≠ OK
GET    /api/insumos/{id}      ← findById
POST   /api/insumos           ← create → 201 Created
PATCH  /api/insumos/{id}      ← update com removeMapping opcional → 200
DELETE /api/insumos/{id}      ← delete → 204 No Content
```

**Arquivos criados/modificados:**
- `inventory/model/Insumo.java` — expandido (extends TenantAwareEntity, BigDecimal quantidade/estoqueMinimo, LocalDate validade)
- `inventory/repository/InsumoRepository.java` — expandido (findAllByEmpresaId, findByIdAndEmpresaId)
- `inventory/dto/CreateInsumoRequest.java` — Record com validações Jakarta
- `inventory/dto/UpdateInsumoRequest.java` — Record PATCH semantics + removeMapping flag
- `inventory/dto/InsumoResponse.java` — Record com statusEstoque calculado
- `inventory/mapper/InsumoMapper.java` — MapStruct com @Named calcularStatusEstoque
- `inventory/service/InsumoService.java` — Interface
- `inventory/service/InsumoServiceImpl.java` — Implementação com tenant isolation + removeMapping
- `inventory/controller/InsumoController.java` — REST controller /api/insumos
- `recipes/repository/IngredientMappingRepository.java` — NOVO: deleteAllByInsumoId para removeMapping

**Decisões tomadas:**
- `BigDecimal` para `quantidade` e `estoqueMinimo` (corresponde a `numeric` PostgreSQL)
- `statusEstoque` calculado dinamicamente via `@Named` no MapStruct — não persistido
- `removeMapping` é flag instrucional no DTO, não mapeado para a entidade
- `Insumo extends TenantAwareEntity` — banco tem `created_at timestamp` (sem TZ), conversão OffsetDateTime→timestamp aceita (comportamento correto UTC, bug de TZ documentado em TD-05)
- Campo `status` da tabela (legado C#) não mapeado — Hibernate `validate` ignora colunas não mapeadas

**Regras de negócio implementadas (lógica C# migrada):**
| Condição | Status |
|---|---|
| quantidade < estoqueMinimo | `CRITICO_ESTOQUE_MINIMO` |
| validade ≤ hoje | `CRITICO_VALIDADE` |
| quantidade ≤ estoqueMinimo × 1.2 | `BAIXO_ESTOQUE_MINIMO` |
| validade ≤ hoje + 7 dias | `BAIXO_VALIDADE` |
| sem alerta | `OK` |

---

## Módulos Pendentes (C# → Java)

### ✅ 6. Módulo Mapeamento (a seguir)

**Endpoints implementados:**
```
PUT    /api/receitas/ingredientes/{ingredienteId}/mapeamento  ← upsert (idempotent)
DELETE /api/receitas/ingredientes/{ingredienteId}/mapeamento  ← remover mapeamento
```

**Arquivos criados/modificados:**
- `recipes/dto/MapIngredientRequest.java` — Record com `insumoId @NotNull @Positive` e `fatorConversao Double @PositiveOrZero`
- `recipes/dto/MappingResponse.java` — Record com `id, ingredienteId, insumoId, fatorConversao`
- `recipes/service/MappingService.java` — Interface com `upsert` e `delete`
- `recipes/service/MappingServiceImpl.java` — Implementação: tenant isolation via `RecipeIngredientRepository.findByIdAndEmpresaId`, upsert via `findByRecipeIngredient_Id + orElseGet`
- `recipes/controller/MappingController.java` — `PUT` + `DELETE` em `/api/receitas/ingredientes/{ingredienteId}/mapeamento`
- `recipes/repository/RecipeIngredientRepository.java` — adicionado `findByIdAndEmpresaId`
- `recipes/repository/IngredientMappingRepository.java` — adicionado `findByRecipeIngredient_Id` e `deleteByRecipeIngredient_Id`

**Decisões tomadas:**
- Endpoint usa `PUT` (idempotente) ao invés de `POST` — cria ou atualiza conforme existência
- `fatorConversao` padrão `1.0` quando não informado
- Tenant isolation: verifica se o `RecipeIngredient` pertence à empresa antes de salvar/deletar
- Controller/service dentro do módulo `recipes` (acoplamento natural)

---

### ✅ 7. Módulo Pedidos (commit a seguir)

**Endpoints implementados:**
```
GET    /api/pedidos                      ← findAll (com items + nomes de produto/cliente)
GET    /api/pedidos/{id}                 ← findById
POST   /api/pedidos                      ← create (com DarBaixaEstoque opcional)
PATCH  /api/pedidos/{id}/status          ← atualizar status
DELETE /api/pedidos/{id}                 ← delete (cascade pedidoprodutos via CascadeType.ALL)
POST   /api/pedidos/verificar-mapeamento ← verificar se todos ingredientes estão mapeados
POST   /api/pedidos/verificar-estoque    ← verificar avisos de estoque antes de criar pedido
POST   /api/pedidos/{id}/baixa-estoque   ← dar baixa manual no estoque
```

**Arquivos criados:**
- `orders/model/Order.java` — sem TenantAwareEntity (pedidos sem created_at), empresaId manual
- `orders/model/OrderItem.java` — tabela pedidoprodutos, empresaId manual (sem created_at)
- `orders/repository/OrderRepository.java` — JOIN FETCH para N+1 fix em findAll e findById
- `orders/dto/OrderItemRequest.java` — produtoId, quantidade, precoUnitario (fallback)
- `orders/dto/CreateOrderRequest.java` — clienteId, observacoes, produtos, darBaixaEstoque
- `orders/dto/UpdateOrderStatusRequest.java` — status com @NotBlank
- `orders/dto/OrderItemResponse.java` — id, produtoId, produtoNome, quantidade, precoUnitario
- `orders/dto/OrderResponse.java` — id, clienteId, clienteNome, dataPedido, valorTotal, status, observacoes, produtos
- `orders/dto/IngredienteNaoMapeadoResponse.java`
- `orders/dto/VerificarMapeamentoResponse.java` — todosMapeados + lista de não mapeados
- `orders/dto/AvisoEstoqueResponse.java` — tipo, mensagem, insumoNome, quantidades, produtoNome
- `orders/dto/VerificarEstoqueResponse.java` — temAvisos + lista de avisos
- `orders/service/OrderService.java` — interface
- `orders/service/OrderServiceImpl.java` — implementação com N+1 fix e baixa de estoque
- `orders/controller/OrderController.java` — REST controller /api/pedidos

**Arquivos modificados:**
- `recipes/repository/RecipeIngredientRepository.java` — adicionado `findAllByRecipe_Id(Long receitaId)`

**Decisões tomadas:**
- `Order` e `OrderItem` NÃO herdam `TenantAwareEntity` (tabela `pedidos` sem `created_at`) — empresaId manual
- `BigDecimal` para `valor` do pedido (evitar TD-01 no módulo mais crítico)
- `OrderItem.quantidade` como `Integer` (smallint PostgreSQL — JDBC faz coerção automaticamente)
- N+1 fix via `JOIN FETCH o.items` na query do repositório (evita N+1 do C# com FindAsync em loop)
- Nome do cliente carregado via `CustomerRepository.findByIdAndEmpresaId` (cross-module dependency aceita em monolito)
- Nomes de produtos carregados em batch via `productRepository.findAllById(ids)` (1 query para todos)
- DarBaixaEstoque: `insumo.quantidade -= qtdIngrediente × fatorConversao × qtdPedido`, mínimo 0
- VerificarEstoque: 3 níveis — CRITICO (saldo negativo), ALERTA (<10% ou <10 unidades restantes), INFO (<30% restante)

---

### ⏳ 8. Integração Frontend

**Prioridade:** Após todos os módulos backend

**O que precisa mudar:**
1. `VITE_API_URL` de `http://localhost:5191/api` → `http://localhost:8080/api`
2. Todos os `services/*.js` precisam enviar `Authorization: Bearer <supabase_jwt>` no header
3. `customerService.js`: remover `user_id` do body, remover `usuario/${user.id}` da URL
4. `productsService.js`: mudar `PUT` para `PATCH`
5. Criar interceptor Axios global para injetar o Bearer token automaticamente

---

## Riscos da Migração

### CRÍTICO
1. **Frontend sem JWT headers** — enquanto não for integrado, o C# API continua sendo usado em paralelo. Qualquer mudança de schema pode quebrar ambos.

### ALTO
2. **`double` para valores financeiros** — `preco`, `custo`, `valor` estão como `double` nas entidades Java. PostgreSQL usa `numeric` (exato). A conversão pode gerar imprecisão de centavos em operações matemáticas. Corrigir para `BigDecimal` antes de entrar em produção.

### MÉDIO
3. **Ausência de testes** — nenhum teste unitário ou de integração escrito. Mudanças podem introduzir regressões silenciosas.
4. **Mapeamento parcial** — `IngredientMapping` sem controller/service dedicado pode causar inconsistência.
5. **Cascade delete produto→receita** — se um produto for deletado sem intenção, a receita é perdida permanentemente.

### BAIXO
6. **`receitaIngredientes` camelCase** — precisa de backtick no Java. Risco de erro se alguém criar nova entidade para a mesma tabela sem o backtick.
7. **`insumos.created_at` sem timezone** — inconsistência com o restante. Pode causar bugs de fuso horário.

---

## Dívidas Técnicas

| # | Descrição | Impacto | Quando resolver |
|---|---|---|---|
| TD-01 | `double` → `BigDecimal` para preco/custo/valor | Bug em produção | Antes do go-live |
| TD-02 | `RecipeIngredient` e `IngredientMapping` sem TenantAwareEntity | Tenant enforcement incompleto | Próxima sessão |
| TD-03 | Sem testes unitários/integração | Regressões não detectadas | Próxima fase |
| TD-04 | `clientes.user_id` coluna legada | Confusão arquitetural | Após migração completa |
| TD-05 | `insumos.created_at` sem timezone | Bug de timezone | Com migration Flyway |
| TD-06 | Frontend ainda aponta para C# API | Módulos Java inacessíveis | Após todos os módulos |
| TD-07 | Nenhum `@PreAuthorize` implementado | Sem controle de acesso por role | Versão futura |
| TD-08 | Índices de banco não criados | Performance em escala | Antes do go-live |
| TD-09 | `receitaIngredientes` camelCase table name | Anomalia arquitetural | Migration futura |

---

## Próximos Passos (Ordem Recomendada)

```
✅ [Módulo 5] Inventory (Insumos) — CONCLUÍDO
✅ [Módulo 6] Mapeamento — CONCLUÍDO
✅ [Módulo 7] Pedidos — CONCLUÍDO (2026-06-12)
   ↓
Próxima sessão:
1. [Frontend] Integrar frontend com novo backend Java
   - VITE_API_URL: 5191 → 8080
   - Interceptor Axios para Bearer JWT
   - customerService.js: remover user_id, remover usuario/{id} da URL
   - productsService.js: PUT → PATCH
   ↓
2. [TD-01] Corrigir double → BigDecimal em Products (preco/custo)
   ↓
3. Testes e validação end-to-end
   ↓
4. Go-live backend Java (descomissionar C#)
```

---

## Referências de Código C# para Migração

| Módulo | Modelo | Serviço | Controller |
|---|---|---|---|
| Insumos | `api/Models/Insumos.cs` | `api/Servicos/InsumosServico.cs` | `api/Controllers/InsumosController.cs` |
| Mapeamento | `api/Models/IngredientesInsumo.cs` | `api/Servicos/MapeamentoServico.cs` | `api/Controllers/MapeamentoController.cs` |
| Pedidos | `api/Models/Pedidos.cs` + `PedidosProdutos.cs` | `api/Servicos/PedidosServico.cs` | `api/Controllers/PedidosController.cs` |
| DTOs Pedidos | `api/DTOs/PedidosDTO.cs` | — | — |

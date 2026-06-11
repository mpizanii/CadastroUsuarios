# MIGRATION_STATUS.md — Status da Migração C# → Java

> **Última atualização:** 2026-06-11
> **Branch:** `dev`

---

## Resumo Executivo

| Aspecto | Status |
|---|---|
| Progresso geral (funcional) | ~42% |
| Progresso módulos backend | ~57% |
| Integração frontend | 0% (ainda usa C# API) |
| Próximo módulo | `inventory` (Insumos) |
| Módulos restantes | 3 (Insumos, Mapeamento, Pedidos) |

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
- Package base: `com.softlanches`
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

## Módulos Pendentes (C# → Java)

### ⏳ 5. Módulo Insumos (inventory completo)

**Prioridade:** PRÓXIMO (pré-requisito para Pedidos)

**C# reference:** `api/Controllers/InsumosController.cs` + `api/Servicos/InsumosServico.cs`

**Endpoints a migrar:**
```
GET    /api/insumos           ← findAll (com status calculado)
GET    /api/insumos/{id}      ← findById
POST   /api/insumos           ← create
PATCH  /api/insumos/{id}      ← update (com removeMapping opcional)
DELETE /api/insumos/{id}      ← delete
GET    /api/insumos/alertas   ← insumos com status crítico/baixo
```

**Regras de negócio a implementar:**
- Calcular `statusEstoque` dinamicamente:
  - `CRITICO_ESTOQUE_MINIMO`: quantidade < estoque_minimo
  - `CRITICO_VALIDADE`: validade <= hoje
  - `BAIXO_ESTOQUE_MINIMO`: quantidade <= estoque_minimo × 1.2
  - `BAIXO_VALIDADE`: validade <= hoje + 7 dias
  - `OK`: caso contrário
- Ao editar insumo com `removeMapping=true`: deletar todos os `IngredientMapping` vinculados

**Atenção:** O stub `Insumo.java` precisa ser expandido com todos os campos.
`InsumoRepository.java` precisa de novos métodos.

---

### ⏳ 6. Módulo Mapeamento

**Prioridade:** JUNTO com Insumos (dependência entre eles)

**C# reference:** `api/Controllers/MapeamentoController.cs` + `api/Servicos/MapeamentoServico.cs`

**Endpoints a migrar:**
```
POST   /api/mapeamento        ← criar ou atualizar mapeamento ingrediente→insumo
DELETE /api/mapeamento/{ingredienteId}  ← remover mapeamento
```

**Observação:** O model `IngredientMapping.java` já existe no módulo `recipes`.
Decidir se o controller/service de mapeamento fica no módulo `recipes` ou em um novo módulo `mapping`.
Recomendado: dentro de `recipes` pois é fortemente acoplado.

---

### ⏳ 7. Módulo Pedidos (mais complexo)

**Prioridade:** APÓS Insumos + Mapeamento

**C# reference:** `api/Controllers/PedidosController.cs` + `api/Servicos/PedidosServico.cs`

**Endpoints a migrar:**
```
GET    /api/pedidos                     ← findAll
GET    /api/pedidos/{id}                ← findById
POST   /api/pedidos                     ← create (com DarBaixaEstoque opcional)
PATCH  /api/pedidos/{id}/status         ← atualizar status
DELETE /api/pedidos/{id}                ← delete (cascade pedidoprodutos)
POST   /api/pedidos/verificar-mapeamento ← verificar se todos ingredientes estão mapeados
POST   /api/pedidos/{id}/baixa-estoque  ← dar baixa manual no estoque
POST   /api/pedidos/verificar-estoque   ← verificar avisos de estoque antes de criar pedido
```

**Regras críticas a implementar:**
1. **DarBaixaEstoque:** para cada produto → receita → ingrediente mapeado → `insumo.quantidade -= ingrediente.quantidade × fator_conversao × pedido.quantidade` (nunca negativo)
2. **VerificarMapeamento:** detectar ingredientes sem mapeamento antes de criar pedido
3. **VerificarEstoque:** 3 níveis de alerta (CRITICO/ALERTA/INFO) baseados em percentual restante
4. **N+1 fix obrigatório:** o C# usa múltiplos `FindAsync` em loops — no Java usar JOIN FETCH

**Tabela nova a mapear:** `pedidoprodutos` (`PedidoItem` em Java)

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
Próxima sessão:
1. [TD-02] Corrigir TenantAwareEntity em RecipeIngredient e IngredientMapping
   ↓
2. [Módulo 5] Implementar inventory completo (expandir Insumo + InsumoRepository + service + controller)
   ↓
3. [Módulo 6] Implementar controller/service de Mapeamento (dentro do módulo recipes)
   ↓
4. [Módulo 7] Implementar Pedidos (mais complexo — JOIN FETCH + baixa estoque + verificações)
   ↓
5. [Frontend] Integrar frontend com novo backend Java (Axios interceptor + JWT headers)
   ↓
6. [TD-01] Corrigir double → BigDecimal
   ↓
7. Testes e validação end-to-end
   ↓
8. Go-live backend Java (descomissionar C#)
```

---

## Referências de Código C# para Migração

| Módulo | Modelo | Serviço | Controller |
|---|---|---|---|
| Insumos | `api/Models/Insumos.cs` | `api/Servicos/InsumosServico.cs` | `api/Controllers/InsumosController.cs` |
| Mapeamento | `api/Models/IngredientesInsumo.cs` | `api/Servicos/MapeamentoServico.cs` | `api/Controllers/MapeamentoController.cs` |
| Pedidos | `api/Models/Pedidos.cs` + `PedidosProdutos.cs` | `api/Servicos/PedidosServico.cs` | `api/Controllers/PedidosController.cs` |
| DTOs Pedidos | `api/DTOs/PedidosDTO.cs` | — | — |

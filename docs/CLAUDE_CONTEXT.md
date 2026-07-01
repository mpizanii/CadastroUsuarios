# CLAUDE_CONTEXT.md — Contexto para Agentes Claude

> Este documento foi criado especificamente para que futuras sessões do Claude Code consigam
> retomar o desenvolvimento rapidamente sem precisar reanalisar todo o código.
>
> **Atualizado em:** 2026-06-12

---

## Resumo Executivo (leia em 60 segundos)

**Scalda** é um ERP SaaS para empresas do setor alimentício.
Está em migração de ASP.NET Core 8 (C#) para Spring Boot 3.4 (Java 21).

**O que existe:**
- Backend Java em `backend/` — **todos os módulos migrados**: Clientes, Produtos, Receitas, Insumos, Mapeamento, Pedidos
- Backend C# em `api/` — API completa mas legada, sem autenticação, a ser descontinuada
- Frontend React em `frontend/` — ainda apontando para o C# API

**O que falta:** Apenas integração frontend (0% integrado ao Java).

**Banco:** Supabase PostgreSQL (project `avugtvhjgtlcilumrvmr`), dev em Neon.tech.

---

## Estado Atual (2026-06-11)

### Funcionando no Java (`backend/`)
- ✅ Autenticação via Supabase JWT (RS256, JWKS)
- ✅ Isolamento multi-tenant por `empresa_id` via ThreadLocal
- ✅ `GET/POST/PATCH/DELETE /api/clientes`
- ✅ `GET/POST/PATCH/DELETE /api/produtos`
- ✅ `GET/POST/DELETE /api/receitas`
- ✅ `GET /api/receitas/{id}` com N+1 corrigido
- ✅ `GET /api/receitas/{id}/ingredientes`
- ✅ `GET/POST/PATCH/DELETE /api/insumos` + `GET /api/insumos/alertas`
- ✅ `PUT/DELETE /api/receitas/ingredientes/{id}/mapeamento`
- ✅ `GET/POST/PATCH/DELETE /api/pedidos` + verificar-mapeamento + verificar-estoque + baixa-estoque
- ✅ `GET /actuator/health`

### Ainda no C# (`api/`) — a migrar
- Todos os módulos foram migrados. O C# pode ser descontinuado após integração do frontend.

### Frontend (`frontend/`)
- Aponta para `http://localhost:5191/api` (C#)
- Usa Supabase Auth mas não envia JWT para o backend
- 0% integrado ao Java backend

---

## Decisões Arquiteturais Já Tomadas (não reverter)

### 1. Multi-tenant por coluna `empresa_id`
Shared schema. Toda tabela de negócio tem `empresa_id UUID`. O isolamento é feito via `TenantContext`
(ThreadLocal) preenchido pelo `TenantFilter` após validação JWT. **Nunca aceitar empresa_id via HTTP.**

### 2. JWT Supabase sem validação de `audience`
Supabase usa `aud: "authenticated"` como string (não lista). O `JwtDecoderConfig` valida apenas
`issuer` + `timestamp`. Não altere isso — reintroduzir validação de audience vai rejeitar todos os tokens.

### 3. Endpoints em Português
Os endpoints usam nomes em português (`/api/clientes`, `/api/produtos`) para compatibilidade com o
frontend existente. Não mude para inglês sem migrar o frontend junto.

### 4. Cascade delete Produto → Receita
Ao deletar produto, `ProductServiceImpl` deleta a receita vinculada via `recipeRepository.deleteById()`.
Decisão intencional: a receita pertence ao produto.

### 5. N+1 Fix em Receitas
`RecipeRepository` usa `JOIN FETCH` para carregar receita + ingredientes + mapeamentos em 1 query.
Nomes de insumos buscados em batch (IN clause). Sempre 2 queries para `findById`.

### 6. Stub Inventory
`inventory/model/Insumo.java` tem apenas `id` + `nome`. É um stub temporário para o módulo `recipes`
usar. Quando o módulo inventory for implementado, expandir esta entidade.

### 7. `ddl-auto=none` no dev
O banco dev (Neon.tech) pode não ter o schema completo. Por isso `ddl-auto=none` em dev.
Em prod usa `validate`.

---

## Convenções Obrigatórias

### Estrutura de Módulo
Todo módulo novo deve ter:
```
<modulo>/
├── controller/<Entidade>Controller.java    ← @RestController, @RequestMapping("/api/<endpoint-pt>")
├── dto/                                    ← Records Java para Create/Update/Response
├── mapper/<Entidade>Mapper.java            ← MapStruct (@Mapper)
├── model/<Entidade>.java                   ← extends TenantAwareEntity (se tiver created_at)
├── repository/<Entidade>Repository.java    ← JpaRepository<Entity, Long>
└── service/
    ├── <Entidade>Service.java              ← Interface
    └── <Entidade>ServiceImpl.java          ← @Service @RequiredArgsConstructor @Transactional
```

### Tenant Isolation (OBRIGATÓRIO)
```java
// Todo método de serviço DEVE começar com:
UUID empresaId = TenantContext.getRequiredEmpresaId();
// E filtrar TODAS as queries por empresaId
repository.findAllByEmpresaId(empresaId);
repository.findByIdAndEmpresaId(id, empresaId);
```

**Nunca passe `empresa_id` como parâmetro HTTP.** Nunca crie endpoints que aceitem `empresaId` no body.

### Transações
```java
@Service
@Transactional          // mutações em geral
public class XxxServiceImpl {
    @Transactional(readOnly = true)  // reads — obrigatório
    public XxxResponse findById(...) { ... }
}
```

### DTOs como Records
```java
public record CreateXxxRequest(
    @NotBlank String nome,
    // ...
) {}

public record XxxResponse(Long id, String nome, ...) {}
```

### Exceções
- Recurso não encontrado → `throw new ResourceNotFoundException("Xxx", id)` → 404
- Regra de negócio violada → `throw new BusinessException("mensagem")` → 400
- Acesso cross-tenant → `throw new TenantAccessDeniedException(...)` → 403

### Anotações de entidade
```java
@Entity
@Table(name = "nome_tabela")  // nome exato no banco (snake_case)
@Getter @Setter @NoArgsConstructor
public class Xxx extends TenantAwareEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    // ...
}
```

---

## O Que NÃO Fazer

1. **Não aceitar `empresa_id` via HTTP** — sempre usar `TenantContext.getRequiredEmpresaId()`
2. **Não usar `double` para valores monetários** — usar `BigDecimal` (bug de precision)
3. **Não usar `@Table(name = "receitaIngredientes")` sem backtick** — camelCase precisa de `` @Table(name = "`receitaIngredientes`") ``
4. **Não usar `ddl-auto=create` ou `update`** — o schema já existe, `validate` (prod) ou `none` (dev)
5. **Não commitar `application-dev.properties`** — está no .gitignore, tem credenciais reais
6. **Não fazer push sem autorização explícita do usuário**
7. **Não criar Flyway migrations em `V1__*`** — versão 1 está reservada como baseline. Começar do V2
8. **Não passar `user_id` como filtro de tenant** — usar `empresa_id`. `user_id` é coluna legada
9. **Não usar `@Autowired` para injetar dependências** — usar `@RequiredArgsConstructor` (Lombok + construtor)
10. **Não criar tabelas sem `empresa_id`** — toda tabela de negócio precisa do discriminador de tenant

---

## Como Executar o Backend Java

### Pré-requisito
Maven não está no PATH. Usar o wrapper:
```
C:\Users\mpiza\.m2\wrapper\dists\apache-maven-3.9.14-bin\1cb7fhup6b5n3bed6kckbrnspv\apache-maven-3.9.14\bin\mvn
```

Ou adicionar ao PATH via PowerShell:
```powershell
$env:PATH += ";C:\Users\mpiza\.m2\wrapper\dists\apache-maven-3.9.14-bin\1cb7fhup6b5n3bed6kckbrnspv\apache-maven-3.9.14\bin"
```

### Compilar
```bash
cd backend
mvn clean package -DskipTests
```

### Rodar em dev
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Variáveis necessárias para dev
O arquivo `backend/src/main/resources/application-dev.properties` (gitignored) deve existir com:
```properties
spring.datasource.url=jdbc:postgresql://...neon.tech/neondb?sslmode=require
spring.datasource.username=neondb_owner
spring.datasource.password=<senha>
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.hikari.maximum-pool-size=5
spring.datasource.hikari.minimum-idle=2
spring.datasource.hikari.connection-timeout=30000
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
cors.allowed-origins=http://localhost:5173
logging.level.com.scalda=DEBUG
logging.level.org.springframework.security=DEBUG
logging.level.org.flywaydb=INFO
```

---

## Próximos Passos da Migração

### Imediato (próxima sessão)
1. **Integrar frontend com backend Java**
   - Mudar `VITE_API_URL` para `http://localhost:8080/api`
   - Criar interceptor Axios global para injetar `Authorization: Bearer <jwt>`
   - `customerService.js`: remover `user_id` do body, remover `/usuario/${user.id}` da URL
   - `productsService.js`: mudar `PUT` → `PATCH`
   - Testar todos os fluxos com JWT real

2. **Corrigir TD-01:** `double` → `BigDecimal` em `Product.preco` e `Product.custo`
   - Módulo `orders` já usa `BigDecimal` para `valor`
   - `products` ainda usa `double` — corrigir antes do go-live

### Depois
3. Testes unitários e de integração
4. Descomissionar C# API
5. Implementar `@PreAuthorize` por role em endpoints críticos

---

## Estrutura do Banco (Quick Reference)

```
empresas (UUID PK)
    └── usuarios_empresa (userId → empresaId, role: admin|operador|visualizador)
    └── clientes (bigint PK, empresa_id)
    └── produtos (bigint PK, empresa_id, receita_id nullable)
    └── receitas (bigint PK, empresa_id)
           └── receitaIngredientes (bigint PK, empresa_id, receita_id)
                  └── ingredientes_insumo (bigint PK, empresa_id, ingrediente_id, insumo_id, fator_conversao)
    └── insumos (bigint PK, empresa_id, quantidade, unidade, validade, estoque_minimo)
    └── pedidos (bigint PK, empresa_id, cliente_id nullable, data, valor, status)
           └── pedidoprodutos (bigint PK, empresa_id, pedido_id, produto_id, quantidade)
```

---

## Supabase Info

- **Project ID:** `avugtvhjgtlcilumrvmr`
- **JWKS URI:** `https://avugtvhjgtlcilumrvmr.supabase.co/auth/v1/.well-known/jwks.json`
- **Issuer URI:** `https://avugtvhjgtlcilumrvmr.supabase.co/auth/v1`
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (ver frontend/.env)

---

## Git Workflow

- Branch principal: `main`
- Branch de desenvolvimento: `dev`
- Sempre trabalhar em `dev`, criar PR para `main`
- Convenção de commit: `feat(<módulo>): descrição` / `fix:` / `docs:`
- **Nunca fazer push sem autorização explícita do usuário**

---

## Arquivos de Referência C# (para migração)

Quando for migrar um módulo, sempre consultar primeiro:
- `api/Models/<Entidade>.cs` — estrutura da entidade
- `api/DTOs/<Entidade>DTO.cs` — campos de entrada/saída
- `api/Interfaces/I<Entidade>Servico.cs` — contrato do serviço
- `api/Servicos/<Entidade>Servico.cs` — regras de negócio
- `api/Controllers/<Entidade>Controller.cs` — endpoints e rotas

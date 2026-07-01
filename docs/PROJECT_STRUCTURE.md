# PROJECT_STRUCTURE.md — Estrutura do Projeto Scalda

## Estrutura Raiz

```
CadastroUsuáriosSoft/
├── api/                    ← Backend LEGADO (C# ASP.NET Core 8) — a ser removido
├── backend/                ← Backend NOVO (Java Spring Boot 3.4) — em migração
├── frontend/               ← Frontend React 19
├── docs/                   ← Documentação técnica (este diretório)
├── CadastroUsuáriosSoft.sln ← Solution file Visual Studio (C#)
└── .claude/                ← Configurações Claude Code
```

---

## Backend Java (`backend/`)

```
backend/
├── pom.xml                          ← Dependências Maven
├── .mvn/wrapper/
│   └── maven-wrapper.properties     ← Maven wrapper (3.9.14)
└── src/
    ├── main/
    │   ├── java/com/scalda/
    │   │   ├── ScaldaApplication.java      ← @SpringBootApplication
    │   │   │
    │   │   ├── shared/                           ← Infraestrutura transversal
    │   │   │   ├── config/
    │   │   │   │   ├── SecurityConfig.java       ← Spring Security chain
    │   │   │   │   └── CorsConfig.java           ← CORS global
    │   │   │   ├── exception/
    │   │   │   │   ├── GlobalExceptionHandler.java ← @RestControllerAdvice
    │   │   │   │   ├── BusinessException.java    ← 400 Bad Request
    │   │   │   │   ├── ResourceNotFoundException.java ← 404
    │   │   │   │   └── TenantAccessDeniedException.java ← 403
    │   │   │   ├── persistence/
    │   │   │   │   └── TenantAwareEntity.java    ← @MappedSuperclass
    │   │   │   ├── security/
    │   │   │   │   ├── JwtDecoderConfig.java     ← JWKS decoder
    │   │   │   │   └── SupabaseJwtConverter.java ← JWT → Authentication
    │   │   │   └── tenant/
    │   │   │       ├── TenantContext.java        ← ThreadLocal<UUID>
    │   │   │       ├── TenantFilter.java         ← OncePerRequestFilter
    │   │   │       ├── TenantRepository.java     ← JPA query
    │   │   │       ├── TenantResolver.java       ← userId → empresaId
    │   │   │       └── model/
    │   │   │           └── UsuariosEmpresa.java
    │   │   │
    │   │   ├── customers/                        ← Módulo Clientes ✅
    │   │   │   ├── controller/CustomerController.java
    │   │   │   ├── dto/
    │   │   │   │   ├── CreateCustomerRequest.java
    │   │   │   │   ├── UpdateCustomerRequest.java
    │   │   │   │   └── CustomerResponse.java
    │   │   │   ├── mapper/CustomerMapper.java
    │   │   │   ├── model/Customer.java
    │   │   │   ├── repository/CustomerRepository.java
    │   │   │   └── service/
    │   │   │       ├── CustomerService.java       ← Interface
    │   │   │       └── CustomerServiceImpl.java   ← Implementação
    │   │   │
    │   │   ├── products/                         ← Módulo Produtos ✅
    │   │   │   ├── controller/ProductController.java
    │   │   │   ├── dto/
    │   │   │   │   ├── CreateProductRequest.java
    │   │   │   │   ├── UpdateProductRequest.java
    │   │   │   │   └── ProductResponse.java
    │   │   │   ├── mapper/ProductMapper.java
    │   │   │   ├── model/Product.java
    │   │   │   ├── repository/ProductRepository.java
    │   │   │   └── service/
    │   │   │       ├── ProductService.java
    │   │   │       └── ProductServiceImpl.java    ← Cascade delete para receita
    │   │   │
    │   │   ├── recipes/                          ← Módulo Receitas ✅
    │   │   │   ├── controller/RecipeController.java
    │   │   │   ├── dto/
    │   │   │   │   ├── CreateRecipeRequest.java
    │   │   │   │   ├── CreateIngredientRequest.java
    │   │   │   │   ├── RecipeResponse.java
    │   │   │   │   ├── RecipeDetailResponse.java  ← Inclui ingredientes + mapeamentos
    │   │   │   │   ├── IngredientResponse.java
    │   │   │   │   └── IngredientWithMappingResponse.java
    │   │   │   ├── mapper/RecipeMapper.java
    │   │   │   ├── model/
    │   │   │   │   ├── Recipe.java               ← extends TenantAwareEntity
    │   │   │   │   ├── RecipeIngredient.java      ← NÃO extends TenantAwareEntity
    │   │   │   │   └── IngredientMapping.java     ← NÃO extends TenantAwareEntity
    │   │   │   ├── repository/
    │   │   │   │   ├── RecipeRepository.java      ← JOIN FETCH N+1 fix
    │   │   │   │   └── RecipeIngredientRepository.java
    │   │   │   └── service/
    │   │   │       ├── RecipeService.java
    │   │   │       └── RecipeServiceImpl.java     ← N+1 corrigido
    │   │   │
    │   │   └── inventory/                        ← Módulo Insumos ⚠️ STUB
    │   │       ├── model/Insumo.java             ← Apenas id + nome
    │   │       └── repository/InsumoRepository.java ← findAllByIdIn
    │   │
    │   └── resources/
    │       ├── application.properties            ← Config base (porta, JPA, Flyway, Supabase JWKS)
    │       ├── application-dev.properties        ← Neon.tech DB ⚠️ GITIGNORED (credenciais)
    │       ├── application-prod.properties       ← Variáveis de ambiente (sem credenciais)
    │       └── db/migration/                     ← Scripts Flyway (vazio — schema pré-existente)
    │
    └── test/
        └── java/com/scalda/
            └── ScaldaApplicationTests.java  ← Stub — sem testes reais
```

---

## Backend C# Legado (`api/`)

```
api/
├── api.csproj
├── Program.cs                ← Sem autenticação, sem multi-tenant
├── Controllers/
│   ├── ClientesController.cs
│   ├── ProdutosController.cs
│   ├── ReceitasController.cs
│   ├── InsumosController.cs
│   ├── MapeamentoController.cs
│   └── PedidosController.cs
├── Data/
│   └── AppDbContext.cs       ← EF Core context
├── Models/
│   ├── Cliente.cs
│   ├── Produtos.cs
│   ├── Receitas.cs
│   ├── ReceitaIngredientes.cs
│   ├── Insumos.cs
│   ├── IngredientesInsumo.cs
│   ├── Pedidos.cs
│   └── PedidosProdutos.cs
├── DTOs/                     ← Data Transfer Objects
├── Interfaces/               ← Contratos de serviço
└── Servicos/                 ← Implementações de serviço
```

---

## Frontend (`frontend/`)

```
frontend/
├── package.json              ← React 19, Bootstrap 5, TanStack Query, Supabase JS
├── vite.config.js
├── index.html
├── .env                      ← VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_URL
└── src/
    ├── main.jsx              ← Entry point
    ├── App.jsx               ← Router + Providers + Layout
    ├── index.css
    ├── pages/
    │   ├── auth/
    │   │   ├── LoginPage.jsx
    │   │   └── ResetPasswordPage.jsx
    │   ├── dashboardPage/DashboardPage.jsx   ← /metricas
    │   ├── customersPage/CustomersPage.jsx   ← /clientes
    │   ├── productsPage/ProductsPage.jsx     ← /produtos
    │   ├── recipesPage/RecipeDetailPage.jsx  ← /receitas/:id
    │   ├── stockPage/StockPage.jsx           ← /estoque
    │   ├── ordersPage/OrdersPage.jsx         ← /pedidos
    │   └── supportPage/SupportPage.jsx       ← /suporte
    ├── components/
    │   ├── alertas/
    │   │   ├── AlertasModal.jsx
    │   │   └── ModalAvisosEstoque.jsx
    │   ├── mapeamento/
    │   │   ├── IngredientesNãoMapeados.jsx
    │   │   └── MapeamentoModal.jsx
    │   ├── menu/
    │   │   ├── Sidebar.jsx
    │   │   └── ModalForm.jsx
    │   └── pedidos/
    │       └── ModalDetalhesPedidos.jsx
    ├── contexts/
    │   ├── CustomersContext.jsx
    │   ├── ProductsContext.jsx
    │   ├── StockContext.jsx
    │   ├── OrdersContext.jsx
    │   └── index.js
    ├── services/             ← Chamadas HTTP (ainda apontando para C# API)
    │   ├── customerService.js
    │   ├── productsService.js
    │   ├── recipesService.js
    │   ├── stockService.js
    │   └── ordersService.js
    ├── hooks/
    │   ├── useProductMutations.js
    │   ├── useProductsQuery.js
    │   ├── useRecipeDetails.js
    │   └── useOrderActions.js
    ├── forms/
    │   ├── customersForms.js
    │   ├── productsForms.js
    │   ├── recipesForms.js
    │   ├── stockForms.js
    │   └── ordersForms.js
    └── utils/
        ├── supabase.js       ← Supabase JS client
        └── protectedroutes.jsx
```

---

## Responsabilidade de cada Módulo Java

| Pacote | Responsabilidade |
|---|---|
| `shared.config` | Configurações de infraestrutura (Security, CORS) |
| `shared.exception` | Tratamento centralizado de erros HTTP |
| `shared.persistence` | Base class com campos comuns (empresa_id, created_at) |
| `shared.security` | Decode e conversão do JWT Supabase |
| `shared.tenant` | Resolução e armazenamento do contexto multi-tenant |
| `customers` | CRUD de clientes com isolamento por tenant |
| `products` | CRUD de produtos + cascade delete de receita vinculada |
| `recipes` | CRUD de receitas + ingredientes + mapeamentos, N+1 fix |
| `inventory` | **STUB** — apenas para consulta de nome do insumo |

---

## Convenções Arquiteturais

### Nomenclatura de Pacotes
- Módulos de domínio no plural inglês: `customers`, `products`, `recipes`, `inventory`
- Pacote compartilhado: `shared` (configurações, infraestrutura)
- Sub-pacotes: `controller`, `service`, `repository`, `model`, `dto`, `mapper`

### Nomenclatura de Classes
| Tipo | Sufixo | Exemplo |
|---|---|---|
| Controller | `Controller` | `CustomerController` |
| Interface de serviço | `Service` | `CustomerService` |
| Implementação | `ServiceImpl` | `CustomerServiceImpl` |
| Repository | `Repository` | `CustomerRepository` |
| Entidade | (sem sufixo) | `Customer`, `Product` |
| DTO de criação | `Request` | `CreateCustomerRequest` |
| DTO de atualização | `Request` | `UpdateCustomerRequest` |
| DTO de resposta | `Response` | `CustomerResponse` |
| Mapper | `Mapper` | `CustomerMapper` |

### Nomenclatura de Endpoints
Endpoints em Português para manter compatibilidade com o frontend existente:
- `/api/clientes` (não `/api/customers`)
- `/api/produtos`
- `/api/receitas`
- Futuro: `/api/insumos`, `/api/pedidos`

---

## Como Adicionar um Novo Módulo

1. Criar pacote `com.scalda.<modulo>/`
2. Criar entidade extends `TenantAwareEntity` (se tiver `created_at`) ou adicionar `empresa_id` manualmente
3. Criar `Repository` extends `JpaRepository<Entity, Long>`
4. Criar interface `Service` e `ServiceImpl`
   - Sempre chamar `TenantContext.getRequiredEmpresaId()` antes de qualquer query
   - Filtrar todas as queries por `empresaId`
5. Criar DTOs como Records Java
6. Criar `Mapper` com MapStruct
7. Criar `Controller` com `@RequestMapping("/api/<endpoint-pt>")`
8. Adicionar testes

### Template de Serviço
```java
@Service
@RequiredArgsConstructor
@Transactional
public class XxxServiceImpl implements XxxService {
    private final XxxRepository repository;
    private final XxxMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<XxxResponse> findAll() {
        UUID empresaId = TenantContext.getRequiredEmpresaId();
        return mapper.toResponseList(repository.findAllByEmpresaId(empresaId));
    }
    // ...
}
```

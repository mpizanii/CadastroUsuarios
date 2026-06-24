# Frontend Migration Status

## Contexto

O backend foi migrado de C# (.NET) para Java (Spring Boot 3.4). Esta documentação registra as incompatibilidades identificadas e as correções aplicadas ao frontend para consumir a nova API.

## Incompatibilidades corrigidas

### 1. URL base — porta e casing

| Antes (C#) | Depois (Java) |
|---|---|
| `http://localhost:5191/api` | `http://localhost:8080/api` |
| `/Clientes` (PascalCase) | `/clientes` (lowercase) |
| `/Produtos` | `/produtos` |
| `/Receitas` | `/receitas` |
| `/Insumos` | `/insumos` |
| `/Pedidos` | `/pedidos` |
| `POST /Mapeamento` | `PUT /receitas/ingredientes/{id}/mapeamento` |
| `DELETE /Mapeamento/{id}` | `DELETE /receitas/ingredientes/{id}/mapeamento` |

### 2. Autenticação — JWT injetado centralmente

| Antes | Depois |
|---|---|
| Headers de auth inconsistentes por serviço | `axiosInstance.js` criado com interceptor que injeta JWT em toda requisição |
| `axios` importado diretamente em cada serviço | `api` importado de `../utils/axiosInstance` |
| `user_id` enviado no body do POST `/clientes` | Removido — backend resolve tenant pelo JWT |

### 3. Campos DTO — C# PascalCase → Java camelCase

| Antes | Depois | Arquivo |
|---|---|---|
| `produto.receita_Id` | `produto.receitaId` | `ProductsPage.jsx` |
| `recipe?.modo_Preparo` | `recipe?.modoPreparo` | `useRecipeDetails.js` |
| `modo_preparo: recipeMethod` | `modoPreparo: recipeMethod` | `recipesForms.js` |
| `receita_id: receita.id` | `receitaId: receita.id` | `recipesForms.js` |
| `ingredienteId` no body do mapeamento | `ingredienteId` na URL path | `recipesService.js` |

### 4. Tipos de dados

| Problema | Correção | Arquivo |
|---|---|---|
| `validade: new Date(x).toISOString()` → datetime com fuso | `validade: validade \|\| null` → string "YYYY-MM-DD" para `LocalDate` Java | `stockForms.js` |
| `preco`, `custo` como string | Wrapped em `Number()` antes do envio | `productsService.js` |

### 5. Método HTTP

| Antes | Depois | Motivo |
|---|---|---|
| PUT com `id` no body | PUT com `id` na URL, sem `id` no body | Java controller extrai id do path |
| Sem `receitaId` no formEditProduct | `receitaId: selectedProduct?.receitaId ?? null` | PUT é full-replace — sem `receitaId` desvincula receita |

## Estado atual

| Arquivo | Status |
|---|---|
| `frontend/.env` | ✅ Porta atualizada para 8080 |
| `frontend/src/utils/axiosInstance.js` | ✅ Criado — interceptor JWT + handler 401 |
| `frontend/src/services/customerService.js` | ✅ Adaptado |
| `frontend/src/services/productsService.js` | ✅ Adaptado |
| `frontend/src/services/recipesService.js` | ✅ Adaptado |
| `frontend/src/services/stockService.js` | ✅ Adaptado |
| `frontend/src/services/ordersService.js` | ✅ Adaptado |
| `frontend/src/pages/productsPage/ProductsPage.jsx` | ✅ `receitaId` corrigido |
| `frontend/src/hooks/useRecipeDetails.js` | ✅ `modoPreparo` corrigido |
| `frontend/src/forms/recipesForms.js` | ✅ Campos camelCase corrigidos |
| `frontend/src/forms/stockForms.js` | ✅ Formato `LocalDate` corrigido |
| `frontend/src/forms/productsForms.js` | ✅ `receitaId` preservado no edit |
| Build | ✅ `npm run build` — zero erros |

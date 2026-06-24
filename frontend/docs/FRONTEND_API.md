# Frontend API Contract

Base URL: `VITE_API_URL` (`.env`) → `http://localhost:8080/api` em desenvolvimento.

Todas as requisições incluem `Authorization: Bearer <JWT>` via interceptor em `axiosInstance.js`.

---

## Clientes — `customerService.js`

| Método | Endpoint | Payload / Params | Retorno |
|---|---|---|---|
| GET | `/clientes` | — | `CustomerResponse[]` |
| POST | `/clientes` | `{nome, email, telefone, endereco}` | `CustomerResponse` |
| PATCH | `/clientes/{id}` | `{nome, email, telefone, endereco}` (parcial) | `CustomerResponse` |
| DELETE | `/clientes/{id}` | — | 204 |

---

## Produtos — `productsService.js`

| Método | Endpoint | Payload / Params | Retorno |
|---|---|---|---|
| GET | `/produtos` | — | `ProductResponse[]` |
| POST | `/produtos` | `{nome, preco, custo, ativo}` | `ProductResponse` |
| PUT | `/produtos/{id}` | `{nome, preco, custo, ativo, receitaId?}` (full replace) | `ProductResponse` |
| DELETE | `/produtos/{id}` | — | 204 |
| GET | `/receitas` | — | `RecipeResponse[]` |
| GET | `/produtos/receita/{receitaId}` | — | `ProductResponse` |

**Atenção**: `PUT /produtos/{id}` é full-replace — sempre enviar `receitaId` para preservar o vínculo com a receita (mesmo que não mude).

---

## Receitas — `recipesService.js`

| Método | Endpoint | Payload / Params | Retorno |
|---|---|---|---|
| POST | `/receitas` | `{nome, modoPreparo, ingredientes[]}` | `RecipeResponse` |
| GET | `/receitas/{id}` | — | `RecipeResponse` (com `ingredientes[].mapeado`) |
| PUT | `/receitas/ingredientes/{ingredienteId}/mapeamento` | `{insumoId, fatorConversao}` | `MapeamentoResponse` |
| DELETE | `/receitas/ingredientes/{ingredienteId}/mapeamento` | — | 204 |

**Mapeamento**: PUT é idempotente (upsert). Usa `ingredienteId` (id do ingrediente da receita), não do insumo.

**Campo `modoPreparo`**: string com passos separados por `;`. O hook `useRecipeDetails.getModoPreparo()` faz o split.

---

## Estoque — `stockService.js`

| Método | Endpoint | Payload / Params | Retorno |
|---|---|---|---|
| GET | `/insumos` | — | `InsumoResponse[]` |
| GET | `/insumos/alertas` | — | `InsumoResponse[]` (apenas em alerta) |
| GET | `/insumos/{id}` | — | `InsumoResponse` |
| POST | `/insumos` | `{nome, quantidade, unidade, validade?, estoqueMinimo}` | `InsumoResponse` |
| PATCH | `/insumos/{id}` | campos parciais + `removeMapping?` | `InsumoResponse` |
| DELETE | `/insumos/{id}` | — | 204 |

**Campo `validade`**: Java espera `LocalDate` no formato `"YYYY-MM-DD"` (string pura). **Não** usar `.toISOString()` (que gera datetime com fuso).

---

## Pedidos — `ordersService.js`

| Método | Endpoint | Payload / Params | Retorno |
|---|---|---|---|
| GET | `/pedidos` | — | `OrderResponse[]` (com items) |
| GET | `/pedidos/{id}` | — | `OrderResponse` |
| POST | `/pedidos` | `{clienteId, observacoes?, produtos[], darBaixaEstoque}` | `OrderResponse` |
| PATCH | `/pedidos/{id}/status` | `{status}` | `OrderResponse` |
| DELETE | `/pedidos/{id}` | — | 204 |
| POST | `/pedidos/verificar-mapeamento` | `produtos[]` | `VerificarMapeamentoResponse` |
| POST | `/pedidos/{id}/baixa-estoque` | — | `VerificarEstoqueResponse` |
| POST | `/pedidos/verificar-estoque` | `produtos[]` | `VerificarEstoqueResponse` |

**Campo `produtos[]`**: `[{produtoId, quantidade, precoUnitario}]`

**`darBaixaEstoque`**: boolean no body de criação. Se `true`, a baixa é feita atomicamente na criação do pedido.

---

## Campos de resposta importantes

| Campo backend (Java camelCase) | Uso no frontend |
|---|---|
| `produto.receitaId` | `ProductsPage` — botão "Ver Receita" |
| `recipe.modoPreparo` | `useRecipeDetails.getModoPreparo()` |
| `pedido.dataPedido` | `OrdersPage` — formatDate |
| `pedido.valorTotal` | `OrdersPage` — formatCurrency |
| `pedido.clienteNome` | `OrdersPage` — nome do cliente |
| `pedido.produtos` | `OrdersPage` — contagem de produtos |

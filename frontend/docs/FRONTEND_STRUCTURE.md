# Frontend Structure

```
frontend/
├── src/
│   ├── App.jsx                         # Router + providers wrapper
│   ├── main.jsx                        # Entry point
│   ├── contexts/
│   │   ├── index.js                    # Re-exports all contexts
│   │   ├── OrdersContext.jsx           # Estado de pedidos (CRUD + clientes disponíveis)
│   │   ├── StockContext.jsx            # Estado de insumos
│   │   ├── ProductsContext.jsx         # (legado — produtos migrados para TanStack Query)
│   │   └── CustomersContext.jsx        # Estado de clientes
│   ├── services/                       # Chamadas HTTP — 1 arquivo por domínio
│   │   ├── customerService.js          # GET/POST/PATCH/DELETE /clientes
│   │   ├── productsService.js          # GET/POST/PUT/DELETE /produtos, GET /receitas
│   │   ├── recipesService.js           # POST /receitas, GET /receitas/{id}, PUT/DELETE /receitas/ingredientes/{id}/mapeamento
│   │   ├── stockService.js             # GET/POST/PATCH/DELETE /insumos, GET /insumos/alertas
│   │   └── ordersService.js            # GET/POST/PATCH/DELETE /pedidos, verificar-mapeamento, baixa-estoque, verificar-estoque
│   ├── hooks/
│   │   ├── useProductsQuery.js         # TanStack Query para lista de produtos
│   │   ├── useProductMutations.js      # TanStack mutations (add/edit/delete produto)
│   │   ├── useRecipeDetails.js         # Detalhes de receita + mapeamento de ingredientes
│   │   └── useOrderActions.js          # Lógica de verificação de mapeamento ao criar pedido
│   ├── forms/                          # Lógica de formulários (estado + submit)
│   │   ├── productsForms.js            # formAddProduct, formEditProduct, formDeleteProduct
│   │   ├── recipesForms.js             # formAddRecipe
│   │   ├── stockForms.js              # formAddInsumo, formEditInsumo, formDeleteInsumo, formAdicionar
│   │   └── ordersForms.js             # formAddPedido, formEditOrderStatus, formDeletePedido
│   ├── pages/
│   │   ├── auth/                       # LoginPage, ResetPasswordPage
│   │   ├── customersPage/              # CustomersPage
│   │   ├── productsPage/               # ProductsPage
│   │   ├── stockPage/                  # StockPage
│   │   ├── ordersPage/                 # OrdersPage
│   │   ├── recipesPage/                # RecipeDetailPage
│   │   ├── dashboardPage/              # DashboardPage
│   │   └── supportPage/                # SupportPage
│   ├── components/
│   │   ├── menu/                       # SideBar, ModalForm
│   │   ├── pedidos/                    # ModalDetalhesPedidos
│   │   ├── mapeamento/                 # IngredientesNãoMapeados
│   │   └── alertas/                    # ModalAvisosEstoque
│   └── utils/
│       ├── axiosInstance.js            # Instância Axios centralizada com interceptors
│       ├── supabase.js                 # Cliente Supabase JS
│       └── protectedroutes.jsx         # HOC de rota protegida (verifica sessão Supabase)
├── docs/                               # Documentação do frontend
├── .env                                # Variáveis de ambiente (VITE_API_URL, VITE_SUPABASE_*)
├── package.json
└── vite.config.js
```

## Convenções

- Nomes de arquivos: camelCase para hooks/services/utils, PascalCase para componentes e páginas
- Importações de serviços: sempre via `axiosInstance` — nunca `axios` diretamente
- Variáveis de ambiente: prefixo `VITE_` obrigatório para acesso no browser

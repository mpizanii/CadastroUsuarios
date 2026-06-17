-- P10: índices de performance para campos filtrados em toda query de tenant
-- Todos criados com IF NOT EXISTS para ser idempotente (safe replay pelo Flyway).

-- Isolamento de tenant: empresa_id é WHERE clause em 100% das queries de negócio
CREATE INDEX IF NOT EXISTS idx_clientes_empresa_id          ON clientes(empresa_id);
CREATE INDEX IF NOT EXISTS idx_produtos_empresa_id          ON produtos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_receitas_empresa_id          ON receitas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_insumos_empresa_id           ON insumos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_empresa_id           ON pedidos(empresa_id);

-- Resolução de tenant (query por request no TenantFilter)
CREATE INDEX IF NOT EXISTS idx_usuarios_empresa_user_id     ON usuarios_empresa(user_id);

-- Navegação receita → produto (findByReceitaId)
CREATE INDEX IF NOT EXISTS idx_produtos_receita_id          ON produtos(receita_id);

-- Listagem de pedidos por data (ORDER BY data DESC)
CREATE INDEX IF NOT EXISTS idx_pedidos_empresa_data         ON pedidos(empresa_id, data DESC);

-- Alertas de estoque: filtro por validade (parcial — apenas insumos com validade cadastrada)
CREATE INDEX IF NOT EXISTS idx_insumos_validade             ON insumos(empresa_id, validade)
    WHERE validade IS NOT NULL;

-- Baixa de estoque: ingredientes por receita (recipeIngredientRepository.findAllByRecipe_Id)
CREATE INDEX IF NOT EXISTS idx_receita_ingredientes_receita ON "receitaIngredientes"(receita_id);

-- Mapeamento ingrediente → insumo (IngredientMappingRepository queries)
CREATE INDEX IF NOT EXISTS idx_ingredientes_insumo_ing      ON ingredientes_insumo(ingrediente_id);
CREATE INDEX IF NOT EXISTS idx_ingredientes_insumo_ins      ON ingredientes_insumo(insumo_id);

-- Pedidos por itens (JOIN na baixa de estoque)
CREATE INDEX IF NOT EXISTS idx_pedidoprodutos_pedido_id     ON pedidoprodutos(pedido_id);

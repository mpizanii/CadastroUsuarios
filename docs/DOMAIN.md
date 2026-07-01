# DOMAIN.md — Domínio de Negócio Scalda

## O que é o Scalda?

Um ERP SaaS voltado para empresas do setor alimentício. Cada empresa que se cadastra na plataforma
recebe um ambiente isolado para gerenciar sua operação: desde o cadastro de clientes até o controle
de estoque e emissão de pedidos.

---

## Entidades e Módulos do ERP

### 1. Empresa (Tenant)
**Tabela:** `empresas`

A empresa é o tenant do sistema. Toda a operação de uma empresa fica isolada das outras.

Campos relevantes:
- `id` (UUID) — identificador único do tenant
- `nome` — razão social ou nome fantasia
- `email` — e-mail de contato único
- `plano` — `basico | profissional | enterprise`
- `ativo` — flag de soft-disable (empresa inativada sem apagar dados)

Regras:
- Uma empresa pode ter múltiplos usuários com papéis diferentes
- Todos os dados da empresa referenciam `empresa_id`

---

### 2. Usuários da Empresa
**Tabela:** `usuarios_empresa`

Vínculo entre um usuário Supabase Auth e uma empresa.

Campos:
- `user_id` (UUID) → `auth.users.id`
- `empresa_id` (UUID) → `empresas.id`
- `role` — `admin | operador | visualizador`

Regras:
- Um usuário pode pertencer a apenas uma empresa (1:1 no modelo atual)
- O `role` ainda não é usado para controle de acesso granular no backend Java (todos os usuários autenticados têm acesso completo)
- O Spring Security lê o `role` do JWT Supabase via `SupabaseJwtConverter` → `ROLE_AUTHENTICATED`

---

### 3. Clientes
**Tabela:** `clientes`

Pessoas físicas ou jurídicas que fazem pedidos na empresa.

Campos:
- `id` (bigint, identity)
- `empresa_id` (UUID) — isolamento de tenant
- `nome` (obrigatório, não pode ser em branco)
- `email` (opcional)
- `telefone` (opcional)
- `endereco` (opcional)

Regras:
- Um cliente pertence exclusivamente à empresa que o cadastrou
- Pedidos referenciam o cliente via `cliente_id` (opcional — pedido pode ser sem cliente identificado)

---

### 4. Produtos
**Tabela:** `produtos`

Os itens vendidos pela empresa (lanches, bebidas, combos, etc.).

Campos:
- `id` (bigint, identity)
- `empresa_id` (UUID)
- `nome`
- `preco` (preço de venda)
- `custo` (custo de produção)
- `ativo` (boolean — produto pode ser desativado sem deletar)
- `receita_id` (bigint, nullable) → FK para `receitas`

Regras:
- Um produto **pode ou não** ter receita associada
- Quando o produto tem receita, o sistema consegue dar baixa no estoque ao criar um pedido
- Ao deletar um produto, a receita vinculada é deletada em cascade (Java) — a receita pertence ao produto
- Produto sem receita não participa do fluxo de baixa de estoque

---

### 5. Receitas
**Tabela:** `receitas`

Descreve como um produto é preparado e quais ingredientes utiliza.

Campos:
- `id` (bigint, identity)
- `empresa_id` (UUID)
- `nome`
- `modo_preparo` (texto livre, instruções de preparo)

Regras:
- Uma receita pertence a no máximo um produto (`produtos.receita_id`)
- Uma receita tem N ingredientes (`receitaIngredientes`)
- Ao deletar uma receita, seus ingredientes são deletados em cascade (JPA `CascadeType.ALL + orphanRemoval`)

---

### 6. Ingredientes da Receita
**Tabela:** `receitaIngredientes`

Cada linha de ingrediente de uma receita.

Campos:
- `id` (bigint, identity)
- `receita_id` → FK para `receitas`
- `empresa_id` (UUID)
- `nome` — nome descritivo do ingrediente na receita (ex: "Pão brioche")
- `quantidade` — quantidade numérica necessária
- `unidade` — unidade de medida (ex: "g", "ml", "unidade")

Regras:
- O ingrediente tem um nome livre (descritivo)
- Para que o sistema possa dar baixa no estoque, o ingrediente precisa ser **mapeado** para um insumo

---

### 7. Mapeamento Ingrediente → Insumo
**Tabela:** `ingredientes_insumo`

Elo entre um ingrediente da receita e um insumo do estoque.

Campos:
- `id` (bigint, identity)
- `ingrediente_id` → FK para `receitaIngredientes`
- `insumo_id` → FK para `insumos`
- `fator_conversao` — fator multiplicador para conversão de unidades (default 1.0)
- `empresa_id` (UUID)

Regras:
- Um ingrediente pode estar **não mapeado** (mapeamento é opcional)
- Ingredientes não mapeados bloqueiam a baixa de estoque para aquele produto
- O sistema exibe alerta ao criar pedido com ingredientes não mapeados
- O fator de conversão permite que a unidade do ingrediente seja diferente da unidade do insumo

**Exemplo:** Receita usa 150g de "Carne moída" → mapeado para insumo "Carne bovina" que é medido em kg → `fator_conversao = 0.001` (150g × 0.001 = 0.15 kg descontados do estoque)

---

### 8. Insumos (Estoque)
**Tabela:** `insumos`

Itens físicos do estoque da empresa.

Campos:
- `id` (bigint, identity)
- `empresa_id` (UUID)
- `nome`
- `quantidade` — saldo atual em estoque
- `unidade` — unidade de medida
- `validade` (date, opcional) — data de validade
- `estoque_minimo` — quantidade mínima aceitável
- `status` (varchar) — campo legado C#, calculado dinamicamente pelo sistema

Regras de status calculado (lógica C#, a ser migrada):
| Condição | Status |
|---|---|
| quantidade < estoque_minimo | "Crítico Estoque Mínimo" |
| validade <= hoje | "Crítico Validade" |
| quantidade <= estoque_minimo × 1.2 | "Baixo Estoque Mínimo" |
| validade <= hoje + 7 dias | "Baixo Validade" |
| normal | "OK" |

---

### 9. Pedidos
**Tabela:** `pedidos`

Registro de uma venda realizada.

Campos:
- `id` (bigint, identity)
- `empresa_id` (UUID)
- `cliente_id` (bigint, nullable) → FK para `clientes`
- `data` (timestamptz) — momento do pedido
- `valor` — valor total calculado
- `status` — "Pendente" | "Em Preparo" | "Em Rota de Entrega" | "Entregue"
- `observacoes` (texto, opcional)

Regras:
- O valor total é calculado somando `preco × quantidade` de cada produto
- O pedido pode ser criado com ou sem `DarBaixaEstoque` (flag no request)
- Ao deletar um pedido, os registros de `pedidoprodutos` são deletados em cascade

---

### 10. Produtos do Pedido
**Tabela:** `pedidoprodutos`

Relação N:N entre pedido e produtos.

Campos:
- `id` (bigint, identity)
- `empresa_id` (UUID)
- `pedido_id` → FK para `pedidos`
- `produto_id` → FK para `produtos`
- `quantidade` (smallint)

---

## Fluxos Principais

### Fluxo de Criação de Pedido

```
1. Usuário seleciona produtos e quantidades
2. [Opcional] Sistema verifica mapeamento:
   - Para cada produto com receita, verifica se todos os ingredientes estão mapeados
   - Se não mapeados, exibe alerta (mas não bloqueia)
3. [Opcional] Sistema verifica estoque:
   - Calcula se há estoque suficiente para todos os insumos necessários
   - Exibe avisos: CRITICO / ALERTA / INFO
4. Pedido é criado com status "Pendente"
5. Se DarBaixaEstoque=true:
   - Para cada produto do pedido que tem receita:
     - Para cada ingrediente mapeado da receita:
       - quantidade_descontar = ingrediente.quantidade × fator_conversao × pedido.quantidade
       - insumo.quantidade -= quantidade_descontar (nunca vai abaixo de 0)
```

### Fluxo de Cadastro de Receita com Ingredientes

```
1. Usuário cria receita (nome + modo_preparo + lista de ingredientes)
2. Sistema salva receita e ingredientes em uma única transação (CascadeType.ALL)
3. Ingredientes ficam não mapeados inicialmente
4. Usuário vai em cada ingrediente e mapeia para um insumo
5. Define fator de conversão se necessário
```

---

## Relacionamentos (Diagrama Simplificado)

```
empresas (1) ──── (N) usuarios_empresa ──── (N) auth.users
    │
    ├── (N) clientes
    │
    ├── (N) produtos ────── (0..1) receitas ──── (N) receitaIngredientes
    │                                                       │
    │                                                  (0..1) ingredientes_insumo
    │                                                       │
    ├── (N) insumos ◄─────────────────────────────────────┘
    │
    └── (N) pedidos ──── (N) pedidoprodutos ──── produtos
              │
              └── (0..1) clientes
```

---

## Conceitos Importantes para Novos Desenvolvedores

**Tenant:** Uma empresa cadastrada na plataforma. Toda query de negócio DEVE filtrar por `empresa_id`.

**TenantContext:** O mecanismo que carrega o `empresa_id` do usuário autenticado para a thread atual.
Nunca passe `empresa_id` como parâmetro HTTP — leia sempre do `TenantContext`.

**Stub de inventário:** O módulo `inventory` no Java existe apenas com `Insumo` (id + nome) para que
o módulo `recipes` possa exibir o nome do insumo mapeado. Quando o módulo completo for migrado,
a entidade será expandida com todos os campos.

**Ingrediente vs Insumo:** São entidades diferentes.
- `RecipeIngredient` é o ingrediente da receita (conceitual, ex: "Carne moída 150g")
- `Insumo` é o item físico do estoque (ex: "Carne bovina 50kg")
- `IngredientMapping` conecta os dois e define o fator de conversão

**`receita_id` em Produto é nullable:** Um produto pode não ter receita. Isso é intencional para
produtos simples que não necessitam de controle de ingredientes.

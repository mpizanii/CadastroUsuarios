-- Idempotência da baixa de estoque: garante que POST /api/pedidos/{id}/baixa-estoque
-- não desconte o estoque duas vezes no mesmo pedido.
ALTER TABLE pedidos
    ADD COLUMN IF NOT EXISTS baixa_executada BOOLEAN NOT NULL DEFAULT FALSE;

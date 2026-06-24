-- empresa_id é o mecanismo exclusivo de isolamento de tenant no backend Java.
-- Registros com empresa_id = NULL são órfãos do sistema C# legado e não pertencem
-- a nenhum tenant ativo — podem ser removidos com segurança.

DELETE FROM pedidoprodutos   WHERE empresa_id IS NULL;
DELETE FROM pedidos          WHERE empresa_id IS NULL;
DELETE FROM ingredientes_insumo WHERE empresa_id IS NULL;
DELETE FROM receita_ingredientes WHERE empresa_id IS NULL;
DELETE FROM clientes         WHERE empresa_id IS NULL;
DELETE FROM insumos          WHERE empresa_id IS NULL;
DELETE FROM produtos         WHERE empresa_id IS NULL;
DELETE FROM receitas         WHERE empresa_id IS NULL;

ALTER TABLE clientes             ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE insumos              ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE receitas             ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE produtos             ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE pedidos              ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE pedidoprodutos       ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE receita_ingredientes ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE ingredientes_insumo  ALTER COLUMN empresa_id SET NOT NULL;

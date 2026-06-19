-- user_id em clientes era usado pelo sistema C# legado para isolamento de tenant.
-- A API Java usa empresa_id exclusivamente. Coluna mantida para não quebrar schema,
-- mas NOT NULL removido pois nunca é preenchido pelo novo backend.
ALTER TABLE clientes ALTER COLUMN user_id DROP NOT NULL;

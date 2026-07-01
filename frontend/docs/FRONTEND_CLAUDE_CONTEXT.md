# Frontend Claude Context

Este arquivo é o ponto de entrada para Claude Code trabalhar no frontend do Scalda.

## O que é este projeto

Scalda é um ERP SaaS multi-tenant para negócios de alimentação. O frontend é uma SPA React que consome uma API Spring Boot 3.4.

## Antes de modificar qualquer arquivo

1. Leia este arquivo inteiro
2. Leia [FRONTEND_ARCHITECTURE.md](FRONTEND_ARCHITECTURE.md) — decisões de design
3. Leia [FRONTEND_API.md](FRONTEND_API.md) — contrato de API com o backend
4. Leia [FRONTEND_MIGRATION_STATUS.md](FRONTEND_MIGRATION_STATUS.md) — histórico de incompatibilidades já resolvidas

## Regras invioláveis

### HTTP
- **Nunca** importe `axios` diretamente em serviços. Sempre use `api` de `../utils/axiosInstance`
- **Nunca** envie `empresa_id` em qualquer requisição — o backend resolve pelo JWT
- **Nunca** envie `user_id` no body — era padrão do C#, removido na migração

### Campos de DTO
- Backend Java usa **camelCase** em todos os campos de request e response
- O C# usava PascalCase (ex: `receita_Id`, `modo_Preparo`) — não usar mais
- Campo `validade` (insumo): string `"YYYY-MM-DD"` — **não** usar `.toISOString()` que gera datetime

### PUT de produto
- `PUT /produtos/{id}` é full-replace: sempre incluir `receitaId: selectedProduct?.receitaId ?? null` ao editar produto, mesmo que não mude a receita. Sem isso, o vínculo com a receita é perdido.

### URLs
- Sempre lowercase: `/clientes`, `/produtos`, `/receitas`, `/insumos`, `/pedidos`
- Mapeamento de ingrediente: `PUT /receitas/ingredientes/{ingredienteId}/mapeamento` (não `POST /Mapeamento`)

## Estrutura de arquivos relevantes

```
src/utils/axiosInstance.js   ← ponto central de HTTP — interceptor JWT
src/services/               ← 1 arquivo por domínio
src/hooks/                  ← lógica reutilizável
src/forms/                  ← estado e submit de formulários
src/contexts/               ← estado global por domínio
```

## Como o auth funciona

O interceptor em `axiosInstance.js` chama `supabase.auth.getSession()` de forma assíncrona em cada request e injeta `Authorization: Bearer <token>`. Não há necessidade de gerenciar headers manualmente em nenhum serviço.

## Quando adicionar novos endpoints

1. Adicione a função no arquivo de serviço correspondente (`/services/`)
2. Importe `api` de `'../utils/axiosInstance'`
3. Use o path relativo (sem `VITE_API_URL` manual — o `baseURL` já está configurado na instância)
4. Documente o novo endpoint em [FRONTEND_API.md](FRONTEND_API.md)

## Estado do build

Build limpo em 2026-06-12. Rodar `npm run build` para validar após mudanças.

## Backend relevante

Ver `docs/CLAUDE_CONTEXT.md` e `docs/MIGRATION_STATUS.md` na raiz do projeto para contexto completo do backend Spring Boot.

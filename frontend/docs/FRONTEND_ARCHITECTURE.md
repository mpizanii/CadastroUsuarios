# Frontend Architecture

## Stack

- **Framework**: React 19 + Vite 6
- **Language**: JavaScript (JSX)
- **Styling**: Bootstrap 5 + Bootstrap Icons + inline styles
- **Routing**: React Router DOM v7
- **State**: React Context API (per-domain) + TanStack Query v5 (server state)
- **HTTP**: Axios com interceptor centralizado (`axiosInstance.js`)
- **Auth**: Supabase JS SDK (email/password + JWT RS256)

## Princípios Arquiteturais

### Separação de responsabilidades

```
pages/       → UI e composição de componentes
forms/       → lógica de formulários (estado, validação, submit)
hooks/       → lógica reutilizável (queries, mutações, efeitos)
contexts/    → estado global por domínio
services/    → chamadas HTTP (1 arquivo por domínio)
utils/       → helpers transversais (axiosInstance, supabase, protectedroutes)
components/  → componentes visuais reutilizáveis
```

### Server state vs. UI state

- **TanStack Query** gerencia cache, refetch e invalidation dos dados do servidor (produtos)
- **Context API** gerencia estado de UI que múltiplos componentes compartilham (pedidos, estoque, clientes)
- **useState** local para estado de formulários e modais

### Autenticação e multi-tenant

O frontend não conhece `empresa_id`. O backend resolve o tenant a partir do JWT (claim `sub` → tabela `usuarios_empresa`). O frontend apenas injeta o JWT em toda requisição.

Ver [FRONTEND_AUTH.md](FRONTEND_AUTH.md) para detalhes.

## Fluxo de dados

```
Supabase Auth → JWT → axiosInstance interceptor → Spring Boot API
                                                    ↓
                                             Response JSON
                                                    ↓
                               Service function → Context / Query cache → Component
```

## Decisões importantes

| Decisão | Motivo |
|---|---|
| Axios centralizado em `axiosInstance.js` | Elimina duplicação de headers e tratamento de 401 |
| Context por domínio (não Redux) | Simplicidade — app pequena, sem estado cross-domain complexo |
| TanStack Query para produtos | Refetch automático, invalidation após mutações, sem boilerplate |
| Forms como hooks customizados | Desacopla lógica de submit da UI da page |

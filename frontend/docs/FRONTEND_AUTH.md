# Frontend Auth

## Provedor de autenticação

**Supabase Auth** (email/password). O Supabase emite JWTs RS256 com as claims:
- `sub`: UUID do usuário
- `email`
- `role`: "authenticated"
- `aud`: string não-padrão (o backend Spring não valida essa claim)

## Fluxo de login

```
LoginPage → supabase.auth.signInWithPassword()
         → sessão armazenada no localStorage pelo SDK
         → redirect para /metricas
```

## Injeção do JWT nas requisições

O arquivo `src/utils/axiosInstance.js` é o único ponto onde o JWT é injetado:

```js
api.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
});
```

Todos os serviços (`customerService`, `productsService`, etc.) importam `api` desse arquivo — nenhum serviço faz chamadas HTTP diretas via `axios`.

## Tratamento de 401

O interceptor de resposta redireciona para `/` (tela de login) em caso de 401:

```js
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);
```

## Rotas protegidas

`src/utils/protectedroutes.jsx` verifica a sessão Supabase antes de renderizar a rota. Se não houver sessão ativa, redireciona para `/`.

## Multi-tenant

O frontend **não conhece nem envia `empresa_id`**. O backend resolve o tenant a partir do `sub` do JWT via `TenantContext`. O frontend apenas autentica o usuário e injeta o token — o isolamento de dados é responsabilidade exclusiva do backend.

## Reset de senha

`ResetPasswordPage` usa `supabase.auth.updateUser()` com o token presente na URL de redefinição enviada por email.

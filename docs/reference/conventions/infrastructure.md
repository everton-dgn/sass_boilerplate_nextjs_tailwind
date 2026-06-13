# Infrastructure

Configuração centralizada de dependências externas em `src/infra/adapters/`.

---

## httpClient — factory Axios

```
src/infra/adapters/httpClient/
├── index.ts            # createHttpClient factory
└── types.ts            # HttpClientConfig (baseURL, headers, timeout)
```

```tsx
export const createHttpClient = (config?: HttpClientConfig) =>
  axios.create({ ...defaultConfig, ...config })
```

- Factory retorna instância Axios isolada.
- Config padrão: `Content-Type: application/json`, timeout 10s.
- Cada service cria sua instância em `services/config.ts` com `baseURL`
  específica.

### Tipo de configuração

```tsx
export type HttpClientConfig = Pick<
  AxiosRequestConfig,
  'baseURL' | 'headers' | 'timeout'
>
```

---

## queryClient — configuração central

```
src/infra/adapters/queryClient/
└── index.ts            # getQueryClient + persister
```

- `getQueryClient()`: retorna singleton no browser, instância nova no
  servidor.
- `staleTime`: 5 minutos. `gcTime`: 24 horas.
- `persister`: `createAsyncStoragePersister` com `localStorage`.
- Dehydrate inclui queries em `pending` para SSR.

### Padrão singleton

```tsx
let browserQueryClient: QueryClient | undefined

export const getQueryClient = () => {
  if (isServer) return makeQueryClient()
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }
  return browserQueryClient
}
```

- No **servidor**: instância nova por request (evita vazamento de dados
  entre requests).
- No **browser**: singleton reutilizado (mantém cache entre navegações).

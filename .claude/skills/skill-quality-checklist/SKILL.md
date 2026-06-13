---
name: skill-quality-checklist
description: |
  Use este skill quando o usuário pedir para "verificar qualidade", "checklist de qualidade",
  "validar antes de deploy", "revisar segurança", "verificar performance", "checar acessibilidade",
  ou mencionar validação pré-release, quality gates ou revisão completa de código.
  Cobre verificações de segurança, robustez, performance, SEO, acessibilidade.
model: opus
---

# Checklist de Qualidade

## Objetivo
Checklist de qualidade - verificações obrigatórias de segurança, robustez, performance, SEO, acessibilidade e código.

## Quando usar
- Antes de finalizar uma entrega ou PR.
- Ao validar requisitos de qualidade em review.
- Ao preparar release ou deploy.

Antes de finalizar qualquer código, verifique:

## Segurança

- [ ] Input externo validado/saneado (usuário, query params, headers, API)
- [ ] Sem exposição de dados sensíveis (tokens, stack traces, ids internos)
- [ ] CSP respeitado (não adicionar inline scripts sem nonce)
- [ ] Riscos verificados: XSS, CSRF, injeções, open redirect

## Robustez

- [ ] Erros tratados com fallback gracioso
- [ ] Estados de loading/error/empty
- [ ] Network failures considerados (timeout, offline, retry)
- [ ] Mensagens de erro amigáveis (não expor mensagens externas)

## Performance

- [ ] Sem re-renders/recomputações desnecessários
- [ ] Imagens otimizadas com lazy loading
- [ ] Bundle size considerado

## SEO (se página)

- [ ] PageHead com title/description únicos
- [ ] JSON-LD se aplicável
- [ ] Canonical e hreflang corretos
- [ ] og/twitter meta tags

## Acessibilidade

- [ ] Navegável por teclado
- [ ] ARIA apenas quando necessário e correto
- [ ] Contraste suficiente
- [ ] Labels em forms, headings coerentes

## Código

- [ ] TypeScript strict (sem any)
- [ ] Formatação segue o padrão do projeto (`;`, tabs, lint)
- [ ] Comentários apenas para decisões não óbvias (trade-offs/invariantes)
- [ ] Imports organizados
- [ ] Compatível com navegadores de 3+ anos

## Exemplos de Código

### Validação de input

```typescript
// ❌ Ruim - sem validação
const userId = req.query.id
await db.users.find(userId)

// ✅ Bom - validado
const userId = z.string().uuid().parse(req.query.id)
await db.users.find(userId)
```

### Tratamento de erro gracioso

```typescript
// ❌ Ruim - erro exposto
try {
  const data = await api.fetch()
} catch (error) {
  return { error: error.message } // Expõe detalhes internos
}

// ✅ Bom - erro amigável
try {
  const data = await api.fetch()
} catch (error) {
  console.error('API error:', error) // Log interno
  return { error: 'Não foi possível carregar os dados' }
}
```

### Estados de loading/error/empty

```tsx
// ✅ Bom - todos os estados tratados
const UserList = () => {
  const { data, isLoading, error } = useUsers()

  if (isLoading) return <Skeleton />
  if (error) return <ErrorMessage message="Erro ao carregar" />
  if (!data?.length) return <EmptyState />

  return <List items={data} />
}
```

### Performance - evitar re-renders

```typescript
// ❌ Ruim - objeto recriado a cada render
<Component style={{ padding: 16 }} />

// ✅ Bom - referência estável
const style = { padding: 16 }
<Component style={style} />

// ✅ Bom - com memo se necessário
const style = useMemo(() => ({ padding: size * 2 }), [size])
```

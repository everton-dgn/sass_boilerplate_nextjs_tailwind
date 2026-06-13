# Regras de Aplicação

Regras técnicas que governam o comportamento da aplicação: autenticação,
validação, tratamento de erros e segurança.

## Autenticação e autorização

### APP-001: Métodos de autenticação

**Contexto**: Segurança do acesso ao sistema.

**Regra**: O sistema deve suportar:
- Email + senha (mínimo 8 caracteres, 1 maiúscula, 1 número)
- OAuth via provedores sociais (Google, GitHub)
- Magic link via email

Sessões expiram após 7 dias de inatividade. Refresh tokens
têm validade de 30 dias.

### APP-002: Autorização baseada em roles

**Contexto**: Controle de acesso granular dentro de uma organização.

**Regra**: Três roles padrão:
- **Owner**: acesso total, gerencia billing e membros
- **Admin**: acesso total exceto billing e exclusão da organização
- **Member**: acesso às funcionalidades do plano, sem gerenciamento

**Exceções**: O Owner não pode remover a si mesmo. Deve transferir
ownership antes.

## Validação de dados

### APP-003: Validação em camadas

**Contexto**: Dados inválidos não devem chegar ao banco.

**Regra**: Toda entrada de dados deve ser validada em duas camadas:
1. **Cliente**: Schema Zod no formulário (feedback imediato)
2. **Servidor**: Schema Zod na action/API route (segurança)

Os schemas devem ser compartilhados quando possível para evitar
divergência.

### APP-004: Sanitização de inputs

**Contexto**: Prevenção de XSS e injection.

**Regra**: Todo input de texto livre deve ser sanitizado antes
de persistência. HTML não é permitido em campos de texto simples.
Campos rich text usam allowlist de tags.

## Tratamento de erros

### APP-005: Erros voltados ao usuário

**Contexto**: Mensagens de erro devem ser úteis, não técnicas.

**Regra**: Erros exibidos ao usuário devem:
- Ser escritos em linguagem acessível
- Sugerir uma ação corretiva quando possível
- Nunca expor stack traces, IDs internos ou detalhes de infra

Erros técnicos são logados no servidor com contexto completo.

### APP-006: Error boundaries por rota

**Contexto**: Falhas isoladas não devem derrubar toda a aplicação.

**Regra**: Cada route group deve ter seu próprio `error.tsx`.
O `global-error.tsx` é o fallback final. Error boundaries devem
oferecer opção de "tentar novamente" e link para a home.

## Rate limiting e segurança

### APP-007: Proteção contra brute force

**Contexto**: Endpoints de autenticação são alvos comuns.

**Regra**: Após 5 tentativas falhas de login no mesmo email
em 15 minutos:
- Bloquear novas tentativas por 30 minutos
- Notificar o proprietário da conta por email
- Logar o evento com IP e user agent

### APP-008: Headers de segurança

**Contexto**: Proteção contra ataques comuns via HTTP.

**Regra**: Todas as respostas devem incluir:
- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Content-Security-Policy` (configurada por ambiente)

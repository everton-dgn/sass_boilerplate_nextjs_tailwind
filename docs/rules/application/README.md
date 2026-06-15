# Regras de Aplicação

Regras técnicas que governam o comportamento da aplicação: validação,
tratamento de erros, segurança e integrações.

## Autenticação e autorização

### APP-001: Métodos de autenticação

**Contexto**: Segurança do acesso ao sistema.

**Regra**: Quando autenticação existir, documente métodos aceitos, duração de
sessão, rotação de tokens, recuperação de acesso e requisitos mínimos de
senha ou provedor externo.

### APP-002: Autorização baseada em roles

**Contexto**: Controle de acesso granular dentro de uma organização.

**Regra**: Documente os papéis do projeto, permissões de cada papel e ações
que exigem confirmação ou dupla autorização.

**Exceções**: Registre permissões temporárias, contas de suporte ou fluxos de
emergência.

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

## Segurança

### APP-007: Proteção contra abuso

**Contexto**: Endpoints públicos e ações sensíveis são alvos comuns.

**Regra**: Defina limites, bloqueios temporários e critérios de auditoria para
ações repetidas, falhas ou suspeitas.

### APP-008: Headers de segurança

**Contexto**: Proteção contra ataques comuns via HTTP.

**Regra**: Todas as respostas devem incluir:
- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Content-Security-Policy` (configurada por ambiente)

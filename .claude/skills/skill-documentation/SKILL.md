---
name: skill-documentation
description: |
  Use este skill quando o usuário pedir para "criar README", "documentar API",
  "escrever guia", "atualizar changelog", "documentar código", ou mencionar
  documentação técnica, API docs, ADRs ou manutenção de documentação.
  Cobre READMEs, docs técnicos, guias, API docs, changelogs, manutenção de docs.
model: opus
---

# Documentation

## Objetivo
Padrões de documentação - READMEs, docs técnicos, guias, API docs, changelogs, manutenção de docs.

## Quando usar
- Ao produzir README, guias e API docs.
- Ao documentar processos e decisões técnicas.
- Ao manter changelog e ADRs atualizados.

Padrões e práticas para documentação de projetos de software.

## Tipos de Documentação

| Tipo | Audiência | Propósito |
|------|-----------|-----------|
| README | Novos usuários | Primeiro contato, setup |
| Guia de início | Devs novos | Onboarding rápido |
| Referência | Devs experientes | Consulta detalhada |
| Tutorial | Aprendizes | Passo a passo |
| ADR | Time interno | Decisões arquiteturais |
| Changelog | Usuários | O que mudou |

---

## README.md

### Template

```markdown
# Nome do Projeto

[Badge de CI] [Badge de versão] [Badge de licença]

Descrição curta em uma linha do que o projeto faz.

## Funcionalidades

- ✅ Feature 1
- ✅ Feature 2
- ✅ Feature 3

## Instalação

\`\`\`bash
pnpm install nome-do-projeto
\`\`\`

## Uso Rápido

\`\`\`typescript
import { algo } from 'nome-do-projeto'

const resultado = algo()
\`\`\`

## Documentação

- [Guia de início](./docs/quick-start.md)
- [Referência da API](./docs/api.md)
- [Exemplos](./examples/)

## Desenvolvimento

\`\`\`bash
# Instalar dependências
pnpm install

# Rodar em desenvolvimento
pnpm dev

# Rodar testes
pnpm test
\`\`\`

## Contribuindo

Veja [CONTRIBUTING.md](./CONTRIBUTING.md).

## Licença

[MIT](./LICENSE)
```

---

## Guia de Início Rápido

### Estrutura

```markdown
# Guia de Início Rápido

## Pré-requisitos

- Node.js 20+
- pnpm 9+

## Instalação

1. Clone o repositório
   \`\`\`bash
   git clone https://github.com/user/repo
   \`\`\`

2. Instale as dependências
   \`\`\`bash
   pnpm install
   \`\`\`

3. Configure as variáveis de ambiente
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. Rode o projeto
   \`\`\`bash
   pnpm dev
   \`\`\`

## Primeiro Uso

[Exemplo mínimo funcional]

## Próximos Passos

- [Configuração avançada](./configuration.md)
- [Exemplos](./examples.md)
```

---

## Documentação Técnica

### Estrutura de Pastas

```
docs/
├── README.md           # Índice da documentação
├── quick-start.md      # Início rápido
├── architecture.md     # Visão arquitetural
├── api/               # Referência de API
│   ├── README.md
│   └── endpoints.md
├── guides/            # Guias detalhados
│   ├── authentication.md
│   └── deployment.md
└── adr/               # Architecture Decision Records
    ├── 001-framework.md
    └── 002-database.md
```

### Índice (docs/README.md)

```markdown
# Documentação

## Começando

- [Guia de início rápido](./quick-start.md)
- [Instalação](./installation.md)
- [Configuração](./configuration.md)

## Guias

- [Autenticação](./guides/authentication.md)
- [Deploy](./guides/deployment.md)

## Referência

- [API](./api/README.md)
- [Componentes](./components/README.md)

## Arquitetura

- [Visão geral](./architecture.md)
- [Decisões (ADRs)](./adr/README.md)

## Contribuindo

- [Guia de contribuição](../CONTRIBUTING.md)
- [Código de conduta](../CODE_OF_CONDUCT.md)
```

---

## Documentação de API

### Endpoint

```markdown
## GET /api/users/:id

Retorna os dados de um usuário.

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| id | string | Sim | ID do usuário |

### Headers

| Header | Obrigatório | Descrição |
|--------|-------------|-----------|
| Authorization | Sim | Bearer token |

### Resposta de Sucesso (200)

\`\`\`json
{
  "id": "123",
  "name": "João",
  "email": "joao@example.com"
}
\`\`\`

### Erros

| Código | Descrição |
|--------|-----------|
| 401 | Token inválido ou ausente |
| 404 | Usuário não encontrado |

### Exemplo

\`\`\`bash
curl -H "Authorization: Bearer token" \\
  https://api.example.com/users/123
\`\`\`
```

### Componente

```markdown
## Button

Botão de ação com variantes e tamanhos.

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| variant | 'primary' \| 'secondary' \| 'ghost' | 'primary' | Estilo visual |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Tamanho |
| disabled | boolean | false | Desabilita o botão |
| onClick | () => void | - | Callback de clique |

### Exemplos

\`\`\`tsx
// Básico
<Button>Clique aqui</Button>

// Com variante
<Button variant="secondary">Cancelar</Button>

// Com tamanho
<Button size="lg">Ação Principal</Button>
\`\`\`

### Acessibilidade

- Usa `<button>` nativo
- Suporta navegação por teclado
- Estados de foco visíveis
```

---

## Changelog

### Formato (Keep a Changelog)

```markdown
# Changelog

Todas as mudanças notáveis serão documentadas aqui.

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

## [Unreleased]

### Added
- Nova feature X

### Changed
- Comportamento Y modificado

### Fixed
- Bug Z corrigido

## [1.2.0] - 2025-01-08

### Added
- Suporte a tema escuro (#123)
- Novo componente Card (#124)

### Changed
- Refatorado sistema de autenticação (#125)

### Fixed
- Corrigido bug de layout no mobile (#126)

### Deprecated
- Função `oldMethod()` será removida na v2.0

### Removed
- Removido suporte a Node 16

### Security
- Atualizada dependência com vulnerabilidade (#127)

## [1.1.0] - 2025-01-01
...
```

---

## ADR (Architecture Decision Record)

### Template

```markdown
# ADR-NNN: Título da Decisão

## Status

Proposto | Aceito | Deprecado | Substituído por [ADR-XXX]

## Contexto

[Descreva o contexto e o problema que levou a essa decisão]

## Decisão

[Descreva a decisão tomada]

## Consequências

### Positivas
- [Benefício 1]
- [Benefício 2]

### Negativas
- [Trade-off 1]
- [Trade-off 2]

## Alternativas Consideradas

### Alternativa 1
- Prós: ...
- Contras: ...
- Por que rejeitada: ...

### Alternativa 2
- Prós: ...
- Contras: ...
- Por que rejeitada: ...
```

---

## Boas Práticas

### Escrita

- **Seja conciso**: Menos é mais
- **Use exemplos**: Código vale mais que explicação
- **Mantenha atualizado**: Doc desatualizada é pior que nenhuma
- **Organize bem**: Estrutura clara facilita navegação

### Manutenção

```markdown
# Processo de Atualização de Docs

1. **Ao criar feature**: Atualizar docs junto com o código
2. **Ao modificar**: Verificar se docs precisam atualizar
3. **Review**: Incluir docs no code review
4. **Periodicidade**: Revisar docs a cada trimestre
```

### Checklist de Doc

- [ ] Atualizada com última mudança de código
- [ ] Exemplos funcionam
- [ ] Links não estão quebrados
- [ ] Sem informações duplicadas
- [ ] Fácil de encontrar via busca

---

## Anti-Padrões

| ❌ Evite | ✅ Prefira |
|----------|-----------|
| Documentar óbvio | Documentar decisões e contexto |
| Duplicar informação | Linkar para fonte única |
| Doc separada do código | Doc próxima ao código |
| Atualizar só no final | Atualizar junto com código |
| Texto sem exemplos | Exemplos funcionais |
| Jargão sem explicação | Linguagem clara |

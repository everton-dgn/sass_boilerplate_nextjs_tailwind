---
name: skill-code-review
description: |
  Use este skill quando o usuário pedir para "revisar código", "code review",
  "revisar PR", "verificar qualidade", "analisar mudanças", ou mencionar
  revisão de pull request, verificação de qualidade ou feedback sobre código.
  É também o roteiro do review automático de PRs no CI
  (.github/workflows/claude-code-review.yml).
  Use /skill-code-review para review estruturado.
argument-hint: "[PR | escopo]"
model: opus
user-invocable: true
---

# Code Review

## Objetivo

Roteiro de code review deste repositório. O review existe para capturar o
que as máquinas não capturam: bugs de lógica, edge cases, decisões de
arquitetura, ausência de código esperado e violações de convenção que
exigem contexto. O valor do reviewer está em pensar o que pode quebrar —
não em conferir convenções que Biome, typecheck e testes já cobrem.

Precisão vem antes de volume: um achado falso com autoridade custa a
confiança de todos os achados seguintes.

## Contextos de execução

| Contexto | Escopo do review | Saída |
|----------|------------------|-------|
| CI (GitHub Actions) | Arquivos alterados no PR (contexto fornecido pelo action) | Relatório único em markdown no comentário do PR |
| Local com argumento | O escopo em **$ARGUMENTS** (PR, arquivos ou pasta) | Relatório no chat |
| Local sem argumento | `git diff HEAD` + arquivos novos (untracked) | Relatório no chat |

### Regras do CI (contexto de produção)

- A saída é UM comentário de PR. Você não aprova, não bloqueia o merge,
  não posta comentários inline e não executa comandos no runner.
- "Revisar só o que mudou" é o escopo do COMENTÁRIO. A INVESTIGAÇÃO deve
  ler arquivos adjacentes disponíveis (usos do símbolo, mensagens i18n,
  schemas de env) para confirmar suspeitas.
- Arquivo ou regra fora do contexto acessível: declare "não verificável
  no contexto do CI" e rebaixe ou omita o achado. Não finja verificação
  e não invente conteúdo de arquivo que você não leu.

Localmente a investigação é livre: `git diff`, `git log`, leitura de
arquivos, busca no projeto e validações read-only (`pnpm typecheck`,
`pnpm test`, `pnpm lint`) para confirmar ou refutar hipóteses. Sem
mutações: não edite arquivos, não faça commit/push e não publique nada
no GitHub sem pedido explícito. No relatório, liste as validações
realmente executadas (se nenhuma, escreva "Nenhuma").

## Fontes da verdade

Antes de apontar violação de convenção, confirme que a regra existe — e
cite a fonte no achado:

- `CLAUDE.md` — regras críticas, limites de tamanho e escopo de alterações
- `docs/reference/styleguide.md` — padrões de código e estilização
- `docs/reference/quality-constraints.md` — restrições de qualidade
- `docs/decisions/` — ADRs (zero comentários, Atomic Design, shadcn/ui,
  Tailwind, lucide-react)

## Processo

### 1. Entender a intenção

Leia título, descrição e, quando disponíveis no contexto, os commits do
PR (ou o pedido do usuário) antes de criticar qualquer linha. Um review
que ignora a intenção da mudança gera ruído, não qualidade.

### 2. Delimitar o escopo

Comente apenas sobre o que mudou. Problema pré-existente fora do diff:
no máximo 1 menção agregada no fim do relatório, sem bloquear o PR.
Exceção: se o PR agrava um problema pré-existente, trate como achado
normal do diff.

### 3. Formular hipóteses de risco (antes de qualquer checklist)

Escreva 2-5 hipóteses concretas do que poderia estar errado NESTA
mudança específica, no gabarito:

- "Se o input for X, o código retorna Y, mas deveria Z porque…"
- "Se o componente re-renderizar com P=undefined, quebra em…"
- "Este handler mexe em dados mas não vejo autorização porque…"

Perguntas-guia para gerar hipóteses:

- Esta mudança pode quebrar em produção? Como? (estado, concorrência,
  auth, fronteira server/client, cache)
- Há efeito colateral fora dos arquivos tocados? (consumidores, rotas,
  env, i18n, invalidação de cache)
- O que passa em lint/typecheck/testes e ainda assim quebra?
- O que DEVERIA estar neste diff e não está?

Depois das hipóteses, escolha 2-4 lentes de leitura conforme os
arquivos do diff — não use todas automaticamente:

- Fluxo do usuário: estados vazio/erro/loading, navegação, responsivo
- Runtime Next.js: RSC/Client, cache, redirects, Server Actions,
  hydration
- React: effects e deps, memoização, keys, re-renders com impacto real
- TypeScript: contratos quebrados, `any`, asserts perigosos, narrowing
- Dados e cache: React Query keys, invalidação, race conditions
- Estado global: Zustand persist, migração, hidratação, serialização
- Formulários: schema Zod, validação client/servidor, mensagens
  traduzidas, submissão duplicada
- HTTP: Axios interceptors, cancelamento, headers, erro normalizado
- i18n, acessibilidade, segurança e testes: guiados pelo checklist
  abaixo

Cada hipótese vira uma investigação (passo 4). Hipótese refutada é
descartada em silêncio — não conta para o limite de achados. Este passo
vem antes do checklist de propósito: revisão dirigida por hipóteses
detecta mais defeitos do que conferência de lista.

### 4. Investigar antes de afirmar

Para cada hipótese ou suspeita:

1. Leia o arquivo completo, não só o hunk do diff
2. Verifique os usos do símbolo — por busca real no projeto (local) ou
   nos arquivos do contexto (CI); nunca "de memória"
3. Confirme a regra na fonte (`CLAUDE.md`, `docs/`)
4. "Mesmo problema em N lugares" exige busca real das ocorrências;
   liste os arquivos no achado

Suspeita não confirmada não vira achado. No CI, o que não puder ser
verificado é declarado como tal ou omitido — nunca afirmado.

### 5. Aplicar o checklist do repositório

> O checklist é piso, não teto. Ele cobre as convenções do repositório —
> não é a lista exaustiva de riscos. Problema real sem item
> correspondente (race condition, invalidação faltando, estado
> dessincronizado, hydration mismatch): reporte mesmo assim, com
> prioridade alta. Um bug de lógica fora da lista vale mais que dez
> convenções confirmadas. Item sem relação com o diff é ignorado, não
> marcado como conferido.

> Itens de convenção: publique apenas o que Biome/typecheck NÃO pegam —
> essas ferramentas já rodam no CI. Na dúvida sobre o que o Biome
> cobre, confirme em `biome.json`, na raiz do repositório.

**Correção e lógica (prioridade máxima):**
- [ ] Edge cases tratados (vazio, erro, loading, concorrência,
      permissões)
- [ ] Promises com `await`/tratamento; condições e negações corretas
- [ ] Mudança de comportamento coberta por teste que realmente prova o
      comportamento (leia o teste, não só confira que existe)
- [ ] Fronteira Server/Client: hook, estado e API de browser só em
      Client Component; `'use client'` apenas onde há estado, efeitos,
      eventos ou APIs de browser; segredo/lógica de servidor não vaza
      para o client; props server→client serializáveis
- [ ] Server Action valida input e autoriza NO SERVIDOR (não confia no
      client)
- [ ] APIs assíncronas do App Router (`params`, `searchParams`,
      `cookies()`, `headers()`) tratadas como Promise
- [ ] `useEffect`: deps corretas, cleanup de subscription/timer, sem
      stale closure; `key` estável em listas
- [ ] React Query: `queryKey` estável e invalidação alinhada à mutação
- [ ] Zustand: update imutável (immer); `persist` com
      `partialize`/`migrate` quando o schema do store muda
- [ ] Cache e hydration: dado dinâmico não cacheado indevidamente
      (`cacheComponents`); sem hydration mismatch

**Ausência de código (o que deveria estar no diff e não está):**
- [ ] Autorização/validação onde dados são lidos ou mutados
- [ ] Estados de loading e erro em fluxo assíncrono de UI
- [ ] Error boundary/fallback quando há import dinâmico ou suspense
- [ ] Teste para comportamento novo

**Convenções críticas (fonte: `CLAUDE.md`):**
- [ ] Sem barrel files; sem `biome-ignore` ou override de regras do Biome
- [ ] Zero comentários no código (exceção: `// TODO: TICKET-123`)
- [ ] `type` em vez de `interface`; arrow functions com `const`;
      `import type`; sem `enum`
- [ ] Limites: `.tsx` até 150 linhas; módulos `.ts` até 80 linhas
- [ ] Estrutura 1:1: pasta com `index.ts(x)` + `types.ts` +
      `__tests__/test.ts(x)`
- [ ] Imports com alias `@/` (sem imports profundos); `'.'`/`'..'`
      (não `./index`)
- [ ] Coesão: helper com 1 consumidor mora na pasta do consumidor

**Componentes:**
- [ ] Estrutura `ComponentName/` com `index.tsx`, `types.ts` e
      `__tests__/test.tsx`; Atomic Design (atoms → molecules →
      organisms); exportação nomeada; dados estáticos (3+ itens) em
      `constants.ts`

**Estilização (Tailwind CSS v4 + shadcn/ui):**
- [ ] Classes Tailwind no JSX, `cn()` para condicionais
- [ ] Cores semânticas (tokens shadcn) para UI
- [ ] Fonte mínima `text-xs`
- [ ] CSS customizado em `globals.css` dentro de `@layer base`

**Hooks:**
- [ ] Prefixo `use`, em `src/hooks/`
- [ ] Sem `'use client'` no hook (a diretiva pertence ao componente
      consumidor)

**i18n (next-intl):**
- [ ] Textos visíveis via mensagens em `src/i18n/messages/`, sem strings
      hardcoded
- [ ] Chave nova em TODOS os idiomas configurados em `src/i18n/`, com
      os mesmos placeholders (`{var}`) e a mesma pluralização

**Acessibilidade (só com evidência no código):**
- [ ] Elementos semânticos; labels em inputs; alt em imagens
- [ ] Teclado: sinalize com evidência concreta (ex.: `onClick` em
      elemento não interativo sem `role`/`tabIndex`)
- [ ] Contraste: sinalize apenas defeito evidente; não estime razão de
      contraste lendo classes — sem ferramenta é chute

**Testes:**
- [ ] Arquivo `__tests__/test.ts(x)`; `describe` no padrão `[tipo] nome`;
      `it` em inglês com prefixo `should`
- [ ] Sem imports de `vitest` (globals habilitados)
- [ ] Teste nunca afrouxado para passar

**Segurança:**
- [ ] Sem secrets ou tokens no código
- [ ] Env novas passam pelos schemas Zod de `src/constants/`
      (`clientEnv`, `serverEnv`, `sharedEnv`)
- [ ] Nenhum dado sensível em variável `NEXT_PUBLIC_*`
- [ ] Input do usuário validado (Zod); output escapado
- [ ] `dangerouslySetInnerHTML` só com conteúdo sanitizado
- [ ] URL de request ou destino de redirect derivado de input do
      usuário é validado (SSRF, open redirect)

### 6. Filtrar por evidência

Cada achado publicado precisa de evidência checável: um cenário de
falha concreto OU uma regra citada da fonte. A sua sensação de confiança
não é critério — exija a prova, não a convicção.

- Não confirmou com leitura/busca real? Não publique.
- Biome ou typecheck pegariam de forma direta? Não publique. Um teste
  pegaria, mas o diff revela a causa de uma regressão? Publique
  explicando o impacto comportamental.
- Gosto pessoal sem regra documentada? Não publique.
- Achado não carrega hedging ("parece", "talvez", "possivelmente"):
  ou tem evidência e é afirmado, ou vira 💬 — ou é omitido.
- Mesmo problema em N lugares? 1 achado com a lista de ocorrências.
- Máximo 10 achados, cortando de baixo para cima (💬 → 🟢 → 🟡);
  🔴 nunca são cortados pelo teto. 🟢 podem ser agrupados por tema em
  um único achado.
- PR grande (15+ arquivos): priorize por risco — actions, hooks, store,
  server components e schemas primeiro; CSS e constantes por último.
  Declare no resumo o que foi coberto com profundidade e o que ficou
  amostral.

O custo de cada comentário recai no autor do PR, e falso positivo em
excesso faz o review inteiro ser ignorado — na dúvida, corte.

### 7. Publicar o relatório

Raciocine livremente primeiro (hipóteses, investigação, análise); monte
o relatório no template só no final — formatar durante o raciocínio
degrada a análise.

Sempre em PT-BR (código e trechos citados permanecem em inglês). O
relatório é único e autossuficiente — no CI ele vira o comentário do PR.

````markdown
## Code Review — PR #N (ou escopo local)

**Veredicto** (recomendação — o gate é humano; no CI isto é um
comentário, não uma aprovação):
✅ Sem bloqueios | 💬 Sem bloqueios, com sugestões | 🛑 Correções
necessárias antes do merge | ⚪ Inconclusiva (evidência insuficiente)

**Achados**: N 🔴 · N 🟡 · N 🟢 · N 💬

### Resumo

1-3 frases: o que o PR faz e a impressão geral.

### Achados

#### 🔴 [caminho/arquivo.ts:42] Título curto

**Problema:** o que está errado.
**Cenário de falha:** input/estado concreto → efeito errado observável.
**Fonte:** regra violada, quando for convenção (ex.: CLAUDE.md > Limites).
**Sugestão:** descreva a correção. Bloco de código somente quando a
mudança for pequena e não depender de decisão de produto/arquitetura.

(repetir por achado, em ordem de severidade)

### Fora do diff (não bloqueante)

- Problema pré-existente relevante, se houver (máx. 1 item agregado).

### Limitações da análise

- Opcional. Somente o que afeta o veredicto: arquivo inacessível,
  validação não executável, contexto insuficiente. No modo local,
  liste as validações executadas (se nenhuma, "Nenhuma").

### O que está bom

- Somente com dado concreto verificável (ex.: "o teste cobre os 3 ramos
  do switch", "componente caiu de 180 para 70 linhas"). Sem dado, omita
  a seção inteira.
````

### Severidades

- 🔴 **Bloqueante** — exige cenário de falha concreto (bug, regressão,
  vulnerabilidade) OU violação de regra OBRIGATÓRIA do `CLAUDE.md` com
  impacto real no PR. Convenção sem quebra de build/comportamento é no
  máximo 🟡. Recomende não fazer merge antes de corrigir — não afirme
  que o merge está travado.
- 🟡 **Corrigir** — cenário de falha existe, mas o impacto é limitado
  ou há solução de contorno aceitável; convenção RECOMENDADA violada.
- 🟢 **Sugestão** — melhoria opcional, ignorável sem prejuízo. Deixe
  o caráter opcional explícito.
- 💬 **Pergunta** — apenas com evidência concreta no diff e quando a
  resposta mudar a avaliação. No CI (comentário único, sem thread),
  prefira convertê-la em 🟢 observação.

**Assimetria**: um bloqueante falso custa mais que uma sugestão perdida —
na dúvida, rebaixe a severidade.

### Tom

- Sobre o código, nunca sobre a pessoa; específico e com sugestão de
  código quando ajudar
- Sugerir, não ordenar ("Que tal...", "Considere...")
- Reconhecer o que está bom quando houver motivo concreto

## Anti-padrões do reviewer

| ❌ Evite | ✅ Prefira |
|----------|-----------|
| Comentar sem verificar o código real | Ler arquivo + usos antes de publicar |
| Dezenas de comentários de ruído | Até 10 achados relevantes |
| Bloquear por estilo/formatação | Deixar para o Biome |
| Repetir o mesmo achado N vezes | 1 achado com lista de ocorrências |
| Exigir refatoração fora do escopo do PR | 🟢 sugestão futura, sem bloquear |
| Aprovar sem ler (rubber stamping) | Veredicto fundamentado em bugs e riscos confirmados |
| Tratar o checklist como o universo do review | Hipóteses de risco primeiro; checklist como piso |
| Confiar na própria sensação de certeza | Exigir cenário de falha ou fonte citada |

## Racional deste desenho (evidência)

- Hipóteses antes de checklist: leitura dirigida por
  perspectiva/cenário detecta mais defeitos que checklist e ad-hoc
  (Porter, Votta & Basili, IEEE TSE 1995; Laitenberger et al., TSE).
- Checklist como piso: LLMs ancoram em listas do prompt e estreitam o
  recall fora delas (anchoring em LLMs — EMNLP 2024, IEEE MIS 2025).
- Raciocinar livre antes de formatar: restrição de formato durante o
  raciocínio degrada a qualidade (Tam et al., EMNLP 2024,
  arXiv:2408.02442).
- Evidência externa por achado: autocrítica sem oráculo não corrige
  raciocínio (Huang et al., ICLR 2024, arXiv:2310.01798) e a confiança
  verbalizada é superestimada (Xiong et al., ICLR 2024,
  arXiv:2306.13063) — por isso o gate é cenário de falha ou fonte
  citada, nunca "confiança".
- Precisão antes de volume: acima de ~10% de falsos positivos os devs
  passam a ignorar a ferramenta (Sadowski et al., Google Tricorder,
  ICSE 2015); o esforço do autor cresce quase linearmente com o número
  de comentários (Google Research, 2024); reviewers LLM alucinam bugs
  sem gate de prova (CriticGPT — McAleese et al., OpenAI 2024,
  arXiv:2407.00215).

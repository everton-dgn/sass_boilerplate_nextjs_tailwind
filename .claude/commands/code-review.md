---
allowed-tools: Bash(gh issue view:*), Bash(gh search:*), Bash(gh issue list:*), Bash(gh pr comment:*), Bash(gh pr diff:*), Bash(gh pr view:*), Bash(gh pr list:*), Bash(gh api:*), Bash(gh repo view:*)
description: Revisar código de um pull request
model: opus
---

Faça uma revisão de código do pull request indicado.

**Premissas para todos os agentes e subagentes:**
- Todas as ferramentas estão funcionais e operarão sem erro. Não teste ferramentas nem faça chamadas exploratórias. Deixe isso claro para cada subagente lançado.
- Só chame uma ferramenta se ela for necessária para concluir a tarefa. Cada chamada deve ter um propósito claro.

Siga estes passos com precisão:

1. Lance um agente haiku para verificar se alguma das condições abaixo é verdadeira:
   - O pull request está fechado
   - O pull request é um rascunho (draft)
   - O pull request não precisa de revisão (ex.: PR automatizado, mudança trivial e obviamente correta)
   - Claude já comentou neste PR (verifique `gh pr view --comments` por comentários de claude)

   Se qualquer condição for verdadeira, pare e não prossiga. Obs.: PRs gerados pelo Claude ainda devem ser revisados.

2. Lance um agente haiku para retornar a lista de caminhos (não o conteúdo) de todos os arquivos CLAUDE.md relevantes, incluindo:
   - O arquivo CLAUDE.md raiz, se existir
   - Quaisquer arquivos CLAUDE.md em diretórios que contenham arquivos modificados pelo pull request

3. Lance um agente sonnet para visualizar o pull request e retornar um resumo das mudanças

4. Lance 4 agentes opus em paralelo para revisar as mudanças de forma independente. Cada agente deve retornar a lista de problemas encontrados, onde cada problema inclui uma descrição e o motivo pelo qual foi sinalizado (ex.: "conformidade com CLAUDE.md", "bug"). Os agentes devem fazer o seguinte:

   Agentes 1 e 2: agentes de conformidade com CLAUDE.md
   Auditam as mudanças em paralelo verificando conformidade com o CLAUDE.md. Obs.: ao avaliar conformidade para um arquivo, considere apenas os arquivos CLAUDE.md que compartilham o caminho do arquivo ou de seus diretórios pai.

   Agente 3: agente opus de bugs (subagente paralelo com o agente 4)
   Varre em busca de bugs óbvios. Foque apenas no diff sem ler contexto extra. Sinalize apenas bugs significativos; ignore nitpicks e possíveis falsos positivos. Não sinalize problemas que não possam ser validados sem contexto fora do git diff.

   Agente 4: agente opus de bugs (subagente paralelo com o agente 3)
   Procura problemas no código introduzido. Podem ser problemas de segurança, lógica incorreta, etc. Analise apenas o código dentro das mudanças.

   **CRÍTICO: Queremos apenas problemas de ALTO SINAL.** Sinalize problemas onde:
   - O código não compilará ou falhará no parse (erros de sintaxe, erros de tipo, imports ausentes, referências não resolvidas)
   - O código definitivamente produzirá resultados errados independentemente das entradas (erros de lógica claros)
   - Violações claras e inequívocas do CLAUDE.md onde você pode citar a regra exata sendo quebrada

   NÃO sinalize:
   - Preocupações de estilo ou qualidade de código
   - Problemas potenciais que dependem de entradas ou estado específicos
   - Sugestões subjetivas ou melhorias

   Se não tiver certeza de que um problema é real, não o sinalize. Falsos positivos destroem a confiança e desperdiçam o tempo dos revisores.

   Além disso, cada subagente deve receber o título e a descrição do PR para ter contexto sobre a intenção do autor.

5. Para cada problema encontrado pelos agentes 3 e 4 no passo anterior, lance subagentes paralelos para validar o problema. Esses subagentes devem receber o título e a descrição do PR junto com a descrição do problema. A tarefa do agente é revisar o problema e confirmar com alta confiança que ele é de fato um problema real. Por exemplo, se "variável não definida" foi sinalizado, o subagente deve validar que isso realmente é verdade no código. Para problemas de CLAUDE.md, o agente deve confirmar que a regra violada se aplica ao arquivo e que ela está de fato sendo violada. Use subagentes opus para bugs e problemas de lógica, e agentes sonnet para violações de CLAUDE.md.

6. Filtre os problemas que não foram validados no passo 5. Esta etapa resulta na lista final de problemas de alto sinal para a revisão.

7. Exiba um resumo dos resultados da revisão no terminal:
   - Se houver problemas, liste cada um com uma descrição breve.
   - Se não houver problemas, exiba: "Nenhum problema encontrado. Verificados bugs e conformidade com CLAUDE.md."

   Se o argumento `--comment` NÃO foi fornecido, pare aqui. Não poste comentários no GitHub.

   Se o argumento `--comment` FOI fornecido e NÃO há problemas, poste um comentário de resumo com `gh pr comment` e pare.

   Se o argumento `--comment` FOI fornecido e há problemas, continue para o passo 8.

8. Crie uma lista de todos os comentários que você planeja deixar. Isso é apenas para sua conferência interna. Não publique esta lista em lugar algum.

9. Obtenha o repositório e o SHA do HEAD do PR para os comentários inline:
   ```
   REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
   COMMIT_SHA=$(gh pr view <PR> --json headRefOid -q .headRefOid)
   ```

   Poste comentários inline para cada problema usando `gh api` no endpoint de review comments. Para cada comentário:
   ```
   gh api repos/$REPO/pulls/<PR>/comments \
     -f body="<descrição do problema>" \
     -f commit_id="$COMMIT_SHA" \
     -f path="<caminho/do/arquivo>" \
     -F line=<número-da-linha> \
     -f side="RIGHT"
   ```
   - Forneça uma descrição breve do problema
   - Para correções pequenas e independentes, inclua um bloco de sugestão commitável no body usando a sintaxe:
     ````
     ```suggestion
     código corrigido aqui
     ```
     ````
   - Para correções maiores (6+ linhas, mudanças estruturais ou que abrangem múltiplos locais), descreva o problema e a correção sugerida sem bloco de sugestão
   - Nunca poste uma sugestão commitável A MENOS que aplicá-la resolva completamente o problema. Se passos adicionais forem necessários, não inclua sugestão commitável.

   **IMPORTANTE: Poste apenas UM comentário por problema único. Não poste comentários duplicados.**

Use esta lista ao avaliar problemas nos passos 4 e 5 (são falsos positivos — NÃO sinalize):
- Problemas pré-existentes
- Algo que parece um bug mas está correto
- Nitpicks pedantes que um engenheiro sênior não sinalizaria
- Problemas que um linter detectaria (não execute o linter para verificar)
- Preocupações gerais de qualidade de código (ex.: falta de cobertura de testes, problemas gerais de segurança) a menos que explicitamente exigido no CLAUDE.md
- Problemas mencionados no CLAUDE.md mas explicitamente silenciados no código (ex.: via comentário de lint ignore)

Notas:
- Use o CLI `gh` para interagir com o GitHub (ex.: buscar pull requests, criar comentários). Não use web fetch.
- Crie uma lista de tarefas antes de começar.
- Cite e vincule cada problema nos comentários inline (ex.: se referenciar um CLAUDE.md, inclua um link para ele).
- Se nenhum problema for encontrado e o argumento `--comment` for fornecido, poste um comentário no seguinte formato:

---

## Code review

Nenhum problema encontrado. Verificados bugs e conformidade com CLAUDE.md.

---

- Ao vincular código em comentários inline, siga exatamente o formato abaixo, caso contrário o preview Markdown não renderizará corretamente:
  `https://github.com/owner/repo/blob/<sha-completo>/caminho/para/arquivo.ts#L10-L15`
  - Requer o sha completo do git — forneça o sha completo, não uma variável como `$(git rev-parse HEAD)`
  - O nome do repositório deve corresponder ao repositório que está sendo revisado
  - Sinal `#` após o nome do arquivo
  - Formato do intervalo de linhas: `L[início]-L[fim]`
  - Forneça pelo menos 1 linha de contexto antes e depois, centralizada na linha comentada (ex.: se comentar sobre as linhas 5-6, vincule a `L4-7`)

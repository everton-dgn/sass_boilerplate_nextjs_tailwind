# Regras de Experiência

Regras que definem experiência de uso, fluxos, permissões visíveis e feedback
de interface.

## Primeira experiência

### UX-001: Estado inicial

**Contexto**: A primeira tela precisa deixar claro o que o usuário pode fazer.

**Regra**: Toda tela inicial deve apresentar estado carregando, estado vazio,
estado com dados e estado de erro. O estado vazio deve incluir ação principal
quando houver uma próxima etapa clara.

**Exemplos**:
- Caso válido: lista vazia explica o conteúdo esperado e mostra CTA.
- Caso inválido: lista vazia renderiza apenas uma área em branco.

## Permissões e disponibilidade

### UX-002: Ações indisponíveis

**Contexto**: A interface precisa comunicar quando uma ação não pode ser usada.

**Regra**: Ações indisponíveis devem indicar motivo e, quando possível,
oferecer caminho de resolução. Não esconda ações necessárias para entender o
fluxo, a menos que a permissão seja sensível.

**Exceções**: Ações administrativas ou perigosas podem ser ocultadas para
papéis sem permissão.

## Feedback de ações

### UX-003: Feedback consistente

**Contexto**: O usuário precisa saber que sua ação foi processada.

**Regra**: Toda ação relevante deve ter feedback visual:
- **Imediato**: estado de loading no controle acionado.
- **Sucesso**: confirmação discreta e contextual.
- **Erro**: mensagem acessível com ação sugerida.
- **Longa duração**: progresso ou estado intermediário.

### UX-004: Ações destrutivas

**Contexto**: Exclusões acidentais causam perda de confiança.

**Regra**: Ações destrutivas devem exigir confirmação explícita e texto claro
sobre impacto, reversibilidade e próximos passos.

# Regras de Domínio

Regras que definem o problema atendido, as entidades principais e os
comportamentos que precisam ser consistentes em qualquer implementação.

## Como usar

Substitua os exemplos abaixo pelas regras reais do projeto quando o domínio
for definido.

### DOM-001: Entidade principal

**Contexto**: Todo projeto precisa nomear claramente sua entidade principal.

**Regra**: Defina o nome da entidade, seus estados possíveis e quais ações
podem alterar esses estados.

**Exemplos**:
- Caso válido: uma entidade muda de `draft` para `published` por ação explícita.
- Caso inválido: uma entidade publicada volta para `draft` sem auditoria.

**Exceções**: Documente exceções regulatórias, operacionais ou históricas.

### DOM-002: Limites operacionais

**Contexto**: Algumas operações podem ter limites por segurança, custo,
capacidade ou regra externa.

**Regra**: Para cada limite, documente valor, unidade, janela de tempo,
comportamento ao exceder e mensagem exibida ao usuário.

**Exemplos**:
- Limite diário de criação de registros.
- Limite de tamanho para upload.
- Limite de tentativas para uma ação sensível.

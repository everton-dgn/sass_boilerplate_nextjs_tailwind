# Regras de Negócio

Regras que definem o modelo de negócio, monetização e operação comercial
do SaaS.

## Planos e assinaturas

### BIZ-001: Estrutura de planos

**Contexto**: Todo SaaS precisa de uma hierarquia clara de planos.

**Regra**: O sistema deve suportar no mínimo três níveis de plano:
Free, Pro e Enterprise. Cada plano define limites de recursos
e funcionalidades disponíveis.

**Exemplos**:
- Free: até 3 projetos, 1 usuário
- Pro: até 50 projetos, 10 usuários
- Enterprise: ilimitado, suporte prioritário

### BIZ-002: Período de trial

**Contexto**: Novos usuários precisam experimentar antes de pagar.

**Regra**: O trial do plano Pro dura 14 dias. Ao expirar, a conta
retorna ao plano Free sem perda de dados. Funcionalidades Pro
ficam em modo somente leitura.

**Exceções**: Contas criadas via convite Enterprise não passam por trial.

## Billing e pagamentos

### BIZ-003: Ciclo de cobrança

**Contexto**: Previsibilidade de receita e experiência do cliente.

**Regra**: Cobranças são mensais ou anuais (com desconto). O ciclo
inicia na data da assinatura. Upgrades são cobrados pro-rata.
Downgrades entram em vigor no próximo ciclo.

### BIZ-004: Falha de pagamento

**Contexto**: Cartões expiram, saldo insuficiente acontece.

**Regra**: Após falha de pagamento, o sistema faz 3 tentativas
automáticas (dias 1, 3 e 7). Notifica o usuário a cada tentativa.
Após a terceira falha, a conta entra em estado de suspensão
(funcionalidades bloqueadas, dados preservados por 30 dias).

## Limites e cotas

### BIZ-005: Limites por plano

**Contexto**: Limites incentivam upgrade e protegem a infraestrutura.

**Regra**: Cada recurso limitado deve ter:
- Limite definido por plano
- Contador visível ao usuário
- Alerta ao atingir 80% do limite
- Bloqueio suave ao atingir 100% (operações de leitura continuam)

### BIZ-006: Rate limiting por plano

**Contexto**: Proteção da API contra abuso, diferenciada por plano.

**Regra**: Limites de requisição por minuto:
- Free: 60 req/min
- Pro: 300 req/min
- Enterprise: 1000 req/min (configurável)

**Exceções**: Webhooks recebidos não contam no rate limit do usuário.

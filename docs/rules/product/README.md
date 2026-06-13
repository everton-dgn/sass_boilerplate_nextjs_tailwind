# Regras de Produto

Regras que definem a experiência do usuário, funcionalidades
e comportamentos do produto.

## Onboarding

### PRD-001: Fluxo de primeiro acesso

**Contexto**: Primeira impressão define retenção.

**Regra**: Após o cadastro, o usuário deve passar por um fluxo
guiado de 3 etapas:
1. Completar perfil (nome, avatar)
2. Criar ou entrar em uma organização
3. Configuração inicial do workspace

O fluxo pode ser pulado, mas um indicador de "setup incompleto"
permanece visível até conclusão.

### PRD-002: Empty states

**Contexto**: Telas vazias são oportunidades de engajamento.

**Regra**: Todo empty state deve conter:
- Ilustração ou ícone contextual
- Texto explicando o que aparecerá ali
- CTA primário para a ação que popula a tela

**Exemplos**:
- Lista de projetos vazia: "Crie seu primeiro projeto" + botão
- Dashboard sem dados: "Comece adicionando dados" + link para import

## Permissões por plano

### PRD-003: Feature gating

**Contexto**: Funcionalidades premium devem ser visíveis mas
bloqueadas para planos inferiores.

**Regra**: Features de planos superiores são exibidas no UI
com indicador visual (badge "Pro", ícone de cadeado). Ao clicar,
o sistema exibe modal de upgrade com benefícios do plano superior.

**Exceções**: Features Enterprise são completamente ocultas para
usuários Free (evitar confusão com funcionalidades muito avançadas).

### PRD-004: Degradação de plano

**Contexto**: Ao fazer downgrade, o usuário pode ter mais recursos
do que o novo plano permite.

**Regra**: Recursos existentes não são deletados no downgrade.
Ficam em modo somente leitura até que o usuário reduza manualmente
ou faça upgrade novamente. O sistema indica quais recursos excedem
o limite.

## Notificações

### PRD-005: Canais de notificação

**Contexto**: Usuários precisam ser informados sem serem incomodados.

**Regra**: Três canais disponíveis:
- **In-app**: Toast para ações imediatas, badge para pendências
- **Email**: Eventos importantes (billing, segurança, convites)
- **Push** (opcional): Apenas se o usuário optar

O usuário pode configurar preferências por canal e por tipo
de notificação.

### PRD-006: Frequência de emails

**Contexto**: Excesso de email causa unsubscribe.

**Regra**: Máximo de 1 email de marketing por semana. Emails
transacionais (reset de senha, confirmação) não têm limite
mas devem ser agrupados quando possível (digest de notificações
a cada 4 horas em vez de email individual).

## Fluxos de usuário

### PRD-007: Ações destrutivas

**Contexto**: Exclusões acidentais causam frustração e churn.

**Regra**: Toda ação destrutiva (excluir projeto, remover membro,
cancelar assinatura) deve:
1. Exigir confirmação explícita (modal com texto descritivo)
2. Para exclusões irreversíveis: exigir digitação do nome do recurso
3. Soft delete com período de recuperação de 30 dias

### PRD-008: Feedback de ações

**Contexto**: O usuário precisa saber que sua ação foi processada.

**Regra**: Toda ação do usuário deve ter feedback visual:
- **Imediato** (< 100ms): Estado de loading no botão/elemento
- **Sucesso**: Toast de confirmação com descrição da ação
- **Erro**: Toast de erro com mensagem acessível e ação sugerida
- **Longa duração** (> 3s): Progress indicator com possibilidade
  de cancelar

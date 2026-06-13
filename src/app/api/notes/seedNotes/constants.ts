type SeedNote = {
  title: string
  content: string
  createdDaysAgo: number
  updatedDaysAgo: number
}

export const SEED_NOTES: SeedNote[] = [
  {
    title: 'Bem-vindo ao Notes',
    content: 'Esta é uma demonstração de CRUD com React Query.',
    createdDaysAgo: 8,
    updatedDaysAgo: 8
  },
  {
    title: 'Atualização Otimista',
    content: 'Edite esta nota e veja a UI atualizar instantaneamente.',
    createdDaysAgo: 7,
    updatedDaysAgo: 5
  },
  {
    title: 'Invalidação de Cache',
    content: 'Ao criar ou excluir, o cache é invalidado automaticamente.',
    createdDaysAgo: 6,
    updatedDaysAgo: 6
  },
  {
    title: 'Paginação Infinita',
    content: 'Use o botão "Mostrar mais" para carregar mais notas.',
    createdDaysAgo: 5,
    updatedDaysAgo: 4
  },
  {
    title: 'Data Mapper',
    content: 'A API retorna snake_case, o domínio usa camelCase.',
    createdDaysAgo: 4,
    updatedDaysAgo: 3
  },
  {
    title: 'Formulários com Zod',
    content: 'Validação client-side usando Zod + React Hook Form.',
    createdDaysAgo: 3,
    updatedDaysAgo: 2
  },
  {
    title: 'Prefetch no Servidor',
    content: 'Os dados iniciais são pré-carregados via Server Component.',
    createdDaysAgo: 2,
    updatedDaysAgo: 1
  },
  {
    title: 'Loading States',
    content: 'Skeleton loaders aparecem durante o carregamento inicial.',
    createdDaysAgo: 1,
    updatedDaysAgo: 1
  },
  {
    title: 'Error Handling',
    content: 'Erros de rede são tratados com estados visuais claros.',
    createdDaysAgo: 0,
    updatedDaysAgo: 0
  }
]

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Notas',
  description:
    'Demonstração de mutations com React Query: CRUD completo com atualização otimista'
}

const NotesLayout = ({ children }: { children: ReactNode }) => children

export default NotesLayout

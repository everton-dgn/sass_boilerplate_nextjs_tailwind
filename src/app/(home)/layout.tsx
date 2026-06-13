import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Boilerplate SaaS com Next.js e Tailwind CSS'
}

const HomeLayout = ({ children }: { children: ReactNode }) => children

export default HomeLayout

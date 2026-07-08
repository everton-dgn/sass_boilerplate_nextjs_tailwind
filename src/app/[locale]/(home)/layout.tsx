import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import type { LocaleLayoutProps } from '../types'

export const generateMetadata = async ({
  params
}: Omit<LocaleLayoutProps, 'children'>): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata.home' })

  return {
    title: t('title'),
    description: t('description')
  }
}

const HomeLayout = ({ children }: LocaleLayoutProps) => children

export default HomeLayout

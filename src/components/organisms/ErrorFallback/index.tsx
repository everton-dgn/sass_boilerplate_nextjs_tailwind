'use client'

import { useTranslations } from 'next-intl'

import { Button } from '@/components/atoms/Button'

import type { ErrorFallbackProps } from './types'

export const ErrorFallback = ({
  reset,
  messageKey = 'notFound',
  actionKey = 'tryAgain'
}: ErrorFallbackProps) => {
  const t = useTranslations('Error')

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-2">
      <header className="mb-8 font-medium text-4xl">{t('title')}</header>
      <main className="flex w-full flex-col items-center gap-2">
        <h1 className="text-center font-medium text-3xl">{t(messageKey)}</h1>
        <Button label={t(actionKey)} onClick={reset} />
      </main>
    </div>
  )
}

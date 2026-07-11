'use client'

import { ArrowLeft, RotateCcw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useId } from 'react'

import { Button } from '@/components/atoms/Button'

import type { ErrorFallbackProps } from './types'

export const ErrorFallback = ({
  reset,
  messageKey = 'notFound',
  actionKey = 'tryAgain'
}: ErrorFallbackProps) => {
  const t = useTranslations('Error')
  const titleId = useId()
  const descriptionId = useId()
  const isNotFound = messageKey === 'notFound'
  const ActionIcon = actionKey === 'backToHome' ? ArrowLeft : RotateCcw
  const descriptionKey = isNotFound
    ? 'notFoundDescription'
    : 'somethingWrongDescription'

  return (
    <main
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-muted/40 via-background to-background px-4 pt-24 pb-10 sm:px-6"
      data-error-variant={isNotFound ? 'not-found' : 'runtime'}
    >
      <div
        aria-hidden
        className="-translate-1/2 absolute top-1/2 left-1/2 size-80 rounded-full bg-primary/5 blur-3xl sm:size-112"
      />
      <section
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        className="relative flex w-full max-w-3xl flex-col items-center text-center"
      >
        <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/90 px-3.5 py-1.5 font-medium text-foreground text-xs uppercase tracking-[0.16em] shadow-foreground/10 shadow-xs backdrop-blur-sm dark:border-foreground/10 dark:bg-muted/50 dark:text-foreground/70 dark:shadow-none">
          <span
            aria-hidden
            className="size-1.5 rounded-full bg-foreground ring-4 ring-foreground/10 dark:bg-foreground/60 dark:ring-foreground/5"
          />
          {isNotFound ? '404' : t('title')}
        </p>
        <h1
          className="max-w-2xl text-balance font-semibold text-4xl tracking-tight sm:text-6xl"
          id={titleId}
        >
          {t(messageKey)}
        </h1>
        <p
          className="mt-5 max-w-xl text-balance text-base text-muted-foreground leading-7 sm:text-lg"
          id={descriptionId}
        >
          {t(descriptionKey)}
        </p>
        <Button
          className="mt-10 min-w-40 rounded-full"
          onClick={reset}
          size="lg"
        >
          <ActionIcon aria-hidden className="size-4" />
          <span>{t(actionKey)}</span>
        </Button>
      </section>
    </main>
  )
}

'use client'

import { Button } from '@/components/atoms/Button'

import type { ErrorFallbackProps } from './types'

export const ErrorFallback = ({ reset }: ErrorFallbackProps) => (
  <div className="flex min-h-screen w-full flex-col items-center justify-center p-2">
    <header className="mb-8 font-medium text-4xl">Error!</header>
    <main className="flex w-full flex-col items-center gap-2">
      <h1 className="text-center font-medium text-3xl">Page not found!</h1>
      <Button label="Try again" onClick={reset} />
    </main>
  </div>
)

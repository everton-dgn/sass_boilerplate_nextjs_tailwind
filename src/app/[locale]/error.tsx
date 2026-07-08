'use client'

import { useEffect } from 'react'

import { ErrorFallback } from '@/components/organisms/ErrorFallback'
import { reportRuntimeError } from '@/helpers/reportRuntimeError'

import type { ErrorPageProps } from '../types'

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  useEffect(() => {
    reportRuntimeError(error)
  }, [error])

  return <ErrorFallback messageKey="somethingWrong" reset={reset} />
}

export default ErrorPage

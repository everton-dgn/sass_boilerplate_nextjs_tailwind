'use client'

import { useEffect } from 'react'

import { ErrorFallback } from '@/components/organisms/ErrorFallback'
import { reportRuntimeError } from '@/helpers/reportRuntimeError'

import type { ErrorPageProps } from '../types'

const ErrorPage = (props: ErrorPageProps) => {
  const { error } = props
  const unstableRetry = props.unstable_retry

  useEffect(() => {
    reportRuntimeError(error)
  }, [error])

  return <ErrorFallback messageKey="somethingWrong" reset={unstableRetry} />
}

export default ErrorPage

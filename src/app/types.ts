type ErrorRetryProps = Record<'unstable_retry', () => void>

export type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
} & ErrorRetryProps

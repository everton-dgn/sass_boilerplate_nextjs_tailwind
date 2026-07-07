export type ErrorFallbackProps = {
  reset?: () => void
  messageKey?: 'notFound' | 'somethingWrong'
  actionKey?: 'tryAgain' | 'backToHome'
}

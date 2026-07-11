'use client'

import { ErrorFallback } from '@/components/organisms/ErrorFallback'
import { useRouter } from '@/i18n/navigation'

const NotFound = () => {
  const { replace } = useRouter()

  return <ErrorFallback actionKey="backToHome" reset={() => replace('/')} />
}

export default NotFound

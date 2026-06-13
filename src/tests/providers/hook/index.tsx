import type { ReactNode } from 'react'

import { type RenderHookResult, renderHook } from '@testing-library/react'

import { TestProvider } from '../TestProvider'

import type { WrapperProps } from './types'

const wrapper = ({ children }: WrapperProps): ReactNode => (
  <TestProvider>{children}</TestProvider>
)

export const renderHooksProvider = <T,>(
  callback: () => T
): RenderHookResult<T, unknown> => {
  return renderHook(callback, { wrapper })
}

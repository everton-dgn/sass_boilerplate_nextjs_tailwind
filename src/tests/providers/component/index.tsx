import { type RenderResult, render } from '@testing-library/react'
import type { ReactNode } from 'react'

import { TestProvider } from '../TestProvider'

export const renderWithProviders = (children: ReactNode): RenderResult =>
  render(<TestProvider>{children}</TestProvider>)

import type { ComponentProps, ReactNode } from 'react'

import type { Content } from '@radix-ui/react-dialog'

export type DialogContentProps = ComponentProps<typeof Content>

export type DialogHeaderProps = {
  className?: string
  children?: ReactNode
}

export type DialogFooterProps = {
  className?: string
  children?: ReactNode
}

import type { Content } from '@radix-ui/react-dialog'
import type { ComponentProps, ReactNode } from 'react'

export type DialogContentProps = ComponentProps<typeof Content>

export type DialogHeaderProps = {
  className?: string
  children?: ReactNode
}

export type DialogFooterProps = {
  className?: string
  children?: ReactNode
}

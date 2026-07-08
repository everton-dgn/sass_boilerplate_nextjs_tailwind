'use client'

import {
  Close,
  Content,
  Description,
  Overlay,
  Portal,
  Title
} from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ComponentProps } from 'react'

import { cn } from '@/helpers/cn'

import type {
  DialogContentProps,
  DialogFooterProps,
  DialogHeaderProps
} from './types'

const DialogOverlay = ({
  className,
  ref,
  ...props
}: ComponentProps<typeof Overlay>) => (
  <Overlay
    className={cn(
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'fixed inset-0 z-50 bg-black/80',
      'data-[state=closed]:animate-out data-[state=open]:animate-in',
      className
    )}
    ref={ref}
    {...props}
  />
)

export const DialogContent = ({
  className,
  children,
  ref,
  ...props
}: DialogContentProps) => (
  <Portal>
    <DialogOverlay />
    <Content
      className={cn(
        'fixed top-[50%] left-[50%] z-50 w-full max-w-lg',
        'translate-x-[-50%] translate-y-[-50%]',
        'flex flex-col gap-4',
        'rounded-lg border bg-background p-6 shadow-lg',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[state=closed]:animate-out data-[state=open]:animate-in',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
      <Close
        className={cn(
          'absolute top-4 right-4 rounded-sm opacity-70',
          'ring-offset-background transition-opacity',
          'hover:opacity-100',
          'focus:outline-none focus:ring-2 focus:ring-ring',
          'focus:ring-offset-2',
          'disabled:pointer-events-none',
          'data-[state=open]:bg-accent',
          'data-[state=open]:text-muted-foreground',
          'cursor-pointer'
        )}
      >
        <X className="size-4" />
      </Close>
    </Content>
  </Portal>
)

export const DialogHeader = ({ className, ...props }: DialogHeaderProps) => (
  <div
    className={cn('flex flex-col gap-1.5 text-center sm:text-left', className)}
    {...props}
  />
)

export const DialogFooter = ({ className, ...props }: DialogFooterProps) => (
  <div
    className={cn(
      'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
      className
    )}
    {...props}
  />
)

export const DialogTitle = ({
  className,
  ref,
  ...props
}: ComponentProps<typeof Title>) => (
  <Title
    className={cn(
      'font-semibold text-lg leading-none tracking-tight',
      className
    )}
    ref={ref}
    {...props}
  />
)

export const DialogDescription = ({
  className,
  ref,
  ...props
}: ComponentProps<typeof Description>) => (
  <Description
    className={cn('text-muted-foreground text-sm', className)}
    ref={ref}
    {...props}
  />
)

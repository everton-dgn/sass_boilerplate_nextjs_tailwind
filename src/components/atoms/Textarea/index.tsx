'use client'

import { tv, type VariantProps } from 'tailwind-variants'

import type { TextareaProps } from './types'

const textareaVariants = tv({
  base: [
    'flex min-h-20 w-full rounded-md border px-3 py-2',
    'bg-transparent text-sm transition-colors',
    'resize-none',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-[3px]',
    'focus-visible:ring-ring/50',
    'disabled:cursor-not-allowed disabled:opacity-50'
  ],
  variants: {
    variant: {
      default: 'border-input',
      destructive: 'border-destructive focus-visible:ring-destructive/50'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export const Textarea = ({
  className,
  variant,
  ref,
  ...props
}: TextareaProps & VariantProps<typeof textareaVariants>) => (
  <textarea
    className={textareaVariants({ variant, className })}
    ref={ref}
    {...props}
  />
)

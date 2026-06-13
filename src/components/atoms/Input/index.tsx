'use client'

import { tv, type VariantProps } from 'tailwind-variants'

import type { InputProps } from './types'

const inputVariants = tv({
  base: [
    'flex h-9 w-full rounded-md border px-3 py-1',
    'bg-transparent text-sm transition-colors',
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

export const Input = ({
  className,
  variant,
  ref,
  ...props
}: InputProps & VariantProps<typeof inputVariants>) => (
  <input
    className={inputVariants({ variant, className })}
    ref={ref}
    {...props}
  />
)

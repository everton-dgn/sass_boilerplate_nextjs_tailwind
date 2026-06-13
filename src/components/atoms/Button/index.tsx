'use client'

import { tv, type VariantProps } from 'tailwind-variants'

import type { ButtonProps } from './types'

const buttonVariants = tv({
  base: [
    'inline-flex shrink-0 items-center justify-center gap-2',
    'rounded-md font-medium text-sm outline-none transition-all',
    'focus-visible:ring-[3px] focus-visible:ring-ring/50',
    'disabled:pointer-events-none disabled:opacity-50',
    'cursor-pointer'
  ],
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-white hover:bg-destructive/90',
      outline:
        'border bg-background hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline'
    },
    size: {
      default: 'h-9 px-4 py-2',
      xs: 'h-6 gap-1 px-2 text-xs',
      sm: 'h-8 gap-1.5 px-3',
      lg: 'h-10 px-6',
      icon: 'size-9'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
})

export const Button = ({
  label,
  children,
  className,
  variant,
  size,
  ...props
}: ButtonProps & VariantProps<typeof buttonVariants>) => (
  <button className={buttonVariants({ variant, size, className })} {...props}>
    {label ?? children}
  </button>
)

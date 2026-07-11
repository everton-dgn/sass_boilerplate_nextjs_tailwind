'use client'

import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui'
import { type ComponentProps, useRef } from 'react'

import { cn } from '@/helpers/cn'

export const DropdownMenu = DropdownMenuPrimitive.Root

export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

export const DropdownMenuContent = ({
  className,
  align = 'end',
  sideOffset = 4,
  ref,
  onCloseAutoFocus,
  onInteractOutside,
  onKeyDown,
  onPointerDown,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Content>) => {
  const lastInputWasPointer = useRef(false)

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        align={align}
        className={cn(
          'z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1',
          'text-popover-foreground shadow-md',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[state=closed]:animate-out data-[state=open]:animate-in',
          'data-[side=bottom]:slide-in-from-top-2',
          'data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2',
          'data-[side=top]:slide-in-from-bottom-2',
          className
        )}
        onCloseAutoFocus={event => {
          if (lastInputWasPointer.current) {
            lastInputWasPointer.current = false
            event.preventDefault()
          }
          onCloseAutoFocus?.(event)
        }}
        onInteractOutside={event => {
          onInteractOutside?.(event)
          if (!event.defaultPrevented) {
            lastInputWasPointer.current = true
          }
        }}
        onKeyDown={event => {
          lastInputWasPointer.current = false
          onKeyDown?.(event)
        }}
        onPointerDown={event => {
          lastInputWasPointer.current = true
          onPointerDown?.(event)
        }}
        ref={ref}
        sideOffset={sideOffset}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

export const DropdownMenuItem = ({
  className,
  ref,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Item>) => (
  <DropdownMenuPrimitive.Item
    className={cn(
      'relative flex cursor-default select-none items-center gap-2',
      'rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
      'focus:bg-accent focus:text-accent-foreground',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      '[&_svg]:pointer-events-none [&_svg]:shrink-0',
      className
    )}
    ref={ref}
    {...props}
  />
)

export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

export const DropdownMenuRadioItem = ({
  className,
  ref,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) => (
  <DropdownMenuPrimitive.RadioItem
    className={cn(
      'relative flex cursor-default select-none items-center gap-2',
      'rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
      'focus:bg-accent focus:text-accent-foreground',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      '[&_svg]:pointer-events-none [&_svg]:shrink-0',
      className
    )}
    ref={ref}
    {...props}
  />
)

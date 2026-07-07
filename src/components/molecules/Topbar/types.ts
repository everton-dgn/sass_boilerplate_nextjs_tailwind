import type { ReactNode } from 'react'

export type TopbarProps = {
  children?: ReactNode
  className?: string
}

export type NavLink = {
  href: string
  labelKey: 'home'
}

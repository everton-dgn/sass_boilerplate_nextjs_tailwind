import type { LucideIcon } from 'lucide-react'
import { Monitor, Moon, Sun } from 'lucide-react'

import type { Theme } from '@/constants/theme'

export const THEME_ICONS: Record<Theme, LucideIcon> = {
  light: Sun,
  dark: Moon,
  system: Monitor
}

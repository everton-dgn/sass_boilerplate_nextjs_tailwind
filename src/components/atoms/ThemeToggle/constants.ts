import type { Theme } from '@/constants/theme'

import type { LucideIcon } from 'lucide-react'
import { Monitor, Moon, Sun } from 'lucide-react'

export const THEME_ICONS: Record<Theme, LucideIcon> = {
  light: Sun,
  dark: Moon,
  system: Monitor
}

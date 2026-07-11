'use client'

import { Check, Languages } from 'lucide-react'
import { type Locale, useLocale, useTranslations } from 'next-intl'
import { useTransition } from 'react'

import { Button } from '@/components/atoms/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/atoms/DropdownMenu'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

export const LocaleSwitcher = () => {
  const t = useTranslations('LocaleSwitcher')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const onLocaleSelect = (nextLocale: Locale) => {
    if (nextLocale === locale) {
      return
    }

    const { search, hash } = window.location

    startTransition(() => {
      router.replace(`${pathname}${search}${hash}`, { locale: nextLocale })
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={t('label')}
          disabled={isPending}
          size="icon"
          variant="ghost"
        >
          <Languages className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          onValueChange={nextLocale => onLocaleSelect(nextLocale as Locale)}
          value={locale}
        >
          {routing.locales.map(availableLocale => (
            <DropdownMenuRadioItem
              disabled={isPending}
              key={availableLocale}
              value={availableLocale}
            >
              <span className="flex-1">{t(`locales.${availableLocale}`)}</span>
              {availableLocale === locale && <Check className="size-4" />}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

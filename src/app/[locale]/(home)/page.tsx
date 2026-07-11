import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'

import LogoTailwind from '@/assets/logo-tailwind.svg'

import type { HomePageProps } from './types'

const Home = ({ params }: HomePageProps) => {
  const { locale } = use(params)

  setRequestLocale(locale)
  const t = useTranslations('Home')

  return (
    <main
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-muted/40 via-background to-background px-4 pt-24 pb-12 sm:px-6"
      data-page="home"
    >
      <div
        aria-hidden
        className="-translate-1/2 absolute top-1/2 left-1/2 size-80 rounded-full bg-primary/5 blur-3xl sm:size-112"
      />
      <section className="relative flex w-full max-w-3xl flex-col items-center text-center">
        <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/90 px-3.5 py-1.5 font-medium text-foreground text-xs uppercase tracking-[0.16em] shadow-foreground/10 shadow-xs backdrop-blur-sm dark:border-foreground/10 dark:bg-muted/50 dark:text-foreground/70 dark:shadow-none">
          <span
            aria-hidden
            className="size-1.5 rounded-full bg-foreground ring-4 ring-foreground/10 dark:bg-foreground/60 dark:ring-foreground/5"
          />
          {t('eyebrow')}
        </p>
        <h1 className="max-w-2xl text-balance font-semibold text-4xl tracking-tight sm:text-6xl">
          {t('heading')}
        </h1>
        <p className="mt-5 max-w-xl text-balance text-base text-muted-foreground leading-7 sm:text-lg">
          {t('description')}
        </p>
        <div className="mt-10 flex items-center justify-center gap-5 sm:gap-7">
          <Image
            className="size-16 sm:size-20"
            alt={t('logoNextjsAlt')}
            height={80}
            priority
            src="/images/logo-nextjs.webp"
            width={80}
          />
          <span
            aria-hidden
            className="font-light text-2xl text-muted-foreground"
          >
            +
          </span>
          <LogoTailwind
            className="h-auto w-24 sm:w-28"
            data-testid="logo-tailwind"
          />
        </div>
        <p className="mt-6 font-medium text-muted-foreground text-xs uppercase tracking-[0.16em]">
          {t('subtitle')}
        </p>
      </section>
    </main>
  )
}

export default Home

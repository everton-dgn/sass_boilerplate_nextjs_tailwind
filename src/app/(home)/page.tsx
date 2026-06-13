import Image from 'next/image'

import LogoTailwind from '@/assets/logo-tailwind.svg'
import { cn } from '@/helpers/cn'

const Home = () => (
  <div className="flex h-full w-full grow flex-col items-center justify-center p-4">
    <header className="mb-10 text-center font-semibold text-4xl tracking-[1px]">
      Boilerplate
    </header>
    <main className="flex h-fit flex-col items-center justify-center gap-4">
      <div
        className={cn(
          'flex w-full flex-wrap items-center justify-center gap-8 px-2',
          '[&_img]:relative! sm:[&_img]:size-38.75! sm:[&_img]:min-w-38.75!',
          'sm:[&_svg]:h-38.75 sm:[&_svg]:w-43.5 sm:[&_svg]:min-w-43.5'
        )}
      >
        <Image
          alt="Logo Nextjs"
          height={77}
          priority
          src="/images/logo-nextjs.webp"
          width={77}
        />
        <LogoTailwind data-testid="logo-tailwind" />
      </div>
      <h1 className="mb-4 text-center font-medium text-muted-foreground tracking-[1px]">
        Nextjs + Tailwind CSS
      </h1>
    </main>
  </div>
)

export default Home

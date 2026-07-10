declare module '*.svg' {
  import type { FunctionComponent, SVGProps } from 'react'
  export const ReactComponent: FunctionComponent<SVGProps<SVGSVGElement>>

  const Component: FunctionComponent<SVGProps<SVGSVGElement>>
  export default Component
}

declare module '*.jpg'

declare module '*.webp'

declare module '*.png'

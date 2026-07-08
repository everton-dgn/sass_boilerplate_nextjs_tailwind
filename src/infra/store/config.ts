import { create, type StateCreator } from 'zustand'
import { type DevtoolsOptions, devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { IS_CLIENT, IS_DEVELOPMENT } from '@/constants/sharedEnv'
import type { MiddlewaresProvider } from './types'

export const devtoolsOptions = (name: string): DevtoolsOptions => ({
  name,
  enabled: IS_DEVELOPMENT,
  store: name
})

export const middlewaresProvider = <TStore>({
  slice,
  storage,
  name
}: MiddlewaresProvider<TStore>) => {
  const isPersist = IS_CLIENT && storage
  const appliedSlice = isPersist ? persist(immer(slice), storage) : immer(slice)

  return create<TStore>()(
    devtools(appliedSlice as StateCreator<TStore>, devtoolsOptions(name))
  )
}

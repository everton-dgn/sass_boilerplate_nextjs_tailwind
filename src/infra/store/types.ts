import type { StateCreator } from 'zustand/index'
import type { PersistOptions } from 'zustand/middleware'

export type Middleware = [
  ['zustand/devtools', never],
  ['zustand/persist', unknown],
  ['zustand/immer', never]
]

export type MiddlewaresProvider<TStore> = {
  slice: StateCreator<TStore, Middleware>
  storage?: PersistOptions<TStore, Partial<TStore>>
  name: string
}

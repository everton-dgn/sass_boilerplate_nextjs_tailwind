import type { PersistOptions } from 'zustand/middleware'

import { middlewaresProvider } from '../config'

import { slice } from './slice'
import type { State, Store } from './types'

const name = 'notesPreferences'

const storage: PersistOptions<Store, Partial<State>> = {
  name,
  partialize: state => {
    const { sortOrder, ...rest } = state
    return rest
  }
}

export const useStore = middlewaresProvider<Store>({
  slice,
  storage,
  name
})

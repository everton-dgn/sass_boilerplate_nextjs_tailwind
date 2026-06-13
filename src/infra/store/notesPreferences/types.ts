import type { StateCreator } from 'zustand'

import type { Middleware } from '../types'

export type ViewMode = 'grid' | 'list'

export type SortOrder = 'newest' | 'oldest'

export type State = {
  viewMode: ViewMode
  sortOrder: SortOrder
}

type Actions = {
  setToggleViewMode: () => void
  setToggleSortOrder: () => void
}

export type Store = State & Actions

export type Slice = StateCreator<Store, Middleware>

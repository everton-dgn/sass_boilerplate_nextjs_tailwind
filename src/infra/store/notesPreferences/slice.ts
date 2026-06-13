import type { Slice, State } from './types'

export const initialState: State = {
  viewMode: 'grid',
  sortOrder: 'newest'
}

export const slice: Slice = set => ({
  ...initialState,

  setToggleViewMode: () =>
    set(
      state => {
        state.viewMode = state.viewMode === 'grid' ? 'list' : 'grid'
      },
      undefined,
      'setToggleViewMode'
    ),

  setToggleSortOrder: () =>
    set(
      state => {
        state.sortOrder = state.sortOrder === 'newest' ? 'oldest' : 'newest'
      },
      undefined,
      'setToggleSortOrder'
    )
})

import { useStore } from './store'

export const useNotesPreferences = () => {
  const stateNotesPreferences = {
    viewMode: useStore(state => state.viewMode),
    sortOrder: useStore(state => state.sortOrder),
    setToggleViewMode: useStore(state => state.setToggleViewMode),
    setToggleSortOrder: useStore(state => state.setToggleSortOrder)
  }

  return { stateNotesPreferences }
}

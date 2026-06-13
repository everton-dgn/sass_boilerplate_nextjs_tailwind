import type { InfiniteData } from '@tanstack/react-query'

import type { NotesPage, UpdateNoteInput } from '../types'

export type NotesCache = InfiniteData<NotesPage>

export type UpdateNoteVariables = UpdateNoteInput & { id: string }

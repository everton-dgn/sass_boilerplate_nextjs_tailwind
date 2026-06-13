import { Button } from '@/components/atoms/Button'

import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  LayoutGrid,
  List
} from 'lucide-react'

import type { NotesToolbarProps } from './types'

export const NotesToolbar = ({
  viewMode,
  sortOrder,
  onToggleViewMode,
  onToggleSortOrder
}: NotesToolbarProps) => (
  <div className="flex items-center justify-end gap-2">
    <Button
      aria-label={
        sortOrder === 'newest'
          ? 'Ordenar por mais antigas'
          : 'Ordenar por mais recentes'
      }
      size="icon"
      variant="ghost"
      onClick={onToggleSortOrder}
    >
      {sortOrder === 'newest' ? (
        <ArrowDownNarrowWide className="size-4" />
      ) : (
        <ArrowUpNarrowWide className="size-4" />
      )}
    </Button>
    <Button
      aria-label={
        viewMode === 'grid' ? 'Alternar para lista' : 'Alternar para grade'
      }
      size="icon"
      variant="ghost"
      onClick={onToggleViewMode}
    >
      {viewMode === 'grid' ? (
        <List className="size-4" />
      ) : (
        <LayoutGrid className="size-4" />
      )}
    </Button>
  </div>
)

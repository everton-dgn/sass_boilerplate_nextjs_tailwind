import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'

export const getEditNoteButtons = (page: Page) =>
  page.getByRole('button', { name: /Editar nota / })

export const getDeleteNoteButtons = (page: Page) =>
  page.getByRole('button', { name: /Excluir nota / })

export const getNoteCards = (page: Page) => page.getByRole('article')

export const getNoteCardById = (page: Page, noteId: string) =>
  page.locator(`[data-note-id="${noteId}"]`)

export const getNoteCardByIndex = (page: Page, index: number) =>
  getNoteCards(page).nth(index)

export const getNoteCardId = (noteCard: Locator) =>
  noteCard.getAttribute('data-note-id')

export const getNoteCardIds = async (page: Page) =>
  getNoteCards(page).evaluateAll(articles =>
    articles
      .map(article => article.getAttribute('data-note-id'))
      .filter((noteId): noteId is string => Boolean(noteId))
  )

export const getNoteCard = (page: Page, noteTitle: string) =>
  page.getByRole('article', { name: noteTitle })

export const getEditNoteButton = (page: Page, noteTitle: string) =>
  page.getByRole('button', { name: `Editar nota ${noteTitle}` })

export const getDeleteNoteButton = (page: Page, noteTitle: string) =>
  page.getByRole('button', { name: `Excluir nota ${noteTitle}` })

export const getEditNoteButtonForCard = (noteCard: Locator) =>
  noteCard.getByRole('button', { name: /Editar nota / })

export const getDeleteNoteButtonForCard = (noteCard: Locator) =>
  noteCard.getByRole('button', { name: /Excluir nota / })

export const gotoNotesPage = async (page: Page) => {
  await page.goto('/notes')
  await expect(page.getByRole('heading', { name: 'Notas' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Criar nota' })).toBeVisible()
  await expect(getNoteCards(page).first()).toBeVisible()
}

export const loadNextNotesPage = async (page: Page, previousCount?: number) => {
  const noteCards = getNoteCards(page)
  const startingCount = previousCount ?? (await noteCards.count())

  await page.getByRole('button', { name: 'Mostrar mais' }).click()

  await expect
    .poll(async () => noteCards.count(), {
      timeout: 5_000
    })
    .toBeGreaterThan(startingCount)

  return noteCards.count()
}

export const loadAllNotes = async (page: Page) => {
  const showMoreButton = page.getByRole('button', { name: 'Mostrar mais' })
  let currentCount = await getNoteCards(page).count()

  while (await showMoreButton.isVisible().catch(() => false)) {
    currentCount = await loadNextNotesPage(page, currentCount)
  }

  return currentCount
}

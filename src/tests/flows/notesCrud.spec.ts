import { expect } from '@playwright/test'

import {
  getDeleteNoteButton,
  getEditNoteButton,
  getEditNoteButtons,
  getNoteCard,
  gotoNotesPage,
  loadAllNotes
} from '../helpers/notesPage'
import { test } from '../helpers/notesTest'

test.describe('notes crud flow', () => {
  test('should create, edit, and delete a note in a single journey', async ({
    page
  }) => {
    await gotoNotesPage(page)

    const noteTitle = `Flow Test ${Date.now()}`
    const noteContent = 'Conteúdo criado no flow test'

    await page.getByPlaceholder('Título da nota').fill(noteTitle)
    await page.getByPlaceholder('Conteúdo da nota').fill(noteContent)
    await page.getByRole('button', { name: 'Criar nota' }).click()

    await expect(getNoteCard(page, noteTitle)).toBeVisible({ timeout: 5000 })
    await expect(page.getByPlaceholder('Título da nota')).toHaveValue('')

    await getEditNoteButton(page, noteTitle).click()

    await expect(
      page.getByRole('heading', { name: 'Editar Nota' })
    ).toBeVisible()

    const editedTitle = `${noteTitle} Editado`
    const dialogTitleInput = page.getByPlaceholder('Título', { exact: true })
    await dialogTitleInput.clear()
    await dialogTitleInput.fill(editedTitle)

    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(
      page.getByRole('heading', { name: 'Editar Nota' })
    ).not.toBeVisible()
    await expect(getNoteCard(page, editedTitle)).toBeVisible({ timeout: 5000 })

    await getDeleteNoteButton(page, editedTitle).click()

    await expect(page.getByText('Nota excluída com sucesso.')).toBeVisible({
      timeout: 5000
    })
    await expect(getNoteCard(page, editedTitle)).not.toBeVisible()
  })

  test('should persist edited note after navigating away and returning', async ({
    page
  }) => {
    await gotoNotesPage(page)

    const noteTitle = `Persist Test ${Date.now()}`

    await page.getByPlaceholder('Título da nota').fill(noteTitle)
    await page
      .getByPlaceholder('Conteúdo da nota')
      .fill('Conteúdo para teste de persistência')
    await page.getByRole('button', { name: 'Criar nota' }).click()

    await expect(getNoteCard(page, noteTitle)).toBeVisible({ timeout: 5000 })

    await getEditNoteButton(page, noteTitle).click()

    await expect(
      page.getByRole('heading', { name: 'Editar Nota' })
    ).toBeVisible()

    const editedTitle = `${noteTitle} Editado`
    const dialogTitleInput = page.getByPlaceholder('Título', { exact: true })
    await dialogTitleInput.clear()
    await dialogTitleInput.fill(editedTitle)
    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(
      page.getByRole('heading', { name: 'Editar Nota' })
    ).not.toBeVisible()
    await expect(getNoteCard(page, editedTitle)).toBeVisible({ timeout: 5000 })

    await page.getByRole('link', { name: 'Início' }).click()
    await expect(page).toHaveURL('/')

    await page.getByRole('link', { name: 'Notas' }).click()
    await expect(page).toHaveURL('/notes')

    await expect(getNoteCard(page, editedTitle)).toBeVisible({ timeout: 5000 })
  })

  test('should preserve loaded pages after navigating away and returning', async ({
    page
  }) => {
    await gotoNotesPage(page)

    const allCardsCount = await loadAllNotes(page)

    await page.getByRole('link', { name: 'Início' }).click()
    await expect(page).toHaveURL('/')

    await page.getByRole('link', { name: 'Notas' }).click()
    await expect(page).toHaveURL('/notes')

    const cardsAfterReturn = getEditNoteButtons(page)

    await expect
      .poll(async () => cardsAfterReturn.count(), {
        timeout: 5_000
      })
      .toBeGreaterThanOrEqual(allCardsCount)
  })
})

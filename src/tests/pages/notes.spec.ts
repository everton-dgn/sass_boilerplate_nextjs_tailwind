import { expect } from '@playwright/test'

import {
  getDeleteNoteButtonForCard,
  getEditNoteButtonForCard,
  getNoteCard,
  getNoteCardById,
  getNoteCardByIndex,
  getNoteCardId,
  getNoteCardIds,
  getNoteCards,
  gotoNotesPage,
  loadAllNotes,
  loadNextNotesPage
} from '../helpers/notesPage'
import { test } from '../helpers/notesTest'

test.describe('notes page', () => {
  test.beforeEach(async ({ page }) => {
    await gotoNotesPage(page)
  })

  test('should render page heading, form, and seed notes', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Notas' })).toBeVisible()

    await expect(page.getByPlaceholder('Título da nota')).toBeVisible()
    await expect(page.getByPlaceholder('Conteúdo da nota')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Criar nota' })).toBeVisible()

    const cards = getNoteCards(page)
    await expect(cards.first()).toBeVisible()
    expect(await cards.count()).toBeGreaterThanOrEqual(1)
  })

  test('should paginate notes with "Mostrar mais" button', async ({ page }) => {
    const cards = getNoteCards(page)
    const initialCount = await cards.count()
    expect(initialCount).toBeLessThanOrEqual(3)

    const showMoreButton = page.getByRole('button', {
      name: 'Mostrar mais'
    })
    await expect(showMoreButton).toBeVisible()
    const afterFirstClick = await loadNextNotesPage(page, initialCount)
    expect(afterFirstClick).toBeGreaterThan(initialCount)

    const finalCount = await loadAllNotes(page)
    expect(finalCount).toBeGreaterThanOrEqual(9)
  })

  test('should toggle view mode between grid and list', async ({ page }) => {
    const toggleToList = page.getByRole('button', {
      name: 'Alternar para lista'
    })
    await expect(toggleToList).toBeVisible()

    await toggleToList.click()

    const toggleToGrid = page.getByRole('button', {
      name: 'Alternar para grade'
    })
    await expect(toggleToGrid).toBeVisible()

    await toggleToGrid.click()

    await expect(
      page.getByRole('button', { name: 'Alternar para lista' })
    ).toBeVisible()
  })

  test('should toggle sort order and change first note', async ({ page }) => {
    const initialOrder = await getNoteCardIds(page)

    const sortButton = page.getByRole('button', {
      name: 'Ordenar por mais antigas'
    })
    await expect(sortButton).toBeVisible()
    await sortButton.click()

    await expect(
      page.getByRole('button', {
        name: 'Ordenar por mais recentes'
      })
    ).toBeVisible()

    await expect
      .poll(async () => (await getNoteCardIds(page)).join('|'))
      .not.toBe(initialOrder.join('|'))
  })

  test('should show validation errors in edit dialog', async ({ page }) => {
    const firstNoteCard = getNoteCardByIndex(page, 0)
    await getEditNoteButtonForCard(firstNoteCard).click()

    await expect(
      page.getByRole('heading', { name: 'Editar Nota' })
    ).toBeVisible()

    const dialogTitleInput = page.getByPlaceholder('Título', { exact: true })
    const dialogContentInput = page.getByPlaceholder('Conteúdo', {
      exact: true
    })
    await dialogTitleInput.clear()
    await dialogContentInput.clear()

    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(page.getByText('Título é obrigatório')).toBeVisible()
    await expect(page.getByText('Conteúdo é obrigatório')).toBeVisible()

    await page.getByRole('button', { name: 'Cancelar' }).click()
  })

  test('should create a new note', async ({ page }) => {
    await page.getByPlaceholder('Título da nota').fill('Nota E2E Test')
    await page
      .getByPlaceholder('Conteúdo da nota')
      .fill('Conteúdo de teste E2E')

    await page.getByRole('button', { name: 'Criar nota' }).click()

    await expect(getNoteCard(page, 'Nota E2E Test')).toBeVisible({
      timeout: 5000
    })

    await expect(page.getByPlaceholder('Título da nota')).toHaveValue('')
    await expect(page.getByPlaceholder('Conteúdo da nota')).toHaveValue('')
  })

  test('should show validation errors on empty submit', async ({ page }) => {
    await page.getByRole('button', { name: 'Criar nota' }).click()

    const errors = page.locator('.text-destructive')
    await expect(errors.first()).toBeVisible()
    expect(await errors.count()).toBeGreaterThanOrEqual(1)
  })

  test('should edit a note via dialog', async ({ page }) => {
    const firstNoteCard = getNoteCardByIndex(page, 0)
    await getEditNoteButtonForCard(firstNoteCard).click()

    await expect(
      page.getByRole('heading', { name: 'Editar Nota' })
    ).toBeVisible()

    const dialogTitleInput = page.getByPlaceholder('Título', { exact: true })
    await dialogTitleInput.clear()
    await dialogTitleInput.fill('Título Editado E2E')

    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(
      page.getByRole('heading', { name: 'Editar Nota' })
    ).not.toBeVisible()

    await expect(getNoteCard(page, 'Título Editado E2E')).toBeVisible({
      timeout: 5000
    })
  })

  test('should cancel edit without changes', async ({ page }) => {
    const firstNoteCard = getNoteCardByIndex(page, 0)
    await getEditNoteButtonForCard(firstNoteCard).click()

    await expect(
      page.getByRole('heading', { name: 'Editar Nota' })
    ).toBeVisible()

    await page.getByRole('button', { name: 'Cancelar' }).click()

    await expect(
      page.getByRole('heading', { name: 'Editar Nota' })
    ).not.toBeVisible()
  })

  test('should delete a note', async ({ page }) => {
    const firstNoteCard = getNoteCardByIndex(page, 0)
    const firstNoteId = await getNoteCardId(firstNoteCard)

    expect(firstNoteId).toBeTruthy()

    await getDeleteNoteButtonForCard(firstNoteCard).click()

    await expect(page.getByText('Nota excluída com sucesso.')).toBeVisible({
      timeout: 5000
    })

    if (firstNoteId) {
      await expect(getNoteCardById(page, firstNoteId)).not.toBeVisible()
    }
  })
})

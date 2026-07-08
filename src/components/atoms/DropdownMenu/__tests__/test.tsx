import { screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { Button } from '@/components/atoms/Button'
import { event } from '@/tests/helpers'
import { renderWithProviders } from '@/tests/providers/component'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '..'

const renderMenu = () =>
  renderWithProviders(
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button label="Open options" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>First option</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

const openMenu = async () => {
  await event().click(screen.getByRole('button', { name: 'Open options' }))
}

const clickOutside = async () => {
  const user = userEvent.setup({ delay: null, pointerEventsCheck: 0 })
  await user.click(document.body)
}

describe('[Component] DropdownMenu', () => {
  it('should open menu content from trigger', async () => {
    renderMenu()

    await openMenu()

    expect(
      screen.getByRole('menuitem', { name: 'First option' })
    ).toBeInTheDocument()
  })

  it('should not focus the trigger when closed by clicking outside', async () => {
    renderMenu()

    await openMenu()
    await clickOutside()

    expect(
      screen.queryByRole('menuitem', { name: 'First option' })
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Open options' })
    ).not.toHaveFocus()
  })

  it('should not focus the trigger when an option is selected with the mouse', async () => {
    renderMenu()

    await openMenu()
    await event().click(screen.getByRole('menuitem', { name: 'First option' }))

    expect(
      screen.queryByRole('menuitem', { name: 'First option' })
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Open options' })
    ).not.toHaveFocus()
  })

  it('should return focus to the trigger when closed with Escape', async () => {
    renderMenu()

    await openMenu()
    await event().keyboard('{Escape}')

    expect(screen.getByRole('button', { name: 'Open options' })).toHaveFocus()
  })
})

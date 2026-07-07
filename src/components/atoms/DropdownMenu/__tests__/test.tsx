import { Button } from '@/components/atoms/Button'
import { event } from '@/tests/helpers'
import { renderWithProviders } from '@/tests/providers/component'

import { screen } from '@testing-library/react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '..'

describe('[Component] DropdownMenu', () => {
  it('should open menu content from trigger', async () => {
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

    await event().click(screen.getByRole('button', { name: 'Open options' }))

    expect(
      screen.getByRole('menuitem', { name: 'First option' })
    ).toBeInTheDocument()
  })
})

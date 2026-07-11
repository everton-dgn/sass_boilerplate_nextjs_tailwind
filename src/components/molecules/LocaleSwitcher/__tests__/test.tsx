import { screen } from '@testing-library/react'

import { event } from '@/tests/helpers'
import { renderWithProviders } from '@/tests/providers/component'

import { LocaleSwitcher } from '..'

const mockReplace = vi.fn()

vi.mock('@/i18n/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ replace: mockReplace })
}))

describe('[Component] LocaleSwitcher', () => {
  beforeEach(() => {
    mockReplace.mockClear()
  })

  it('should render a globe button that opens all locales', async () => {
    renderWithProviders(<LocaleSwitcher />)

    await event().click(screen.getByRole('button', { name: 'Language' }))

    expect(
      screen.getByRole('menuitemradio', { name: 'English' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('menuitemradio', { name: 'Spanish' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('menuitemradio', { name: 'Portuguese' })
    ).toBeInTheDocument()
  })

  it('should mark the active locale', async () => {
    renderWithProviders(<LocaleSwitcher />)

    await event().click(screen.getByRole('button', { name: 'Language' }))

    expect(
      screen.getByRole('menuitemradio', { name: 'English' })
    ).toHaveAttribute('aria-checked', 'true')
  })

  it('should navigate to the selected locale', async () => {
    renderWithProviders(<LocaleSwitcher />)

    await event().click(screen.getByRole('button', { name: 'Language' }))
    await event().click(
      screen.getByRole('menuitemradio', { name: 'Portuguese' })
    )

    expect(mockReplace).toHaveBeenCalledWith('/', { locale: 'pt' })
  })
})

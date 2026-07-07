import errorMessages from './components/Error.json' with { type: 'json' }
import localeSwitcher from './components/LocaleSwitcher.json' with {
  type: 'json'
}
import themeToggle from './components/ThemeToggle.json' with { type: 'json' }
import topbar from './components/Topbar.json' with { type: 'json' }
import home from './pages/Home.json' with { type: 'json' }
import metadata from './pages/Metadata.json' with { type: 'json' }

export const messages = {
  ...metadata,
  ...home,
  ...topbar,
  ...errorMessages,
  ...themeToggle,
  ...localeSwitcher
}

# Shared translations (`common/`)

This folder holds **translations reused by two or more components or
pages**. It is intentionally empty — see "When to create" below.

## Message organization

Messages are split by **locale** and, within each locale, by the **layer of
origin** of the string:

```text
src/i18n/messages/
├── common/          # shared translations (this folder)
├── en/
│   ├── index.ts     # single registration point: imports and merges JSONs
│   ├── pages/       # page/route strings (Metadata, Home…)
│   └── components/  # component strings (Topbar, Error, ThemeToggle…)
├── es/  (same shape)
└── pt/  (same shape)
```

The `index.ts` of each locale is the **single registration point** for
messages: `request.ts` (runtime), `global.ts` (types), and `TestProvider`
(tests) all derive from it and need no maintenance when new namespaces
are added.

The structure is extensible: when strings specific to another layer
emerge (for example `hooks/`, `helpers/`, `actions/`), create the
matching subfolder inside each locale.

## When to create (share by meaning, not by coincidence)

Use `common/` only when the same string, with the **same meaning**, is
used in several places — for example generic actions: `save`, `cancel`,
`confirm`, `close`.

Do not share strings that merely **coincide in text**. Real example from
this project: `Topbar.home` and `Metadata.home.title` both translate to
"Home", but they have distinct meanings (menu item vs. page title). If
they ever diverge, the coupling breaks — keep them separate.

Proper nouns that **do not change across languages** (the "SaaS
Boilerplate" brand, the "Next.js + Tailwind CSS" stack) are not
translations. Prefer a TypeScript constant over putting them here.

## How to create when needed

1. Add one file per locale in this folder, with the `Common` namespace at the top:

```json
{
  "Common": {
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

2. Import and merge it into each locale's `index.ts` (e.g. `en/index.ts`):

```ts
import common from '../common/en.json' with { type: 'json' }

export const messages = {
  ...common
  // …other namespaces
}
```

3. Consume it in the component with `useTranslations('Common')`. Types,
   runtime, tests, and client components follow automatically — the
   `NextIntlClientProvider` from `src/app/[locale]/layout.tsx` inherits
   all messages from the server, without manual registration per
   namespace.

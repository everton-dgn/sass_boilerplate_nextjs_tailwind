# Shared translations (`common/`)

This folder holds **translations reused by two or more components or
pages**. It is intentionally empty — see "When to create" below.

## Message organization

Messages are split by **locale** and, within each locale, by the **layer of
origin** of the string:

```text
src/i18n/messages/
├── common/          # shared translations (this folder)
├── generated/       # build artifacts: one merged JSON per locale (gitignored)
├── en/
│   ├── pages/       # page/route strings (Metadata, Home…)
│   └── components/  # component strings (Topbar, Error, ThemeToggle…)
├── es/  (same shape)
└── pt/  (same shape)
```

There is **no manual registration point**: the codegen in
`src/i18n/messagesCodegen` scans the locale folders and merges every JSON
(plus `common/<locale>.json`, when present) into `generated/<locale>.json`.
It runs when `next dev`, `next build`, `next typegen`, or Vitest starts,
and watches for changes during development. `request.ts` (runtime),
`global.ts` (types), and `TestProvider` (tests) all consume the generated
files — adding a namespace is just adding one JSON file per locale.

A namespace duplicated across two files of the same locale fails the
codegen with an explicit error.

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

1. Add one file per locale in this folder, with the `Common` namespace at
   the top:

```json
{
  "Common": {
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

2. Consume it in the component with `useTranslations('Common')`. Types,
   runtime, and tests follow automatically — no manual registration.

3. If the consumer is a **client component**, also add `Common` to the
   `clientMessages` object in `src/app/[locale]/layout.tsx`: only the
   namespaces listed there are sent to the browser (`Home` and `Metadata`
   stay server-only).

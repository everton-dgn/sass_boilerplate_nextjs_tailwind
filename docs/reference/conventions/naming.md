# Nomenclatura

Tabelas consolidadas de nomenclatura para manter consistência em todo o
projeto.

---

## Arquivos e pastas

| Tipo | Nome do arquivo | Exemplo |
|------|----------------|---------|
| Componente | `PascalCase/index.tsx` | `NoteCard/index.tsx` |
| Tipos de componente | `PascalCase/types.ts` | `NoteCard/types.ts` |
| Hook | `camelCase/index.ts` | `useCreateNoteForm/index.ts` |
| Query hook | `useFindRecursos.ts` | `useFindNotes.ts` |
| Mutation hook | `useVerbRecurso.ts` | `useCreateNote.ts` |
| Mappers | `mappers.ts` | — |
| Config de service | `config.ts` | — |
| Types de service | `types.ts` | — |
| Store Zustand | `camelCase/` | `notesPreferences/` |
| Store slice | `slice.ts` | — |
| Store hook | `index.ts` (facade) | — |
| API Route | `route.ts` | — |
| Loading | `loading.tsx` | — |
| Client | `Client.tsx` | — |
| Constantes | `constants.ts` | — |

---

## Exports e funções

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Schema Zod (form) | `create<Recurso>Schema` | `createNoteSchema` |
| Schema Zod (API) | `<recurso>ResponseSchema` | `noteResponseSchema` |
| Mapper | `to<Recurso>` | `toNote` |
| Query key | `RECURSO_QUERY_KEY` | `NOTES_QUERY_KEY` |
| Query options | `<recurso>QueryOptions` | `notesQueryOptions` |
| Hook de query | `useFind<Recurso>s` | `useFindNotes` |
| Hook de mutation | `useCreate/Update/Delete<Recurso>` | `useCreateNote` |
| Hook de form | `useCreate<Recurso>Form` | `useCreateNoteForm` |
| Hook de store | `use<Nome>` | `useNotesPreferences` |
| State retornado | `state<Nome>` | `stateNotesPreferences` |
| Action toggle | `setToggle<Prop>` | `setToggleViewMode` |

---

## Tipos

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Tipo de domínio | `<Recurso>` | `Note` |
| Tipo de input | `<Ação><Recurso>Input` | `CreateNoteInput` |
| Tipo de página | `<Recurso>sPage` | `NotesPage` |
| Tipo de cache | `<Recurso>sCache` | `NotesCache` |
| Tipo de resposta API | `<Recurso>Response` | `NoteResponse` |
| Tipo de props | `<Componente>Props` | `NoteCardProps` |
| Tipo de state | `State` | (dentro da store) |
| Tipo de actions | `Actions` | (dentro da store) |
| Tipo de store | `Store` | `State & Actions` |
| Tipo de slice | `Slice` | `StateCreator<Store, Middleware>` |

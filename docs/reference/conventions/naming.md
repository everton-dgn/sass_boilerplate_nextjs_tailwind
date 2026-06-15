# Nomenclatura

Tabelas consolidadas de nomenclatura para manter consistência em todo o
projeto.

---

## Arquivos e pastas

| Tipo | Nome do arquivo | Exemplo |
|------|----------------|---------|
| Componente | `PascalCase/index.tsx` | `ResourceCard/index.tsx` |
| Tipos de componente | `PascalCase/types.ts` | `ResourceCard/types.ts` |
| Hook | `camelCase/index.ts` | `useCreateResourceForm/index.ts` |
| Query hook | `useFindRecursos.ts` | `useFindResources.ts` |
| Mutation hook | `useVerbRecurso.ts` | `useCreateResource.ts` |
| Mappers | `mappers.ts` | — |
| Config de service | `config.ts` | — |
| Types de service | `types.ts` | — |
| Store Zustand | `camelCase/` | `resourceFilters/` |
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
| Schema Zod (form) | `create<Recurso>Schema` | `createResourceSchema` |
| Schema Zod (API) | `<recurso>ResponseSchema` | `resourceResponseSchema` |
| Mapper | `to<Recurso>` | `toResource` |
| Query key | `RECURSO_QUERY_KEY` | `RESOURCES_QUERY_KEY` |
| Query options | `<recurso>QueryOptions` | `resourcesQueryOptions` |
| Hook de query | `useFind<Recurso>s` | `useFindResources` |
| Hook de mutation | `useCreate/Update/Delete<Recurso>` | `useCreateResource` |
| Hook de form | `useCreate<Recurso>Form` | `useCreateResourceForm` |
| Hook de store | `use<Nome>` | `useResourceFilters` |
| State retornado | `state<Nome>` | `stateResourceFilters` |
| Action toggle | `setToggle<Prop>` | `setToggleViewMode` |

---

## Tipos

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Tipo de domínio | `<Recurso>` | `Resource` |
| Tipo de input | `<Ação><Recurso>Input` | `CreateResourceInput` |
| Tipo de página | `<Recurso>sPage` | `ResourcesPage` |
| Tipo de cache | `<Recurso>sCache` | `ResourcesCache` |
| Tipo de resposta API | `<Recurso>Response` | `ResourceResponse` |
| Tipo de props | `<Componente>Props` | `ResourceCardProps` |
| Tipo de state | `State` | (dentro da store) |
| Tipo de actions | `Actions` | (dentro da store) |
| Tipo de store | `Store` | `State & Actions` |
| Tipo de slice | `Slice` | `StateCreator<Store, Middleware>` |

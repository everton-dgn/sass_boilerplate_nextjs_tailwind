# Classes utilitárias Tailwind em vez de CSS Modules

**Situação**: Aceita

## Contexto

Com a adoção do Tailwind CSS v4, CSS Modules se tornaram redundantes. Classes
utilitárias oferecem co-localização de estilos no JSX.

## Decisão

Usar classes utilitárias Tailwind diretamente no JSX. Auxiliar `cn()` (clsx +
tailwind-merge) para classes condicionais. Variáveis CSS em
`src/theme/globals.css` para tokens que precisam de modo escuro.

## Alternativas rejeitadas

- **CSS Modules** — rejeitada: sobrecarga de arquivos extras, nomenclatura
  manual e menor integração com Tailwind.

## Consequências

Zero arquivos CSS por componente. Estilos co-localizados. Biome
`useSortedClasses` garante ordenação consistente das classes.

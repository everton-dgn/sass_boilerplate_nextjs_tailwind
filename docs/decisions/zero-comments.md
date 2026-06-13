# Zero comentários no código

**Situação**: Aceita

## Contexto

Comentários frequentemente ficam desatualizados e enganosos. Código bem
nomeado é mais sustentável que código comentado.

## Decisão

Sem comentários no código-fonte. O código deve ser auto-explicativo através
de nomes significativos, estrutura clara e funções pequenas e focadas.

**Exceções**: Diretivas `'use client'` e `'use server'` (exigidas pelo
Next.js, não são comentários).

## Consequências

Força melhor nomenclatura e funções menores. Revisões de código focam em
clareza em vez de precisão dos comentários.

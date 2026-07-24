# Solução de problemas por plataforma

Este guia cobre problemas específicos de cada SO e suas soluções. Para regras
gerais, leia `../reference/quality-constraints.md`.

## Problemas comuns

- Terminações de linha: o repositório espera LF. Se você vir avisos de CRLF
  ou o Biome ficar modificando arquivos, configure o Git para evitar CRLF e
  refaça o clone ou renormalize os arquivos.
- Sensibilidade a maiúsculas: CI roda em Linux, então os caminhos de import
  devem corresponder exatamente à capitalização do nome do arquivo.
- Route groups: pastas como `src/app/[locale]/(home)` usam parênteses. Use
  aspas no caminho em terminais, por exemplo: `ls "src/app/[locale]/(home)"`.
- Playwright: a configuração usa o Chromium gerenciado. Execute
  `pnpm exec playwright install chromium` quando a revisão exigida estiver
  ausente.

## macOS

- Use a linha de Node declarada em `engines.node` e habilite o Corepack para
  o pnpm.
- O Playwright reutiliza o Chromium do cache global padrão do macOS.

# Solução de problemas por plataforma

Este guia cobre problemas específicos de cada SO e suas soluções. Para regras
gerais, leia `../reference/quality-constraints.md`.

## Problemas comuns

- Terminações de linha: o repositório espera LF. Se você vir avisos de CRLF
  ou o Biome ficar modificando arquivos, configure o Git para evitar CRLF e
  refaça o clone ou renormalize os arquivos.
- Sensibilidade a maiúsculas: CI roda em Linux, então os caminhos de import
  devem corresponder exatamente à capitalização do nome do arquivo.
- Route groups: pastas como `src/app/(home)` usam parênteses. Use aspas no
  caminho em terminais, por exemplo: `ls "src/app/(home)"`.
- Playwright: a configuração usa `channel: 'chrome'`, então o Google Chrome
  deve estar instalado ou a configuração deve ser ajustada.

## macOS

- Use Node 24.x e habilite Corepack para pnpm.
- Se o Playwright não encontrar o Chrome, instale o Google Chrome e tente
  novamente.

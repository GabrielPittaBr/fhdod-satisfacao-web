# 09 — Exportação pela API

**Issue:** [#9](https://github.com/GabrielPittaBr/fhdod-satisfacao-web/issues/9)

**O que construir:** Os botões de exportação do dashboard baixam o Excel e o PDF gerados pela API, com os filtros da tela. O PDF, hoje desligado com o aviso de que chegaria com a API, passa a funcionar.

**Bloqueado por:** 07 — Indicadores, respostas e pedidos de retorno ligados à API; API 17 — Exportação em Excel e API 18 — Exportação do resumo em PDF (repositório da API)

**Status:** done

**Critérios de aceite:**

- [x] O resumo e as respostas em Excel e o resumo em PDF são baixados da API com o token de acesso e os filtros atuais, usando o nome de arquivo que a API manda.
- [x] O botão do PDF fica ativo para quem tem `exportacao:resumo`, e o das respostas, só para quem tem `exportacao:detalhada`.
- [x] Enquanto o arquivo é gerado, o botão mostra que está trabalhando; um erro aparece como aviso, sem sair da tela.
- [x] O CSV montado no navegador deixa de existir.
- [x] Testado com cada perfil: os arquivos abrem no Excel e no leitor de PDF, e o telefone só sai para quem pode vê-lo.

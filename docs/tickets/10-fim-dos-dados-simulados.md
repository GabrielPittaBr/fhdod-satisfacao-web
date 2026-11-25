# 10 — Fim dos dados simulados

**Issue:** [#10](https://github.com/GabrielPittaBr/fhdod-satisfacao-web/issues/10)

**O que construir:** O front deixa de ter qualquer dado simulado: tudo vem da API. Saem os mocks, o ajuste provisório da sessão, as simulações de falha pela URL e os tipos da API escritos à mão. O README passa a explicar como rodar o front junto com a API.

**Bloqueado por:** 06 — Cadastros ligados à API; 07 — Indicadores, respostas e pedidos de retorno ligados à API; 08 — TV Wall ligada à API; 09 — Exportação pela API

**Status:** done

**Critérios de aceite:**

- [x] Nenhum arquivo do front importa os mocks, e eles foram apagados com os seus testes (as regras testadas ali agora são testadas na API).
- [x] Os tipos do contrato vêm só do arquivo gerado; não sobra tipo da API escrito à mão.
- [x] Os parâmetros `?falha=` deixam de existir.
- [x] O build não leva nada dos mocks nem dos dados simulados.
- [x] O README explica como rodar o front com a API local, como gerar os tipos e onde ficam os dados de demonstração.
- [x] A mudança fica registrada em `docs/registros/`.
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` passam sem erros.

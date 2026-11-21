# 07 — Indicadores, respostas e pedidos de retorno ligados à API

**Issue:** [#7](https://github.com/GabrielPittaBr/fhdod-satisfacao-web/issues/7)

**O que construir:** O dashboard, a lista e o detalhe das respostas e os pedidos de retorno passam a mostrar os dados reais da API, com os mesmos filtros guardados na URL. Uma avaliação enviada pela pesquisa aparece nos números na atualização seguinte.

**Bloqueado por:** 05 — Login e sessão reais no painel; API 13 — Dashboard: filtros, resumo, NPS por setor e evolução, API 14 — Dashboard: categorias, melhores e piores pontos e comentários e API 15 — Respostas e pedidos de retorno no painel (repositório da API)

**Status:** ready-for-agent

**Critérios de aceite:**

- [ ] Os blocos do dashboard, a lista e o detalhe das respostas e os pedidos de retorno usam a API, com os tipos gerados do contrato.
- [ ] Os pedidos de retorno pedem uma página grande o bastante para o volume do MVP, ou passam a paginar se precisarem.
- [ ] "Revelar telefone" chama a API, e o número continua sumindo ao sair da tela.
- [ ] Testado contra a API com os dados de demonstração: cada perfil vê só o que pode, e uma pesquisa respondida aparece no dashboard.

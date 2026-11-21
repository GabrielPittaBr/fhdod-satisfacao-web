# 05 — Login e sessão reais no painel

**Issue:** [#5](https://github.com/GabrielPittaBr/fhdod-satisfacao-web/issues/5)

**O que construir:** A gestão entra no painel com a conta de verdade, a sessão volta sozinha ao recarregar a página, pelo cookie de refresh, e o primeiro acesso obriga a trocar a senha provisória. Os atalhos de demonstração somem da tela de login. As áreas do painel que ainda usam dados simulados continuam abrindo normalmente com a sessão real, até cada uma ser ligada à API.

**Bloqueado por:** 04 — Cliente da API e pesquisa do paciente ligada à API; API 05 — Login, sessão e acesso por perfil e setor (repositório da API)

**Status:** ready-for-agent

**Critérios de aceite:**

- [ ] Login, recuperação da sessão ao recarregar, logout, `/auth/me` e troca de senha chamam a API.
- [ ] O cliente envia o token de acesso em cada chamada do painel e, num 401, renova a sessão uma única vez e repete a chamada; se a renovação falhar, a pessoa volta para o login.
- [ ] O token de acesso continua só em memória; o refresh fica no cookie que só a API lê.
- [ ] A tela de login não tem mais os atalhos de demonstração, e o menu do Super Admin não tem mais "Restaurar dados de demonstração".
- [ ] As telas do painel ainda simuladas aceitam a sessão real: o mock passa a usar as permissões e os setores da sessão no lugar do token próprio dele. É um ajuste provisório, que sai no ticket 10.
- [ ] O tipo da sessão vem do contrato gerado.
- [ ] Testado contra a API local, com o Super Admin do seed ou com os dados de demonstração: cada perfil entra e vê os menus certos, o primeiro acesso leva à troca de senha e recarregar a página mantém a sessão.

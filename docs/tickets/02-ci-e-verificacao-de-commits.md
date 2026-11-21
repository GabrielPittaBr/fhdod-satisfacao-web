# 02 — CI e verificação de commits

**Issue:** [#2](https://github.com/GabrielPittaBr/fhdod-satisfacao-web/issues/2)

**O que construir:** Todo pull request do front passa pelas mesmas verificações automáticas da API: lint, tipos, testes e build. Antes de cada commit, os arquivos alterados passam pelo lint, e a mensagem precisa seguir o padrão, sem coautoria do Claude.

**Bloqueado por:** 01 — Configuração dos agentes e do fluxo de trabalho

**Status:** ready-for-agent

**Critérios de aceite:**

- [ ] Antes de cada commit, o lint roda nos arquivos alterados e a mensagem é conferida no padrão Conventional Commits; mensagem com coautoria do Claude é recusada.
- [ ] `.editorconfig` e versão do Node fixada, iguais às da API.
- [ ] CI no GitHub Actions a cada pull request e a cada push na `develop` e na `main`: instalação com pnpm e cache, lint, checagem de tipos, testes e build.
- [ ] O `package-lock.json` fica no `.gitignore`, porque o projeto usa pnpm.
- [ ] Modelo de pull request igual ao da API.

# 01 — Configuração dos agentes e do fluxo de trabalho

**Issue:** [#1](https://github.com/GabrielPittaBr/fhdod-satisfacao-web/issues/1)

**O que construir:** Quem abrir o repositório do front, pessoa ou agente, encontra num só lugar como trabalhar nele: o mesmo fluxo de branches e o mesmo padrão de commits da API, como pegar um ticket e quando uma tela está pronta. Commits e pull requests feitos por agentes saem sem coautoria e sem assinatura do Claude.

**Bloqueado por:** Nenhum — pode começar já.

**Status:** ready-for-agent

**Critérios de aceite:**

- [ ] A configuração do Claude Code fica versionada no repositório e desliga a coautoria e a assinatura em commits e pull requests, e o `AGENTS.md` diz isso com todas as letras.
- [ ] O `AGENTS.md` traz o mesmo fluxo de branches e o mesmo padrão de commits do `AGENTS.md` da API: branch por tarefa a partir da `develop`, com o prefixo do tipo e o número do ticket; volta para a `develop` ao terminar; a `main` só com versão estável e tag; ninguém commita direto na `develop` nem na `main`.
- [ ] O `AGENTS.md` explica os tickets de `docs/tickets/`, espelhados como issues no GitHub, e avisa que um ticket do front que liga uma área à API só começa depois dos tickets da API de que ele depende.
- [ ] O `AGENTS.md` traz a definição de pronto do front: a tela funciona no celular e no computador; os tipos da API vêm do contrato gerado; `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` passam; e a entrega fica registrada em `docs/registros/`.
- [ ] O `AGENTS.md` guarda as regras que já valem no front: só a camada de chamadas de cada assunto conversa com a API; o front nunca recalcula classificação, NPS nem permissão; nada da pesquisa fica salvo no navegador; e as decisões de interface dos registros (cores, rostinhos e acessibilidade) continuam valendo.
- [ ] O `AGENTS.md` lista os comandos do projeto e aponta para o plano do front e para o Plano de Desenvolvimento, no repositório da API, e o Claude Code carrega essas instruções ao abrir o repositório.

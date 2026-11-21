# CI e verificação de commits

21/11/2026 · Agente (Claude Code)

> Ticket [02](../tickets/02-ci-e-verificacao-de-commits.md), issue [#2](https://github.com/GabrielPittaBr/fhdod-satisfacao-web/issues/2). Todo PR do front passa a ter as verificações automáticas que a definição de pronto pede, e cada commit passa pelo lint e pelo padrão de mensagens, como na API.

## O que foi feito

- **Hooks do Git:** Husky com os dois hooks da API. O `pre-commit` roda o lint-staged: ESLint e Prettier nos `.ts`, `.tsx` e `.js` alterados, e Prettier nos `.json`, `.css`, `.html` e `.yml`. O `commit-msg` roda o commitlint. O `pnpm install` liga os hooks (script `prepare`).
- **Commitlint:** o `commitlint.config.js` da API, sem mudança: Conventional Commits com os oito tipos do `AGENTS.md` e a regra `sem-coautoria-do-claude`, que recusa o `Co-Authored-By` do Claude ou da Anthropic, o "Generated with Claude Code" e o trailer `Claude-Session`. Os 14 testes da API vieram junto (`tests/commitlint.test.ts`), com exemplos do front, e o `tsconfig.json` passou a checar a pasta `tests/`.
- **Editor e Node:** `.editorconfig` e `.gitattributes` copiados da API (UTF-8, fim de linha LF, dois espaços). Node 26 no `.nvmrc` e `engines.node` em `^26.13.0`, os mesmos da API.
- **CI:** `.github/workflows/ci.yml`, a cada pull request e a cada push na `develop` e na `main`: checkout, pnpm na versão do `packageManager`, Node na versão do `.nvmrc` com o store do pnpm em cache, `pnpm install --frozen-lockfile`, lint, tipos, testes e build. Um push novo no mesmo PR cancela a execução anterior.
- **Lockfiles:** `package-lock.json` e `yarn.lock` no `.gitignore`.
- **Modelo de PR:** `.github/pull_request_template.md`, com "O que mudou", "Como testar", "O que mudou em relação ao plano" e "Ticket".
- **Formatação:** o Prettier passou no projeto todo, num commit só de formatação, que fica no `.git-blame-ignore-revs`. O `pnpm format` passou a valer para o projeto inteiro (antes era só `src/`), e o `.prettierignore` deixa de fora os `.md` e o `pnpm-lock.yaml`, como na API.
- `AGENTS.md` e README com o Node 26, os hooks, o CI e o modelo de PR.
- Ticket 02 marcado como `done`.

## Decisões e por quê

| Decisão | Por quê |
| --- | --- |
| Hooks, commitlint e versões das ferramentas iguais aos da API (commitlint 21.2.4, Husky 9.1.7, lint-staged 17.6.1) | O ticket pede as mesmas verificações da API. Com a mesma configuração, uma mensagem aceita num repositório é aceita no outro |
| Os testes do commitlint também no front | A regra `sem-coautoria-do-claude` é escrita à mão. Os testes garantem que ela continua recusando as assinaturas do Claude e aceitando a coautoria de pessoas |
| Node 26 (`^26.13.0`) | É a versão da API desde hoje (PR #23 da API, registro 03 de lá), e o ticket pede a mesma. Como na API, o `engines` só avisa: quem ainda estiver no Node 24 instala e vê o aviso, e o CI usa o `.nvmrc` |
| `.gitattributes` com LF | Com `core.autocrlf=true`, a cópia de trabalho no Windows ficava em CRLF. O Prettier acusava 111 arquivos, e o lint-staged não conseguia devolver as alterações não staged depois de rodar. A API anotou o mesmo risco no registro 02 dela |
| Prettier no projeto todo, num commit separado | O código nunca tinha passado pelo `.prettierrc`: 68 arquivos estavam fora do padrão, com linhas acima de 110 colunas e as aspas duplas do shadcn/ui. Sem a formatação agora, o primeiro commit que tocasse cada arquivo o traria inteiro reformatado, com a mudança de verdade escondida no meio. Num commit separado, a revisão pode pulá-lo |
| `.git-blame-ignore-revs` | O "Blame" do GitHub pula o commit de formatação, e cada linha continua mostrando quem a escreveu de fato |
| `pnpm format` no projeto todo | O hook passa o Prettier nos `.json`, `.css`, `.html` e `.yml` alterados fora de `src/`. Se o `format` cobrisse só `src/`, os dois discordariam |
| `pnpm/action-setup@v6` e `actions/setup-node@v7`, com `node-version-file: .nvmrc` e `cache: pnpm` | O pnpm sai do `packageManager` e o Node, do `.nvmrc`: o CI nunca roda com versões diferentes das do projeto. As versões das actions são as últimas em 21/11/2026 (checkout v7.0.1, setup-node v7.1.0 e action-setup v6.1.1, que aceita o pnpm 12 desde a v6.1.0) |
| `pnpm install --frozen-lockfile` | Se o `package.json` mudar sem o lockfile, o CI falha, em vez de instalar versões diferentes das testadas na máquina |
| `pull_request` sem filtro de branch | O ticket pede "a cada pull request". Assim, um PR que parte de outra branch de tarefa também é verificado |
| `permissions: contents: read` e `timeout-minutes: 15` | O CI só precisa ler o código, e uma instalação travada não gasta os minutos de Actions do mês |
| Modelo de PR com as seções dos PRs da API, mais o lembrete dos prints | A API ainda não tem modelo, que é do ticket 03 de lá. O do front segue o formato que os PRs #21 e #22 da API já usam e o que o ticket 03 da API pede: o que mudou, como testar e o link do ticket. Os prints vêm do Plano de Desenvolvimento ("pull requests pequenos, com descrição e print das telas") |
| Branch `ci/02-ci-e-verificacao-de-commits`, criada a partir da branch do ticket 01 | O ticket 02 é bloqueado pelo 01 e muda o `AGENTS.md` que o 01 cria. Quando o 02 começou, o PR do 01 ainda esperava revisão |

## Ferramentas e skills usadas

- Claude Code, lendo a configuração da API e os registros 02 e 03 dela.
- As versões das actions foram conferidas pela API do GitHub (`gh api`), e as entradas do `actions/setup-node`, no `action.yml` da v7.1.0.
- Nenhuma skill.

## Como foi verificado

- `pnpm lint`, `pnpm typecheck`, `pnpm test` (41 testes: os 27 de antes e os 14 do commitlint) e `pnpm build` sem erros, no Node 24 da máquina.
- Os hooks foram testados com commits que não chegaram ao histórico: um `.ts` com uma variável sem uso parou no ESLint do `pre-commit`; a linha `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` foi recusada pela regra `sem-coautoria-do-claude`, com o aviso que aponta para o `AGENTS.md`; e "Teste do hook." foi recusado por não ter tipo e terminar com ponto. O commitlint também recusou uma mensagem deste próprio ticket, com uma linha de corpo acima de 100 caracteres.
- Todos os commits do ticket feitos depois de ligar os hooks passaram por eles.
- Formatação: os 67 arquivos do `dist/` têm o mesmo SHA-256 antes e depois do commit de formatação.
- O CI rodou no PR [#12](https://github.com/GabrielPittaBr/fhdod-satisfacao-web/pull/12) e passou em 35 s: o `actions/setup-node` leu o `26` do `.nvmrc` e instalou o Node 26.13.1, e a instalação (com o lockfile congelado), o lint, os tipos, os testes e o build passaram.

## O que mudou em relação ao plano

- **Formatação do projeto todo**, que o ticket não pede (o motivo está na tabela).
- **Modelo de PR "igual ao da API".** A API ainda não tem o dela; o do front segue o formato dos PRs da API e o ticket 03 de lá.
- **Node 26 só no CI.** A máquina tem o Node 24: o lint, os testes e o build rodaram nele, e o Node 26 roda no CI.

## Pendências e dúvidas

- **Ordem dos merges.** O PR deste ticket parte da branch do ticket 01, então os commits do 01 aparecem nele até o PR #11 entrar na `develop`. O #11 entra primeiro.
- **Proteção da `develop` e da `main`.** Agora que o CI existe, uma regra de proteção pode exigir o check "Lint, tipos, testes e build" verde e um PR aprovado antes do merge. É configuração do GitHub e decisão do time.
- **Modelo de PR na API.** Quem fizer o ticket 03 da API pode copiar o `.github/pull_request_template.md` daqui, para os dois ficarem iguais.
- **Node 26 na máquina.** Quem estiver no Node 24 vê o aviso do pnpm e deve instalar o 26, pelo nodejs.org ou com `nvm install 26`.
- **`git blame` na máquina.** Cada clone precisa de `git config blame.ignoreRevsFile .git-blame-ignore-revs` para pular o commit de formatação.
- **Nome antigo no `package.json`** (registro 01): continua.

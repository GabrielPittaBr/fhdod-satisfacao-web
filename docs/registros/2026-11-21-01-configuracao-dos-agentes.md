# Configuração dos agentes e do fluxo de trabalho

21/11/2026 · Agente (Claude Code)

> Ticket [01](../tickets/01-configuracao-dos-agentes.md), issue [#1](https://github.com/GabrielPittaBr/fhdod-satisfacao-web/issues/1). Primeiro ticket da ligação com a API. Nenhuma tela muda: fica escrito como se trabalha no front daqui em diante, do mesmo jeito que na API.

## O que foi feito

- `AGENTS.md` na raiz, com:
  - a regra de que commits e PRs não levam coautoria nem assinatura de ferramenta;
  - o fluxo de branches e o padrão de commits da API, com os escopos do front;
  - como pegar, acompanhar e fechar um ticket, e o aviso de que um ticket que liga uma área à API espera os tickets da API de que depende, com o comando para conferir o status deles;
  - a definição de pronto do front e o formato do registro da entrega;
  - as regras que já valiam no front: só a camada de chamadas conversa com a API, o front não recalcula classificação, NPS nem permissão, nada da pesquisa fica no navegador e as decisões de interface dos registros (cores, rostinhos, acessibilidade, fonte, texto, dados pessoais na tela e desempenho);
  - idioma, nomes e pastas, o contrato com a API e as regras de segurança e LGPD;
  - os comandos do projeto e onde estão as coisas, com o Plano de Desenvolvimento no repositório da API.
- `CLAUDE.md` que importa o `AGENTS.md` (`@AGENTS.md`), para o Claude Code carregar as mesmas instruções ao abrir o repositório.
- `.claude/settings.json` versionado, igual ao da API: `attribution` vazio (commit e PR), `sessionUrl: false` e `includeCoAuthoredBy: false`.
- `.claude/settings.local.json` no `.gitignore`, para a configuração pessoal de cada um não ir para o Git.
- README com o caminho para o `AGENTS.md`, o Plano de Desenvolvimento e os tickets.
- Etiqueta `in-progress` criada no GitHub do front (a API já tinha a sua) e usada na issue #1.
- Ticket 01 marcado como `done`.

## Decisões e por quê

| Decisão | Por quê |
| --- | --- |
| Fluxo de branches, padrão de commits, ciclo dos tickets e registro com o mesmo texto do `AGENTS.md` da API | O ticket pede "o mesmo fluxo de branches e o mesmo padrão de commits" da API. Com o mesmo texto, quem trabalha nos dois repositórios segue uma regra só |
| Escopos dos commits: as pastas de `src/features/`, mais `api`, `mocks`, `ui`, `totem`, `tickets` e `registros` | São os escopos que o histórico do front já usa. Na API, o escopo é a pasta do módulo; aqui, a pasta da feature |
| Plano de Desenvolvimento citado pelo link do GitHub e pelo caminho `../fhdod-satisfacao-api/docs/` | O plano agora mora no repositório da API. Um link relativo não abriria no GitHub, e o caminho local é o que o plano recomenda: os dois repositórios lado a lado |
| O status de um ticket da API é conferido no arquivo do ticket, na `develop` da API, e não pela issue | A issue da API é fechada à mão depois do merge e pode ficar aberta por um tempo. Hoje mesmo, a #2 da API está aberta com o ticket já `done` |
| "Ao ligar uma área à API, só o `api.ts` dela muda" | É a promessa do plano do front (seção 5, "só a camada de chamadas mude") e o que os tickets 04 a 09 pedem |
| Definição de pronto com 360×740 e 1366×768 como mínimo | São o menor celular e o computador mais comum da seção 11 do plano do front. O totem e a TV entram quando a tarefa mexe neles |
| Tipos gerados obrigatórios só depois do ticket 04 | O gerador (`pnpm api:tipos`) chega no ticket 04, e cada área troca os tipos escritos à mão ao ser ligada à API |
| Decisões de interface resumidas no `AGENTS.md`, com as cores em hexadecimal | Quem abre o repositório fica sabendo, sem ler os dois registros inteiros, que erro não é vermelho e que os rostinhos não são ícones. O porquê de cada decisão continua nos registros de 10/11 e 11/11 |
| PR com prints no celular e no computador quando muda uma tela | O Plano de Desenvolvimento pede "pull requests pequenos, com descrição e print das telas" |
| `attribution` com `sessionUrl: false` e também `includeCoAuthoredBy: false` | Igual à API. `attribution` é a chave atual; `includeCoAuthoredBy` fica para quem estiver numa versão anterior do Claude Code |
| Branch `chore/01-configuracao-dos-agentes` | O ticket é configuração do projeto, e o nome é o mesmo do ticket 01 da API |

## Ferramentas e skills usadas

- Claude Code, lendo o `AGENTS.md`, o `CLAUDE.md`, o `.claude/settings.json` e os registros da API, o plano do front, os registros de 10/11 e 11/11 e os tickets do front.
- As chaves `attribution` (com `sessionUrl`) e `includeCoAuthoredBy` foram conferidas na instalação do Claude Code da máquina (2.1.325): `attribution` é a chave atual, e `includeCoAuthoredBy` aparece como obsoleta, mas ainda é aceita.
- As regras citadas no `AGENTS.md` foram conferidas no código: só os `features/*/api.ts` importam `src/mocks/`; o `localStorage` só aparece dentro de `src/mocks/`; as cores estão em `src/styles/globals.css`; os erros de validação vão para os campos em `src/lib/salvar.ts`.
- Nenhuma skill.

## Como foi verificado

- O Claude Code, aberto na raiz do repositório e sem ferramentas, respondeu `fix/07-<assunto>` para a branch de uma correção do ticket 07, `#A63D00` para a cor dos erros de formulário e `in-progress` para a etiqueta de quem pega um ticket. A cor e a etiqueta só estão no `AGENTS.md`, então o `CLAUDE.md` carregou o arquivo.
- O comando que confere o status de um ticket da API foi rodado: o ticket 02 da API aparece `done` e o 03, `ready-for-agent`.

## O que mudou em relação ao plano

- **O plano do front aponta para documentos fora do repositório** (`D:\Trabalhos\FHDOD\docs\`) e para o nome antigo do repositório (`frontend-fhdod`). O plano não foi editado, porque "não é usado como diário"; o `AGENTS.md` aponta para o lugar atual do Plano de Desenvolvimento.
- **Comandos do projeto.** A seção traz o que já existe. O ticket 02 acrescenta os hooks do Git, a versão fixa do Node e o CI.

## Pendências e dúvidas

- **Branch padrão e proteção das branches**, as mesmas da API. Se a `develop` virar a branch padrão, o `Closes #N` passa a fechar as issues sozinho e o PR já abre com a base certa. Uma regra de proteção faria valer o "ninguém commita direto" e, depois do ticket 02, o CI verde.
- **Quadro do GitHub Projects.** As issues ficam em "A fazer" no quadro, como as da API; nenhum dos dois `AGENTS.md` manda mover os cartões. Se o time quiser usar as colunas, vale escrever isso nos dois.
- **Nome antigo no `package.json`.** `name`, `repository`, `bugs` e `homepage` ainda dizem `frontend-fhdod`. O GitHub redireciona o endereço antigo, mas vale trocar por `fhdod-satisfacao-web` numa próxima mudança do arquivo.

# AGENTS.md — como trabalhar no front

Este arquivo vale para qualquer pessoa ou agente que mexa no `fhdod-satisfacao-web`, o front-end do Sistema de Satisfação Hospitalar da FHDOD: a pesquisa do paciente (celular, tablet e totem), o painel da gestão e a TV Wall. Leia antes de começar qualquer tarefa. Todos os tickets seguem o que está escrito aqui.

- **Regras de negócio:** o [Plano de Desenvolvimento](https://github.com/GabrielPittaBr/fhdod-satisfacao-api/blob/develop/docs/Plano%20de%20Desenvolvimento%20-%20FHDOD.md) é a fonte. Ele fica no repositório da API, em `../fhdod-satisfacao-api/docs/`, com os dois repositórios clonados lado a lado na mesma pasta.
- **Telas e interface:** o [plano do front](docs/plano-frontend.md) e os [registros](docs/registros/). Se o plano do front e o Plano de Desenvolvimento discordarem numa regra de negócio, vale o Plano de Desenvolvimento. O plano do front foi escrito antes da API: o que ele deixou de fora (tipos gerados, Docker, Caddy e a ligação com a API) chega pelos tickets.
- **O que fazer:** os tickets de [`docs/tickets/`](docs/tickets/).
- **Como trabalhar:** este arquivo. O Claude Code o carrega sozinho pelo `CLAUDE.md`.

## Sem coautoria nem assinatura

**Commits e pull requests não levam coautoria nem assinatura de ferramenta.** Nenhum commit tem a linha `Co-Authored-By` de um agente, e nenhuma descrição de PR tem "Generated with Claude Code", link de sessão ou qualquer marca de ferramenta de IA. Vale para pessoas e agentes, mesmo quando a ferramenta sugerir o contrário.

O `.claude/settings.json`, versionado no repositório, já desliga isso no Claude Code para o time todo (`attribution` vazio e `includeCoAuthoredBy: false`). Quem usar outra ferramenta apaga essas linhas à mão antes de commitar ou abrir o PR. O commitlint, no hook `commit-msg`, recusa mensagens com a coautoria ou a assinatura do Claude.

## Fluxo de branches

O mesmo da API:

| Branch | Para quê | Quem escreve nela |
| --- | --- | --- |
| `develop` | Base de todo o trabalho; reúne o que já foi revisado | Só merge de branch de tarefa, por PR |
| `main` | Só versões estáveis, prontas para o hospital | Só merge da `develop`, com tag de versão |
| `<tipo>/<NN>-<assunto>` | Uma tarefa (um ticket) | Quem pegou o ticket |

- **Uma branch por tarefa**, curta, criada a partir da `develop` atualizada.
- **Nome:** prefixo do tipo, número do ticket com dois dígitos e um resumo em kebab-case, sem acentos. Exemplo: `feat/05-login-e-sessao-reais`.
- **Prefixos:** `feat/`, `fix/`, `docs/`, `chore/`, `style/`, `refactor/`, `test/` e `ci/`, os mesmos tipos dos commits.
- **Terminou a tarefa:** a branch volta para a `develop` por pull request, com o CI verde e a aprovação de outra pessoa do time. Use merge commit, sem squash, como no histórico atual.
- **Versão estável:** a `main` recebe a `develop` e ganha uma tag de versão (`v0.1.0`, `v0.2.0`...). O que vai para o hospital sai sempre da `main`.
- **Ninguém commita direto na `develop` nem na `main`.**

```bash
git switch develop
git pull
git switch -c feat/05-login-e-sessao-reais
# ... commits ...
git push -u origin feat/05-login-e-sessao-reais
gh pr create --base develop
```

O PR é pequeno e diz o que mudou, como testar e qual é o ticket. Se a tarefa muda uma tela, o PR leva prints no celular e no computador. Atenção à base: o padrão do GitHub é a `main`, e o PR de uma tarefa vai sempre para a `develop`.

Os merges antigos do histórico (`feat/painel`, `feat/tv-wall`...) são de antes dos tickets, por isso as branches não têm número. Daqui em diante, toda branch leva o número do ticket.

## Padrão de commits

O mesmo da API: [Conventional Commits](https://www.conventionalcommits.org/pt-br/), `tipo(escopo): descrição`.

- **Tipo em inglês:** `feat` (funcionalidade), `fix` (correção), `docs` (documentação), `chore` (configuração e manutenção), `style` (formatação, sem mudar comportamento), `refactor` (reorganização, sem mudar comportamento), `test` (testes) e `ci` (pipeline).
- **Escopo:** o assunto afetado, com o mesmo nome da pasta em `src/features/` (`auth`, `pesquisa`, `dashboard`, `respostas`, `contatos`, `setores`, `perguntas`, `cadastros`, `usuarios`, `tv-wall`). Mudanças fora das features usam a área (`api` para `src/lib/api/`, `mocks`, `ui`, `totem`, `tickets`, `registros`); mudanças que tocam o projeto inteiro ficam sem escopo.
- **Descrição em português**, curta, começando com letra minúscula e sem ponto final. Se o porquê não for óbvio, explique no corpo do commit.

| Exemplo | Quando |
| --- | --- |
| `feat(pesquisa): escala de rostinhos` | Funcionalidade nova numa feature |
| `fix(auth): renovar o token só uma vez` | Correção |
| `test(mocks): classificação e cálculo do nps` | Testes |
| `docs(tickets): divide a ligação com a API em 10 tickets` | Documentação de uma área |
| `chore: configuração do Claude Code sem coautoria` | Configuração do projeto inteiro |
| `ci: lint, tipos, testes e build no GitHub Actions` | Pipeline |

## Tickets

- Ficam em `docs/tickets/`, **um por arquivo** (`NN-assunto.md`), e são **espelhados como issues no GitHub** com o mesmo número: o ticket `05` é a issue #5 deste repositório.
- Cada ticket diz o que construir, por quem está bloqueado, o status e os critérios de aceite.
- **Só se pega um ticket cujos bloqueios já estão feitos** (status `done`). A numeração segue a ordem dos bloqueios.
- Tickets `ready-for-human` precisam de alguém do time (acesso a servidor, domínio, conversa com o hospital). Um agente não os pega sozinho; ajuda só se alguém pedir.

### Tickets que ligam uma área à API

**Um ticket do front que liga uma área à API só começa depois dos tickets da API de que ele depende.** O "Bloqueado por" desses tickets cita os da API pelo número e pelo nome (por exemplo, "API 03 — Contrato: Swagger, `openapi.json` e CI"), e cada um deles precisa estar `done` no repositório da API: com o status `done` no arquivo do ticket, na `develop` da API. Sem isso, o front ficaria desenhado contra um contrato que ainda não existe.

```bash
# Status do ticket 03 da API na develop de lá, com os dois repositórios lado a lado
git -C ../fhdod-satisfacao-api fetch origin
git -C ../fhdod-satisfacao-api grep -h "Status" origin/develop -- "docs/tickets/03-*.md"
```

Ao ligar uma área à API, **só o `api.ts` dela muda**: telas e hooks continuam iguais. Se a API devolve algo diferente do mock, vale a API, e a diferença fica no registro e no PR.

### Status

| Status | Quando | No arquivo | No GitHub |
| --- | --- | --- | --- |
| `ready-for-agent` | Pronto para pegar | `**Status:** ready-for-agent` | Etiqueta `ready-for-agent` |
| `in-progress` | Alguém começou | `**Status:** in-progress` | Etiqueta `in-progress` no lugar de `ready-for-agent` |
| `done` | A branch entrou na `develop` | `**Status:** done`, com os critérios marcados `[x]` | Issue fechada |

**Ao começar:** crie a branch e troque a etiqueta da issue, para o time saber que o ticket tem dono.

```bash
gh issue edit 5 --remove-label ready-for-agent --add-label in-progress
```

**Ao terminar:** o último commit da branch marca os critérios atendidos e passa o status do arquivo para `done`. Quando o PR entra na `develop`, a issue é fechada **à mão**: o GitHub só fecha sozinho uma issue citada com `Closes #5` quando o PR entra na branch padrão, que hoje é a `main`. Se a `develop` virar a branch padrão, o `Closes #5` na descrição do PR passa a bastar.

```bash
gh issue close 5 --comment "Entrou na develop pelo PR #NN."
```

Se um critério não puder ser cumprido como está escrito, não o pule em silêncio: explique no registro da entrega, em "O que mudou em relação ao plano", e no PR.

## Definição de pronto

Uma tarefa do front só está pronta quando:

- [ ] **a tela funciona no celular e no computador**: testada pelo menos em 360×740 e em 1366×768, sem rolagem horizontal da página, com toque, mouse e teclado. O totem e a TV também são testados nos tamanhos deles (seção 11 do plano do front) quando a tarefa mexe neles;
- [ ] **os tipos da API vêm do contrato gerado**: `src/lib/api/schema.d.ts`, criado por `pnpm api:tipos` a partir do `openapi.json` da API, nunca escrito nem editado à mão. Todas as áreas ligadas à API usam os tipos gerados, que o `src/lib/api/tipos.ts` só renomeia, sem nenhum tipo da API escrito à mão;
- [ ] **`pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` passam** na máquina e no CI, incluindo os testes da regra nova;
- [ ] a entrega está **registrada em `docs/registros/`**;
- [ ] os critérios de aceite do ticket estão marcados e o status está `done`;
- [ ] outra pessoa do time revisou e aprovou o PR.

O CI roda os quatro comandos em todo pull request e em cada push na `develop` e na `main`. Rode-os na máquina antes de abrir o PR, para o CI não ser o primeiro a acusar.

### Registro da entrega

Cada entrega ganha um arquivo em `docs/registros/`, no formato que o plano do front criou e a API copiou: `AAAA-MM-DD-NN-assunto.md`, em que `NN` é a ordem do registro naquele dia. O registro traz:

1. título, data, autor (pessoa ou agente) e o link do ticket;
2. **O que foi feito**;
3. **Decisões e por quê**, numa tabela, citando a persona, a regra do plano ou a necessidade por trás de cada uma;
4. **Ferramentas e skills usadas**;
5. **O que mudou em relação ao plano**;
6. **Pendências e dúvidas**.

Quando a entrega mexe em telas, entra também **Como foi verificado**: os fluxos e os tamanhos de tela testados, como no registro de 11/11. O registro conta pontos na atividade ("Registro do processo e justificativas"), então as justificativas precisam ser claras.

## Regras que já valem no front

### Só a camada de chamadas conversa com a API

```text
componente → hook (TanStack Query) → features/<assunto>/api.ts → cliente HTTP → API
```

- **Só o `api.ts` de cada assunto conversa com a API.** Componentes, páginas e hooks nunca chamam `fetch` nem o cliente HTTP diretamente.
- Cada função do `api.ts` corresponde a um endpoint do contrato: `buscarPesquisa(slug)` ↔ `GET /publico/setores/:slug/pesquisa`.
- O `api.ts` chama a API pelo cliente de `src/lib/api/cliente.ts` (openapi-fetch, tipado pelo `schema.d.ts`), sempre dentro de `pedir(...)`: ele devolve o corpo do sucesso ou lança o `ErroApi`. Os endereços são os do contrato, com o `/api/v1` na frente, e vão ao mesmo domínio do site.
- As chamadas do painel usam `pedirComToken(...)` (`src/features/auth/api.ts`) no lugar do `pedir`: ele põe o token de acesso no `Authorization` e, num 401, renova a sessão uma única vez e repete a chamada. Se a renovação falha, a sessão acaba e o painel volta para o login. As renovações da aba saem uma de cada vez, porque a API troca o refresh a cada uso. Os `api.ts` dos cadastros (`setores`, `cadastros`, `perguntas` e `usuarios`) mostram o uso.
- As rotas que devolvem um arquivo (as exportações) vão com `parseAs: 'blob'` pelo `pedirArquivoComToken(...)`, que devolve o arquivo e o nome que a API mandou no `Content-Disposition`; o erro antes do arquivo chega em JSON e vira o `ErroApi` de sempre. A página só salva o arquivo (`src/features/dashboard/`).
- A tela da TV é a exceção: não tem login e manda o token do link no cabeçalho `X-Tv-Token`, pelo `pedir`, sem a sessão do painel. Nela, o 401 quer dizer que a tela foi desativada, não que a sessão acabou (`src/features/tv-wall/api.ts`).
- O corpo que uma rota recebe vem do contrato, com o `CorpoDe<'/api/v1/setores', 'post'>` de `src/lib/api/tipos.ts`, e os filtros da query string, com o `ConsultaDe<'/api/v1/respostas'>`, sem tipo escrito à mão. Os `api.ts` do dashboard, das respostas e dos contatos mostram o uso.
- Os testes de cada `api.ts` usam a API de mentira de `src/test/api-falsa.ts`: as rotas previstas, a resposta de cada uma e a conferência do método, do caminho, do corpo e da query string enviados. As rotas sem a sessão do painel, como a da TV, vão em `usarApiFalsa({ semSessao: [...] })`.
- Todas as leituras e envios passam pelo TanStack Query, para os estados de carregamento e erro existirem em toda tela.
- Erros chegam às telas como `ErroApi` (`src/lib/api/erro.ts`), com status, código, mensagem, detalhes e o `requestId` que a API mandou. Sem rede, o status é 0, com a mensagem de sem conexão. A tela mostra a mensagem da API, que já vem escrita para quem está na tela, e os erros de validação vão para o campo do formulário indicado em `detalhes` (`src/lib/salvar.ts`); a validação de um campo que não está na tela, num aviso ou numa consulta, aparece com a mensagem do campo (`mensagemGeral`, em `src/lib/api/erro.ts`). Depois de gravar, o `useSalvar` recarrega as listas afetadas também quando a gravação falha, para a tela não ficar com o que não foi gravado.

### O front nunca recalcula classificação, NPS nem permissão

- A **classificação** da resposta (NORMAL, BAIXA, BAIXISSIMA) e o **NPS** chegam prontos da API; o front só os exibe. Nada de decidir nota baixa num componente.
- Menus e rotas dependem da **lista de permissões** do `/auth/me` (`usePode`, em `src/stores/sessao.ts`), nunca do nome do perfil. Esconder um botão é só conforto: quem garante o acesso é a API.
- As permissões e os setores de cada perfil vêm só do `/auth/me`. Enquanto houver dados simulados, a classificação e o NPS simulados ficam só em `src/mocks/regras.ts`.

### Nada da pesquisa fica salvo no navegador

- O estado da pesquisa vive no `useReducer` do `useFluxoPesquisa` e some ao reiniciar. **Nada da pesquisa vai para `localStorage`, `sessionStorage`, cookie ou URL**, nem a chave de idempotência: no totem, o próximo paciente não pode ver nada do anterior.
- O token de acesso do painel fica só em memória (Zustand); ao recarregar, a sessão volta pelo refresh, que fica no cookie HttpOnly da API: o front nunca o lê nem o guarda. Ao sair, ou quando a sessão acaba, o cache do TanStack Query é apagado, para quem entrar depois não ver os dados de quem saiu.
- O front não guarda nada no `localStorage`. O "banco" simulado de `src/mocks/`, que nenhuma tela usa mais, sai com os mocks no ticket 10.

### As decisões de interface dos registros continuam valendo

As decisões dos registros de 10/11 e 11/11 valem para toda tela nova ou alterada. Mudar uma delas pede um registro explicando o porquê.

- **Cores:** o vermelho da marca fica só no logo. Ações em verde-petróleo (`#0A6C6C`), texto em azul-marinho (`#12303F`), avisos em âmbar (`#6E4400` sobre `#FFF1CC`) e erros de formulário em ferrugem (`#A63D00`), nunca em vermelho. As cores do vermelho ao verde (`--nota-1` a `--nota-5`) aparecem só na escala de 1 a 5 e nos indicadores que a repetem. As cores ficam em `src/styles/globals.css`; não crie outras soltas nos componentes.
- **Rostinhos:** a escala de 1 a 5 usa as ilustrações coloridas do Microsoft Fluent Emoji de `src/assets/emojis/` (licença MIT), nunca ícones de linha (lucide `Smile`, `Frown`...) nem o emoji do sistema. Cada nível tem rosto, texto e cor (1 Muito ruim, 2 Ruim, 3 Regular, 4 Bom, 5 Muito bom), sempre na mesma direção, e o rótulo completo para leitor de tela ("4, Bom"). Os mesmos rostinhos aparecem no painel e na TV.
- **Acessibilidade:** contraste AA da WCAG em tudo, inclusive sobre as cores da escala. Na pesquisa, botões de no mínimo 48 px e texto de pelo menos 18 px. Navegação completa por teclado, com foco sempre visível, e rótulos para leitor de tela. Respeito a `prefers-reduced-motion`. Contagens regressivas anunciadas ao leitor de tela uma vez só. O zoom do navegador só é bloqueado no totem.
- **Fonte:** Lexend, que tem o zero sem corte (importa na escala de 0 a 10).
- **Texto:** o paciente nunca vê termos internos ("NPS", "classificação baixa", "detrator"); frases curtas, tratando por "você", sem siglas. No painel, os números vêm explicados, e o NPS aparece sempre com o número de respostas ao lado.
- **Pesquisa:** o toque na nota de 0 a 10 seleciona e "Enviar avaliação" confirma. "Voltar" fica sempre à esquerda e "Pular", à direita. Elogio tem o mesmo destaque que reclamação.
- **Dados pessoais na tela:** a TV nunca mostra comentário, reclamação, telefone ou outro dado pessoal. O telefone aparece sempre mascarado (`•••• 0042`); o número completo, só em "Revelar telefone", para quem tem `contatos:ver`.
- **Desempenho:** cada área (pesquisa, totem, painel, TV) é carregada sob demanda. Quem abre a pesquisa pelo QR Code não baixa gráficos nem nada do painel.
- **Revisão:** ao terminar uma área ou uma tela nova, revise com a skill `web-design-guidelines` e corrija o que ela apontar, ou registre por que não corrigiu (seção 2 do plano do front).

### Idioma, nomes e pastas

- **Domínio em português** (`setores`, `perguntas`, `respostas`, `classificacao`); **termos técnicos em inglês** (`hook`, `store`, `schema`, `query`). Identificadores sem acentos; textos para o usuário em português correto, com acentos.
- Componentes React em PascalCase (`EscalaNps.tsx`), hooks como `useFluxoPesquisa.ts` e os demais arquivos em minúsculas, com hífen quando precisar (`query-client.ts`).
- Código organizado por assunto: cada um em `src/features/<assunto>/`, com `api.ts`, `hooks/`, `components/`, `pages/` e `schemas.ts` quando precisar. O que várias áreas usam fica em `src/components/` e `src/lib/`. `src/components/ui/` é código gerado pelo shadcn/ui.
- Formulários com React Hook Form e Zod, com mensagens em português. A validação do front só avisa antes do envio; quem decide é a API.

### Contrato com a API

- **O front só conhece a API pelo `openapi.json`**, gerado e commitado pela API (`../fhdod-satisfacao-api/openapi.json`). O front nunca copia código do backend.
- **Uma funcionalidade que mexe nos dois lados vira dois PRs ligados:** o da API entra primeiro, com o `openapi.json` atualizado; depois o do front, com os tipos regenerados. Os dois PRs se citam na descrição.
- Campo que a tela precisa e o contrato não tem se combina com a API, nunca se inventa no front. Exemplo: o `temRespostas` da pergunta, anotado no registro de 10/11.
- Os códigos de erro que o front trata são os sete do contrato: `VALIDACAO`, `NAO_AUTENTICADO`, `SEM_PERMISSAO`, `NAO_ENCONTRADO`, `CONFLITO`, `LIMITE_ATINGIDO` e `ERRO_INTERNO`.

## Segurança e LGPD

- **Nenhum segredo no Git.** O `.env` nunca é commitado; o `.env.example` traz só os nomes das variáveis e exemplos falsos. Nenhuma variável do front começa com `VITE_`, então nada do `.env` vai para o site.
- **Nenhum dado real de paciente**, em lugar nenhum: dados simulados, testes, prints, issues, PRs e registros usam só dados inventados, com telefones claramente fictícios.
- Telefone, senha e tokens não vão para o `console` nem para mensagens de erro. O único token que aparece num endereço é o da TV, e ele fica depois do `#`, a parte que o navegador nunca envia ao servidor.
- Ao usar uma ferramenta de IA, não cole nela o `.env`, dados reais nem logs de produção.

## Comandos do projeto

Node.js 26 (a versão fica no `.nvmrc`, a mesma da API) e pnpm 12 (a versão fica em `packageManager`; sem o pnpm instalado, use `corepack pnpm`). Com outra versão do Node, o pnpm só avisa; o CI usa sempre a do `.nvmrc`. O passo a passo para rodar está no [README](README.md), com os endereços de cada área.

| Comando | O que faz |
| --- | --- |
| `pnpm install` | Instala as dependências e liga os hooks do Git |
| `pnpm dev` | Servidor de desenvolvimento em `http://localhost:5173`, que repassa `/api` para a API local (`API_URL`, padrão `http://localhost:3333`) |
| `pnpm build` | Gera o site estático em `dist/` |
| `pnpm preview` | Serve o `dist/` para conferir o build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Checagem de tipos do TypeScript |
| `pnpm test` | Testes (Vitest) |
| `pnpm format` | Formata o projeto com o Prettier (menos os `.md`, o `pnpm-lock.yaml` e o `schema.d.ts`) |
| `pnpm api:tipos` | Gera `src/lib/api/schema.d.ts` a partir do `openapi.json` da API (`OPENAPI_JSON`, padrão `../fhdod-satisfacao-api/openapi.json`) |

- **Antes de cada commit**, o Husky roda o ESLint e o Prettier nos arquivos alterados (lint-staged), e o commitlint confere a mensagem: Conventional Commits, com os tipos deste arquivo e sem coautoria nem assinatura do Claude. É a mesma configuração da API.
- **CI:** o `.github/workflows/ci.yml` instala com o pnpm (com cache) e roda lint, tipos, testes e build em todo pull request e em cada push na `develop` e na `main`. O modelo de PR fica em `.github/pull_request_template.md`.
- **Formatação:** o commit que passou o Prettier no projeto todo está no `.git-blame-ignore-revs`, que o `git blame` do GitHub pula. Para o da máquina pular também: `git config blame.ignoreRevsFile .git-blame-ignore-revs`.
- **Contrato mudou na API:** rode `pnpm api:tipos` e commite o `schema.d.ts` gerado no mesmo PR que usa o contrato novo. O ESLint e o Prettier não mexem nele.
- **Pesquisa:** usa a API de verdade; para abrir com o `pnpm dev`, a API precisa estar rodando, com um setor cadastrado (README, em "Com a API").
- **Login:** é o da API, com as contas de lá (README, em "Com a API"). Não há mais atalhos de demonstração.
- **Cadastros:** setores, categorias, turnos, perguntas e usuários são os da API. Para a pesquisa abrir, cadastre no painel um setor com perguntas (README, em "Com a API").
- **Indicadores, respostas e pedidos de retorno:** são os da API. Para terem o que mostrar, rode os dados de demonstração da API (`pnpm db:demo`, README, em "Com a API") ou responda a pesquisa de um setor cadastrado.
- **TV:** os números e as telas são os da API. Os dados de demonstração de lá abrem em `/tv#demo-recepcao-fhdod`; outras telas se criam no painel, em "Telas de TV", com o link mostrado uma vez só.
- **Exportações:** o resumo em Excel e em PDF e as respostas em Excel são gerados pela API, com os filtros da tela; o telefone só vai para quem tem `contatos:ver`, e quem decide é a API.
- **Dados simulados:** nenhuma tela usa mais `src/mocks/`, e o `?falha=tudo` deixou de ter efeito. A pasta sai inteira no ticket 10.

## Onde estão as coisas

| O quê | Onde |
| --- | --- |
| Regras de negócio, contrato e arquitetura | [Plano de Desenvolvimento](https://github.com/GabrielPittaBr/fhdod-satisfacao-api/blob/develop/docs/Plano%20de%20Desenvolvimento%20-%20FHDOD.md), no repositório da API |
| Telas, interface, dispositivos e acessibilidade | [`docs/plano-frontend.md`](docs/plano-frontend.md) |
| Tickets | [`docs/tickets/`](docs/tickets/) e as issues do GitHub |
| Registros das entregas e decisões de interface | [`docs/registros/`](docs/registros/) |
| Cliente HTTP, tipos gerados do contrato e erro padrão | [`src/lib/api/`](src/lib/api/) e o gerador, em [`scripts/api-tipos.mjs`](scripts/api-tipos.mjs) |
| Variáveis do ambiente de desenvolvimento | [`.env.example`](.env.example) |
| Dados simulados e as regras que serão da API | [`src/mocks/`](src/mocks/) |
| API de mentira dos testes dos `api.ts` | [`src/test/api-falsa.ts`](src/test/api-falsa.ts) |
| Cores, fonte e temas | [`src/styles/globals.css`](src/styles/globals.css) |
| CI e modelo de pull request | [`.github/`](.github/) |
| Imagem Docker e Caddy: HTTPS, repasse de `/api` e cache | [`Dockerfile`](Dockerfile), [`Caddyfile`](Caddyfile) e o README, em "Imagem Docker" |
| Hooks do Git e regras das mensagens de commit | [`.husky/`](.husky/) e [`commitlint.config.js`](commitlint.config.js) |
| Configuração do Claude Code para o time | [`.claude/settings.json`](.claude/settings.json) |
| API | `../fhdod-satisfacao-api`, com o próprio `AGENTS.md` |

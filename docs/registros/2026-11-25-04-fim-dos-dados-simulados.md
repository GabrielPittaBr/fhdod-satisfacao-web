# Fim dos dados simulados

25/11/2026 · Agente (Claude Code)

> Ticket [10](../tickets/10-fim-dos-dados-simulados.md), issue [#10](https://github.com/GabrielPittaBr/fhdod-satisfacao-web/issues/10). O front deixa de ter qualquer dado simulado: saem os mocks com os testes deles, o ajuste provisório da sessão do ticket 05 e o `?falha=tudo`. Tudo o que o front mostra vem da API, e o README passa a explicar, passo a passo, como rodar o front com a API local, como gerar os tipos e onde ficam os dados de demonstração.

## O que foi feito

- **Mocks apagados.** Saiu a pasta `src/mocks/` inteira, com os 8 arquivos (791 linhas) que sobravam depois dos tickets 04 a 09, nenhum deles importado por outro arquivo do front:
  - `banco.ts`, o "banco" simulado no `localStorage` (`fhdod-mock-banco`), e a semente dele, `seed/dados.ts` (setores, categorias, turnos, perguntas, configurações e comentários inventados) e `seed/historico.ts` (o gerador de quatro meses de respostas);
  - `regras.ts`, a classificação e o cálculo do NPS simulados;
  - `auth.ts`, o ajuste provisório do ticket 05, que fazia as telas ainda simuladas lerem as permissões e os setores da sessão real;
  - `rede.ts`, a latência simulada, os erros simulados e o `?falha=tudo`.
- **Testes dos mocks apagados** com eles: o `regras.test.ts` (9 testes: a classificação, o cálculo do NPS e o histórico gerado) e o `auth.test.ts` (3 testes do ajuste da sessão). As mesmas regras são testadas na API (na tabela). Ficam 122 testes, em 16 arquivos.
- **Tipos do contrato:** conferidos, sem mudança. O [`tipos.ts`](../../src/lib/api/tipos.ts) só dá nomes aos tipos do `schema.d.ts`, e nenhum arquivo do front declara um tipo da API à mão (os `interface` e `type` que sobram são de props, de formulários e do estado da pesquisa). Os apelidos que os mocks usavam continuam em uso pelas telas. O `pnpm api:tipos`, rodado com a `develop` da API (merge do PR #40 de lá), gerou o mesmo `schema.d.ts` que está commitado.
- **README** ([`README.md`](../../README.md)): "Como rodar" virou um passo a passo em três partes (os dois repositórios lado a lado, a API com o seed e os dados de demonstração, e o front), com a conferência do `/api/health` e o comando do PowerShell. Seções novas: "Dados de demonstração" (o que o `pnpm db:demo` grava e onde fica o código, em `prisma/seeds/demonstracao/` na API), "Sem os dados de demonstração", "O `.env`" e "Tipos do contrato", reescrita com o `pnpm api:tipos`, o `OPENAPI_JSON` e a ordem dos PRs quando o contrato muda. Em "Endereços", as falhas se testam parando a API ou com o navegador offline, sem simulação pela URL.
- **`AGENTS.md`**: saíram o escopo de commit `mocks`, o exemplo `test(mocks)`, as regras que citavam `src/mocks/` e o ticket 10, e a linha de `src/mocks/` em "Onde estão as coisas", que agora aponta para os dados de demonstração da API. As referências à antiga seção "Com a API" do README apontam para as seções novas.
- Issue #10 com a etiqueta `in-progress` e ticket 10 marcado como `done`.

## Decisões e por quê

| Decisão | Por quê |
| --- | --- |
| Testes dos mocks apagados sem cópia no front | O critério pede, e as regras que eles testavam já são testadas na API: a classificação em `src/shared/rules/classificar-nota.test.ts` (as faixas do NPS e da escala, a pior entre o NPS e as notas e os limites ajustados), o NPS em `calcular-nps.test.ts` (promotores menos detratores e o arredondamento) e o histórico em `tests/integration/demonstracao.test.ts` (o mesmo a cada dia, quatro meses sem envio no futuro, a maioria positiva e uma parte baixa). Manter uma cópia no front seria a segunda fonte da regra que o `AGENTS.md` proíbe ("o front nunca recalcula classificação, NPS nem permissão") |
| O ajuste da sessão sai sem substituto | Ele só existia para as telas simuladas aceitarem a sessão real. Desde o ticket 09, nenhuma tela as usa: a permissão e o escopo de setor de cada rota são conferidos e testados na API, e as telas só leem as permissões e os setores do `/auth/me` (`usePode`, em `src/stores/sessao.ts`) |
| A API de mentira dos testes (`src/test/api-falsa.ts`) fica | Não é dado simulado do produto: é a ferramenta dos testes de cada `api.ts`, que confere o método, o caminho, o corpo e a query string de cada chamada contra o contrato. Fica só nos testes e não entra no build, que só importa a partir do `main.tsx` |
| Nenhum código para apagar o `fhdod-mock-banco` dos navegadores | O código que gravava a chave saiu, e nada mais a lê. Ela só existe nos navegadores que abriram a versão simulada, de antes da API: máquinas de desenvolvimento e a demonstração estática, nunca um aparelho do hospital, porque a `main`, de onde sai o que vai para lá, nunca recebeu essa versão. Um `removeItem` no início do app ficaria para sempre no build para limpar só essas máquinas; o README diz como tirá-la (apagar os dados do site) |
| README com o passo a passo da API, e não só o link para o README de lá | O critério pede que o README do front explique como rodar os dois juntos, e quem chega pelo front (alguém novo no time, ou quem prepara a apresentação para o hospital) precisa da ordem: o seed antes dos dados de demonstração, a API antes do front. Os detalhes que mudam lá (as senhas das contas, as regras do `db:demo`) ficam só no README da API, com o link, para não ficarem duas versões |
| Exemplo de commit de teste trocado para `test(api)` | O escopo `mocks` deixou de existir. O `api` (`src/lib/api/`) é o que mais recebe testes fora das features |

## Ferramentas e skills usadas

- Claude Code. Os status dos tickets 06 a 09 daqui foram conferidos na `develop`: `done`.
- Para conferir o README na prática: a API na `develop` de lá (merge do PR #40), compilada com o `tsup` e rodando com o `node` na porta 3334, num banco descartável no container de teste do `docker-compose.yml` da API, com as migrations, o seed base e os dados de demonstração (`pnpm db:demo`); o front no servidor do Vite na porta 5174, repassando o `/api` para a 3334. As variáveis da API foram passadas na linha do comando, com segredos gerados na hora, sem `.env`. No fim, os dois foram parados e o banco, apagado.
- O Chromium do Playwright, para as telas.

## Como foi verificado

- `pnpm lint`, `pnpm typecheck`, `pnpm test` (122 testes, em 16 arquivos; eram 134, em 18, e saíram os 12 dos mocks) e `pnpm build` sem erros.
- **Nenhum arquivo importa os mocks:** a busca por `mocks` em `src/`, `scripts/`, `tests/` e nas configurações não acha nada, e o `tsc` e o build passam sem a pasta.
- **O build não leva nada dos mocks:** o `dist/` desta branch é idêntico, arquivo a arquivo, ao da `develop` (o mesmo `vite build`, comparado com `diff -r`), o que confirma que os mocks já não entravam no build desde o ticket 09. Nenhum arquivo do `dist/` tem `fhdod-mock-banco`, `localStorage`, `falha`, o gerador do histórico ou os textos da semente ("Higiene e Limpeza", "Em reforma", os comentários).
- **Com a API e os dados de demonstração** (962 avaliações, de 28/07 a 25/11/2026), em 1366×768 e em 360×740, cada tela num navegador novo:
  - a pesquisa em `/s/pronto-atendimento` abriu com a única chamada `GET /api/v1/publico/setores/pronto-atendimento/pesquisa`; com `?falha=tudo`, abriu igual;
  - a TV em `/tv#demo-recepcao-fhdod` (em 1920×1080 e em 360×740) mostrou os números da API: NPS +57 em 188 respostas no mês;
  - o login do Super Admin de demonstração abriu o dashboard com o NPS +55 em 227 respostas nos últimos 30 dias, e `/painel/respostas?falha=tudo` carregou a lista da API (200), sem erro;
  - nenhuma chamada saiu para fora do endereço do site, o console ficou sem erro, nada foi gravado no `localStorage` nem no `sessionStorage`, e nenhuma página teve rolagem horizontal.
- **Sem a API:** com ela parada, o `/api/health` pelo Vite deu 502, e a pesquisa em 360×740 mostrou "Não deu para abrir a pesquisa", com "Tentar de novo", como diz o README.
- Prints (a pesquisa nos dois tamanhos, o dashboard nos dois tamanhos, a TV em 1920×1080 e a pesquisa sem a API em 360×740), para o PR.

## O que mudou em relação ao plano

- **O plano do front** ([`plano-frontend.md`](../plano-frontend.md)) continua descrevendo a camada de chamadas sobre os mocks (`features/<assunto>/api.ts → src/mocks/`) e a pasta `mocks/` na estrutura. Ele não foi mudado, como nos tickets anteriores: é o plano de antes da API, e o `AGENTS.md` já diz que a ligação com a API chega pelos tickets. A regra que vale agora é a do `AGENTS.md` ("Só a camada de chamadas conversa com a API").
- **Os mocks saíram aos poucos, e não todos aqui.** Cada ticket de 04 a 09 apagou o que deixou de usar; este apagou o que sobrou, sem uso desde o ticket 09. Por isso o build não mudou.
- **Os tipos já vinham todos do contrato** desde o ticket 08, que tirou o último tipo escrito à mão (o `Envelope`). Aqui só houve a conferência.

## Pendências e dúvidas

- **O `AGENTS.md` da API** ainda pede, em "Contrato com o front", que se confira o que o front espera em `../fhdod-satisfacao-web/src/mocks/`, que não existe mais. A frase pode virar só o `tipos.ts` e as telas, num PR de documentação de lá.
- **A chave `fhdod-mock-banco`** fica nos navegadores que abriram a versão simulada, sem uso, até alguém apagar os dados do site (na tabela).

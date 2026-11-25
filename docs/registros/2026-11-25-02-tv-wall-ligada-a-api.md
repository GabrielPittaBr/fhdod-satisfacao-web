# TV Wall ligada à API

25/11/2026 · Agente (Claude Code)

> Ticket [08](../tickets/08-tv-wall-ligada-a-api.md), issue [#8](https://github.com/GabrielPittaBr/fhdod-satisfacao-web/issues/8). A TV mostra os números reais da pesquisa, autenticada pelo token do link, e as telas são criadas, ativadas e desativadas na API pelo painel. Desativada, a tela para na consulta seguinte da TV; sem rede, a TV mantém os últimos números com a hora em que chegaram.

## O que foi feito

- **TV na API.** O [`tv-wall/api.ts`](../../src/features/tv-wall/api.ts) chama `GET /tv/indicadores` com o token que vem depois do `#` no cabeçalho `X-Tv-Token`, pelo `pedir`, sem a sessão do painel. O 401 da API (token desconhecido ou tela desativada) mostra a mesma mensagem de antes, "Esta tela não está ativa". As quatro visões, o rodízio de 15 s e a consulta a cada 30 s não mudaram.
- **Gestão das telas na API.** `GET /tv-telas`, `POST /tv-telas` e `PATCH /tv-telas/:id/status` vão pelo `pedirComToken`. O link continua montado pelo front (`<origem>/tv#<token>`), com o token que só vem na resposta da criação, e aparece uma única vez, como antes.
- **Sem rede.** A consulta da TV ganhou `networkMode: 'always'` (na tabela): offline, ela continua tentando a cada 30 s, e o rodapé mostra "Sem conexão. Números das HH:MM" com os últimos números na tela.
- **Tipos do contrato.** `TelaTv` e `IndicadoresTv` viraram apelidos do `schema.d.ts` em [`src/lib/api/tipos.ts`](../../src/lib/api/tipos.ts), e o `Envelope`, que só os mocks da TV usavam, saiu. Não sobra nenhum tipo da API escrito à mão. O `pnpm api:tipos` não mudou o `schema.d.ts`: o contrato já tinha as rotas da TV.
- **Mocks.** Saíram o `src/mocks/cadastros.ts` (só tinha as telas de TV), os indicadores da TV de [`consultas.ts`](../../src/mocks/consultas.ts) com as contas que só eles usavam (os destaques, as notas por ponto e a evolução), as telas do "banco" e da semente, e o token aleatório e os erros simulados que ninguém mais lançava, de [`rede.ts`](../../src/mocks/rede.ts). Fica só a exportação.
- **API de mentira.** O [`api-falsa.ts`](../../src/test/api-falsa.ts) aceita rotas sem a sessão do painel (`usarApiFalsa({ semSessao: [...] })`): elas recebem o pedido como veio, e o teste confere os cabeçalhos.
- **Testes:** 6 novos, com 116 no total. A TV manda o `X-Tv-Token` e nenhum `Authorization`; o 401 de uma tela desativada chega com a mensagem da API, sem renovar nem encerrar a sessão do painel; a gestão lista, cria (com o nome no corpo e o token na resposta), recusa o nome com o campo e a mensagem da API e desativa com o 204.
- **README e `AGENTS.md`**: a TV pela API, o link de demonstração com os dados de demonstração da API (`pnpm db:demo`, do ticket 12 de lá), a exceção da TV ao `pedirComToken` e o `semSessao` da API de mentira.
- Issue #8 com a etiqueta `in-progress` e ticket 08 marcado como `done`.

## Decisões e por quê

| Decisão | Por quê |
| --- | --- |
| A TV chama pelo `pedir`, não pelo `pedirComToken` | Na TV, o 401 quer dizer que a tela foi desativada. Pelo `pedirComToken`, ele tentaria renovar a sessão do painel e, num navegador com o painel aberto, a encerraria; e o token de acesso de quem está logado iria junto para uma rota que não precisa dele. Os testes conferem os dois: nenhum `Authorization` e nenhuma chamada ao `/auth/refresh`. Trocar o `pedir` pelo `pedirComToken` faz os dois testes falharem (conferido) |
| `networkMode: 'always'` na consulta da TV | O TanStack Query pausa as consultas quando o navegador avisa que ficou offline. Conferido sem a opção: com a rede cortada por 36 s, a TV não fez nenhuma chamada, e o rodapé continuou "Atualizado às 11:13", como se os números estivessem em dia. O registro de 11/11 pede "Sem conexão. Números das HH:MM" sem rede, e quem olha a TV num corredor precisa saber que os números pararam. Com a opção, aberta já sem rede, a TV mostra "Sem conexão" no lugar de ficar em "Carregando" sem fim. O custo é uma chamada que falha a cada 30 s enquanto não há rede |
| A mensagem do 401 continua a da tela, não a da API | É a "mensagem simples de hoje" do critério. A API manda "Esta tela não está ativa.", a mesma frase do título; a tela acrescenta o que fazer ("Peça um novo link a quem administra o sistema"), que a API não diz |
| Mocks da TV apagados antes do ticket 10 | Nada mais os usava, como os cadastros no ticket 06 e as leituras do painel no 07. Mantê-los deixaria duas fontes para as mesmas regras (a dos destaques, por exemplo) |
| Rotas `semSessao` na API de mentira | Ela recusava com 401 toda chamada sem o token do painel, e o teste da TV precisa provar justamente que esse token não vai. A opção vale por rota: as rotas do painel continuam conferindo o `Authorization` |
| O link de demonstração do README fica o mesmo | Os dados de demonstração da API (ticket 12 de lá, já na `develop`) criam as duas telas com os mesmos tokens do mock: `/tv#demo-recepcao-fhdod` abre, e `/tv#demo-corredor-desativada` mostra a tela desativada |

## Ferramentas e skills usadas

- Claude Code, com a API na `develop` (merge do PR #40 de lá) compilada com o `tsup` e rodando com o `node` na porta 3334, num banco descartável no container de teste do `docker-compose.yml` da API, com o seed base e os dados de demonstração (`pnpm db:demo`). O front rodou com o servidor do Vite na porta 5174, repassando o `/api` para a 3334, e o Chromium do Playwright.
- O status do ticket 16 da API foi conferido na `develop` de lá, com o comando do `AGENTS.md`: `done`. O do ticket 05 daqui também: `done`.
- Nenhuma skill. A revisão com `web-design-guidelines` não foi rodada: não há tela nova, e as duas telas mudaram só por dentro (a origem dos dados e a consulta offline). A gestão das telas foi conferida em 360×740 e 1366×768, e a TV em 1920×1080 e 3840×2160.

## Como foi verificado

- `pnpm lint`, `pnpm typecheck`, `pnpm test` (116 testes) e `pnpm build` sem erros.
- **Ambiente:** banco descartável no container de teste da API, com as migrations, o seed base e os dados de demonstração: 6 setores, as contas de demonstração, as duas telas de TV e cerca de quatro meses de avaliações. A API e o Vite usaram variáveis na própria linha do comando, sem `.env`; no fim, os dois foram parados e o banco, apagado.
- **TV ativa, em 1920×1080:** `/tv#demo-recepcao-fhdod` chamou `GET /api/v1/tv/indicadores` com `X-Tv-Token: demo-recepcao-fhdod` e sem `Authorization`. A visão geral mostrou "+57 em 187 respostas", média 4,5 (Muito bom) e 8% de detratores, 27% de neutros e 65% de promotores; o NPS por setor, do Raio-X (+84 em 19 respostas) ao Ambulatório (+32 em 28); a evolução das 12 semanas, de 07/09 a 23/11; e os destaques (Enfermagem no Raio-X, 4,9 de 5; Médico no Ambulatório e Enfermagem na Internação, 4,8). Em 45 s, a TV consultou a API duas vezes, como pede o intervalo de 30 s. Sem rolagem em 1920×1080 nem em 3840×2160.
- **Tela recusada:** `/tv#demo-corredor-desativada` (desativada), `/tv#token-que-nao-existe` e `/tv` sem token mostraram "Esta tela não está ativa", com o 401 "Esta tela não está ativa." da API nos dois primeiros.
- **Sem rede:** com a TV aberta e a rede cortada pelo Playwright, a consulta seguinte falhou em 6 s, e o rodapé passou para "Sem conexão. Números das 11:12", com o ícone de sem rede e os números na tela. Com a rede de volta, a TV voltou sozinha, na consulta seguinte, para "Atualizado às 11:13". Num navegador novo, aberta já sem rede, mostrou "Sem conexão. A tela tenta de novo sozinha em instantes." e, com a rede de volta, os números em até 30 s.
- **Gestão das telas, com o Super Admin de demonstração, em 1366×768:** a lista veio da API, com "Corredor da Internação" desativada ("Ainda não foi aberta em nenhuma TV.") e "Recepção principal" ativa, com o último acesso das 11:11, gravado pela TV aberta antes. "Nova tela" com "R" mostrou "Informe onde a tela fica" sem chamar a API; com um nome de 104 caracteres, a chamada foi feita, a mensagem da API, "Use no máximo 100 caracteres", apareceu no campo, e nenhuma tela foi criada. Com "Sala de espera do Raio-X", o diálogo mostrou o link `http://localhost:5174/tv#<token>`, com o token de 43 caracteres; depois de "Já copiei", a lista tinha as três telas e o token não estava mais em lugar nenhum da página.
- **Desativar e ativar de novo:** o link novo, aberto noutro navegador em 1920×1080, mostrou os números. "Desativar" chamou `PATCH /api/v1/tv-telas/3/status` com `{"ativa":false}` e recarregou a lista; a TV mostrou "Esta tela não está ativa" na consulta seguinte, 30 s depois. "Ativar de novo" mandou `{"ativa":true}`, e o mesmo link voltou com os números na consulta seguinte. Ao recarregar o painel, a tela mostrava "Último acesso em 25/11/2026 às 11:17.".
- **360×740:** a lista das telas, com os selos e os botões, sem rolagem horizontal; em 1366×768 também.
- No console, só os avisos do próprio navegador sobre as chamadas recusadas de propósito (os 401) e as feitas sem rede.
- Prints da TV (as quatro visões, sem rede, aberta sem rede, desativada ao vivo e em 4K) e da gestão das telas (1366×768, 360×740 e o link criado, com o token de um banco já apagado), para o PR.

## O que mudou em relação ao plano

- **Mudanças além do `api.ts`.** O `AGENTS.md` diz que, ao ligar uma área à API, só o `api.ts` muda. Mudaram também a consulta da TV (`networkMode`, explicado na tabela), os tipos e a API de mentira dos testes.
- **Limpeza dos mocks antes do ticket 10:** tudo o que era da TV. O "banco" simulado fica só para a exportação.

## Pendências e dúvidas

- **Exportação com os números simulados** (até o ticket 09), como no registro 07.
- **A TV desativada para em até 30 s.** A API recusa o link na hora, mas a TV só fica sabendo na consulta seguinte, como o contrato descreve. Para parar na hora, a API teria de avisar a TV (por exemplo, com eventos do servidor), o que o MVP não pede.
- **Volta da rede em até 30 s.** Com a rede de volta, a TV esperou a consulta seguinte, sem recarregar na hora. Para quem olha a TV, é o mesmo intervalo de sempre.
- **"Banco" simulado antigo.** Um navegador que já abriu a versão simulada guarda as telas de TV no `localStorage` (`fhdod-mock-banco`). Elas ficam lá sem uso e saem com os mocks, no ticket 10.

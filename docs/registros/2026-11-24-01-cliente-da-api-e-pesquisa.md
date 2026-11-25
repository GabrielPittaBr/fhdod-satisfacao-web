# Cliente da API e pesquisa do paciente ligada à API

24/11/2026 · Agente (Claude Code)

> Ticket [04](../tickets/04-cliente-da-api-e-pesquisa.md), issue [#4](https://github.com/GabrielPittaBr/fhdod-satisfacao-web/issues/4). A pesquisa do paciente passa a gravar no PostgreSQL da API: abrir a pesquisa, enviar a avaliação e mandar o comentário e o telefone. Junto chega a base de toda a ligação com a API: os tipos gerados do `openapi.json`, o cliente HTTP tipado e o repasse de `/api` no `pnpm dev`. Nenhuma tela muda.

## O que foi feito

- **Tipos gerados.** `pnpm api:tipos` roda o [`scripts/api-tipos.mjs`](../../scripts/api-tipos.mjs), que lê o `openapi.json` com o openapi-typescript 7.13 e grava o `src/lib/api/schema.d.ts`. A origem vem de `OPENAPI_JSON` (do ambiente ou do `.env`): um caminho ou o endereço do contrato na API rodando. Sem ela, vale o `../fhdod-satisfacao-api/openapi.json`, com os dois repositórios lado a lado. O arquivo gerado é commitado, com um cabeçalho dizendo para não editá-lo, e fica fora do ESLint e do Prettier.
- **Cliente HTTP** ([`src/lib/api/cliente.ts`](../../src/lib/api/cliente.ts)). Um cliente openapi-fetch 0.17 tipado pelo `schema.d.ts`, no mesmo domínio do site, e a função `pedir(...)`, que envolve cada chamada: devolve o corpo do sucesso ou lança o `ErroApi`.
  - erro da API: status, código, mensagem, detalhes e o `requestId` que ela mandou;
  - resposta de erro fora do contrato (o 502 de um proxy sem a API atrás, por exemplo): `ERRO_INTERNO`, com o status e o `requestId` do cabeçalho, se houver;
  - sem rede: status 0, código `SEM_CONEXAO` e a mensagem "Sem conexão. Confira a internet e tente de novo.";
  - um cancelamento pedido pelo próprio front passa como está, sem virar falta de rede.
- **`ErroApi`** ([`src/lib/api/erro.ts`](../../src/lib/api/erro.ts)) recebe o `requestId` em vez de inventar um, e o código passou a ser um dos sete do contrato ou o `SEM_CONEXAO`. O `mensagemDeErro` trata qualquer 5xx como o 500: mostra a mensagem padrão da tela, e não a do servidor.
- **Repasse de `/api`.** O `pnpm dev` e o `pnpm preview` mandam o `/api` inteiro para `API_URL` (padrão `http://localhost:3333`), como o Caddy faz em produção. O [`.env.example`](../../.env.example) documenta `API_URL` e `OPENAPI_JSON`.
- **Pesquisa ligada à API** ([`src/features/pesquisa/api.ts`](../../src/features/pesquisa/api.ts)). As três funções chamam as rotas públicas do contrato: `GET /publico/setores/:slug/pesquisa`, `POST /publico/setores/:slug/respostas` e `POST /publico/respostas/:id/complemento`, esta com o token no cabeçalho `X-Complemento-Token` e `keepalive`.
- **Campo isca.** Um campo `site` fora da tela, fora da ordem do teclado (`tabindex="-1"`), escondido do leitor de tela (`aria-hidden`) e com `autocomplete="off"`, na tela da nota de 0 a 10 ([`CampoIsca.tsx`](../../src/features/pesquisa/components/CampoIsca.tsx)). O envio leva sempre o valor dele, vazio para pessoas.
- **Tipos da pesquisa do contrato.** Em `src/lib/api/tipos.ts`, os tipos da pesquisa pública (`PesquisaPublica`, `PerguntaPublica`, `ItemEnvio`, `EnvioResposta`, `RespostaCriada`, `Complemento`), o `DetalheErro` e as listas que a pesquisa usa (`Canal`, `Classificacao`, `TipoPergunta`, `TipoComentario`) viraram apelidos do `schema.d.ts`. O resto continua escrito à mão até a vez de cada área. O `turnoDoHorario` passou a usar o turno da `PesquisaPublica`, e não o `Turno` do painel.
- **Mock da pesquisa removido.** O `src/mocks/pesquisa.ts` saiu: nada mais o chamava. O `limites()`, que as consultas do painel ainda usam, foi para o `consultas.ts`. Saíram também o `?falha=envio` e os campos do "banco" simulado que só a pesquisa usava (chave de idempotência e token do complemento).
- **Testes:** 11 novos, com 52 no total. Os do cliente cobrem o sucesso, o erro da API com o `requestId`, o 404, a resposta de erro sem JSON, a falta de rede e o cancelamento. Os da pesquisa conferem endereço, método, cabeçalhos, `keepalive` e corpo das três rotas, com um `fetch` falso. Os do fluxo cobrem o campo isca no corpo do envio.
- **README e `AGENTS.md`**: a pesquisa com a API local, o `.env`, os tipos gerados, o `pnpm api:tipos` e o fim do `?falha=envio`.
- Issue #4 com a etiqueta `in-progress` e ticket 04 marcado como `done`.

## Decisões e por quê

| Decisão | Por quê |
| --- | --- |
| openapi-typescript e openapi-fetch | São os que o plano do front deixou para quando a API existisse (seção 3, "Ajuste"). O openapi-fetch ocupa 7,5 kB minificado (2,9 kB com gzip) e não tem dependência além dos tipos, e o TypeScript confere o endereço, os parâmetros e o corpo de cada chamada contra o contrato |
| Gerador num script Node, e não a linha de comando do openapi-typescript no `package.json` | O caminho tem um padrão e pode vir do `.env`. Um `${OPENAPI_JSON:-...}` no `package.json` não funciona no Windows, onde o pnpm roda os scripts pelo `cmd`. O script também explica o que fazer quando não acha a API ao lado |
| `schema.d.ts` commitado | O CI não tem o repositório da API ao lado. Commitado, a checagem de tipos roda sem ele, e o diff do PR mostra o que mudou no contrato |
| `schema.d.ts` fora do ESLint e do Prettier | O `AGENTS.md` diz que ele nunca é editado à mão. Sem formatar, o arquivo fica igual ao que o gerador escreve, e gerar de novo sem mudança no contrato não muda nada |
| openapi-typescript com o TypeScript 6 | Ele pede o TypeScript 5 como dependência par, e o pnpm avisa. Os tipos gerados com o 6 passam no `tsc` e batem com os escritos à mão campo a campo, então ficou como está, sem forçar a versão |
| `pedir(...)` em volta de cada chamada, e não um middleware do openapi-fetch | O tipo de retorno já sai sem o ramo de erro: o `api.ts` recebe o corpo do sucesso e as telas recebem o `ErroApi`, como antes. Um middleware que lança o erro deixaria o tipo dizendo que o corpo pode faltar |
| Resposta de erro fora do contrato vira `ERRO_INTERNO`, e não "sem conexão" | O 502 do Caddy ou do `pnpm dev` com a API parada não é culpa da internet do aparelho. Para a Camila, no celular, a mensagem certa é a de tentar de novo, e não a de conferir a internet |
| Qualquer 5xx mostra a mensagem padrão da tela | Antes, só o 500 mostrava. O 502, o 503 e o 504 vêm de quem está no caminho, sem mensagem escrita para o paciente |
| `requestId` vazio quando a chamada não chega à API | O `requestId` liga a mensagem à linha do log da API. Inventar um, como o `ErroApi` fazia, apontaria para uma linha que não existe |
| Endereço base é a origem da própria página | A API fica no mesmo domínio (Caddy em produção, `pnpm dev` aqui): sem CORS e sem cookie de outro site. A origem explícita também deixa o cliente funcionar fora do navegador, nos testes |
| `keepalive` em todo envio do complemento | O critério pede que o comentário enviado ao sair da página (`pagehide`) sobreviva ao fechamento. Com o `keepalive` sempre ligado, só o `api.ts` muda, como o `AGENTS.md` pede, e o envio comum não perde nada: o corpo tem no máximo cerca de 1 kB (500 letras de comentário e o telefone), bem abaixo dos 64 kB do limite. O `sendBeacon` não serve, porque não manda o cabeçalho `X-Complemento-Token` |
| Campo isca na tela da nota, lido na hora do envio | É a tela que envia: o valor vai junto, sem passar pelo estado da pesquisa. Fora da tela e escondido do leitor de tela, como o contrato pede, a Sônia, no totem ou no tablet, nunca o encontra, nem pelo teclado |
| Rótulo "Deixe este campo em branco" | Na primeira versão o rótulo era "Site", e o texto aparecia no `innerText` da página. Para quem visse a página sem o CSS, o rótulo agora diz o que fazer. É também a mensagem que a API devolve quando o campo vem preenchido |
| Os tipos da pesquisa como apelidos dentro do `tipos.ts`, e não importados direto do `schema.d.ts` | Os componentes e o hook continuam importando de `@/lib/api/tipos`, sem mudar. A troca de cada área fica num lugar só, até o ticket 10 apagar o arquivo |
| As listas de valores (`Canal`, `Classificacao` e as outras) vindas do contrato, mesmo que o painel também as use | São iguais às escritas à mão, valor a valor, e a pesquisa as envia e recebe. Vindo do contrato, uma mudança lá aparece no `tsc` do painel também |
| Mock da pesquisa apagado agora, e não no ticket 10 | Nada mais o chamava, e o `?falha=envio` só existia nele. Deixá-lo faria o README prometer uma falha simulada que não acontece mais |

## Ferramentas e skills usadas

- Claude Code, com openapi-typescript 7.13, openapi-fetch 0.17, a API na `develop` (merge do PR #39 de lá) rodando com `tsx`, PostgreSQL 18 do container de teste do `docker-compose.yml` da API e o Chromium do Playwright.
- O status dos tickets 03 e 11 da API foi conferido na `develop` de lá, com o comando do `AGENTS.md`: os dois `done`.
- Nenhuma skill. Nenhuma tela mudou, e o campo isca não aparece para pessoas, então a revisão com `web-design-guidelines` não se aplica.

## Como foi verificado

- `pnpm lint`, `pnpm typecheck`, `pnpm test` (52 testes) e `pnpm build` sem erros.
- **Ambiente:** banco descartável no container de teste da API, com as migrations e o seed base. A API rodou na porta 3334 com as variáveis na linha de comando (sem o `.env` de lá), e o `pnpm dev` com `API_URL=http://localhost:3334`. O setor ativo (5 perguntas, uma de cada tipo e duas escalas), o setor inativo e a troca da senha provisória foram feitos pela própria API, com o Super Admin do seed. No fim, o banco foi apagado.
- **Repasse:** `/api/health` e as rotas da pesquisa responderam pelo `pnpm dev`, com os cabeçalhos da API (`X-Request-Id`, Helmet), e a rota da pesquisa também pelo `pnpm preview`. Com a API parada, o `pnpm dev` responde 502 sem JSON, e a pesquisa mostra "Não deu para abrir a pesquisa", com "Tentar de novo".
- **Cenários do ticket**, no Chromium, conferindo o corpo de cada requisição e depois o banco:
  - **só a nota final**, em 360×740: as 5 perguntas puladas, nota 9. O envio leva `itens: []` e `site: ""`; a API devolve 201 `NORMAL`, e a resposta fica sem nenhum item;
  - **nota baixa com comentário e telefone**, em 360×740: notas 1 e 2, "Não" nas duas de escolha, texto livre e nota 2. A API devolve `BAIXISSIMA`; a reclamação e o telefone vão juntos, numa chamada só, com o token no `X-Complemento-Token`, e voltam 204. No banco, o telefone está cifrado, só com o `0000` final em claro, o pedido de retorno nasce `NOVO` e o token do complemento fica gasto;
  - **nota normal com elogio**, em 1366×768, com a data escolhida pelo teclado: nota 10, `NORMAL`, e o elogio gravado com 204;
  - **setor inativo** e um slug que não existe: 404 da API e a tela "Esta pesquisa não está disponível";
  - **totem com o turno automático**, em 1080×1920: às 18h44 (horário de Brasília), o envio foi com `canal: "TOTEM"`, a data de hoje e o turno da tarde (13h às 19h), sem as telas de data e turno. Depois dos 15 s do agradecimento, o totem buscou a pesquisa de novo e a avaliação seguinte saiu com outra chave. Nada ficou no `localStorage`, no `sessionStorage`, em cookie ou no endereço;
  - **reenvio com a mesma chave**: a primeira tentativa chegou à API e foi gravada, mas a resposta foi cortada no caminho (interceptação do Playwright). A tela mostrou "Sem conexão. Confira a internet e tente de novo. Suas respostas continuam aqui." e "Tentar de novo". A segunda tentativa levou a mesma chave e recebeu o mesmo `id` e a mesma classificação, com um token novo; o comentário enviado com esse token foi gravado. No banco, uma resposta só para aquela chave, e 13 respostas para 13 chaves no fim dos testes.
- **Saída da página:** na tela do telefone, com o comentário já escrito, a página foi trocada por outra. O Playwright não mostra requisições feitas durante o fechamento, mas o banco mostra o comentário gravado e o token gasto.
- **Campo isca:** fora da tela (x = −9999), fora da árvore de acessibilidade, pulado pelo Tab e sem rolagem horizontal em 360×740. Preenchido à mão, o envio voltou 400 `VALIDACAO` no campo `site`, e nada foi gravado.
- **Token recusado:** com o cabeçalho trocado por um token inválido, a API devolveu 401, e a tela mostrou "O tempo para complementar terminou. Sua avaliação já está salva.", com "Agora não" levando ao agradecimento.
- **Tamanho:** quem abre a pesquisa baixa 123,7 kB de JavaScript além do principal (sem compressão), contra 132,8 kB na `develop`: o cliente HTTP entra, e o "banco" simulado, o histórico e as regras dos mocks saem.

## O que mudou em relação ao plano

- **O hook e a tela da nota mudaram**, embora o `AGENTS.md` diga que, ao ligar uma área, só o `api.ts` muda. O campo isca precisa de um campo na tela e do valor dele no envio: o `Etapas.tsx` desenha o `CampoIsca` e passa o valor para `fluxo.enviar(site)`, e o `montarEnvio` o põe no corpo. Nada visível mudou.
- **O mock da pesquisa saiu antes do ticket 10**, porque nada mais o chamava. Os outros mocks continuam.
- **`mensagemDeErro`:** todo 5xx mostra a mensagem padrão da tela, e não só o 500.
- **Uma avaliação enviada não aparece mais no painel nem na TV** até os tickets 07 e 08: a pesquisa grava na API, e eles ainda leem os dados simulados.

## Pendências e dúvidas

- **Sem internet de verdade, o envio espera em vez de avisar.** Quando o aparelho sabe que está sem rede (`navigator.onLine` falso, como no modo avião), o TanStack Query pausa o envio: o botão fica em "Enviando…" e o envio sai sozinho quando a rede volta (testado: a avaliação foi gravada). A mensagem de sem conexão só aparece quando o aparelho acha que tem rede e a chamada falha, como no corte do teste de reenvio. Era assim também com os mocks, que passavam pelo mesmo envio. Para a Sônia, um aviso de que o envio vai sair quando a internet voltar seria mais claro do que o botão parado; vale combinar a mudança (`networkMode` do TanStack Query ou um aviso na tela) num ticket próprio.
- **Totem reiniciado no meio da busca.** Ao reiniciar, o totem busca a pesquisa de novo e, quando ela chega, recomeça do início (`key={versao}`). Se alguém tocar em "Começar avaliação" antes de a busca terminar, volta para a abertura. Com a API na mesma rede, a busca leva milissegundos; com o mock, que esperava de 200 a 600 ms, já era assim.
- **Sem dados de demonstração na API** (ticket 12 de lá). Até lá, para a pesquisa abrir no `pnpm dev`, é preciso cadastrar um setor e as perguntas pelo Swagger da API, porque o painel daqui ainda é simulado. O README explica como.
- **Tipos gerados conferidos no CI.** O CI checa os tipos com o `schema.d.ts` commitado, mas não confere se ele bate com o `openapi.json` da `develop` da API. Um passo que baixe o contrato de lá e rode o `pnpm api:tipos` acusaria um front desatualizado.
- **Token do complemento nos logs da API** (pendência do registro 03): resolvida lá. O logger da API já oculta o `x-complemento-token`, junto com o `x-tv-token`.

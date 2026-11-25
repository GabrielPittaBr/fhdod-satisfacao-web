# Exportação pela API

25/11/2026 · Agente (Claude Code)

> Ticket [09](../tickets/09-exportacao-pela-api.md), issue [#9](https://github.com/GabrielPittaBr/fhdod-satisfacao-web/issues/9). Os botões de exportação do dashboard baixam o Excel e o PDF gerados pela API, com o token de acesso, os filtros da tela e o nome de arquivo que a API manda. O PDF, até aqui desligado com o aviso de que chegaria com a API, funciona, e o CSV montado no navegador deixou de existir.

## O que foi feito

- **Exportações na API.** O [`dashboard/api.ts`](../../src/features/dashboard/api.ts) chama `GET /exportacoes/resumo.xlsx`, `GET /exportacoes/resumo.pdf` e `GET /exportacoes/respostas.xlsx` com os mesmos filtros dos blocos (período, base da data, setor, turno e canal), pelo `pedirArquivoComToken`. O escopo e o telefone ficam com a API: o Gestor e o Visualizador exportam só os seus setores, e a coluna "Telefone para retorno" só vem para quem tem `contatos:ver`.
- **Arquivos no cliente HTTP.** O [`cliente.ts`](../../src/lib/api/cliente.ts) ganhou o `pedirArquivo`, o `pedir` das rotas que devolvem um arquivo (chamadas com `parseAs: 'blob'`): ele devolve o arquivo com o nome do `Content-Disposition`, lido pelo `nomeDoArquivo` (o `filename*`, com acentos, vale mais que o `filename`, entre aspas ou não), ou um nome padrão se o cabeçalho não vier. O erro antes de o arquivo sair chega em JSON e vira o `ErroApi` de sempre. O [`auth/api.ts`](../../src/features/auth/api.ts) ganhou o `pedirArquivoComToken`, com o token e a renovação num 401, como o `pedirComToken`.
- **Menu "Exportar".** Três itens: "Resumo dos indicadores (Excel)" e "Resumo dos indicadores (PDF)", para quem tem `exportacao:resumo` (os quatro perfis), e "Todas as respostas (Excel)", só para quem tem `exportacao:detalhada` (o Visualizador não vê). Enquanto o arquivo é gerado, o botão mostra um círculo girando e "Gerando a planilha…" ou "Gerando o PDF…", fica com `aria-disabled`, não abre o menu e mantém o foco; um aviso para leitor de tela diz o mesmo. Pronto, o arquivo é salvo com o nome da API, e o aviso "Arquivo baixado" mostra o nome. Um erro aparece num aviso com a mensagem da API, e o dashboard continua na tela.
- **Sem rede:** a exportação ganhou `networkMode: 'always'` (na tabela).
- **CSV.** Saiu o [`src/mocks/consultas.ts`](../../src/mocks/consultas.ts), que só tinha a exportação simulada em CSV. Nenhum arquivo do front importa mais os mocks.
- **Testes:** 18 novos, com 134 no total. O cliente lê o arquivo com o nome do `Content-Disposition`, usa o nome padrão sem ele, transforma o erro JSON antes do arquivo no `ErroApi` e trata o download cortado no meio como a falta de rede; o `nomeDoArquivo` lê cinco formatos do cabeçalho e não inventa nome nos quatro casos sem nome; o download renova a sessão num 401 e repete com o token novo; as três exportações vão ao caminho certo com os filtros da tela na query string, e o 403 chega com a mensagem da API.
- **README e `AGENTS.md`**: as exportações pela API, o `pedirArquivoComToken` na regra das chamadas do painel e o `?falha=tudo`, que deixou de ter efeito.
- Issue #9 com a etiqueta `in-progress` e ticket 09 marcado como `done`.

## Decisões e por quê

| Decisão | Por quê |
| --- | --- |
| O nome do arquivo vem do `Content-Disposition`, com um nome padrão só se ele faltar | É o critério do ticket, e o nome da API traz o período (`fhdod-resumo-2026-08-28-a-2026-11-25.pdf`), o que ajuda a Renata a achar o arquivo depois. O nome padrão (`fhdod-resumo.xlsx`) cobre um proxy que derrube o cabeçalho, para o download não sair como um nome qualquer do navegador |
| `pedirArquivo` no cliente e `pedirArquivoComToken` no `auth/api.ts`, em vez de o `api.ts` ler a resposta | A regra do `AGENTS.md` é que o `api.ts` chama a API só pelos `pedir*`, e o download precisava da mesma renovação de sessão num 401 (testada). O tipo exige o `parseAs: 'blob'`: sem ele, o `tsc` recusa a chamada (conferido), em vez de o arquivo virar um JSON quebrado na hora de baixar |
| O download cortado no meio falha como a falta de rede | A API derruba a conexão quando um erro acontece com o arquivo já saindo, para o navegador não salvar um arquivo pela metade. Para o `fetch`, é a mesma conexão interrompida da falta de internet, e as duas pedem o mesmo: tentar de novo. O teste confere que nada é salvo |
| `networkMode: 'always'` na exportação | O TanStack Query guarda o pedido quando o navegador está offline. Conferido sem a opção: com a rede cortada, o botão ficou em "Gerando o PDF…" por 8 s sem nenhum aviso, e o arquivo baixou sozinho quando a rede voltou. Com a opção, o aviso "Sem conexão. Confira a internet e tente de novo." aparece na hora, como na TV (ticket 08) |
| Botão com `aria-disabled` durante a geração, não `disabled` | O `disabled` tira o foco de quem escolheu o arquivo pelo teclado (o foco cai no começo da página). Com o `aria-disabled`, o foco fica no botão (conferido nos quatro perfis), o leitor de tela o anuncia como indisponível, e o menu não abre até o arquivo chegar, o que evita duas exportações ao mesmo tempo |
| Itens escondidos pela permissão, não desabilitados | Segue o que o menu já fazia com "Todas as respostas" e a regra de que esconder é só conforto: quem garante é a API, que recusa com 403. O item do PDF fica ativo para quem tem `exportacao:resumo`, como pede o critério. Sem nenhuma das duas permissões, o botão some (nenhum perfil está nesse caso hoje) |
| A URL do arquivo é liberada 40 s depois do clique | Liberada na hora, como fazia o CSV, o download pode não sair em alguns navegadores, que leem o arquivo depois do clique. É o mesmo intervalo do FileSaver.js |
| Só o `consultas.ts` saiu dos mocks | Ele só tinha a exportação, e o critério pede o fim do CSV. O resto de `src/mocks/` (o "banco", a semente, as regras, o ajuste da sessão e o `?falha=`) não é importado por ninguém, e apagá-lo com os testes é o ticket 10. O build já não leva nada dele (conferido no `dist/`) |
| Aviso "Arquivo baixado" com o nome do arquivo | Diz qual arquivo foi salvo e lembra que ele tem os filtros da tela, a necessidade da Renata no registro de 11/11 ("exportação com os mesmos filtros") |
| Menu a 8 px da borda da tela | No celular, em 360×740, o menu encostava na borda esquerda (apontado na revisão com `web-design-guidelines`) |

## Ferramentas e skills usadas

- Claude Code, com a API na `develop` (merge do PR #40 de lá) compilada com o `tsup` e rodando com o `node` na porta 3334, num banco descartável no container de teste do `docker-compose.yml` da API, com o seed base e os dados de demonstração (`pnpm db:demo`). O front rodou com o servidor do Vite na porta 5174, repassando o `/api` para a 3334, e o Chromium do Playwright, com um atraso de 1,5 s nas exportações para ver o botão trabalhando.
- O Excel 16 da máquina, aberto pela automação (COM), conferiu as planilhas, e as páginas dos PDFs foram lidas como imagem.
- Os status dos tickets 17 e 18 da API foram conferidos na `develop` de lá, com o comando do `AGENTS.md`: `done`. O do ticket 07 daqui também: `done`.
- Skill `web-design-guidelines` no menu de exportação: o único ponto, o menu encostado na borda no celular, foi corrigido. Os ícones decorativos têm `aria-hidden`, o círculo girando para com `prefers-reduced-motion` (regra do `globals.css`), os textos de carregamento terminam em "…", e o aviso e o estado do botão são anunciados ao leitor de tela.

## Como foi verificado

- `pnpm lint`, `pnpm typecheck`, `pnpm test` (134 testes) e `pnpm build` sem erros. Sem o `setorId` na chamada do resumo, sem ler o `Content-Disposition` ou sem o `filename*`, os testes falham; sem o `parseAs: 'blob'`, o `tsc` falha (conferido, com os arquivos restaurados depois).
- **Ambiente:** banco descartável no container de teste da API, com as migrations, o seed base e os dados de demonstração: 6 setores, as contas de demonstração e 962 avaliações, de 28/07 a 25/11/2026. A API e o Vite usaram variáveis na própria linha do comando, sem `.env`; no fim, os dois foram parados e o banco, apagado.
- **Cada perfil, em 1366×768, nos últimos 90 dias:** o primeiro arquivo foi escolhido pelo teclado e os outros pelo mouse. Em todos, a chamada levou o `Authorization` e os filtros da URL, o botão mostrou "Gerando a planilha…" ou "Gerando o PDF…" com o foco nele, um clique no botão ocupado não abriu o menu, e o aviso trouxe o nome do arquivo.
  - Super Admin: os três itens; `resumo.xlsx`, `resumo.pdf` e `respostas.xlsx` de 28/08 a 25/11, base do atendimento.
  - Gestora (Pronto Atendimento e Internação), com a data do envio: os três itens, com `base=ENVIO` na chamada.
  - Ouvidoria, só o totem: os três itens, com `canal=TOTEM`.
  - Visualizador (Raio-X): só os dois resumos, sem "Todas as respostas".
- **Os arquivos no Excel:** as sete planilhas abriram. A das respostas do Super Admin tem as abas Resumo, Respostas, Itens e Comentários, com 707 respostas (as mesmas "707 respostas" do dashboard) e a coluna "Telefone para retorno" preenchida nos pedidos de retorno; a da Ouvidoria também tem a coluna, com 341 respostas do totem; a da Gestora, com 414 respostas dos seus dois setores, não tem a coluna. Os resumos mostram quem gerou e os filtros: "Os seus setores: Internação, Pronto Atendimento" para a Gestora, "Os seus setores: Raio-X" para o Visualizador e "Data do envio, no horário de Brasília" quando a base era o envio.
- **Os PDFs:** os da Gestora e da Ouvidoria, baixados pelo painel, abrem numa página A4, com os indicadores, o NPS por setor e as médias por categoria dos filtros da tela; o da Ouvidoria mostra "Canal: Totem". Os do Super Admin e do Visualizador também baixaram pelo painel, mas foram apagados com a pasta do Playwright antes de abertos: os dois foram gerados de novo pela API, com os mesmos filtros, e abrem igual (707 respostas e NPS 53 para o Super Admin; só o Raio-X, com 105 respostas, para o Visualizador).
- **Auditoria da API:** cada exportação ficou registrada; só as planilhas de respostas do Super Admin e da Ouvidoria com `comTelefones: true`.
- **Erros, sem sair da tela:** a Gestora em `/painel?setor=3` (o Raio-X, que não é dela) recebeu o 403 da API, com o aviso "Você não tem acesso a este setor." e o endereço igual. Sem rede, o aviso "Sem conexão. Confira a internet e tente de novo." apareceu em 1,9 s (1,5 s era o atraso de propósito), com o botão de volta a "Exportar".
- **360×740:** o menu abre dentro da tela, a 8 px da borda, com os itens de cada perfil, e o botão mostra "Gerando o PDF…"; sem rolagem horizontal. Em 1366×768 também.
- No console, só os avisos do próprio navegador sobre os 403 do setor de fora (dos blocos e da exportação) e a chamada sem rede.
- Prints (o menu do Super Admin, o PDF sendo gerado e o aviso do arquivo baixado em 1366×768, o erro do setor de fora, o aviso sem rede, e o menu do Visualizador e o PDF sendo gerado em 360×740), para o PR.

## O que mudou em relação ao plano

- **Mudanças além do `api.ts`.** O `AGENTS.md` diz que, ao ligar uma área à API, só o `api.ts` muda. Mudaram também o cliente HTTP e o `auth/api.ts` (as versões de arquivo do `pedir` e do `pedirComToken`) e a página: o arquivo agora é binário, o PDF ganhou o seu item, e o botão ganhou o estado de geração e o `networkMode`, explicados na tabela.
- **O plano do front** previa o "Excel" como um CSV do mock e o "PDF" desabilitado até a API. Os dois agora vêm da API, e o Excel é `.xlsx`.
- **Limpeza dos mocks:** só o `consultas.ts` saiu; o resto da pasta, sem uso, fica para o ticket 10.

## Pendências e dúvidas

- **Download cortado no meio:** aparece "Sem conexão", também quando a internet está boa e foi a API que derrubou a conexão por um erro no meio do arquivo. É raro (o erro antes do primeiro byte já chega com a mensagem da API), e uma mensagem própria pediria ler o arquivo aos pedaços no front.
- **O arquivo passa pela memória do navegador** antes de ser salvo. Com os dados de demonstração, a maior planilha tem 217 KB; um ano do hospital deve ficar em poucos megabytes. Um download direto, sem passar pela memória, pediria o token no endereço ou num cookie, o que a API não aceita, e com razão.
- **Sair do dashboard durante a geração:** o arquivo continua sendo gerado e é salvo quando chega, já noutra tela.
- **Mocks sem uso** em `src/mocks/` até o ticket 10, que os apaga com os testes, o ajuste da sessão e o `?falha=`. Um navegador que abriu a versão simulada guarda o "banco" dela no `localStorage` (`fhdod-mock-banco`), sem uso.

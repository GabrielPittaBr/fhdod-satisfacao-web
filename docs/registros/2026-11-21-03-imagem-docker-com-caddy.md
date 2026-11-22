# Imagem Docker do front com Caddy

21/11/2026 · Agente (Claude Code)

> Ticket [03](../tickets/03-imagem-docker-com-caddy.md), issue [#3](https://github.com/GabrielPittaBr/fhdod-satisfacao-web/issues/3). O front vira a imagem que o compose de produção da API vai usar: o Caddy serve o site com HTTPS automático e repassa `/api` para a API, no mesmo domínio. Nenhuma tela muda.

## O que foi feito

- **`Dockerfile`** em dois estágios. O primeiro, no `node:26` (a imagem completa, na versão do `.nvmrc`), instala o pnpm na versão do `packageManager`, instala as dependências com `--frozen-lockfile` e roda o `pnpm build`. O segundo é o `caddy:2-alpine`, só com o `Caddyfile` e o `dist/` em `/srv`. Um `caddy validate` no build barra um Caddyfile com erro.
- **`Caddyfile`**:
  - o domínio vem de `DOMAIN`. Com um domínio, o HTTPS é automático (emissão, renovação e redirecionamento do HTTP); sem a variável, o site sai em HTTP na porta 80, para testar na máquina;
  - compressão zstd e gzip;
  - `/api` e `/api/*` vão para `API_UPSTREAM` (padrão `api:3333`) com o caminho inteiro;
  - `/assets/*` fica um ano em cache, e um arquivo que não existe ali dá 404;
  - qualquer outro caminho devolve o arquivo, se existir, ou o `index.html`, sempre com `Cache-Control: no-cache`.
- **`.dockerignore`**: ficam fora do contexto do build o `node_modules` e o `dist` da máquina, os `.env`, o `.git`, a documentação e os testes.
- **`.editorconfig`**: tabulação no `Caddyfile`, o formato do `caddy fmt`.
- **Tailwind lendo só `src/`** (`@import 'tailwindcss' source('..')`, em `src/styles/globals.css`), para a imagem gerar o mesmo CSS que o CI. O motivo está na tabela.
- **README**: seção "Imagem Docker", com como gerar e rodar a imagem, as variáveis, o que o servidor precisa, um exemplo do serviço no compose e o que o Caddy responde em cada endereço. A antiga seção "Publicar" virou "Hospedagem estática".
- **`AGENTS.md`**: o `Dockerfile` e o `Caddyfile` na tabela "Onde estão as coisas".
- Issue #3 com a etiqueta `in-progress` e ticket 03 marcado como `done`.
- Issues #1 e #2 fechadas à mão, como pede o `AGENTS.md` ("Status"). Os PRs #11 e #12 já tinham entrado na `develop` e os tickets estavam `done`, mas as issues continuavam abertas com `in-progress`.

## Decisões e por quê

| Decisão | Por quê |
| --- | --- |
| Build no `node:26` completo, e não na variante slim ou Alpine | O ticket pede "uma imagem completa". É Debian com glibc, como o `ubuntu-latest` do CI, então o pnpm instala as mesmas variantes nativas do Rolldown, do Lightning CSS e do Tailwind que o CI testa. Ela ocupa cerca de 1,8 GB no cache do Docker do servidor, mas não vai para a imagem que roda: só o `dist/` passa para a imagem final |
| pnpm instalado pelo npm, na versão lida do `packageManager` | O Node 26 não traz mais o Corepack: a imagem oficial responde `corepack: not found`. Ler a versão do `package.json` mantém uma fonte só, a mesma que o `pnpm/action-setup` do CI usa |
| `HUSKY=0` no build | Dentro da imagem não há repositório Git, então o `prepare` do Husky não teria o que ligar |
| `package.json` e `pnpm-lock.yaml` copiados antes do resto | A camada do `pnpm install` só é refeita quando as dependências mudam. Numa versão que só muda telas, o build reaproveita a instalação |
| `caddy:2-alpine` | A imagem oficial do Caddy (hoje a 2.11.9), presa só na versão principal, como o `.nvmrc` faz com o Node. As correções de segurança da versão 2 chegam quando a imagem base é baixada de novo: o Docker reaproveita a que já tem, então só um build com `--pull` traz a mais nova, do Caddy e do Node |
| `caddy validate` no build | Um Caddyfile com erro para o `docker build`, em vez de deixar o container reiniciando no servidor. A camada sai vazia: o `validate` não grava nada na imagem |
| Uma variável `DOMAIN`, com HTTP na porta 80 quando ela não existe | O ticket pede o domínio por variável e a imagem rodando na máquina sem domínio público. O mesmo Caddyfile serve os dois casos, e na máquina basta um `docker run -p 8080:80` |
| `DOMAIN` vazio derruba o Caddy, e o README manda usar `${DOMAIN:?...}` no compose | O Caddy troca a variável pelo texto antes de ler o arquivo: vazia, o bloco do site vira o bloco de opções globais, e ele para com `unrecognized global option`. Tratar o vazio como ausente faria um servidor de produção sem `DOMAIN` subir só em HTTP, em vez de parar. Melhor parar, e o `:?` do compose para antes, com uma mensagem clara |
| `API_UPSTREAM` com `api:3333` de padrão | `api` é o serviço da API no compose de produção do plano ("Containers de produção"), e 3333 é o `PORT` da API. A variável existe para testar com a API fora do Docker (`host.docker.internal:3333`) |
| O `/api` vai inteiro para a API, e `/api` sem barra também | As rotas da API já começam com `/api` (`/api/health`, `/api/docs`, `/api/v1`). `/api` sem barra cai no 404 em JSON da API, e não numa tela do front |
| Um arquivo de `/assets/*` que não existe dá 404, e não o `index.html` | Depois de uma versão nova, uma aba aberta pode pedir um arquivo da versão anterior. Com o `index.html` no lugar do `.js`, o navegador recusa o módulo com um erro de tipo MIME difícil de entender. O 404 sai sem o cache longo, para não ficar guardado |
| `public, max-age=31536000, immutable` em `/assets/*` | O nome tem o hash do conteúdo: um arquivo novo tem nome novo. Com `immutable`, o navegador nem confere ao recarregar, e a pesquisa abre mais rápido no 4G (Camila, no celular) |
| "Sem cache" no `index.html` é `no-cache`, e não `no-store` | `no-cache` obriga o navegador a confirmar com o servidor a cada acesso: com o ETag, a resposta é um 304 sem corpo, e uma versão nova chega na hora. `no-store` baixaria a página inteira toda vez, sem ganho. O `favicon.svg` e os outros arquivos sem hash seguem a mesma regra |
| As regras de cache só valem para o site | Um `header` aplicado ao `/api` somaria um segundo `Cache-Control` ao da API, que decide o cache das próprias respostas (hoje, `no-store`) |
| `encode zstd gzip` | zstd para os navegadores que aceitam e gzip para os outros, como os dos totens e TVs mais antigos. O Caddy só comprime texto e respostas a partir de 512 bytes: o JS principal cai de 336 kB para 109 kB com gzip. O Brotli não vem no Caddy padrão |
| Sem log de acesso no Caddy | O log de acesso do Caddy grava os cabeçalhos das requisições, e os tokens da TV e do complemento da pesquisa vão em cabeçalhos. Quem registra cada chamada é a API, que oculta esses campos (Plano de Desenvolvimento, "Logs e saúde") |
| Tailwind lendo só `src/` | O primeiro build da imagem saiu com um CSS diferente do build da máquina. O Tailwind v4 procura nomes de classe no projeto inteiro: achava "contents" no `permissions: contents: read` do `ci.yml` e gerava `.contents{display:contents}`, que nenhuma tela usa. Como o `.dockerignore` deixa o `.github` de fora, a imagem não tinha a classe. Agora o CSS depende só do código, e a imagem é igual ao build do CI |
| `.dockerignore` sem `.env`, `node_modules` nem documentação | Nenhum segredo entra na imagem, e o Vite não embute no site as variáveis `VITE_*` de um `.env` de quem gerou a imagem. O `node_modules` da máquina, que no Windows tem binários de outro sistema, não sobrescreve o da imagem. E mudar só a documentação não refaz o build |
| Tabulação no `Caddyfile`, no `.editorconfig` | É o formato do `caddy fmt`, e o Caddy avisa ao subir quando o arquivo sai dele. O resto do `.editorconfig` continua igual ao da API |
| Exemplo do serviço `caddy` no README | O compose de produção é do ticket 19 da API, mas quem for escrevê-lo precisa saber do volume dos certificados, das portas e do `DOMAIN` vazio. O exemplo foi rodado como está (veja "Como foi verificado") |

## Ferramentas e skills usadas

- Claude Code, com Docker 29.10 e Docker Compose 5.7, as imagens oficiais `node:26` (Node 26.13.1) e `caddy:2-alpine` (Caddy 2.11.9), curl, openssl e o Chromium do Playwright.
- O status dos tickets 03, 10 e 11 da API foi conferido na `develop` de lá, com o comando do `AGENTS.md`.
- Nenhuma skill. Nenhuma tela mudou, então a revisão com `web-design-guidelines` não se aplica.

## Como foi verificado

- `pnpm lint`, `pnpm typecheck`, `pnpm test` (41 testes) e `pnpm build` sem erros.
- **Build:** sem cache, leva 11 s com as imagens base já baixadas. A imagem final tem 25 MB comprimida, quase tudo do próprio Caddy: o site ocupa 1,6 MB, e não há Node nem `node_modules`.
- **Mesmo site do CI:** o `dist/` de dentro da imagem é idêntico ao do `pnpm build` da máquina, arquivo por arquivo (os 67, com o mesmo SHA-256). Antes da mudança no Tailwind, não era. Comparado ao build da `develop`, a única diferença no CSS é a regra `.contents`.
- **Regras do Caddy**, com um script de curl contra a imagem rodando sem domínio (38 verificações):
  - `/`, `/s/pronto-atendimento`, `/s/maternidade`, `/totem/pronto-atendimento`, `/tv`, `/login`, `/painel` e quatro rotas do painel, com e sem barra no fim e com `?falha=tudo`, devolvem o `index.html` com `no-cache`;
  - os `.js` e o `.css` de `/assets/` vão com o cache de um ano, e um arquivo inexistente ali dá 404, sem cache;
  - zstd quando o navegador aceita, gzip quando só aceita gzip, e o 304 da revalidação, com e sem compressão;
  - `/api`, `/api/health` e `/api/v1/...` com query chegam à API com o caminho inteiro, com o `Cache-Control` dela intacto e o JSON comprimido. A API recebe o `X-Forwarded-For` com o IP de quem chamou, e um valor forjado pelo cliente é descartado, o que importa para o limite de envios por IP da API;
  - `/apiario` não é confundido com `/api`, e `/assets/../../../../etc/passwd` não sai da pasta do site.
- **Navegador:** no Chromium, em 360×740 e 1366×768, a pesquisa, o setor inativo, o `?falha=tudo`, o totem, a TV, o login, `/painel/respostas` (que leva ao login) e uma rota inexistente abrem pelo link direto e de novo ao recarregar, sem requisição falha nem rolagem horizontal, e sem erro no console fora o `?falha=tudo`, que falha de propósito. A TV em 1920×1080 mostra os indicadores.
- **HTTPS:** com `DOMAIN=localhost`, o site sai em HTTPS com HTTP/2 e anuncia o HTTP/3. O certificado vem da autoridade local do Caddy, e o HTTP é redirecionado com 308, mantendo caminho e query. Recriado o container com o mesmo volume em `/data`, o certificado foi o mesmo (mesmo número de série).
- **Domínio público:** com `DOMAIN=pesquisa.exemplo.com.br`, o Caddy ligou o certificado automático para o domínio, começou a emissão pelo Let's Encrypt e redirecionou o HTTP para `https://pesquisa.exemplo.com.br/...`. A emissão em si não termina neste ambiente, porque o container não resolve o DNS do Let's Encrypt.
- **Com a API:** PostgreSQL 18 do `docker-compose.yml` da API e a API em `pnpm dev`, na `develop` do merge do PR #25 de lá. Pela imagem do front, `/api/health` respondeu `{"data":{"status":"ok","banco":"ok"}}`, uma rota inexistente respondeu o 404 `NAO_ENCONTRADO` com `requestId`, e o Swagger abriu em `/api/docs/`. Os cabeçalhos do Helmet chegaram sem duplicar.
- **Exemplo do README:** o serviço `caddy` rodou como está no README, num compose em `infra/` e com uma API falsa no lugar da `api`. Sem `DOMAIN`, e com ele vazio, o compose parou com "defina o DOMAIN no .env". Com `DOMAIN=:80`, gerou a imagem a partir de `../../fhdod-satisfacao-web`, esperou a `api` ficar saudável, e o Caddy alcançou `api:3333` sem nenhuma variável.
- **Proxy deste ambiente:** aqui, o tráfego que sai dos containers passa por um proxy com certificado próprio. Por isso, o build usou uma cópia local do `node:26` que só acrescenta esse certificado, trocada no lugar do `node:26` com `--build-context`. O `Dockerfile` do repositório não tem nada disso, e numa máquina comum o `docker build .` basta.

## O que mudou em relação ao plano

- **Tailwind lendo só `src/`.** O ticket não pede, mas sem isso a imagem não servia o mesmo site que o CI testa.
- **Um arquivo de `/assets/` que não existe dá 404.** O critério manda devolver o `index.html` em "qualquer rota que não seja arquivo nem `/api`"; um caminho em `/assets/` é o pedido de um arquivo do build, então fica com o 404.
- **"Sem cache" no `index.html`** foi feito com `no-cache`: o navegador guarda a página, mas confere com o servidor a cada acesso.
- **Emissão do certificado de verdade não testada.** Este ambiente não alcança o Let's Encrypt; o primeiro teste com domínio fica para o compose de produção e a homologação (tickets 19 e 20 da API).
- **Caminho do front no compose de produção.** O plano diz que o compose "constrói o front a partir de `../fhdod-satisfacao-web`", mas o compose fica em `infra/`, e o Docker Compose resolve os caminhos a partir da pasta do arquivo: de lá, o front fica em `../../fhdod-satisfacao-web`. O exemplo do README usa esse caminho.
## Pendências e dúvidas

- **Ticket 04 ainda bloqueado.** Ele depende dos tickets 03 e 11 da API. O 03 está `done`, mas o 11 (comentário e pedido de retorno) e o 10, de que o 11 depende, estão `ready-for-agent` na `develop` da API.
- **Compose de produção (ticket 19 da API).** Ele precisa de um volume em `/data` e outro em `/config`, das portas 80, 443 e 443/udp, do `DOMAIN` com `:?` e do caminho `../../fhdod-satisfacao-web`, como no exemplo do README.
- **Proxy na frente do Caddy.** Se a hospedagem puser um balanceador ou uma CDN na frente do servidor, o Caddy precisa da opção `trusted_proxies`. Sem ela, a API vê o IP do balanceador, e o limite de envios por IP e a exceção dos totens (`RATE_LIMIT_ALLOWLIST`) deixam de funcionar. Com o Caddy direto na internet, como no plano, não é preciso.
- **Cabeçalhos de segurança da página.** As respostas da API levam os do Helmet, mas o HTML servido pelo Caddy não leva nenhum (CSP, proibição de abrir o site dentro de outro). Uma CSP precisa ser testada tela a tela, porque o Recharts e o Radix usam estilos inline. Proibir o site dentro de outro depende de o hospital querer pôr a pesquisa no site dele, o que não está no plano. Fica para um ticket próprio.
- **Versão nova com a página aberta.** Totem, TV e painel ficam abertos por dias. Depois de um deploy, os arquivos da versão anterior deixam de existir, e abrir uma área que ainda não tinha sido carregada falha com o 404. O front pode ouvir o evento `vite:preloadError` do Vite e recarregar a página sozinho.
- **Corepack no Node 26.** O README e o `AGENTS.md` dizem para usar `corepack pnpm` quando o pnpm não está instalado, mas o Node 26 não traz o Corepack. A alternativa é `npm install --global pnpm@12.18.0`, como faz o `Dockerfile`.
- **Build da imagem no CI.** O CI não gera a imagem. Um arquivo novo de que o build precise e que o `.dockerignore` deixe de fora só apareceria no servidor. Um passo de `docker build` no CI, ou a publicação da imagem no GitHub Container Registry na fase 2, pegaria isso antes.
- **Token do complemento nos logs da API.** O plano lista `x-tv-token` entre os campos ocultados no log da API, mas não o `X-Complemento-Token` que o ticket 11 da API cria. Vale incluí-lo quando o 11 for feito.
- **Nome antigo no `package.json`** (registro 01): continua.

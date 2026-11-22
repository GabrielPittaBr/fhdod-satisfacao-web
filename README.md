# frontend-fhdod

Front-end do Sistema de Avaliação da Fundação Hospitalar Doutor Oswaldo Diesel: pesquisa de satisfação do paciente (celular, tablet e totem), painel da gestão e TV Wall.

Enquanto a API não existe, os dados são simulados no próprio navegador (`src/mocks/`). Uma avaliação enviada na pesquisa aparece no painel e na TV abertos no mesmo navegador.

Antes de trabalhar no repositório, leia o [`AGENTS.md`](AGENTS.md): fluxo de branches, padrão de commits, tickets, definição de pronto e as regras que já valem no front. As regras de negócio estão no [Plano de Desenvolvimento](https://github.com/GabrielPittaBr/fhdod-satisfacao-api/blob/develop/docs/Plano%20de%20Desenvolvimento%20-%20FHDOD.md), no repositório da API.

## Como rodar

Precisa do Node.js 26 (a versão fica no `.nvmrc`, a mesma da API). O gerenciador é o pnpm (a versão está em `packageManager`); sem ele instalado, use `corepack pnpm` no lugar de `pnpm`.

```bash
pnpm install   # dependências e hooks do Git
```

```bash
pnpm dev
```

Abra `http://localhost:5173/login`. A tela de login tem atalhos para entrar como cada perfil e links para a pesquisa, o totem e a TV.

| Comando | O que faz |
| --- | --- |
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Gera o site estático em `dist/` |
| `pnpm preview` | Serve o `dist/` para conferir o build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Checagem de tipos do TypeScript |
| `pnpm test` | Testes (Vitest) |
| `pnpm format` | Formata o projeto com o Prettier |

Antes de cada commit, os hooks do Git rodam o ESLint e o Prettier nos arquivos alterados e conferem a mensagem do commit. Em todo pull request, o CI do GitHub Actions roda lint, tipos, testes e build.

## Endereços

| Endereço | O que é |
| --- | --- |
| `/s/pronto-atendimento` | Pesquisa do setor (o QR Code leva para cá) |
| `/totem/pronto-atendimento` | A mesma pesquisa no modo totem |
| `/tv#demo-recepcao-fhdod` | TV Wall da tela de demonstração |
| `/login` e `/painel` | Painel da gestão |
| `/s/maternidade` | Setor inativo: mostra a mensagem de pesquisa indisponível |

Para testar as telas de erro, acrescente ao endereço `?falha=tudo` (toda chamada falha) ou `?falha=envio` (o primeiro envio da pesquisa é gravado, mas a confirmação não chega).

O Super Admin pode voltar aos dados iniciais pelo menu do usuário, em "Restaurar dados de demonstração".

## Imagem Docker

Em homologação e produção, o front é uma imagem Docker: o Caddy serve o site com HTTPS automático e repassa `/api` para a API, no mesmo domínio. Quem sobe tudo junto é o compose de produção da API (ticket 19 de lá), que gera esta imagem a partir desta pasta; por isso os dois repositórios ficam lado a lado também no servidor.

```bash
docker build -t fhdod-satisfacao-web .
```

O build acontece dentro do Docker, com o Node 26 e o pnpm do `packageManager`: não precisa de `pnpm install` na máquina. A imagem final tem só o Caddy, o [`Caddyfile`](Caddyfile) e os arquivos do `dist/`.

### Rodar na máquina, sem domínio

```bash
docker run --rm -p 8080:80 fhdod-satisfacao-web
```

Abra `http://localhost:8080/s/pronto-atendimento`. Sem `DOMAIN`, o Caddy serve em HTTP na porta 80 do container e avisa no log que não há HTTPS, o que é o esperado na máquina. Enquanto as telas usam os dados simulados, a imagem funciona sozinha; só o `/api` precisa da API no ar.

Com a API rodando na máquina (`docker compose up -d` e `pnpm dev`, na pasta da API):

```bash
docker run --rm -p 8080:80 --add-host=host.docker.internal:host-gateway \
  -e API_UPSTREAM=host.docker.internal:3333 fhdod-satisfacao-web
```

`http://localhost:8080/api/health` passa pelo Caddy e responde `{"data":{"status":"ok","banco":"ok"}}`.

Para ver o HTTPS na máquina, rode com `-e DOMAIN=localhost -p 8443:443` e abra `https://localhost:8443`. O certificado vem da autoridade do próprio Caddy, que o navegador não conhece: o aviso de certificado é o esperado.

### Variáveis

| Variável | Padrão | Para quê |
| --- | --- | --- |
| `DOMAIN` | nenhum: HTTP na porta 80 | Domínio do site, como `pesquisa.exemplo.com.br`. Com ele, o Caddy emite e renova o HTTPS sozinho e manda o HTTP para o HTTPS |
| `API_UPSTREAM` | `api:3333` | Para onde vai o `/api`: o serviço e a porta da API no compose de produção |

`DOMAIN` vazio não é o mesmo que sem `DOMAIN`: com `DOMAIN=`, o Caddy não sobe e acusa `unrecognized global option`. No compose, use `${DOMAIN:?defina o DOMAIN no .env}`, que para com uma mensagem clara quando a variável falta ou está vazia. Para testar o compose na máquina, `DOMAIN=:80` serve em HTTP, e `DOMAIN=localhost`, em HTTPS com o certificado do próprio Caddy.

### No servidor

O compose de produção da API cuida disto, mas a imagem precisa de:

- `DOMAIN` com o domínio, e o DNS dele apontando para o servidor;
- as portas 80 e 443 abertas, e a 443/udp, para o HTTP/3;
- um volume em `/data`, onde ficam os certificados. Sem ele, cada container novo pede outro certificado, e o Let's Encrypt limita as emissões por semana. Outro volume em `/config` guarda a configuração que o Caddy salva;
- a API como serviço `api`, na porta 3333 e na mesma rede, ou o `API_UPSTREAM` apontando para ela.

Por exemplo, num compose em `infra/`, no repositório da API (os caminhos são relativos à pasta do arquivo):

```yaml
caddy:
  build: ../../fhdod-satisfacao-web
  environment:
    DOMAIN: ${DOMAIN:?defina o DOMAIN no .env}
  ports:
    - 80:80
    - 443:443
    - 443:443/udp
  volumes:
    - caddy-dados:/data
    - caddy-config:/config
  depends_on:
    api:
      condition: service_healthy
```

### O que o Caddy responde

| Endereço | Resposta | Cache no navegador |
| --- | --- | --- |
| `/api` e `/api/*` | Repassado para a API, com o caminho inteiro | O que a API mandar |
| `/assets/*` | Arquivo do build, com hash no nome; 404 se não existir | Um ano (`immutable`): o nome muda quando o arquivo muda |
| Arquivo que existe, como `/favicon.svg` | O arquivo | Conferido a cada acesso (`no-cache`) |
| Qualquer outro caminho: `/s/...`, `/totem/...`, `/tv`, `/painel/...` | O `index.html`, para o link abrir direto e ao recarregar | Conferido a cada acesso (`no-cache`), para uma versão nova chegar na hora |

O que é texto (HTML, JS, CSS, JSON e SVG) sai comprimido com zstd ou gzip, conforme o navegador aceitar.

### Hospedagem estática

O build também é um site estático comum, que pode ir para uma hospedagem estática numa demonstração, sem a API: `vercel.json` (Vercel) e `public/_redirects` (Netlify e Cloudflare Pages) fazem os links diretos abrirem ao recarregar a página.

## Documentos

- `AGENTS.md`: como trabalhar no repositório, para pessoas e agentes.
- `docs/plano-frontend.md`: o plano deste front-end.
- `docs/tickets/`: os tickets, espelhados como issues no GitHub.
- `docs/registros/`: o registro de cada etapa, com as decisões e o porquê.

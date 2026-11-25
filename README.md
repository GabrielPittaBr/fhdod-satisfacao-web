# frontend-fhdod

Front-end do Sistema de Avaliação da Fundação Hospitalar Doutor Oswaldo Diesel: pesquisa de satisfação do paciente (celular, tablet e totem), painel da gestão e TV Wall.

A pesquisa do paciente, o painel, os cadastros e a TV Wall já usam a [API](https://github.com/GabrielPittaBr/fhdod-satisfacao-api): abrir a pesquisa, enviar a avaliação e mandar o comentário e o telefone gravam no PostgreSQL dela, a gestão entra no painel com a conta de verdade, os setores, as categorias, os turnos, as perguntas e os usuários são lidos e gravados lá, o dashboard, as respostas e os pedidos de retorno mostram os dados de lá, a TV Wall mostra os números de lá, com as telas criadas e desativadas no painel, e as exportações do dashboard (o resumo em Excel e em PDF e as respostas em Excel) são geradas lá. Uma avaliação enviada na pesquisa aparece no dashboard na atualização seguinte (a cada minuto, ou ao trocar um filtro). Nenhuma tela usa mais os dados simulados de `src/mocks/`, que saem no ticket 10.

Antes de trabalhar no repositório, leia o [`AGENTS.md`](AGENTS.md): fluxo de branches, padrão de commits, tickets, definição de pronto e as regras que já valem no front. As regras de negócio estão no [Plano de Desenvolvimento](https://github.com/GabrielPittaBr/fhdod-satisfacao-api/blob/develop/docs/Plano%20de%20Desenvolvimento%20-%20FHDOD.md), no repositório da API.

## Como rodar

Precisa do Node.js 26 (a versão fica no `.nvmrc`, a mesma da API). O gerenciador é o pnpm (a versão está em `packageManager`); sem ele instalado, use `corepack pnpm` no lugar de `pnpm`.

```bash
pnpm install   # dependências e hooks do Git
```

```bash
pnpm dev
```

Abra `http://localhost:5173/login` e entre com uma conta da API: na primeira vez, o Super Admin que o `pnpm db:seed` de lá cria (o `SEED_ADMIN_EMAIL` e a senha provisória `SEED_ADMIN_PASSWORD` do `.env` da API). No primeiro acesso, o painel pede a troca da senha provisória antes de abrir. A pesquisa, o painel e a TV precisam da API (veja a seção seguinte).

| Comando | O que faz |
| --- | --- |
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Gera o site estático em `dist/` |
| `pnpm preview` | Serve o `dist/` para conferir o build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Checagem de tipos do TypeScript |
| `pnpm test` | Testes (Vitest) |
| `pnpm format` | Formata o projeto com o Prettier |
| `pnpm api:tipos` | Gera `src/lib/api/schema.d.ts` a partir do `openapi.json` da API |

Antes de cada commit, os hooks do Git rodam o ESLint e o Prettier nos arquivos alterados e conferem a mensagem do commit. Em todo pull request, o CI do GitHub Actions roda lint, tipos, testes e build.

### Com a API

O `pnpm dev` repassa tudo o que começa com `/api` para a API rodando na máquina, em `http://localhost:3333`, como o Caddy faz em produção. O front chama a API sempre no mesmo endereço do site, então não há CORS no caminho. Para subir a API, siga o README dela (`docker compose up -d`, `pnpm db:deploy`, `pnpm db:seed` e `pnpm dev`, na pasta `../fhdod-satisfacao-api`).

O jeito mais rápido de ter o que mostrar são os dados de demonstração da API: `DEMO_CONFIRM=satisfacao pnpm db:demo`, na pasta dela, depois do `pnpm db:seed`. Eles trazem os setores com perguntas (o `pronto-atendimento` abre os links abaixo), uma conta de cada perfil, com as senhas no README de lá, as duas telas de TV dos endereços abaixo e cerca de quatro meses de avaliações.

Sem eles, cadastre pelo próprio painel, com o Super Admin, o que a pesquisa e os outros perfis precisam:

- para a pesquisa abrir, um setor com perguntas, em "Setores e perguntas". Com o endereço `pronto-atendimento`, os links abaixo abrem a pesquisa;
- para entrar com os outros perfis, os usuários, em "Usuários": a senha provisória aparece uma vez só, ao criar a conta ou ao redefinir a senha, com o botão de copiar;
- para o dashboard, as respostas, os pedidos de retorno e a TV terem o que mostrar, avaliações respondidas na pesquisa. O telefone para retorno é oferecido na avaliação baixa;
- para a TV, uma tela, em "Telas de TV": o link dela, com o token depois do `#`, aparece uma vez só, ao criar a tela.

As exportações, em "Exportar" no dashboard, são geradas pela API com os filtros da tela e o nome de arquivo que ela dá: o resumo em Excel e em PDF, para todos os perfis, e todas as respostas em Excel, para quem tem `exportacao:detalhada` (o Visualizador não tem). O telefone para retorno só vai na planilha das respostas de quem tem `contatos:ver` (o Super Admin e a Ouvidoria); quem decide é a API.

O `.env` é opcional. Copie o [`.env.example`](.env.example) para `.env` só se precisar mudar um padrão:

| Variável | Padrão | Para quê |
| --- | --- | --- |
| `API_URL` | `http://localhost:3333` | Para onde o `pnpm dev` e o `pnpm preview` repassam o `/api` |
| `OPENAPI_JSON` | `../fhdod-satisfacao-api/openapi.json` | De onde o `pnpm api:tipos` lê o contrato: um caminho ou o endereço do `openapi.json` na API rodando |

### Tipos do contrato

Os tipos das rotas, dos corpos e dos erros vêm do `openapi.json` que a API gera e commita. Quando o contrato mudar na API, rode `pnpm api:tipos` e commite o `src/lib/api/schema.d.ts` gerado, que nunca é editado à mão. O cliente HTTP ([`src/lib/api/cliente.ts`](src/lib/api/cliente.ts)) usa esses tipos: o endereço, os parâmetros e o corpo de cada chamada são conferidos pelo TypeScript.

## Endereços

| Endereço | O que é |
| --- | --- |
| `/s/pronto-atendimento` | Pesquisa do setor (o QR Code leva para cá), com o setor cadastrado na API |
| `/totem/pronto-atendimento` | A mesma pesquisa no modo totem |
| `/tv#demo-recepcao-fhdod` | TV Wall da tela de demonstração da API (`pnpm db:demo` de lá); a outra tela de lá, `/tv#demo-corredor-desativada`, está desativada e mostra que a tela não está ativa |
| `/login` e `/painel` | Painel da gestão: login, sessão, cadastros, indicadores, respostas, pedidos de retorno, telas de TV e exportações na API |
| `/s/<setor-inativo>` | Um setor desativado na API, ou um slug que não existe: mostra a mensagem de pesquisa indisponível |

As falhas são as de verdade: com a API parada, a pesquisa não abre e oferece "Tentar de novo"; sem internet no meio, as respostas continuam na tela e a mesma chave vai na nova tentativa, sem gravar a avaliação duas vezes. A TV sem rede mantém os últimos números, com "Sem conexão. Números das HH:MM" no rodapé, e volta sozinha na consulta seguinte (a cada 30 s). Uma exportação que falha, sem rede ou num setor que não é da pessoa, mostra um aviso, e o dashboard continua na tela.

Um navegador que abriu a versão simulada ainda guarda o "banco" dela no `localStorage`, na chave `fhdod-mock-banco`, sem uso: apagar os dados do site o tira.

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

Abra `http://localhost:8080/s/pronto-atendimento`. Sem `DOMAIN`, o Caddy serve em HTTP na porta 80 do container e avisa no log que não há HTTPS, o que é o esperado na máquina. A pesquisa, o login do painel, a TV e o `/api` precisam da API no ar.

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

O build também é um site estático comum, que pode ir para uma hospedagem estática numa demonstração: `vercel.json` (Vercel) e `public/_redirects` (Netlify e Cloudflare Pages) fazem os links diretos abrirem ao recarregar a página. Sem a API atrás do `/api`, a pesquisa, o painel e a TV mostram que não deu para abrir.

## Documentos

- `AGENTS.md`: como trabalhar no repositório, para pessoas e agentes.
- `docs/plano-frontend.md`: o plano deste front-end.
- `docs/tickets/`: os tickets, espelhados como issues no GitHub.
- `docs/registros/`: o registro de cada etapa, com as decisões e o porquê.

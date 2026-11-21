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

## Publicar

O build é um site estático. `vercel.json` (Vercel) e `public/_redirects` (Netlify e Cloudflare Pages) fazem os links diretos abrirem ao recarregar a página.

## Documentos

- `AGENTS.md`: como trabalhar no repositório, para pessoas e agentes.
- `docs/plano-frontend.md`: o plano deste front-end.
- `docs/tickets/`: os tickets, espelhados como issues no GitHub.
- `docs/registros/`: o registro de cada etapa, com as decisões e o porquê.

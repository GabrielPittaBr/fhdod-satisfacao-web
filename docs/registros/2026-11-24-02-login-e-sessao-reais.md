# Login e sessão reais no painel

24/11/2026 · Agente (Claude Code)

> Ticket [05](../tickets/05-login-e-sessao-reais.md), issue [#5](https://github.com/GabrielPittaBr/fhdod-satisfacao-web/issues/5). A gestão entra no painel com a conta da API, a sessão volta sozinha ao recarregar a página, pelo cookie de refresh, e o primeiro acesso obriga a trocar a senha provisória. Os atalhos de demonstração saem da tela de login. As telas do painel ainda simuladas abrem com a sessão real.

## O que foi feito

- **Autenticação na API** ([`src/features/auth/api.ts`](../../src/features/auth/api.ts)): login (`POST /auth/login` e depois `GET /auth/me`), recuperação da sessão ao recarregar (`POST /auth/refresh` e `GET /auth/me`), saída (`POST /auth/logout`) e troca de senha (`PATCH /auth/senha` e o `/auth/me` de novo, já com o `trocarSenha` falso).
- **Token em cada chamada do painel.** O `comToken` continua sendo a porta de todas as features do painel, com a mesma assinatura, e ganhou o `pedirComToken(...)`, para as chamadas à API: põe o token no `Authorization: Bearer` e, num 401, renova a sessão uma única vez e repete a chamada.
  - as renovações da aba saem uma de cada vez: várias chamadas com 401 ao mesmo tempo dividem uma renovação só;
  - se outra chamada já renovou enquanto esta esperava, ela repete com o token novo, sem renovar de novo;
  - se a renovação falha, ou se a chamada repetida também leva 401, a sessão acaba na aba e o painel volta para o login.
- **Sessão só em memória.** O token de acesso continua no Zustand (`stores/sessao.ts`); o refresh fica no cookie `refresh_token` da API (HttpOnly, Secure, SameSite=Strict, só nas rotas de `/api/v1/auth`), que o front nunca lê. Ao sair, ou quando a sessão acaba, o cache do TanStack Query é apagado.
- **Tela de login e menu do usuário.** Saíram os atalhos de demonstração (os perfis e os links para a pesquisa, o totem e a TV) e o "Restaurar dados de demonstração" do menu do Super Admin.
- **Telas simuladas com a sessão real** ([`src/mocks/auth.ts`](../../src/mocks/auth.ts)). O `autenticar` dos mocks deixou de conferir um token próprio: lê as permissões, os setores e o id do usuário da sessão do `/auth/me`. É um ajuste provisório, que sai no ticket 10. Com ele, saíram do mock o login, o refresh, o logout, o `/auth/me` e a troca de senha simulados, o "cookie" de refresh no `localStorage`, a revogação de sessões nas telas de usuários e o `restaurarDados`.
- **Tipos da sessão do contrato.** `Sessao`, `Perfil` e `Permissao` viraram apelidos do `schema.d.ts` em `src/lib/api/tipos.ts`, e o `AcessoDemo` saiu.
- **Mapa de permissões do mock removido.** O `PERMISSOES_POR_PERFIL` e o `PERFIS_SEM_ESCOPO` de `src/mocks/regras.ts`, e os dois testes deles, saíram: nada mais os usava, e as permissões de cada perfil agora vêm só do `/auth/me`.
- **Testes:** 16 novos e 2 removidos, com 66 no total. Os da autenticação usam um `fetch` falso e cobrem o login, o 401 do login sem renovar, a recuperação ao recarregar com e sem cookie, o token no `Authorization`, a renovação única com a nova tentativa, três chamadas com 401 ao mesmo tempo e uma renovação só, a sessão que acaba quando a renovação falha ou a nova tentativa leva 401 (com o cache apagado), outros erros sem renovar, a saída com e sem rede e a troca de senha. Os do mock conferem o contexto tirado da sessão real.
- **README e `AGENTS.md`**: como entrar com as contas da API, como cadastrar setores e usuários de verdade pelo Swagger enquanto o painel é simulado, como voltar aos dados simulados iniciais, o `pedirComToken` e a sessão só em memória.
- Issue #5 com a etiqueta `in-progress` e ticket 05 marcado como `done`.

## Decisões e por quê

| Decisão | Por quê |
| --- | --- |
| `pedirComToken(...)` em volta de cada chamada do painel, e não um middleware do openapi-fetch que põe o token | Para repetir uma chamada depois do 401, a requisição precisa ser montada de novo, com o token novo: o corpo da primeira já foi enviado. Com uma função que monta a chamada, a nova tentativa é só chamá-la de novo. E as rotas públicas da pesquisa, no mesmo cliente, não recebem o token de quem estiver logado na mesma aba |
| `comToken` no mesmo lugar e com a mesma assinatura | Os `api.ts` das outras features continuam iguais, como pede o `AGENTS.md`, e cada uma troca o mock pela API no seu ticket só mudando o corpo da função |
| Uma renovação por vez na aba | A API troca o refresh a cada uso e recusa o já usado com 401, sem derrubar as outras sessões. Duas renovações ao mesmo tempo mandariam o mesmo cookie, e a segunda derrubaria a sessão de quem estava trabalhando, como a Renata, na Ouvidoria, com o dashboard e a lista de retornos carregando juntos |
| Repetir com o token que outra chamada já renovou | Sem isso, uma chamada que levou 401 com o token velho logo depois de outra renovar faria uma segunda renovação à toa |
| Um 401 na nova tentativa também encerra a sessão | Com um token recém-emitido, o 401 quer dizer que a conta foi desativada ou que a sessão foi encerrada em outro lugar. Repetir de novo entraria num laço; voltar ao login é o que o critério pede |
| Cache do TanStack Query apagado ao sair e quando a sessão acaba | No computador compartilhado da recepção ou da Ouvidoria, quem entra depois não pode ver, nem por um instante, os números, os comentários ou os telefones mascarados de quem saiu (LGPD). Sem apagar, o que estava carregado fica no cache por até 5 minutos e aparece na hora para quem entrar, antes de a tela buscar de novo |
| Sair nunca falha | A API responde 204 mesmo sem sessão. Sem rede, a sessão acaba nesta aba do mesmo jeito: quem clicou em "Sair" não pode continuar dentro do painel por causa de uma falha de conexão |
| Depois da troca de senha, o `/auth/me` passa pelo `comToken` | A troca encerra as outras sessões e grava um refresh novo. Se o token de acesso tiver vencido no meio, o `/auth/me` renova com o cookie novo, em vez de mandar a pessoa para o login logo depois de trocar a senha |
| Mock com as permissões e os setores da sessão real, sem conferir o token | O token agora é o JWT da API, que o mock não tem como validar; quem valida é a API, no login, na renovação e no `/auth/me`. As permissões vêm de lá também, então menus, rotas e telas simuladas mostram o mesmo recorte |
| Mapa de permissões do mock apagado | O contrato diz que o mapa de cada perfil existe só na API. Manter uma cópia no mock, que ninguém usa, deixaria duas fontes para a mesma regra |
| Links da pesquisa, do totem e da TV fora da tela de login | Faziam parte dos atalhos de demonstração, montados a partir dos dados simulados. Os endereços estão no README |
| Senha provisória do teste fora das mensagens | No teste de ponta a ponta, as senhas provisórias que a API devolveu ficaram só num arquivo temporário, que foi apagado com o banco no fim |

## Ferramentas e skills usadas

- Claude Code, com a API na `develop` (merge do PR #39 de lá) rodando com `tsx`, o PostgreSQL 18 do container de teste do `docker-compose.yml` da API e o Chromium do Playwright.
- O status do ticket 05 da API foi conferido na `develop` de lá, com o comando do `AGENTS.md`: `done`.
- Nenhuma skill. A revisão com `web-design-guidelines` não foi rodada: as telas só perderam elementos (os atalhos e o item do menu), sem nada novo para revisar.

## Como foi verificado

- `pnpm lint`, `pnpm typecheck`, `pnpm test` (66 testes) e `pnpm build` sem erros. A tela de login não baixa mais nada dos dados simulados.
- **Ambiente:** banco descartável no container de teste da API, com as migrations e o seed base. A API rodou na porta 3334 com as variáveis na linha de comando e `ACCESS_TOKEN_TTL=60s`, para o token vencer durante o teste, e o `pnpm dev` com `API_URL=http://localhost:3334`. Os seis setores foram criados pela API na ordem dos simulados (os ids batem, com a Maternidade inativa), junto com um usuário de cada perfil; o gestor ficou com a Internação e o Raio-X. No fim, o banco foi apagado.
- **Super Admin, em 1366×768:** a tela de login só tem o formulário. A senha provisória do seed leva a "Crie a sua senha", e abrir `/painel/respostas` pelo endereço, recarregando a página, volta para a troca. Depois da troca (204, com o `Authorization`), o painel abre com os sete itens do menu, e o menu do usuário tem só "Trocar senha" e "Sair". O cookie de refresh é HttpOnly, Secure, SameSite=Strict, com o caminho `/api/v1/auth`, e não aparece no `document.cookie`; `localStorage` e `sessionStorage` vazios. Recarregar a página manteve a sessão (refresh 200). "Sair" chamou o logout com o token (204) e apagou o cookie; depois, `/painel/usuarios` levou ao login.
- **Gestor, Ouvidoria e Visualizador, em 360×740:** os três entraram com a senha provisória, foram para a troca obrigatória, trocaram e chegaram ao painel. Menus, no menu recolhível do celular:
  - Gestor: Indicadores, Respostas e Setores e perguntas, com "Gestor de setor: Internação, Raio-X" no menu do usuário. A tela simulada de setores mostrou só a Internação e o Raio-X;
  - Ouvidoria: Indicadores, Respostas e Pedidos de retorno;
  - Visualizador: só Indicadores, com "nenhum setor vinculado".
  Os três viram "Você não tem acesso a esta página" em `/painel/usuarios`, mantiveram a sessão ao recarregar e não tiveram rolagem horizontal.
- **Token vencido:** depois de 65 s parado, a troca de senha pelo menu levou 401 com o token velho, uma renovação (200) e a nova tentativa com o token novo (204), seguida do `/auth/me`.
- **Renovação recusada:** com a sessão do Super Admin encerrada em outro navegador (entrar e sair lá revoga todos os refresh), e o token vencido, a troca de senha levou 401, a renovação levou 401, e o painel voltou para o login.
- **Erros do login:** e-mail ou senha errados mostram "E-mail ou senha incorretos."; a sexta tentativa errada seguida recebe o 429 da API, com "Muitas tentativas. Espere 15 minutos e tente de novo."; e-mail sem `@` fica no aviso do formulário, sem chamar a API. Na troca de senha, a senha atual errada voltou da API em `senhaAtual` e foi para o campo, marcado como inválido e com o foco.
- Prints da tela de login em 360×740 e 1366×768 e do menu do usuário em 1366×768, para o PR.

## O que mudou em relação ao plano

- **Mapa de permissões do mock e os testes dele saíram antes do ticket 10**, porque nada mais os usava.
- **Cache apagado ao sair**, o que o ticket não pedia (veja a tabela).
- **Os links da pesquisa, do totem e da TV saíram da tela de login** junto com os atalhos.
- Para voltar aos dados simulados iniciais, sem o "Restaurar dados de demonstração", é preciso apagar o `localStorage` do site.

## Pendências e dúvidas

- **Uma renovação a mais quando a sessão acaba.** Quando a renovação falha, a sessão acaba e a guarda do painel tenta recuperá-la mais uma vez antes de ir para o login: sai um segundo `POST /auth/refresh`, que também leva 401. Não muda nada para quem usa, mas dá para evitar.
- **Duas abas recarregadas no mesmo instante.** A fila de renovações vale para uma aba. Com duas abas do painel recarregando juntas, as duas mandam o mesmo cookie, e a segunda volta para o login. Coordenar as abas (Web Locks ou `BroadcastChannel`) resolveria; é raro, e entrar de novo resolve.
- **Telas de usuários ainda simuladas** (até o ticket 06). Criar um usuário, redefinir a senha ou desativar alguém nelas não muda as contas da API, que são as que entram no painel. Até lá, as contas de verdade se criam pelo Swagger da API (README).
- **Setores das telas simuladas.** Um gestor enxerga os setores simulados que têm os mesmos ids dos dele na API. Com outros ids, as telas simuladas aparecem vazias para ele até o ticket 06.
- **Sem dados de demonstração na API** (ticket 12 de lá). Até lá, o único usuário que existe depois do seed é o Super Admin.

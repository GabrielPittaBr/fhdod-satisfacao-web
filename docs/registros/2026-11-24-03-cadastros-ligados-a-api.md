# Cadastros ligados à API

24/11/2026 · Agente (Claude Code)

> Ticket [06](../tickets/06-cadastros-ligados-a-api.md), issue [#6](https://github.com/GabrielPittaBr/fhdod-satisfacao-web/issues/6). Setores (com os links e o QR Code), categorias, turnos, perguntas do setor e usuários passam a ser lidos e gravados na API. As telas são as mesmas; os erros de validação da API vão para o campo do formulário, e os conflitos aparecem com a mensagem dela. Resolve duas pendências do registro 05: as telas de usuários já mexem nas contas de verdade, e o gestor vê nos cadastros os setores dele na API.

## O que foi feito

- **Cadastros na API.** Cada função dos `api.ts` corresponde a uma rota do contrato e passa pelo `pedirComToken`:
  - [`setores/api.ts`](../../src/features/setores/api.ts): `GET /setores`, `POST /setores`, `PATCH /setores/:id` e `PATCH /setores/:id/status`;
  - [`cadastros/api.ts`](../../src/features/cadastros/api.ts): `GET`, `POST` e `PATCH` das categorias (a edição também ativa e desativa) e dos turnos;
  - [`perguntas/api.ts`](../../src/features/perguntas/api.ts): `GET` e `POST /setores/:setorId/perguntas`, `PATCH /perguntas/:id`, `PUT /setores/:setorId/perguntas/ordem` e `PATCH /perguntas/:id/status`;
  - [`usuarios/api.ts`](../../src/features/usuarios/api.ts): `GET` e `POST /usuarios`, `PATCH /usuarios/:id`, `PUT /usuarios/:id/setores`, `PATCH /usuarios/:id/status` e `POST /usuarios/:id/redefinir-senha`.
- **Tipos do contrato.** `Setor`, `Categoria`, `Turno`, `Pergunta` e `Usuario` viraram apelidos do `schema.d.ts` em `src/lib/api/tipos.ts`. O corpo que cada rota recebe (`DadosSetor`, `DadosTurno`, `DadosPergunta`, `DadosUsuario` e os das edições) sai do contrato pelo `CorpoDe<caminho, método>`, novo no mesmo arquivo.
- **Erros da API no formulário.** Os de validação vão para o campo, com o foco no primeiro, inclusive os que o front não confere antes de enviar (nome com mais de 100 caracteres, opções repetidas com maiúsculas diferentes). Os conflitos aparecem acima do botão, com a mensagem da API: endereço do setor, e-mail, nome de categoria e tipo de pergunta com respostas.
- **A própria conta.** "Desativar" continua bloqueado na própria linha, como decidido em 11/11. O perfil, no formulário da própria conta, agora fica bloqueado, com "Você não pode mudar o próprio perfil." na explicação: é uma regra da API (409) que o mock não tinha.
- **Senha provisória.** Continua numa janela que aparece uma vez só, com o botão de copiar, ao criar a conta e ao redefinir a senha. Se a gravação dos setores falhar depois de a conta ser criada, a senha aparece mesmo assim, com um aviso para escolher os setores de novo em "Editar". Criar uma conta sem setores (Super Admin e Ouvidoria) não chama mais o `PUT /usuarios/:id/setores`.
- **`useSalvar`** ([`src/lib/salvar.ts`](../../src/lib/salvar.ts)): recarrega as listas afetadas também depois de uma falha, e a validação de um campo que não está na tela aparece com a mensagem do campo, no lugar de "Dados inválidos".
- **Lista de perguntas no celular.** Os botões (subir, descer, editar e desativar) vão para uma linha só deles abaixo da pergunta; do lado do texto, eles deixavam uma palavra por linha em 360 px.
- **Aviso de copiar:** "Copiado: senha provisória", no lugar de "Senha provisória copiado".
- **Mocks.** Saíram de `src/mocks/cadastros.ts` os setores, as categorias, os turnos, as perguntas e os usuários simulados; ficam só as telas de TV, até o ticket 08. Os usuários simulados, com as senhas de demonstração, saíram do "banco" e do seed. Os setores, as categorias, os turnos e as perguntas simulados continuam no "banco": dão nome e forma às respostas simuladas dos indicadores, das respostas e da TV.
- **Testes:** 25 novos, com 91 no total. Os `api.ts` das quatro áreas são testados com uma API de mentira ([`src/test/api-falsa.ts`](../../src/test/api-falsa.ts)), que confere o método, o caminho, o corpo e o token de cada chamada: criar, editar, ordenar, desativar, a senha provisória devolvida, os conflitos com a mensagem da API e o 403 do setor de fora. O `aplicarErroDaApi` é testado com um formulário de mentira: a validação no campo, o conflito na mensagem geral, o campo que não está na tela, a falta de rede e o erro do servidor.
- **README e `AGENTS.md`**: os cadastros pelo painel, no lugar do Swagger; o `CorpoDe`, a API de mentira dos testes e o que ainda é simulado.
- Issue #6 com a etiqueta `in-progress` e ticket 06 marcado como `done`.

## Decisões e por quê

| Decisão | Por quê |
| --- | --- |
| Corpos das rotas pelo `CorpoDe`, do contrato, no lugar dos `Dados*` do mock | O contrato é a única fonte. Um campo que mudar na API quebra o `pnpm typecheck` depois do `pnpm api:tipos`, em vez de quebrar na tela |
| As mudanças de situação e a ordem não devolvem nada | A API responde 204, sem corpo, e as telas nunca usaram o retorno |
| Funções dos cadastros e usuários simulados apagados dos mocks antes do ticket 10 | Nada mais os usava, como o mapa de permissões no ticket 05. Mantê-los deixaria duas fontes para as mesmas regras, e as senhas de demonstração no código sem servir para nada |
| Setores, categorias, turnos e perguntas simulados ficam no "banco" | As respostas simuladas dependem deles para ter setor, categoria e turno; saem com as telas que os usam (tickets 07, 08 e 10) |
| Perfil da própria conta bloqueado, com a explicação no campo | A API recusa (409): o Super Admin que se rebaixasse perderia o acesso aos usuários, e o hospital poderia ficar sem ninguém para gerenciá-los. Sem o bloqueio, quem administra só descobriria a regra depois de salvar |
| "Desativar" da própria conta continua bloqueado | Decisão de 11/11, pelo mesmo motivo. Se a API recusar por outro caminho, a mensagem dela aparece no aviso, como nas outras mudanças de situação |
| Senha provisória mostrada mesmo quando os setores falham | A conta já existe, e a senha não volta mais. Sem isso, o Super Admin veria o erro, tentaria criar de novo, receberia "Já existe um usuário com este e-mail." e teria de redefinir a senha para entregá-la ao gestor |
| Sem `PUT /usuarios/:id/setores` ao criar uma conta sem setores | Uma chamada a menos, e uma chance a menos de falha, na conta da Ouvidoria e do Super Admin, que a API já cria sem setores |
| `useSalvar` recarrega as listas também depois de uma falha | A ordem das perguntas muda na tela antes da resposta. Sem rede, ou com a lista mudada por outra pessoa, a tela continuaria mostrando uma ordem que não foi gravada, e o gestor sairia achando que salvou |
| Validação sem campo na tela mostra a mensagem do campo | "Dados inválidos" não diz o que fazer; as mensagens da API já vêm escritas para quem está na tela |
| Botões das perguntas numa linha própria no celular | Em 360×740, a pergunta ficava com uma palavra por linha, difícil de ler e de achar na lista. A definição de pronto pede a tela funcionando no celular |
| "Copiado: senha provisória" | "Senha provisória copiado" não concordava em gênero; a forma com dois-pontos serve para todos os rótulos ("Copiado: link da pesquisa") |
| API de mentira num arquivo só, em `src/test/` | Os tickets 07 a 09 testam os seus `api.ts` do mesmo jeito; a origem e o `fetch` precisam ser trocados antes de o cliente ser importado, e o arquivo cuida disso |

## Ferramentas e skills usadas

- Claude Code, com a API na `develop` (merge do PR #39 de lá) compilada com o `tsup` e rodando com o `node`, o PostgreSQL 18 do container de teste do `docker-compose.yml` da API e o Chromium do Playwright.
- O status dos tickets 06, 07, 08 e 09 da API foi conferido na `develop` de lá, com o comando do `AGENTS.md`: `done`. O `pnpm api:tipos` não mudou o `schema.d.ts`: o contrato já tinha as rotas.
- Nenhuma skill. A revisão com `web-design-guidelines` não foi rodada: não há tela nova. As mudanças são um campo bloqueado com explicação, um aviso na janela da senha com o mesmo estilo dos outros avisos e a linha das perguntas no celular, todas conferidas em 360×740 e 1366×768.

## Como foi verificado

- `pnpm lint`, `pnpm typecheck`, `pnpm test` (91 testes) e `pnpm build` sem erros.
- **Ambiente:** banco descartável no container de teste da API, com as migrations e o seed base. A API rodou na porta 3334, com as variáveis num arquivo temporário (apagado no fim), e o `pnpm dev` com `API_URL=http://localhost:3334`. Tudo foi cadastrado pelas telas do painel. No fim, o banco foi apagado.
- **Super Admin, em 1366×768**, depois da troca obrigatória da senha:
  - setores: os seis criados na ordem dos simulados, com o endereço preenchido a partir do nome (`internacao`, `raio-x`...), e a lista em ordem alfabética, como a API devolve. O endereço repetido voltou com o 409 e "Já existe um setor com este endereço. Escolha outro." acima do botão; o nome com 101 caracteres, com o 400 da API no campo do nome, marcado como inválido e com o foco. A Maternidade teve a descrição editada (200) e foi desativada (204), com o selo "Inativo: pesquisa pausada". "Links e QR Code" mostrou os links da pesquisa e do totem com o endereço do setor;
  - categorias e turnos: "Acolhimento" criada; "RECEPÇÃO" voltou com "Já existe uma categoria com este nome."; desativar e ativar mandaram `ativa: false` e `ativa: true`. O turno "Madrugada", das 23h às 5h, apareceu com "do dia seguinte" e foi renomeado; o nome com 101 caracteres voltou com o erro da API no campo;
  - perguntas da Internação: uma de rostinhos, uma de sim ou não e uma de múltipla escolha. As opções "Indicação" e "INDICAÇÃO" voltaram da API com "As opções não podem se repetir", no campo das opções. Descer a primeira mandou a ordem `[2, 1, 3]` (204), e recarregar a página manteve. A terceira foi desativada (204) e a primeira teve o texto editado (200). Com a edição da pergunta de rostinhos aberta, chegou uma avaliação pela pesquisa pública (201); trocar o tipo voltou com o 409 e "Esta pergunta já tem respostas, então o tipo não pode mudar. Crie outra pergunta e desative esta.". Ao recarregar, o tipo ficou bloqueado, com a explicação;
  - usuários: o gestor criado com a Internação e o Raio-X recebeu a senha provisória na janela; "Copiar" avisou "Copiado: senha provisória" e pôs a senha na área de transferência, e depois de "Já anotei" a senha não estava mais na página. A lista mostrou "Setores: Internação, Raio-X." e "Com senha provisória". Ouvidoria e Visualizador (com o Raio-X) também foram criados. O e-mail repetido, com maiúsculas, voltou com "Já existe um usuário com este e-mail.". Com a chamada dos setores cortada uma vez, a conta foi criada e a senha apareceu com o aviso dos setores; a lista mostrou "nenhum vinculado ainda". Na própria conta, "Desativar" estava bloqueado e o perfil também, com a explicação; o nome mudou (200, com o perfil de sempre no corpo). O visualizador foi desativado e ativado (204), e a senha da Ouvidoria, redefinida (200), com uma senha nova na janela.
- **Gestor, em 360×740:** entrou com a senha provisória e trocou. Em Setores, só a Internação e o Raio-X, com "Perguntas" e "Links e QR Code" e sem "Novo setor", "Editar" ou "Desativar". Nas perguntas da Internação, criou uma pergunta (201), subiu-a (204), desativou-a (204) e editou outra (200). As perguntas do Pronto Atendimento, que não é dele, voltaram com o 403 da API, e a tela mostrou "Você não tem acesso a este setor."; Usuários mostrou "Você não tem acesso a esta página".
- **Ouvidoria e Visualizador, em 360×740:** sem acesso a Setores e a Categorias e turnos. No filtro do dashboard, que já lê os setores e os turnos da API, a Ouvidoria viu os seis setores (a Maternidade como "inativo") e o Visualizador, só o Raio-X; os dois viram o turno novo.
- **Super Admin, em 360×740:** Setores, Categorias e turnos, as perguntas e Usuários sem rolagem horizontal. A lista de perguntas mostrava uma palavra por linha; depois da correção, os botões ficam abaixo da pergunta, e em 1366×768 a linha continua igual. Pelo teclado, Enter em "Novo setor" abre o formulário com o foco dentro, e Esc o fecha.
- Prints de Setores, das perguntas, de Usuários e de Categorias e turnos em 360×740 e 1366×768, e de Setores do gestor em 360×740, para o PR. Nenhum mostra uma senha.

## O que mudou em relação ao plano

- **Mudanças além dos `api.ts`.** O `AGENTS.md` diz que, ao ligar uma área à API, só o `api.ts` muda. Mudaram também, cada uma explicada na tabela: o formulário de usuários (o perfil da própria conta, regra nova da API, e a senha quando os setores falham), o `useSalvar` (recarregar depois da falha e a mensagem do campo que não está na tela), a linha das perguntas no celular e o texto do aviso de copiar.
- **Desativar a própria conta.** O critério pede o conflito com a mensagem da API. Na tela, ele não acontece: o botão continua bloqueado na própria linha (decisão de 11/11). O conflito chega com a mensagem da API no teste do `usuarios/api.ts`, e a tela o mostraria no mesmo aviso das outras mudanças de situação.
- **Conflito novo:** mudar o próprio perfil, que não estava no ticket.
- **Limpeza dos mocks antes do ticket 10:** as funções dos cadastros e os usuários simulados.

## Pendências e dúvidas

- **Indicadores e respostas com setores simulados** (até o ticket 07). O filtro do dashboard já lista os setores e os turnos da API, mas os números são simulados e só batem quando os ids coincidem; o README explica a ordem de cadastro que os alinha.
- **O foco não volta ao botão depois de fechar um formulário:** com Esc, no "Novo setor" e no "Editar" de um setor, o foco foi para o começo da página. O `DialogoFormulario` não mudou neste ticket; o provável é que ele saia da tela junto com o estado que o abre, antes de o diálogo devolver o foco. Deve valer para todos os formulários do painel, e quem usa o teclado precisa voltar até a lista.
- **Nome no cabeçalho depois de editar a própria conta.** O menu do usuário continua com o nome antigo até recarregar a página: ele vem da sessão do `/auth/me`, que a tela de usuários não relê. O perfil não muda (a API não deixa), então é só o nome.
- **"Tentar de novo" num 403.** A mensagem de setor de fora vem com o botão de tentar de novo, que não muda nada. Já era assim em toda consulta do painel.
- **Ordem com vários cliques seguidos.** Cada movimento manda a lista inteira; se as respostas chegarem fora de ordem, a ordem gravada pode ser a de um clique anterior. A tela recarrega depois de cada uma, então a pessoa vê o que ficou gravado.

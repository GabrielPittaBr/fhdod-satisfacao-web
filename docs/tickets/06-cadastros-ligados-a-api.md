# 06 — Cadastros ligados à API

**Issue:** [#6](https://github.com/GabrielPittaBr/fhdod-satisfacao-web/issues/6)

**O que construir:** Setores (com links e QR Code), categorias, turnos, perguntas do setor e usuários passam a ser lidos e gravados na API. As telas continuam as mesmas, e os erros de validação e de conflito que a API devolve aparecem no campo certo do formulário.

**Bloqueado por:** 05 — Login e sessão reais no painel; API 06 — Setores, API 07 — Categorias e turnos, API 08 — Perguntas do setor e API 09 — Usuários e seus setores (repositório da API)

**Status:** done

**Critérios de aceite:**

- [x] As chamadas de setores, categorias, turnos, perguntas e usuários usam a API, com os tipos gerados do contrato.
- [x] Os erros por campo da API aparecem no campo do formulário, e os conflitos (slug, e-mail, nome de categoria, tipo de pergunta com respostas e desativar a própria conta) aparecem com a mensagem da API.
- [x] A senha provisória continua aparecendo uma única vez, com o botão de copiar.
- [x] O gestor continua vendo só os seus setores, em modo leitura, e só as perguntas deles.
- [x] Testado contra a API local com cada perfil: criar, editar, ordenar e desativar.

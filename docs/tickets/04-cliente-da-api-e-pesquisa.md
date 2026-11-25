# 04 — Cliente da API e pesquisa do paciente ligada à API

**Issue:** [#4](https://github.com/GabrielPittaBr/fhdod-satisfacao-web/issues/4)

**O que construir:** A pesquisa do paciente passa a usar a API de verdade: abrir a pesquisa do setor, enviar a avaliação e mandar o comentário e o telefone gravam no PostgreSQL. Junto chega a base de toda a ligação com a API: os tipos gerados do `openapi.json`, um cliente HTTP tipado que converte os erros no formato que as telas já tratam e o repasse de `/api` no servidor de desenvolvimento. Nenhuma tela da pesquisa muda.

**Bloqueado por:** 01 — Configuração dos agentes e do fluxo de trabalho; API 03 — Contrato: Swagger, `openapi.json` e CI e API 11 — Comentário e pedido de retorno depois do envio (repositório da API)

**Status:** done

**Critérios de aceite:**

- [x] `pnpm api:tipos` gera os tipos a partir do `openapi.json` da API (por padrão, no repositório ao lado), e um cliente openapi-fetch usa esses tipos.
- [x] O cliente converte qualquer erro da API no erro que as telas já tratam (status, código, mensagem, detalhes e o `requestId` que a API mandou), e a falta de rede vira status 0, com a mensagem de sem conexão.
- [x] O servidor de desenvolvimento repassa `/api` para a API local; o endereço dela e o caminho do `openapi.json` ficam documentados no `.env.example`.
- [x] Abrir a pesquisa, enviar a avaliação e enviar o complemento chamam a API, com o token de complemento no cabeçalho `X-Complemento-Token`; o complemento enviado quando a pessoa sai da página usa uma requisição que sobrevive ao fechamento dela.
- [x] O formulário da pesquisa manda o campo isca definido pela API, invisível e sempre vazio para pessoas.
- [x] Os tipos da pesquisa passam a vir do contrato gerado; o resto do front continua compilando com os tipos escritos à mão até chegar a sua vez.
- [x] Testado contra a API local: pesquisa só com a nota final, nota baixa com comentário e telefone, nota normal com elogio, setor inativo, totem com o turno automático e reenvio com a mesma chave sem duplicar a resposta.

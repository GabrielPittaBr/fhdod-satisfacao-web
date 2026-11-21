# 03 — Imagem Docker do front com Caddy

**Issue:** [#3](https://github.com/GabrielPittaBr/fhdod-satisfacao-web/issues/3)

**O que construir:** O front vira uma imagem Docker que serve o site com HTTPS automático e repassa as chamadas de `/api` para a API, no mesmo domínio. Os links diretos do QR Code, do totem e da TV abrem mesmo ao recarregar a página. É essa imagem que o compose de produção da API usa.

**Bloqueado por:** 01 — Configuração dos agentes e do fluxo de trabalho

**Status:** ready-for-agent

**Critérios de aceite:**

- [ ] Dockerfile em múltiplos estágios: gera o build com pnpm numa imagem completa e copia só o resultado para a imagem do Caddy.
- [ ] O Caddyfile recebe o domínio por variável, emite e renova o HTTPS sozinho, comprime as respostas e repassa `/api/*` para o serviço da API.
- [ ] Qualquer rota que não seja arquivo nem `/api` devolve o `index.html`, para `/s/...`, `/totem/...`, `/tv` e `/painel/...` abrirem direto.
- [ ] Arquivos com hash no nome ficam em cache longo, e o `index.html`, sem cache.
- [ ] Na máquina local, a imagem roda sem domínio público, para ser testada com o compose da API.
- [ ] O README do front explica como gerar e rodar a imagem.

# 08 — TV Wall ligada à API

**Issue:** [#8](https://github.com/GabrielPittaBr/fhdod-satisfacao-web/issues/8)

**O que construir:** A TV mostra os números reais da pesquisa, autenticada pelo token do link, e a gestão das telas cria e desativa TVs na API. Se a rede cair, a TV mantém os últimos números, como já faz hoje.

**Bloqueado por:** 05 — Login e sessão reais no painel; API 16 — TV Wall: telas e indicadores (repositório da API)

**Status:** done

**Critérios de aceite:**

- [x] A tela da TV lê o token depois do `#` e busca os indicadores com o cabeçalho `X-Tv-Token`; token inválido ou tela desativada mostram a mensagem simples de hoje.
- [x] A gestão das telas lista, cria (o link com o token aparece uma única vez) e desativa pela API.
- [x] Os tipos da TV vêm do contrato gerado.
- [x] Testado: a tela ativa mostra os números, a tela desativada para de funcionar e, sem rede, a TV mantém os números com a hora da última atualização.

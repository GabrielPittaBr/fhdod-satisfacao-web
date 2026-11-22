# Imagem do front: o Caddy serve o build do Vite com HTTPS automático e repassa /api para a API.
# Como gerar e rodar: README, em "Imagem Docker". As regras de cada endereço estão no Caddyfile.

# Estágio 1: o build, numa imagem completa do Node 26, a mesma versão do .nvmrc e do CI.
FROM node:26 AS build
WORKDIR /app

# Sem os hooks do Git: dentro da imagem não há repositório.
ENV HUSKY=0

# O pnpm na versão do packageManager do package.json. O Node 26 não traz mais o Corepack.
COPY package.json pnpm-lock.yaml ./
RUN npm install --global "$(node --print "require('./package.json').packageManager.split('+')[0]")"

# As dependências ficam numa camada própria, refeita só quando o package.json ou o pnpm-lock.yaml mudam.
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Estágio 2: a imagem final, só com o Caddy, o Caddyfile e o resultado do build (sem Node nem node_modules).
FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
# Um Caddyfile com erro para aqui, no build, e não no container do servidor.
RUN caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile

COPY --from=build /app/dist /srv

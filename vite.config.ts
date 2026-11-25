import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => {
  // Variáveis do .env (modelo no .env.example). Sem o prefixo VITE_, nenhuma delas vai para o site.
  const env = loadEnv(mode, import.meta.dirname, '')

  return {
    plugins: [react(), tailwindcss()],
    resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
    // O /api vai inteiro para a API local, como o Caddy faz em produção: as rotas dela já começam com /api.
    // O `pnpm preview` usa o mesmo repasse.
    server: { proxy: { '/api': { target: env.API_URL || 'http://localhost:3333' } } },
    // Totens e TVs costumam ter navegadores mais antigos que os celulares.
    build: { target: 'es2020' },
    test: { environment: 'node' },
  }
})

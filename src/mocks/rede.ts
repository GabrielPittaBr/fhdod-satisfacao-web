import { ErroApi } from '@/lib/api/erro'

// Jeito simples de testar as telas de erro da exportação, a única área ainda simulada, pela URL:
//   ?falha=tudo   toda chamada simulada falha com erro 500
// Além disso, com o navegador offline (DevTools > Network > Offline) toda chamada falha.
// O resto do front já chama a API de verdade e não passa por aqui.
const parametro = typeof location === 'undefined' ? null : new URLSearchParams(location.search).get('falha')
const falha = { tudo: parametro === 'tudo' }

/** Simula a ida ao servidor: latência de 200 a 600 ms e as falhas forçadas. */
export async function rede() {
  await new Promise((resolver) => setTimeout(resolver, 200 + Math.random() * 400))
  if (typeof navigator !== 'undefined' && !navigator.onLine) throw erros.semConexao()
  if (falha.tudo) throw new ErroApi(500, 'ERRO_INTERNO', 'Erro inesperado')
}

export const erros = {
  semConexao: () => new ErroApi(0, 'SEM_CONEXAO', 'Sem conexão'),
  naoAutenticado: () => new ErroApi(401, 'NAO_AUTENTICADO', 'Sua sessão terminou. Entre de novo.'),
  semPermissao: () => new ErroApi(403, 'SEM_PERMISSAO', 'Você não tem permissão para isso.'),
}

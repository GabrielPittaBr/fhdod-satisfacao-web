// Autenticação do painel, na API: login, sessão, renovação, saída e troca de senha.
// O token de acesso fica só em memória (stores/sessao); o refresh fica no cookie HttpOnly, que só a API lê
// e que o navegador manda sozinho às rotas de /api/v1/auth.
import { api, pedir, type Resultado } from '@/lib/api/cliente'
import { ErroApi } from '@/lib/api/erro'
import type { Sessao } from '@/lib/api/tipos'
import { queryClient } from '@/lib/query-client'
import { useSessao } from '@/stores/sessao'

const comoBearer = (token: string) => ({ Authorization: `Bearer ${token}` })

let renovando: Promise<string> | null = null

/**
 * POST /auth/refresh. Uma renovação por vez nesta aba: a API troca o refresh a cada uso, então uma segunda
 * renovação ao mesmo tempo iria com o cookie já trocado, levaria 401 e derrubaria a sessão.
 */
function renovarToken(): Promise<string> {
  renovando ??= pedir(api.POST('/api/v1/auth/refresh'))
    .then(({ data }) => {
      useSessao.getState().definirToken(data.tokenAcesso)
      return data.tokenAcesso
    })
    .finally(() => (renovando = null))
  return renovando
}

/** Esquece a sessão nesta aba, com o que já foi carregado: o próximo a entrar não vê os dados de quem saiu. */
function encerrarNestaAba() {
  useSessao.getState().limpar()
  queryClient.clear()
}

/**
 * Envia o token de acesso e, num 401, renova a sessão uma única vez e repete a chamada. Se a renovação
 * falhar, ou se a chamada repetida também levar 401, a sessão acaba e o painel volta para o login.
 * Todas as features do painel passam por aqui.
 */
export async function comToken<T>(chamada: (token: string) => Promise<T>): Promise<T> {
  const usado = useSessao.getState().token ?? ''
  try {
    return await chamada(usado)
  } catch (erro) {
    if (!(erro instanceof ErroApi) || erro.status !== 401) throw erro
    try {
      // outra chamada pode já ter renovado enquanto esta esperava: aí basta repetir com o token novo
      const atual = useSessao.getState().token
      return await chamada(atual && atual !== usado ? atual : await renovarToken())
    } catch (erroDepois) {
      if (erroDepois instanceof ErroApi && erroDepois.status === 401) encerrarNestaAba()
      throw erroDepois
    }
  }
}

/**
 * Chamada do painel à API, com o token no cabeçalho `Authorization` e a renovação do `comToken`.
 * Uso: `(await pedirComToken((headers) => api.GET('/api/v1/...', { headers }))).data`.
 */
export const pedirComToken = <R extends Resultado>(
  chamada: (headers: { Authorization: string }) => Promise<R>,
) => comToken((token) => pedir(chamada(comoBearer(token))))

/** GET /auth/me */
const buscarSessao = (token: string) =>
  pedir(api.GET('/api/v1/auth/me', { headers: comoBearer(token) })).then(({ data }) => data)

/** POST /auth/login + GET /auth/me */
export async function entrar(email: string, senha: string): Promise<Sessao> {
  const { data } = await pedir(api.POST('/api/v1/auth/login', { body: { email, senha } }))
  const sessao = await buscarSessao(data.tokenAcesso)
  useSessao.getState().definir(data.tokenAcesso, sessao)
  return sessao
}

/** Ao recarregar a página: POST /auth/refresh + GET /auth/me. Devolve null se não há sessão. */
export async function recuperarSessao(): Promise<Sessao | null> {
  try {
    const token = await renovarToken()
    const sessao = await buscarSessao(token)
    useSessao.getState().definir(token, sessao)
    return sessao
  } catch (erro) {
    if (erro instanceof ErroApi && erro.status === 401) return null
    throw erro
  }
}

/** POST /auth/logout: encerra todas as sessões da pessoa e apaga o cookie. Sair nunca falha para quem clicou. */
export async function sair() {
  const { token } = useSessao.getState()
  try {
    await pedir(api.POST('/api/v1/auth/logout', { headers: token ? comoBearer(token) : {} }))
  } catch {
    // sem rede, a sessão continua na API até o refresh vencer, mas nesta aba ela acaba do mesmo jeito
  } finally {
    encerrarNestaAba()
  }
}

/** PATCH /auth/senha e, depois, o /auth/me de novo: o `trocarSenha` volta falso. */
export async function trocarSenha(corpo: { senhaAtual: string; novaSenha: string }) {
  await pedirComToken((headers) => api.PATCH('/api/v1/auth/senha', { headers, body: corpo }))
  const sessao = await comToken(buscarSessao)
  useSessao.getState().definir(useSessao.getState().token ?? '', sessao)
}

import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { ErroApi } from '@/lib/api/erro'
import type { Sessao } from '@/lib/api/tipos'
import { queryClient } from '@/lib/query-client'
import { useSessao } from '@/stores/sessao'

// O cliente da API guarda o fetch e a origem da página ao ser criado: os dois são trocados antes de importar.
type Rota = (pedido: Request) => Response | Promise<Response>
const rotas = new Map<string, Rota>()
const pedidos: Request[] = []
const fetchFalso = vi.fn(async (pedido: Request) => {
  pedidos.push(pedido)
  const caminho = `${pedido.method} ${new URL(pedido.url).pathname}`
  const rota = rotas.get(caminho)
  if (!rota) throw new Error(`rota não prevista no teste: ${caminho}`)
  return rota(pedido)
})

let auth: typeof import('./api')
let cliente: typeof import('@/lib/api/cliente')
beforeAll(async () => {
  vi.stubGlobal('location', { origin: 'http://site.teste' })
  vi.stubGlobal('fetch', fetchFalso)
  auth = await import('./api')
  cliente = await import('@/lib/api/cliente')
})
afterAll(() => vi.unstubAllGlobals())
beforeEach(() => {
  rotas.clear()
  pedidos.length = 0
  useSessao.setState({ token: null, sessao: null })
  queryClient.clear()
})

const json = (status: number, corpo: unknown) =>
  new Response(JSON.stringify(corpo), { status, headers: { 'Content-Type': 'application/json' } })
const naoAutenticado = () =>
  json(401, {
    erro: { codigo: 'NAO_AUTENTICADO', mensagem: 'Sua sessão terminou.', detalhes: [], requestId: 'R' },
  })
const semConteudo = () => new Response(null, { status: 204 })

const SESSAO: Sessao = {
  usuario: {
    id: 7,
    nome: 'Renata Lima',
    email: 'renata@exemplo.com.br',
    perfil: 'OUVIDORIA',
    trocarSenha: false,
  },
  permissoes: ['dashboard:ver', 'contatos:ver'],
  setores: [],
  todosSetores: true,
}
const bearer = (pedido: Request) => pedido.headers.get('Authorization')
const chamadasA = (caminho: string) => pedidos.filter((p) => new URL(p.url).pathname === caminho)

/** Uma chamada do painel à API (aqui, o /auth/me), que só aceita o token pedido. */
const ROTA = 'GET /api/v1/auth/me'
const rotaQueAceita = (token: string) => (pedido: Request) =>
  bearer(pedido) === `Bearer ${token}` ? json(200, { data: SESSAO }) : naoAutenticado()
const chamarMe = () => auth.pedirComToken((headers) => cliente.api.GET('/api/v1/auth/me', { headers }))

describe('login e sessão', () => {
  it('entra com e-mail e senha e guarda o token e a sessão do /auth/me só em memória', async () => {
    rotas.set('POST /api/v1/auth/login', () => json(200, { data: { tokenAcesso: 'acesso-1' } }))
    rotas.set('GET /api/v1/auth/me', (p) =>
      bearer(p) === 'Bearer acesso-1' ? json(200, { data: SESSAO }) : naoAutenticado(),
    )

    await expect(auth.entrar('renata@exemplo.com.br', 'senha-de-teste-1')).resolves.toEqual(SESSAO)
    expect(await chamadasA('/api/v1/auth/login')[0]!.json()).toEqual({
      email: 'renata@exemplo.com.br',
      senha: 'senha-de-teste-1',
    })
    expect(useSessao.getState()).toMatchObject({ token: 'acesso-1', sessao: SESSAO })
  })

  it('e-mail ou senha errados chegam como o 401 da API, sem tentar renovar', async () => {
    rotas.set('POST /api/v1/auth/login', () =>
      json(401, {
        erro: {
          codigo: 'NAO_AUTENTICADO',
          mensagem: 'E-mail ou senha incorretos.',
          detalhes: [],
          requestId: 'R',
        },
      }),
    )
    await expect(auth.entrar('x@exemplo.com.br', 'errada')).rejects.toMatchObject({
      status: 401,
      message: 'E-mail ou senha incorretos.',
    })
    expect(chamadasA('/api/v1/auth/refresh')).toHaveLength(0)
  })

  it('ao recarregar, a sessão volta pelo cookie de refresh', async () => {
    rotas.set('POST /api/v1/auth/refresh', () => json(200, { data: { tokenAcesso: 'acesso-2' } }))
    rotas.set('GET /api/v1/auth/me', () => json(200, { data: SESSAO }))
    await expect(auth.recuperarSessao()).resolves.toEqual(SESSAO)
    expect(useSessao.getState().token).toBe('acesso-2')
    expect(bearer(chamadasA('/api/v1/auth/me')[0]!)).toBe('Bearer acesso-2')
  })

  it('sem cookie válido, não há sessão para recuperar', async () => {
    rotas.set('POST /api/v1/auth/refresh', naoAutenticado)
    await expect(auth.recuperarSessao()).resolves.toBeNull()
  })
})

describe('token em cada chamada do painel', () => {
  beforeEach(() => useSessao.setState({ token: 'acesso-velho', sessao: SESSAO }))

  it('manda o token no cabeçalho Authorization', async () => {
    rotas.set(ROTA, rotaQueAceita('acesso-velho'))
    await chamarMe()
    expect(bearer(pedidos[0]!)).toBe('Bearer acesso-velho')
  })

  it('num 401, renova uma vez e repete a chamada com o token novo', async () => {
    rotas.set(ROTA, rotaQueAceita('acesso-novo'))
    rotas.set('POST /api/v1/auth/refresh', () => json(200, { data: { tokenAcesso: 'acesso-novo' } }))
    await expect(chamarMe()).resolves.toEqual({ data: SESSAO })
    expect(chamadasA('/api/v1/auth/me').map(bearer)).toEqual(['Bearer acesso-velho', 'Bearer acesso-novo'])
    expect(chamadasA('/api/v1/auth/refresh')).toHaveLength(1)
    expect(useSessao.getState().token).toBe('acesso-novo')
  })

  it('várias chamadas com 401 ao mesmo tempo dividem uma renovação só', async () => {
    rotas.set(ROTA, rotaQueAceita('acesso-novo'))
    let liberar = () => {}
    rotas.set(
      'POST /api/v1/auth/refresh',
      () =>
        new Promise<Response>(
          (r) => (liberar = () => r(json(200, { data: { tokenAcesso: 'acesso-novo' } }))),
        ),
    )
    const tres = Promise.all([chamarMe(), chamarMe(), chamarMe()])
    await vi.waitFor(() => expect(chamadasA('/api/v1/auth/refresh')).toHaveLength(1))
    liberar()
    await tres
    // o refresh é trocado a cada uso: uma segunda renovação iria com o cookie velho e derrubaria a sessão
    expect(chamadasA('/api/v1/auth/refresh')).toHaveLength(1)
    expect(chamadasA('/api/v1/auth/me')).toHaveLength(6)
  })

  it('se a renovação falha, a sessão acaba nesta aba, com o que estava carregado', async () => {
    queryClient.setQueryData(['respostas'], ['dados de quem saiu'])
    rotas.set(ROTA, naoAutenticado)
    rotas.set('POST /api/v1/auth/refresh', naoAutenticado)
    await expect(chamarMe()).rejects.toBeInstanceOf(ErroApi)
    expect(useSessao.getState()).toMatchObject({ token: null, sessao: null })
    expect(queryClient.getQueryData(['respostas'])).toBeUndefined()
  })

  it('se a chamada repetida também leva 401, não renova de novo e a sessão acaba', async () => {
    rotas.set(ROTA, naoAutenticado)
    rotas.set('POST /api/v1/auth/refresh', () => json(200, { data: { tokenAcesso: 'acesso-novo' } }))
    await expect(chamarMe()).rejects.toMatchObject({ status: 401 })
    expect(chamadasA('/api/v1/auth/refresh')).toHaveLength(1)
    expect(useSessao.getState().sessao).toBeNull()
  })

  it('outros erros passam direto, sem renovar', async () => {
    rotas.set(ROTA, () =>
      json(403, {
        erro: {
          codigo: 'SEM_PERMISSAO',
          mensagem: 'Você não tem permissão para isso.',
          detalhes: [],
          requestId: 'R',
        },
      }),
    )
    await expect(chamarMe()).rejects.toMatchObject({ status: 403 })
    expect(chamadasA('/api/v1/auth/refresh')).toHaveLength(0)
    expect(useSessao.getState().sessao).toEqual(SESSAO)
  })
})

describe('saída e troca de senha', () => {
  beforeEach(() => useSessao.setState({ token: 'acesso-1', sessao: SESSAO }))

  it('sair avisa a API com o token e esquece a sessão e os dados carregados', async () => {
    queryClient.setQueryData(['contatos'], ['telefones'])
    rotas.set('POST /api/v1/auth/logout', semConteudo)
    await auth.sair()
    expect(bearer(chamadasA('/api/v1/auth/logout')[0]!)).toBe('Bearer acesso-1')
    expect(useSessao.getState()).toMatchObject({ token: null, sessao: null })
    expect(queryClient.getQueryData(['contatos'])).toBeUndefined()
  })

  it('sair sem rede também encerra a sessão nesta aba', async () => {
    rotas.set('POST /api/v1/auth/logout', () => {
      throw new TypeError('Failed to fetch')
    })
    await expect(auth.sair()).resolves.toBeUndefined()
    expect(useSessao.getState().sessao).toBeNull()
  })

  it('troca a senha com o token e relê a sessão, já sem o trocarSenha', async () => {
    useSessao.setState({ sessao: { ...SESSAO, usuario: { ...SESSAO.usuario, trocarSenha: true } } })
    rotas.set('PATCH /api/v1/auth/senha', (p) =>
      bearer(p) === 'Bearer acesso-1' ? semConteudo() : naoAutenticado(),
    )
    rotas.set('GET /api/v1/auth/me', () => json(200, { data: SESSAO }))
    await auth.trocarSenha({ senhaAtual: 'provisoria-1', novaSenha: 'senha-nova-de-teste-2' })
    expect(await chamadasA('/api/v1/auth/senha')[0]!.json()).toEqual({
      senhaAtual: 'provisoria-1',
      novaSenha: 'senha-nova-de-teste-2',
    })
    expect(useSessao.getState().sessao?.usuario.trocarSenha).toBe(false)
  })
})

import { beforeAll, describe, expect, it } from 'vitest'
import type { IndicadoresTv, TelaTv } from '@/lib/api/tipos'
import { useSessao } from '@/stores/sessao'
import { erroDaApi, json, semConteudo, TOKEN, usarApiFalsa } from '@/test/api-falsa'

const INDICADORES = 'GET /api/v1/tv/indicadores'
const falsa = usarApiFalsa({ semSessao: [INDICADORES] })
let tv: typeof import('./api')
beforeAll(async () => {
  tv = await import('./api')
})

const TOKEN_DA_TELA = 'jIWDi92T12y8w3ZdkfQFXBxKOtO28BLzEKAK84UyMNs'
const RECEPCAO: TelaTv = { id: 3, nome: 'Recepção principal', ativa: true, ultimoAcessoEm: null }
const NUMEROS: IndicadoresTv = {
  tela: 'Recepção principal',
  geradoEm: '2026-11-25T15:00:00.000Z',
  mes: { nps: 42, total: 134, promotores: 78, neutros: 34, detratores: 22, mediaEscala: 4.3 },
  npsPorSetor: [{ setor: 'Pediatria', nps: 71, total: 28 }],
  evolucao: [{ periodo: '2026-11-23', nps: 40, total: 12 }],
  destaques: [{ setor: 'Pediatria', categoria: 'Enfermagem', media: 4.8, percentual45: 96 }],
}

/** Como a API: só o token de uma tela ativa abre os números. */
const indicadores = (pedido: Request) =>
  pedido.headers.get('X-Tv-Token') === TOKEN_DA_TELA
    ? json(200, { data: NUMEROS })
    : erroDaApi(401, 'NAO_AUTENTICADO', 'Esta tela não está ativa.')

describe('tela da TV na API', () => {
  it('busca os números com o token do link no X-Tv-Token, sem a sessão do painel', async () => {
    let autorizacao: string | null = 'não conferida'
    falsa.rotas.set(INDICADORES, (pedido) => {
      autorizacao = pedido.headers.get('Authorization')
      return indicadores(pedido)
    })
    await expect(tv.buscarIndicadoresTv(TOKEN_DA_TELA)).resolves.toEqual(NUMEROS)
    await falsa.conferirChamada(INDICADORES)
    expect(autorizacao).toBeNull()
  })

  it('o token de uma tela desativada chega como 401, sem renovar nem encerrar a sessão do painel', async () => {
    falsa.rotas.set(INDICADORES, indicadores)
    await expect(tv.buscarIndicadoresTv('token-de-tela-desativada')).rejects.toMatchObject({
      status: 401,
      codigo: 'NAO_AUTENTICADO',
      message: 'Esta tela não está ativa.',
    })
    // uma chamada só: nenhum POST /auth/refresh
    await falsa.conferirChamada(INDICADORES)
    expect(useSessao.getState().token).toBe(TOKEN)
  })
})

describe('gestão das telas na API', () => {
  it('lista as telas com o token da sessão', async () => {
    falsa.rotas.set('GET /api/v1/tv-telas', () => json(200, { data: [RECEPCAO] }))
    await expect(tv.listarTelas()).resolves.toEqual([RECEPCAO])
    await falsa.conferirChamada('GET /api/v1/tv-telas')
  })

  it('cria a tela pelo nome e devolve o token do link, que só vem nesta resposta', async () => {
    falsa.rotas.set('POST /api/v1/tv-telas', () =>
      json(201, { data: { tela: RECEPCAO, token: TOKEN_DA_TELA } }),
    )
    await expect(tv.criarTela('Recepção principal')).resolves.toEqual({
      tela: RECEPCAO,
      token: TOKEN_DA_TELA,
    })
    await falsa.conferirChamada('POST /api/v1/tv-telas', { nome: 'Recepção principal' })
  })

  it('o nome recusado chega com o campo e a mensagem da API', async () => {
    const detalhes = [{ campo: 'nome', mensagem: 'Informe onde a tela fica' }]
    falsa.rotas.set('POST /api/v1/tv-telas', () => erroDaApi(400, 'VALIDACAO', 'Dados inválidos', detalhes))
    await expect(tv.criarTela(' ')).rejects.toMatchObject({ status: 400, codigo: 'VALIDACAO', detalhes })
  })

  it('desativa e ativa de novo com o 204 da API', async () => {
    falsa.rotas.set('PATCH /api/v1/tv-telas/3/status', semConteudo)
    await expect(tv.alterarStatusTela(3, false)).resolves.toBeUndefined()
    await falsa.conferirChamada('PATCH /api/v1/tv-telas/3/status', { ativa: false })
  })
})

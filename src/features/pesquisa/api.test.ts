import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

// O cliente da API guarda o fetch e a origem da página ao ser criado: os dois são trocados antes de importar.
const chamadas: Request[] = []
let resposta: () => Response
const fetchFalso = vi.fn(async (pedido: Request) => {
  chamadas.push(pedido)
  return resposta()
})

let api: typeof import('./api')
beforeAll(async () => {
  vi.stubGlobal('location', { origin: 'http://site.teste' })
  vi.stubGlobal('fetch', fetchFalso)
  api = await import('./api')
})
afterAll(() => vi.unstubAllGlobals())
beforeEach(() => {
  chamadas.length = 0
})

const json = (status: number, corpo: unknown) =>
  new Response(JSON.stringify(corpo), { status, headers: { 'Content-Type': 'application/json' } })

describe('rotas públicas da pesquisa', () => {
  it('abre a pesquisa do setor no mesmo domínio do site', async () => {
    resposta = () =>
      json(200, { data: { setor: { nome: 'Pronto Atendimento', slug: 'pronto-atendimento' } } })
    const pesquisa = await api.buscarPesquisa('pronto-atendimento')
    expect(pesquisa.setor.nome).toBe('Pronto Atendimento')
    expect(chamadas[0]!.method).toBe('GET')
    expect(chamadas[0]!.url).toBe('http://site.teste/api/v1/publico/setores/pronto-atendimento/pesquisa')
  })

  it('envia a avaliação com o campo isca e devolve o que a API gravou', async () => {
    const criada = {
      id: 845,
      classificacao: 'BAIXA',
      tokenComplemento: 'tk',
      expiraEm: '2026-11-10T14:52:00Z',
    }
    resposta = () => json(201, { data: criada })
    const corpo = {
      chaveIdempotencia: '4b7e0c1a-9d2f-4c11-8a35-1f0e6b2d7c90',
      canal: 'WEB' as const,
      dataAtendimento: '2026-11-10',
      turnoId: 1,
      itens: [],
      nps: 6,
      site: '',
    }
    await expect(api.enviarResposta('pronto-atendimento', corpo)).resolves.toEqual(criada)
    const pedido = chamadas[0]!
    expect([pedido.method, pedido.url]).toEqual([
      'POST',
      'http://site.teste/api/v1/publico/setores/pronto-atendimento/respostas',
    ])
    expect(pedido.headers.get('Content-Type')).toBe('application/json')
    expect(await pedido.json()).toEqual(corpo)
  })

  it('manda o complemento com o token no cabeçalho, numa requisição que sobrevive ao fechar a página', async () => {
    resposta = () => new Response(null, { status: 204 })
    const corpo = { comentario: { tipo: 'RECLAMACAO' as const, texto: 'Esperei muito na triagem.' } }
    await expect(api.enviarComplemento(845, 'token-do-envio', corpo)).resolves.toBeUndefined()
    const pedido = chamadas[0]!
    expect([pedido.method, pedido.url]).toEqual([
      'POST',
      'http://site.teste/api/v1/publico/respostas/845/complemento',
    ])
    expect(pedido.headers.get('X-Complemento-Token')).toBe('token-do-envio')
    expect(pedido.keepalive).toBe(true)
    expect(await pedido.json()).toEqual(corpo)
  })

  it('o prazo vencido do complemento chega como o 401 da API', async () => {
    resposta = () =>
      json(401, {
        erro: {
          codigo: 'NAO_AUTENTICADO',
          mensagem: 'O prazo para complementar esta avaliação terminou.',
          detalhes: [],
          requestId: 'R3',
        },
      })
    await expect(
      api.enviarComplemento(845, 'vencido', { comentario: { tipo: 'OUTRO', texto: 'x' } }),
    ).rejects.toMatchObject({
      status: 401,
      codigo: 'NAO_AUTENTICADO',
      requestId: 'R3',
    })
  })
})

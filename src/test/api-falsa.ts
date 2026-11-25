// API de mentira para os testes dos api.ts do painel. Só os testes importam este arquivo.
import { afterAll, beforeAll, beforeEach, expect, vi } from 'vitest'
import type { CodigoErro } from '@/lib/api/erro'
import type { DetalheErro } from '@/lib/api/tipos'
import { useSessao } from '@/stores/sessao'

type Rota = (pedido: Request) => Response | Promise<Response>

export const TOKEN = 'acesso-1'

export const json = (status: number, corpo: unknown) =>
  new Response(JSON.stringify(corpo), { status, headers: { 'Content-Type': 'application/json' } })

export const semConteudo = () => new Response(null, { status: 204 })

/** Resposta de erro no formato padrão da API. */
export const erroDaApi = (
  status: number,
  codigo: CodigoErro,
  mensagem: string,
  detalhes: DetalheErro[] = [],
) => json(status, { erro: { codigo, mensagem, detalhes, requestId: 'R' } })

/**
 * Troca o fetch e a origem da página antes de o cliente da API ser importado (ele guarda os dois ao ser
 * criado) e deixa uma sessão aberta, com o token `TOKEN`. Por isso, o api.ts testado é importado depois,
 * com `await import(...)` num `beforeAll` registrado depois desta chamada.
 *
 * Cada rota é `"MÉTODO /caminho"`. Uma chamada sem rota prevista falha o teste; uma sem o token, leva 401. As
 * rotas de `semSessao` não usam a sessão do painel (a TV entra com o token da tela): recebem o pedido como veio.
 */
export function usarApiFalsa({ semSessao = [] }: { semSessao?: string[] } = {}) {
  const rotas = new Map<string, Rota>()
  const pedidos: Request[] = []

  beforeAll(() => {
    vi.stubGlobal('location', { origin: 'http://site.teste' })
    vi.stubGlobal('fetch', async (pedido: Request) => {
      pedidos.push(pedido)
      const caminho = `${pedido.method} ${new URL(pedido.url).pathname}`
      if (!semSessao.includes(caminho) && pedido.headers.get('Authorization') !== `Bearer ${TOKEN}`) {
        return erroDaApi(401, 'NAO_AUTENTICADO', 'Sua sessão terminou. Entre de novo.')
      }
      const rota = rotas.get(caminho)
      if (!rota) throw new Error(`rota não prevista no teste: ${caminho}`)
      return rota(pedido)
    })
  })
  afterAll(() => vi.unstubAllGlobals())
  beforeEach(() => {
    rotas.clear()
    pedidos.length = 0
    useSessao.setState({ token: TOKEN, sessao: null })
  })

  return {
    rotas,
    /** Confere que houve uma chamada só, com este método, caminho e corpo. */
    async conferirChamada(metodoECaminho: string, corpo?: unknown) {
      expect(pedidos.map((p) => `${p.method} ${new URL(p.url).pathname}`)).toEqual([metodoECaminho])
      const enviado = await pedidos[0]!.clone().text()
      expect(enviado ? JSON.parse(enviado) : undefined).toEqual(corpo)
    },
    /** A query string da chamada, como objeto: os filtros que foram de fato à API. */
    consultaEnviada(): Record<string, string> {
      expect(pedidos).toHaveLength(1)
      return Object.fromEntries(new URL(pedidos[0]!.url).searchParams)
    },
  }
}

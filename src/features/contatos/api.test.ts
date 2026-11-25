import { beforeAll, describe, expect, it } from 'vitest'
import type { PedidoRetorno } from '@/lib/api/tipos'
import { erroDaApi, json, usarApiFalsa } from '@/test/api-falsa'

const falsa = usarApiFalsa()
let contatos: typeof import('./api')
beforeAll(async () => {
  contatos = await import('./api')
})

const PEDIDO: PedidoRetorno = {
  id: 31,
  respostaId: 845,
  setor: 'Pronto Atendimento',
  dataAtendimento: '2026-11-10',
  nps: 3,
  classificacao: 'BAIXA',
  comentario: null,
  telefoneMascarado: '•••• 0042',
  consentimentoEm: '2026-11-10T14:23:00.000Z',
  status: 'NOVO',
}

describe('pedidos de retorno na API', () => {
  it('pede a página com 20 pedidos e devolve o total de todas', async () => {
    const lista = { data: [PEDIDO], meta: { pagina: 2, porPagina: 20, total: 21 } }
    falsa.rotas.set('GET /api/v1/contatos', () => json(200, lista))
    await expect(contatos.listarContatos(2)).resolves.toEqual(lista)
    expect(falsa.consultaEnviada()).toEqual({ pagina: '2', porPagina: '20' })
  })

  it('revela o telefone com um POST sem corpo e devolve só o número', async () => {
    // telefone claramente fictício
    falsa.rotas.set('POST /api/v1/contatos/31/revelar-telefone', () =>
      json(200, { data: { telefone: '51900000042' } }),
    )
    await expect(contatos.revelarTelefone(31)).resolves.toBe('51900000042')
    await falsa.conferirChamada('POST /api/v1/contatos/31/revelar-telefone')
  })

  it('sem contatos:ver, a revelação chega com o 403 da API', async () => {
    const mensagem = 'Você não tem permissão para isso.'
    falsa.rotas.set('POST /api/v1/contatos/31/revelar-telefone', () =>
      erroDaApi(403, 'SEM_PERMISSAO', mensagem),
    )
    await expect(contatos.revelarTelefone(31)).rejects.toMatchObject({ status: 403, message: mensagem })
  })
})

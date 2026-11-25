import { describe, expect, it } from 'vitest'
import { criarCliente, pedir } from './cliente'
import { ErroApi, MENSAGEM_SEM_CONEXAO } from './erro'

const json = (status: number, corpo: unknown, cabecalhos: Record<string, string> = {}) =>
  new Response(JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json', ...cabecalhos },
  })

/** Cliente com um fetch falso, que responde sempre o mesmo. */
const clienteQue = (responder: () => Promise<Response>) =>
  criarCliente({ baseUrl: 'http://api.teste', fetch: responder })

const abrirPesquisa = (cliente: ReturnType<typeof criarCliente>) =>
  pedir(cliente.GET('/api/v1/publico/setores/{slug}/pesquisa', { params: { path: { slug: 'pa' } } }))

async function falhaCom(promessa: Promise<unknown>) {
  const erro = await promessa.then(
    () => expect.unreachable('a chamada devia falhar'),
    (e: unknown) => e,
  )
  expect(erro).toBeInstanceOf(ErroApi)
  return erro as ErroApi
}

describe('cliente da API', () => {
  it('devolve o corpo do sucesso', async () => {
    const corpo = { data: { setor: { nome: 'Pronto Atendimento', slug: 'pa' } } }
    const cliente = clienteQue(async () => json(200, corpo))
    await expect(abrirPesquisa(cliente)).resolves.toEqual(corpo)
  })

  it('converte o erro da API, com o requestId que ela mandou', async () => {
    const cliente = clienteQue(async () =>
      json(
        400,
        {
          erro: {
            codigo: 'VALIDACAO',
            mensagem: 'Dados inválidos',
            detalhes: [{ campo: 'nps', mensagem: 'Obrigatório, de 0 a 10' }],
            requestId: '01JC9W2K7QXZ4N5M8R3T6V0B1D',
          },
        },
        { 'X-Request-Id': '01JC9W2K7QXZ4N5M8R3T6V0B1D' },
      ),
    )
    const erro = await falhaCom(abrirPesquisa(cliente))
    expect(erro).toMatchObject({
      status: 400,
      codigo: 'VALIDACAO',
      message: 'Dados inválidos',
      detalhes: [{ campo: 'nps', mensagem: 'Obrigatório, de 0 a 10' }],
      requestId: '01JC9W2K7QXZ4N5M8R3T6V0B1D',
    })
  })

  it('mantém o status de cada erro do contrato', async () => {
    const cliente = clienteQue(async () =>
      json(404, {
        erro: {
          codigo: 'NAO_ENCONTRADO',
          mensagem: 'Esta pesquisa não está disponível.',
          detalhes: [],
          requestId: 'R1',
        },
      }),
    )
    const erro = await falhaCom(abrirPesquisa(cliente))
    expect([erro.status, erro.codigo, erro.message]).toEqual([
      404,
      'NAO_ENCONTRADO',
      'Esta pesquisa não está disponível.',
    ])
  })

  it('resposta de erro fora do contrato vira erro interno, com o requestId do cabeçalho se houver', async () => {
    // por exemplo, o 502 do Caddy quando a API está fora do ar
    const cliente = clienteQue(
      async () => new Response('<h1>Bad Gateway</h1>', { status: 502, headers: { 'X-Request-Id': 'R2' } }),
    )
    const erro = await falhaCom(abrirPesquisa(cliente))
    expect(erro).toMatchObject({ status: 502, codigo: 'ERRO_INTERNO', detalhes: [], requestId: 'R2' })

    const semCorpo = clienteQue(async () => new Response(null, { status: 500 }))
    expect(await falhaCom(abrirPesquisa(semCorpo))).toMatchObject({ status: 500, requestId: '' })
  })

  it('sem rede, o erro tem status 0 e a mensagem de sem conexão', async () => {
    const cliente = clienteQue(async () => {
      throw new TypeError('Failed to fetch')
    })
    const erro = await falhaCom(abrirPesquisa(cliente))
    expect(erro).toMatchObject({ status: 0, codigo: 'SEM_CONEXAO', requestId: '' })
    expect(erro.message).toBe(MENSAGEM_SEM_CONEXAO)
  })

  it('cancelamento não vira falta de rede', async () => {
    const cancelado = new DOMException('cancelado', 'AbortError')
    const cliente = clienteQue(async () => {
      throw cancelado
    })
    await expect(abrirPesquisa(cliente)).rejects.toBe(cancelado)
  })
})

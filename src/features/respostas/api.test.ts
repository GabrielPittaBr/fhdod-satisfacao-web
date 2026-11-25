import { beforeAll, describe, expect, it } from 'vitest'
import type { RespostaDetalhe, RespostaResumo } from '@/lib/api/tipos'
import { erroDaApi, json, usarApiFalsa } from '@/test/api-falsa'

const falsa = usarApiFalsa()
let respostas: typeof import('./api')
beforeAll(async () => {
  respostas = await import('./api')
})

const RESPOSTA: RespostaResumo = {
  id: 845,
  setorId: 1,
  setor: 'Pronto Atendimento',
  canal: 'TOTEM',
  dataAtendimento: '2026-11-10',
  turno: 'Manhã',
  nps: 3,
  classificacao: 'BAIXA',
  enviadoEm: '2026-11-10T14:22:00.000Z',
  temComentario: true,
  pediuRetorno: true,
}

describe('respostas na API', () => {
  it('lista a página pedida, com os filtros, a ordem e o total', async () => {
    const lista = { data: [RESPOSTA], meta: { pagina: 2, porPagina: 20, total: 134 } }
    falsa.rotas.set('GET /api/v1/respostas', () => json(200, lista))
    await expect(
      respostas.listarRespostas({
        inicio: '2026-11-01',
        fim: '2026-11-30',
        base: 'ATENDIMENTO',
        classificacao: 'BAIXA',
        comComentario: true,
        comRetorno: false,
        pagina: 2,
        porPagina: 20,
        ordenarPor: 'nps',
        ordem: 'asc',
      }),
    ).resolves.toEqual(lista)
    expect(falsa.consultaEnviada()).toEqual({
      inicio: '2026-11-01',
      fim: '2026-11-30',
      base: 'ATENDIMENTO',
      classificacao: 'BAIXA',
      comComentario: 'true',
      comRetorno: 'false',
      pagina: '2',
      porPagina: '20',
      ordenarPor: 'nps',
      ordem: 'asc',
    })
  })

  it('busca o detalhe pelo ID, com o telefone mascarado', async () => {
    const detalhe: RespostaDetalhe = {
      ...RESPOSTA,
      itens: [
        {
          perguntaId: 7,
          perguntaTexto: 'Como você avalia a recepção?',
          categoria: 'Recepção',
          tipo: 'ESCALA_1_5',
          valorNumero: 2,
          valorTexto: null,
          classificacao: 'BAIXA',
        },
      ],
      comentario: { tipo: 'RECLAMACAO', texto: 'Demorou muito.' },
      contato: { id: 31, telefoneMascarado: '•••• 0042', status: 'NOVO' },
    }
    falsa.rotas.set('GET /api/v1/respostas/845', () => json(200, { data: detalhe }))
    await expect(respostas.buscarResposta(845)).resolves.toEqual(detalhe)
    await falsa.conferirChamada('GET /api/v1/respostas/845')
  })

  it('a resposta de um setor de fora chega com o 403 da API', async () => {
    const mensagem = 'Você não tem permissão para isso.'
    falsa.rotas.set('GET /api/v1/respostas/12', () => erroDaApi(403, 'SEM_PERMISSAO', mensagem))
    await expect(respostas.buscarResposta(12)).rejects.toMatchObject({ status: 403, message: mensagem })
  })
})

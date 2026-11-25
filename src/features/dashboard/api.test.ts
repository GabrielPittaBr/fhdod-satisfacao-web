import { beforeAll, describe, expect, it } from 'vitest'
import type { FiltrosDashboard, Resumo } from '@/lib/api/tipos'
import { erroDaApi, json, usarApiFalsa } from '@/test/api-falsa'

const falsa = usarApiFalsa()
let dashboard: typeof import('./api')
beforeAll(async () => {
  dashboard = await import('./api')
})

const NOVEMBRO: FiltrosDashboard = { inicio: '2026-11-01', fim: '2026-11-30', base: 'ATENDIMENTO' }
const RESUMO: Resumo = {
  nps: 42,
  total: 134,
  promotores: 80,
  neutros: 30,
  detratores: 24,
  notasBaixas: 19,
  baixissimas: 4,
  mediaEscala: 4.3,
}

describe('dashboard na API', () => {
  it('pede o resumo com os filtros da tela, sem mandar os vazios', async () => {
    falsa.rotas.set('GET /api/v1/dashboard/resumo', () => json(200, { data: RESUMO }))
    await expect(dashboard.buscarResumo({ ...NOVEMBRO, setorId: undefined })).resolves.toEqual(RESUMO)
    expect(falsa.consultaEnviada()).toEqual({ inicio: '2026-11-01', fim: '2026-11-30', base: 'ATENDIMENTO' })
  })

  it('manda o setor, o turno e o canal escolhidos', async () => {
    falsa.rotas.set('GET /api/v1/dashboard/nps-por-setor', () =>
      json(200, { data: [{ setorId: 3, setor: 'Pediatria', nps: 70, total: 12 }] }),
    )
    const filtros = { ...NOVEMBRO, base: 'ENVIO', setorId: 3, turnoId: 2, canal: 'TOTEM' } as const
    await expect(dashboard.buscarNpsPorSetor(filtros)).resolves.toEqual([
      { setorId: 3, setor: 'Pediatria', nps: 70, total: 12 },
    ])
    expect(falsa.consultaEnviada()).toEqual({
      inicio: '2026-11-01',
      fim: '2026-11-30',
      base: 'ENVIO',
      setorId: '3',
      turnoId: '2',
      canal: 'TOTEM',
    })
  })

  it('pede a evolução na granularidade escolhida', async () => {
    const pontos = [
      { periodo: '2026-10-26', nps: null, total: 0 },
      { periodo: '2026-11-02', nps: 50, total: 8 },
    ]
    falsa.rotas.set('GET /api/v1/dashboard/evolucao', () => json(200, { data: pontos }))
    await expect(dashboard.buscarEvolucao(NOVEMBRO, 'SEMANA')).resolves.toEqual(pontos)
    expect(falsa.consultaEnviada()).toMatchObject({ granularidade: 'SEMANA', inicio: '2026-11-01' })
  })

  it('lê as categorias e o ranking', async () => {
    const categorias = [{ categoriaId: 1, categoria: 'Recepção', media: 4.1, percentual45: 78, total: 40 }]
    falsa.rotas.set('GET /api/v1/dashboard/categorias', () => json(200, { data: categorias }))
    await expect(dashboard.buscarCategorias(NOVEMBRO)).resolves.toEqual(categorias)

    const ranking = { melhores: [], piores: [] }
    falsa.rotas.set('GET /api/v1/dashboard/ranking', () => json(200, { data: ranking }))
    await expect(dashboard.buscarRanking(NOVEMBRO)).resolves.toEqual(ranking)
  })

  it('devolve os comentários com o total do período e filtra pelo tipo', async () => {
    const lista = {
      data: [
        {
          id: 9,
          respostaId: 845,
          tipo: 'ELOGIO',
          texto: 'Equipe muito atenciosa.',
          setor: 'Pediatria',
          dataAtendimento: '2026-11-10',
          enviadoEm: '2026-11-10T14:22:00.000Z',
          classificacao: 'NORMAL',
        },
      ],
      meta: { pagina: 1, porPagina: 8, total: 31 },
    }
    falsa.rotas.set('GET /api/v1/dashboard/comentarios', () => json(200, lista))
    await expect(dashboard.buscarComentarios(NOVEMBRO, 'ELOGIO')).resolves.toEqual(lista)
    expect(falsa.consultaEnviada()).toMatchObject({ tipo: 'ELOGIO' })
  })

  it('o setor de fora chega com o 403 e a mensagem da API', async () => {
    const mensagem = 'Você não tem permissão para isso.'
    falsa.rotas.set('GET /api/v1/dashboard/resumo', () => erroDaApi(403, 'SEM_PERMISSAO', mensagem))
    await expect(dashboard.buscarResumo({ ...NOVEMBRO, setorId: 99 })).rejects.toMatchObject({
      status: 403,
      codigo: 'SEM_PERMISSAO',
      message: mensagem,
    })
  })

  it('a evolução com pontos demais chega com a validação do campo', async () => {
    const detalhe = {
      campo: 'granularidade',
      mensagem: 'Escolha um período de até 366 dias ou veja por semana ou por mês',
    }
    falsa.rotas.set('GET /api/v1/dashboard/evolucao', () =>
      erroDaApi(400, 'VALIDACAO', 'Dados inválidos', [detalhe]),
    )
    const doisAnos = { ...NOVEMBRO, inicio: '2024-11-01' }
    await expect(dashboard.buscarEvolucao(doisAnos, 'DIA')).rejects.toMatchObject({
      status: 400,
      detalhes: [detalhe],
    })
  })
})

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

describe('exportações na API', () => {
  const XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  /** O arquivo como a API manda: o corpo binário, o tipo e o nome no `Content-Disposition`. */
  const arquivo = (conteudo: string, tipo: string, nome: string) =>
    new Response(new TextEncoder().encode(conteudo), {
      status: 200,
      headers: {
        'Content-Type': tipo,
        'Content-Disposition': `attachment; filename="${nome}"`,
        'Cache-Control': 'no-store',
      },
    })

  it('baixa o resumo em Excel com os filtros da tela e o nome que a API deu', async () => {
    falsa.rotas.set('GET /api/v1/exportacoes/resumo.xlsx', () =>
      arquivo('PK planilha', XLSX, 'fhdod-resumo-2026-11-01-a-2026-11-30.xlsx'),
    )
    const filtros = { ...NOVEMBRO, base: 'ENVIO', setorId: 3, turnoId: 2, canal: 'WEB' } as const
    const { nome, conteudo } = await dashboard.exportarResumo(filtros)
    expect(nome).toBe('fhdod-resumo-2026-11-01-a-2026-11-30.xlsx')
    expect(conteudo.type).toBe(XLSX)
    expect(await conteudo.text()).toBe('PK planilha')
    expect(falsa.consultaEnviada()).toEqual({
      inicio: '2026-11-01',
      fim: '2026-11-30',
      base: 'ENVIO',
      setorId: '3',
      turnoId: '2',
      canal: 'WEB',
    })
  })

  it('baixa o resumo em PDF', async () => {
    falsa.rotas.set('GET /api/v1/exportacoes/resumo.pdf', () =>
      arquivo('%PDF-1.7', 'application/pdf', 'fhdod-resumo-2026-11-01-a-2026-11-30.pdf'),
    )
    const { nome, conteudo } = await dashboard.exportarResumoPdf(NOVEMBRO)
    expect([nome, conteudo.type, await conteudo.text()]).toEqual([
      'fhdod-resumo-2026-11-01-a-2026-11-30.pdf',
      'application/pdf',
      '%PDF-1.7',
    ])
    expect(falsa.consultaEnviada()).toEqual({ inicio: '2026-11-01', fim: '2026-11-30', base: 'ATENDIMENTO' })
  })

  it('baixa as respostas em Excel', async () => {
    falsa.rotas.set('GET /api/v1/exportacoes/respostas.xlsx', () =>
      arquivo('PK respostas', XLSX, 'fhdod-respostas-2026-11-01-a-2026-11-30.xlsx'),
    )
    const { nome, conteudo } = await dashboard.exportarRespostas(NOVEMBRO)
    expect([nome, await conteudo.text()]).toEqual([
      'fhdod-respostas-2026-11-01-a-2026-11-30.xlsx',
      'PK respostas',
    ])
    expect(falsa.consultaEnviada()).toMatchObject({ inicio: '2026-11-01', fim: '2026-11-30' })
  })

  it('quem não tem a permissão recebe o 403 com a mensagem da API, sem arquivo', async () => {
    const mensagem = 'Você não tem permissão para isso.'
    falsa.rotas.set('GET /api/v1/exportacoes/respostas.xlsx', () => erroDaApi(403, 'SEM_PERMISSAO', mensagem))
    await expect(dashboard.exportarRespostas(NOVEMBRO)).rejects.toMatchObject({
      status: 403,
      codigo: 'SEM_PERMISSAO',
      message: mensagem,
    })
  })
})

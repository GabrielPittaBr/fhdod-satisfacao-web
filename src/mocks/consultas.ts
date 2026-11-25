// Dados simulados que ainda não vêm da API: a exportação (até o ticket 09) e os indicadores da TV (até o 08).
// O dashboard, as respostas e os pedidos de retorno já são da API (ticket 07).
// O escopo por setor é aplicado aqui dentro, como a API faz na própria consulta.
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  format,
  parseISO,
  startOfMonth,
  startOfWeek,
  subDays,
} from 'date-fns'
import type {
  Envelope,
  FiltrosDashboard,
  Granularidade,
  IndicadorCategoria,
  IndicadoresTv,
  ItemRanking,
  NpsSetor,
  PontoEvolucao,
  Resumo,
} from '@/lib/api/tipos'
import { autenticar, exigir, exigirSetor, type Contexto } from './auth'
import { banco, salvar, todasAsRespostas, type RespostaBanco } from './banco'
import { calcularNps } from './regras'
import { erros, rede } from './rede'

const iso = (data: Date) => format(data, 'yyyy-MM-dd')
const nomeDoSetor = (id: number) => banco.setores.find((s) => s.id === id)?.nome ?? 'Setor removido'
const nomeDaCategoria = (id: number) => banco.categorias.find((c) => c.id === id)?.nome ?? 'Sem categoria'
const nomeDoTurno = (id: number) => banco.turnos.find((t) => t.id === id)?.nome ?? '—'
const media = (valores: number[]) =>
  valores.length ? Math.round((valores.reduce((a, b) => a + b, 0) / valores.length) * 10) / 10 : null

// Map.groupBy ainda falta em navegadores de TV e totem mais antigos
function agrupar<T, K>(itens: T[], chave: (item: T) => K): Map<K, T[]> {
  const grupos = new Map<K, T[]>()
  for (const item of itens) grupos.set(chave(item), [...(grupos.get(chave(item)) ?? []), item])
  return grupos
}

function filtrar(setorIds: number[] | null, f: Partial<FiltrosDashboard>): RespostaBanco[] {
  return todasAsRespostas().filter((r) => {
    if (setorIds && !setorIds.includes(r.setorId)) return false
    if (f.setorId && r.setorId !== f.setorId) return false
    if (f.turnoId && r.turnoId !== f.turnoId) return false
    if (f.canal && r.canal !== f.canal) return false
    const data = f.base === 'ENVIO' ? iso(new Date(r.enviadoEm)) : r.dataAtendimento
    return (!f.inicio || data >= f.inicio) && (!f.fim || data <= f.fim)
  })
}

function resumir(respostas: RespostaBanco[]): Resumo {
  const notas = respostas.flatMap((r) => r.itens.flatMap((i) => i.valorNumero ?? []))
  return {
    nps: calcularNps(respostas.map((r) => r.nps)),
    total: respostas.length,
    promotores: respostas.filter((r) => r.nps >= 9).length,
    neutros: respostas.filter((r) => r.nps === 7 || r.nps === 8).length,
    detratores: respostas.filter((r) => r.nps <= 6).length,
    notasBaixas: respostas.filter((r) => r.classificacao !== 'NORMAL').length,
    baixissimas: respostas.filter((r) => r.classificacao === 'BAIXISSIMA').length,
    mediaEscala: media(notas),
  }
}

function porSetor(respostas: RespostaBanco[]): NpsSetor[] {
  const grupos = agrupar(respostas, (r) => r.setorId)
  return [...grupos]
    .map(([setorId, grupo]) => ({
      setorId,
      setor: nomeDoSetor(setorId),
      nps: calcularNps(grupo.map((r) => r.nps)),
      total: grupo.length,
    }))
    .sort((a, b) => (b.nps ?? -101) - (a.nps ?? -101))
}

function evoluir(
  respostas: RespostaBanco[],
  f: FiltrosDashboard,
  granularidade: Granularidade,
): PontoEvolucao[] {
  const intervalo = { start: parseISO(f.inicio), end: parseISO(f.fim) }
  const inicioDoPeriodo = (data: Date) =>
    granularidade === 'DIA'
      ? data
      : granularidade === 'SEMANA'
        ? startOfWeek(data, { weekStartsOn: 1 })
        : startOfMonth(data)
  const periodos =
    granularidade === 'DIA'
      ? eachDayOfInterval(intervalo)
      : granularidade === 'SEMANA'
        ? eachWeekOfInterval(intervalo, { weekStartsOn: 1 })
        : eachMonthOfInterval(intervalo)
  const grupos = agrupar(respostas, (r) =>
    iso(inicioDoPeriodo(f.base === 'ENVIO' ? new Date(r.enviadoEm) : parseISO(r.dataAtendimento))),
  )
  return periodos.map((data) => {
    const grupo = grupos.get(iso(data)) ?? []
    return { periodo: iso(data), nps: calcularNps(grupo.map((r) => r.nps)), total: grupo.length }
  })
}

/** Notas de 1 a 5 agrupadas por setor e categoria. */
function notasPorPonto(respostas: RespostaBanco[]): ItemRanking[] {
  const grupos = new Map<string, { setorId: number; categoriaId: number; notas: number[] }>()
  for (const r of respostas) {
    for (const item of r.itens) {
      if (item.valorNumero === null) continue
      const chave = `${r.setorId}:${item.categoriaId}`
      const grupo = grupos.get(chave) ?? { setorId: r.setorId, categoriaId: item.categoriaId, notas: [] }
      grupo.notas.push(item.valorNumero)
      grupos.set(chave, grupo)
    }
  }
  return [...grupos.values()].map(({ setorId, categoriaId, notas }) => ({
    setorId,
    setor: nomeDoSetor(setorId),
    categoriaId,
    categoria: nomeDaCategoria(categoriaId),
    media: media(notas)!,
    percentual45: Math.round((notas.filter((n) => n >= 4).length / notas.length) * 100),
    total: notas.length,
  }))
}

function porCategoria(respostas: RespostaBanco[]): IndicadorCategoria[] {
  return banco.categorias
    .slice()
    .sort((a, b) => a.ordem - b.ordem)
    .map((categoria) => {
      const notas = respostas.flatMap((r) =>
        r.itens.flatMap((i) =>
          i.categoriaId === categoria.id && i.valorNumero !== null ? [i.valorNumero] : [],
        ),
      )
      return {
        categoriaId: categoria.id,
        categoria: categoria.nome,
        media: media(notas),
        percentual45: notas.length
          ? Math.round((notas.filter((n) => n >= 4).length / notas.length) * 100)
          : null,
        total: notas.length,
      }
    })
    .filter((c) => c.total > 0)
}

/** TV: o ponto mais bem avaliado de cada setor (até três), para o destaque não ficar num setor só. */
function destaquesPorSetor(respostas: RespostaBanco[]): IndicadoresTv['destaques'] {
  const destaques: IndicadoresTv['destaques'] = []
  const pontos = notasPorPonto(respostas)
    .filter((p) => p.total >= 5)
    .sort((a, b) => b.media - a.media || b.total - a.total)
  for (const { setor, categoria, media, percentual45 } of pontos) {
    if (destaques.length < 3 && !destaques.some((d) => d.setor === setor))
      destaques.push({ setor, categoria, media, percentual45 })
  }
  return destaques
}

function contextoDoDashboard(token: string, f: Partial<FiltrosDashboard>): Contexto {
  const contexto = autenticar(token)
  exigir(contexto, 'dashboard:ver')
  if (f.setorId) exigirSetor(contexto, f.setorId)
  return contexto
}

// ---------- Exportação ----------
// O sistema real gera .xlsx na API; aqui sai um CSV que o Excel abre (ponto e vírgula + BOM).

const csv = (linhas: (string | number | null)[][]) =>
  '﻿' +
  linhas
    .map((linha) => linha.map((celula) => `"${String(celula ?? '').replaceAll('"', '""')}"`).join(';'))
    .join('\r\n')

const descreverFiltros = (f: FiltrosDashboard) => [
  ['Período', `${f.inicio} a ${f.fim}`],
  ['Data considerada', f.base === 'ENVIO' ? 'Data do envio' : 'Data do atendimento'],
  ['Setor', f.setorId ? nomeDoSetor(f.setorId) : 'Todos os que você acessa'],
  ['Turno', f.turnoId ? nomeDoTurno(f.turnoId) : 'Todos'],
  ['Canal', f.canal ?? 'Todos'],
]

/** GET /exportacoes/resumo.xlsx */
export async function exportarResumo(
  token: string,
  f: FiltrosDashboard,
): Promise<{ nomeArquivo: string; conteudo: string }> {
  await rede()
  const contexto = contextoDoDashboard(token, f)
  exigir(contexto, 'exportacao:resumo')
  const respostas = filtrar(contexto.setorIds, f)
  const r = resumir(respostas)
  return {
    nomeArquivo: `fhdod-resumo-${f.inicio}-a-${f.fim}.csv`,
    conteudo: csv([
      ['Resumo da pesquisa de satisfação'],
      ...descreverFiltros(f),
      [],
      ['Indicador', 'Valor'],
      ['NPS', r.nps],
      ['Respostas', r.total],
      ['Promotores (9 e 10)', r.promotores],
      ['Neutros (7 e 8)', r.neutros],
      ['Detratores (0 a 6)', r.detratores],
      ['Avaliações com nota baixa', r.notasBaixas],
      ['Média das notas de 1 a 5', r.mediaEscala],
      [],
      ['Setor', 'NPS', 'Respostas'],
      ...porSetor(respostas).map((s) => [s.setor, s.nps, s.total]),
      [],
      ['Categoria', 'Média (1 a 5)', '% de notas 4 e 5', 'Notas'],
      ...porCategoria(respostas).map((c) => [c.categoria, c.media, c.percentual45, c.total]),
    ]),
  }
}

/** GET /exportacoes/respostas.xlsx */
export async function exportarRespostas(
  token: string,
  f: FiltrosDashboard,
): Promise<{ nomeArquivo: string; conteudo: string }> {
  await rede()
  const contexto = contextoDoDashboard(token, f)
  exigir(contexto, 'exportacao:detalhada')
  // telefones só para quem tem contatos:ver
  const comTelefone = contexto.permissoes.includes('contatos:ver')
  const respostas = filtrar(contexto.setorIds, f).sort((a, b) => b.enviadoEm.localeCompare(a.enviadoEm))
  if (comTelefone) {
    banco.auditoria.push({
      em: new Date().toISOString(),
      usuarioId: contexto.usuarioId,
      acao: 'exportacao.respostas_com_telefone',
      entidadeId: 0,
    })
    salvar()
  }
  return {
    nomeArquivo: `fhdod-respostas-${f.inicio}-a-${f.fim}.csv`,
    conteudo: csv([
      [
        'Código',
        'Setor',
        'Data do atendimento',
        'Turno',
        'Canal',
        'Enviada em',
        'Nota de recomendação (0 a 10)',
        'Classificação',
        'Notas de 1 a 5',
        'Tipo do comentário',
        'Comentário',
        ...(comTelefone ? ['Telefone para retorno'] : []),
      ],
      ...respostas.map((r) => [
        r.id,
        nomeDoSetor(r.setorId),
        r.dataAtendimento,
        nomeDoTurno(r.turnoId),
        r.canal,
        format(new Date(r.enviadoEm), 'yyyy-MM-dd HH:mm'),
        r.nps,
        r.classificacao,
        r.itens
          .flatMap((i) =>
            i.valorNumero === null ? [] : [`${nomeDaCategoria(i.categoriaId)}: ${i.valorNumero}`],
          )
          .join(' | '),
        r.comentario?.tipo ?? '',
        r.comentario?.texto ?? '',
        ...(comTelefone ? [r.contato?.telefone ?? ''] : []),
      ]),
    ]),
  }
}

// ---------- TV Wall ----------

/** GET /tv/indicadores (token da tela). Só números agregados: nada de comentário ou telefone. */
export async function indicadoresTv(tokenDaTela: string): Promise<Envelope<IndicadoresTv>> {
  await rede()
  const tela = banco.tvTelas.find((t) => t.token === tokenDaTela)
  if (!tela?.ativa) throw erros.naoAutenticado('Esta tela não está ativa.')

  const agora = new Date()
  if (!tela.ultimoAcessoEm || agora.getTime() - new Date(tela.ultimoAcessoEm).getTime() > 5 * 60 * 1000) {
    tela.ultimoAcessoEm = agora.toISOString()
    salvar()
  }

  const hoje = iso(agora)
  const doMes = filtrar(null, { inicio: iso(startOfMonth(agora)), fim: hoje })
  const semanas: FiltrosDashboard = {
    inicio: iso(startOfWeek(subDays(agora, 77), { weekStartsOn: 1 })),
    fim: hoje,
    base: 'ATENDIMENTO',
  }
  const { nps, total, promotores, neutros, detratores, mediaEscala } = resumir(doMes)

  return {
    data: {
      tela: tela.nome,
      geradoEm: agora.toISOString(),
      mes: { nps, total, promotores, neutros, detratores, mediaEscala },
      npsPorSetor: porSetor(doMes).map(({ setor, nps, total }) => ({ setor, nps, total })),
      evolucao: evoluir(filtrar(null, semanas), semanas, 'SEMANA'),
      destaques: destaquesPorSetor(filtrar(null, { inicio: iso(subDays(agora, 30)), fim: hoje })),
    },
  }
}

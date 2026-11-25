// Dados simulados que ainda não vêm da API: só a exportação, até o ticket 09. O dashboard, as respostas e os
// pedidos de retorno já são da API (ticket 07), e a TV também (ticket 08).
// O escopo por setor é aplicado aqui dentro, como a API faz na própria consulta.
import { format } from 'date-fns'
import type { FiltrosDashboard, IndicadorCategoria, NpsSetor, Resumo } from '@/lib/api/tipos'
import { autenticar, exigir, exigirSetor, type Contexto } from './auth'
import { banco, salvar, todasAsRespostas, type RespostaBanco } from './banco'
import { calcularNps } from './regras'
import { rede } from './rede'

const iso = (data: Date) => format(data, 'yyyy-MM-dd')
const nomeDoSetor = (id: number) => banco.setores.find((s) => s.id === id)?.nome ?? 'Setor removido'
const nomeDaCategoria = (id: number) => banco.categorias.find((c) => c.id === id)?.nome ?? 'Sem categoria'
const nomeDoTurno = (id: number) => banco.turnos.find((t) => t.id === id)?.nome ?? '—'
const media = (valores: number[]) =>
  valores.length ? Math.round((valores.reduce((a, b) => a + b, 0) / valores.length) * 10) / 10 : null

// Map.groupBy ainda falta em navegadores de totem mais antigos
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

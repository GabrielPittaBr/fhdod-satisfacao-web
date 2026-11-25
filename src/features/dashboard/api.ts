// Leituras do dashboard, na API. Todos os blocos recebem os mesmos filtros, e a API aplica o escopo da sessão:
// o Gestor e o Visualizador veem só os seus setores, mesmo sem pedir um. A exportação continua simulada até o
// ticket 09.
import { comToken, pedirComToken } from '@/features/auth/api'
import { api } from '@/lib/api/cliente'
import type { FiltrosDashboard, Granularidade, TipoComentario } from '@/lib/api/tipos'
import * as mock from '@/mocks/consultas'

/** GET /dashboard/resumo */
export const buscarResumo = async (filtros: FiltrosDashboard) =>
  (
    await pedirComToken((headers) =>
      api.GET('/api/v1/dashboard/resumo', { params: { query: filtros }, headers }),
    )
  ).data

/** GET /dashboard/nps-por-setor (só os setores com respostas no período) */
export const buscarNpsPorSetor = async (filtros: FiltrosDashboard) =>
  (
    await pedirComToken((headers) =>
      api.GET('/api/v1/dashboard/nps-por-setor', { params: { query: filtros }, headers }),
    )
  ).data

/** GET /dashboard/evolucao (um ponto por período, também os sem resposta) */
export const buscarEvolucao = async (filtros: FiltrosDashboard, granularidade: Granularidade) =>
  (
    await pedirComToken((headers) =>
      api.GET('/api/v1/dashboard/evolucao', { params: { query: { ...filtros, granularidade } }, headers }),
    )
  ).data

/** GET /dashboard/categorias */
export const buscarCategorias = async (filtros: FiltrosDashboard) =>
  (
    await pedirComToken((headers) =>
      api.GET('/api/v1/dashboard/categorias', { params: { query: filtros }, headers }),
    )
  ).data

/** GET /dashboard/ranking */
export const buscarRanking = async (filtros: FiltrosDashboard) =>
  (
    await pedirComToken((headers) =>
      api.GET('/api/v1/dashboard/ranking', { params: { query: filtros }, headers }),
    )
  ).data

/** GET /dashboard/comentarios: os mais novos (8 por página) e, em `meta.total`, quantos há no período. */
export const buscarComentarios = (filtros: FiltrosDashboard, tipo?: TipoComentario) =>
  pedirComToken((headers) =>
    api.GET('/api/v1/dashboard/comentarios', { params: { query: { ...filtros, tipo } }, headers }),
  )

/** GET /exportacoes/resumo.xlsx (no mock, um CSV que o Excel abre) */
export const exportarResumo = (f: FiltrosDashboard) => comToken((t) => mock.exportarResumo(t, f))
/** GET /exportacoes/respostas.xlsx */
export const exportarRespostas = (f: FiltrosDashboard) => comToken((t) => mock.exportarRespostas(t, f))

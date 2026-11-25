// Leituras do dashboard, na API. Todos os blocos recebem os mesmos filtros, e a API aplica o escopo da sessão:
// o Gestor e o Visualizador veem só os seus setores, mesmo sem pedir um. As exportações também, em Excel e PDF.
import { pedirArquivoComToken, pedirComToken } from '@/features/auth/api'
import { api } from '@/lib/api/cliente'
import type { FiltrosDashboard, Granularidade, TipoComentario } from '@/lib/api/tipos'

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

// As exportações levam os mesmos filtros dos blocos, e a API aplica o mesmo escopo. O arquivo vem com o nome que a
// API deu a ele; o nome padrão só vale se o `Content-Disposition` não chegar.

/** GET /exportacoes/resumo.xlsx */
export const exportarResumo = (filtros: FiltrosDashboard) =>
  pedirArquivoComToken(
    (headers) =>
      api.GET('/api/v1/exportacoes/resumo.xlsx', { params: { query: filtros }, headers, parseAs: 'blob' }),
    'fhdod-resumo.xlsx',
  )

/** GET /exportacoes/resumo.pdf */
export const exportarResumoPdf = (filtros: FiltrosDashboard) =>
  pedirArquivoComToken(
    (headers) =>
      api.GET('/api/v1/exportacoes/resumo.pdf', { params: { query: filtros }, headers, parseAs: 'blob' }),
    'fhdod-resumo.pdf',
  )

/** GET /exportacoes/respostas.xlsx (com o telefone só para quem tem `contatos:ver`: quem decide é a API) */
export const exportarRespostas = (filtros: FiltrosDashboard) =>
  pedirArquivoComToken(
    (headers) =>
      api.GET('/api/v1/exportacoes/respostas.xlsx', { params: { query: filtros }, headers, parseAs: 'blob' }),
    'fhdod-respostas.xlsx',
  )

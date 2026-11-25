// Respostas, na API: a lista com filtros, ordem e página, e o detalhe. Exigem `respostas:ver`, e o Gestor vê
// só as dos seus setores. O telefone nunca vem completo daqui.
import { pedirComToken } from '@/features/auth/api'
import { api } from '@/lib/api/cliente'
import type { FiltrosRespostas } from '@/lib/api/tipos'

/** GET /respostas (a página pedida e, em `meta.total`, quantas há com estes filtros) */
export const listarRespostas = (filtros: FiltrosRespostas) =>
  pedirComToken((headers) => api.GET('/api/v1/respostas', { params: { query: filtros }, headers }))

/** GET /respostas/:id */
export const buscarResposta = async (id: number) =>
  (await pedirComToken((headers) => api.GET('/api/v1/respostas/{id}', { params: { path: { id } }, headers })))
    .data

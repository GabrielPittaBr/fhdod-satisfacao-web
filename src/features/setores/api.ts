// Setores, na API. Qualquer perfil lista os setores que enxerga; só o Super Admin cria, edita e desativa.
import { pedirComToken } from '@/features/auth/api'
import { api } from '@/lib/api/cliente'
import type { CorpoDe } from '@/lib/api/tipos'

export type DadosSetor = CorpoDe<'/api/v1/setores', 'post'>

/** GET /setores (só os que o usuário enxerga, ativos e inativos, em ordem alfabética) */
export const listarSetores = async () =>
  (await pedirComToken((headers) => api.GET('/api/v1/setores', { headers }))).data

/** POST /setores */
export const criarSetor = async (dados: DadosSetor) =>
  (await pedirComToken((headers) => api.POST('/api/v1/setores', { body: dados, headers }))).data

/** PATCH /setores/:id (só os campos enviados mudam) */
export const editarSetor = async (id: number, dados: CorpoDe<'/api/v1/setores/{id}', 'patch'>) =>
  (
    await pedirComToken((headers) =>
      api.PATCH('/api/v1/setores/{id}', { params: { path: { id } }, body: dados, headers }),
    )
  ).data

/** PATCH /setores/:id/status */
export const alterarStatusSetor = async (id: number, ativo: boolean) => {
  await pedirComToken((headers) =>
    api.PATCH('/api/v1/setores/{id}/status', { params: { path: { id } }, body: { ativo }, headers }),
  )
}

// Categorias e turnos, na API. Qualquer perfil lista; só o Super Admin cria e edita.
import { pedirComToken } from '@/features/auth/api'
import { api } from '@/lib/api/cliente'
import type { CorpoDe } from '@/lib/api/tipos'

export type DadosTurno = CorpoDe<'/api/v1/turnos', 'post'>

/** GET /categorias (ativas e inativas, na ordem) */
export const listarCategorias = async () =>
  (await pedirComToken((headers) => api.GET('/api/v1/categorias', { headers }))).data

/** POST /categorias */
export const criarCategoria = async (nome: string) =>
  (await pedirComToken((headers) => api.POST('/api/v1/categorias', { body: { nome }, headers }))).data

/** PATCH /categorias/:id (edita ou desativa) */
export const editarCategoria = async (id: number, dados: CorpoDe<'/api/v1/categorias/{id}', 'patch'>) =>
  (
    await pedirComToken((headers) =>
      api.PATCH('/api/v1/categorias/{id}', { params: { path: { id } }, body: dados, headers }),
    )
  ).data

/** GET /turnos (na ordem) */
export const listarTurnos = async () =>
  (await pedirComToken((headers) => api.GET('/api/v1/turnos', { headers }))).data

/** POST /turnos */
export const criarTurno = async (dados: DadosTurno) =>
  (await pedirComToken((headers) => api.POST('/api/v1/turnos', { body: dados, headers }))).data

/** PATCH /turnos/:id (o turno inteiro: o nome e os dois horários) */
export const editarTurno = async (id: number, dados: DadosTurno) =>
  (
    await pedirComToken((headers) =>
      api.PATCH('/api/v1/turnos/{id}', { params: { path: { id } }, body: dados, headers }),
    )
  ).data

// Perguntas do setor, na API. O Super Admin mexe nas de qualquer setor; o Gestor, só nas dos seus.
import { pedirComToken } from '@/features/auth/api'
import { api } from '@/lib/api/cliente'
import type { CorpoDe } from '@/lib/api/tipos'

/** A pergunta inteira, na criação e na edição. */
export type DadosPergunta = CorpoDe<'/api/v1/setores/{setorId}/perguntas', 'post'>

/** GET /setores/:setorId/perguntas (ativas e inativas, na ordem da pesquisa) */
export const listarPerguntas = async (setorId: number) =>
  (
    await pedirComToken((headers) =>
      api.GET('/api/v1/setores/{setorId}/perguntas', { params: { path: { setorId } }, headers }),
    )
  ).data

/** POST /setores/:setorId/perguntas */
export const criarPergunta = async (setorId: number, dados: DadosPergunta) =>
  (
    await pedirComToken((headers) =>
      api.POST('/api/v1/setores/{setorId}/perguntas', {
        params: { path: { setorId } },
        body: dados,
        headers,
      }),
    )
  ).data

/** PATCH /perguntas/:id (com respostas gravadas, o tipo não muda: 409) */
export const editarPergunta = async (id: number, dados: DadosPergunta) =>
  (
    await pedirComToken((headers) =>
      api.PATCH('/api/v1/perguntas/{id}', { params: { path: { id } }, body: dados, headers }),
    )
  ).data

/** PUT /setores/:setorId/perguntas/ordem (os IDs de todas as perguntas do setor, na ordem nova) */
export const salvarOrdem = async (setorId: number, ids: number[]) => {
  await pedirComToken((headers) =>
    api.PUT('/api/v1/setores/{setorId}/perguntas/ordem', {
      params: { path: { setorId } },
      body: { ids },
      headers,
    }),
  )
}

/** PATCH /perguntas/:id/status */
export const alterarStatusPergunta = async (id: number, ativa: boolean) => {
  await pedirComToken((headers) =>
    api.PATCH('/api/v1/perguntas/{id}/status', { params: { path: { id } }, body: { ativa }, headers }),
  )
}

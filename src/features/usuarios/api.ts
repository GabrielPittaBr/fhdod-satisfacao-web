// Contas do painel, na API. Só o Super Admin (usuarios:gerenciar) lista e mexe nelas.
import { pedirComToken } from '@/features/auth/api'
import { api } from '@/lib/api/cliente'
import type { CorpoDe } from '@/lib/api/tipos'

export type DadosUsuario = CorpoDe<'/api/v1/usuarios', 'post'>

/** GET /usuarios (ativas e inativas, em ordem alfabética) */
export const listarUsuarios = async () =>
  (await pedirComToken((headers) => api.GET('/api/v1/usuarios', { headers }))).data

/** POST /usuarios (a conta e a senha provisória, que só aparece nesta resposta) */
export const criarUsuario = async (dados: DadosUsuario) =>
  (await pedirComToken((headers) => api.POST('/api/v1/usuarios', { body: dados, headers }))).data

/** PATCH /usuarios/:id (nome e perfil; ninguém muda o próprio perfil: 409) */
export const editarUsuario = async (id: number, dados: CorpoDe<'/api/v1/usuarios/{id}', 'patch'>) =>
  (
    await pedirComToken((headers) =>
      api.PATCH('/api/v1/usuarios/{id}', { params: { path: { id } }, body: dados, headers }),
    )
  ).data

/** PUT /usuarios/:id/setores (a lista substitui os setores de antes) */
export const definirSetores = async (id: number, setorIds: number[]) => {
  await pedirComToken((headers) =>
    api.PUT('/api/v1/usuarios/{id}/setores', { params: { path: { id } }, body: { setorIds }, headers }),
  )
}

/** PATCH /usuarios/:id/status (desativar derruba as sessões; ninguém desativa a própria conta: 409) */
export const alterarStatusUsuario = async (id: number, ativo: boolean) => {
  await pedirComToken((headers) =>
    api.PATCH('/api/v1/usuarios/{id}/status', { params: { path: { id } }, body: { ativo }, headers }),
  )
}

/** POST /usuarios/:id/redefinir-senha (a senha provisória nova, que só aparece nesta resposta) */
export const redefinirSenha = async (id: number) =>
  (
    await pedirComToken((headers) =>
      api.POST('/api/v1/usuarios/{id}/redefinir-senha', { params: { path: { id } }, headers }),
    )
  ).data.senhaProvisoria

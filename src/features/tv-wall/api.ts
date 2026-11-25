// TV Wall, na API. A TV não tem login: vale o token do link da tela, no cabeçalho X-Tv-Token. A gestão das
// telas é do painel, com a sessão de quem tem `tvwall:gerenciar`.
import { pedirComToken } from '@/features/auth/api'
import { api, pedir } from '@/lib/api/cliente'

/**
 * GET /tv/indicadores, com o token da tela (o que vem depois do # no link) no cabeçalho X-Tv-Token. Vai pelo
 * `pedir`, sem a sessão do painel: o 401 aqui quer dizer que a tela não está ativa, não que a sessão acabou.
 */
export const buscarIndicadoresTv = async (tokenDaTela: string) =>
  (await pedir(api.GET('/api/v1/tv/indicadores', { headers: { 'X-Tv-Token': tokenDaTela } }))).data

/** GET /tv-telas (ativas e desativadas, em ordem alfabética) */
export const listarTelas = async () =>
  (await pedirComToken((headers) => api.GET('/api/v1/tv-telas', { headers }))).data

/** POST /tv-telas: o token do link só vem nesta resposta. */
export const criarTela = async (nome: string) =>
  (await pedirComToken((headers) => api.POST('/api/v1/tv-telas', { body: { nome }, headers }))).data

/** PATCH /tv-telas/:id/status: desativada, a tela para de abrir na consulta seguinte da TV. */
export const alterarStatusTela = async (id: number, ativa: boolean) => {
  await pedirComToken((headers) =>
    api.PATCH('/api/v1/tv-telas/{id}/status', { params: { path: { id } }, body: { ativa }, headers }),
  )
}

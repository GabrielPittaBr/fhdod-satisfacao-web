// Rotas públicas da pesquisa, sem login. Só este arquivo conversa com a API.
import { api, pedir } from '@/lib/api/cliente'
import type { Complemento, EnvioResposta, PesquisaPublica, RespostaCriada } from '@/lib/api/tipos'

/** GET /publico/setores/:slug/pesquisa */
export const buscarPesquisa = async (slug: string): Promise<PesquisaPublica> =>
  (await pedir(api.GET('/api/v1/publico/setores/{slug}/pesquisa', { params: { path: { slug } } }))).data

/** POST /publico/setores/:slug/respostas */
export const enviarResposta = async (slug: string, corpo: EnvioResposta): Promise<RespostaCriada> =>
  (
    await pedir(
      api.POST('/api/v1/publico/setores/{slug}/respostas', { params: { path: { slug } }, body: corpo }),
    )
  ).data

/**
 * POST /publico/respostas/:id/complemento, com o token do envio no cabeçalho X-Complemento-Token.
 * `keepalive`: o navegador termina a requisição mesmo se a página fechar. É o caso do comentário que
 * vai sozinho quando a pessoa sai da tela do telefone sem decidir (`pagehide`, no useFluxoPesquisa).
 */
export async function enviarComplemento(
  respostaId: number,
  token: string,
  corpo: Complemento,
): Promise<void> {
  await pedir(
    api.POST('/api/v1/publico/respostas/{id}/complemento', {
      params: { path: { id: respostaId } },
      headers: { 'X-Complemento-Token': token },
      body: corpo,
      keepalive: true,
    }),
  )
}

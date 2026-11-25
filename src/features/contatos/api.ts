// Pedidos de retorno, na API. Exigem `contatos:ver`: o Super Admin e a Ouvidoria.
import { pedirComToken } from '@/features/auth/api'
import { api } from '@/lib/api/cliente'

/**
 * Pedidos por página, os mesmos 20 das respostas. Com mais que isso, a tela mostra "Anterior" e "Próxima":
 * sem pedir a página, a lista pararia nos 20 mais recentes sem avisar ninguém.
 */
const PEDIDOS_POR_PAGINA = 20

/** GET /contatos (do pedido mais recente para o mais antigo, com o telefone mascarado) */
export const listarContatos = (pagina: number) =>
  pedirComToken((headers) =>
    api.GET('/api/v1/contatos', { params: { query: { pagina, porPagina: PEDIDOS_POR_PAGINA } }, headers }),
  )

/** POST /contatos/:id/revelar-telefone (a API registra quem revelou e quando, a cada chamada) */
export const revelarTelefone = async (id: number) =>
  (
    await pedirComToken((headers) =>
      api.POST('/api/v1/contatos/{id}/revelar-telefone', { params: { path: { id } }, headers }),
    )
  ).data.telefone

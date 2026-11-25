// Acesso das telas do painel ainda simuladas.
//
// Ajuste provisório (ticket 05), que sai com os mocks no ticket 10: o login, a sessão e a troca de senha já
// são da API, e os mocks usam a sessão de verdade, a do /auth/me guardada em stores/sessao, no lugar de um
// token próprio. O token que chega aqui é o JWT da API, que o mock não tem como conferir: quem o confere é a
// API, no login, na renovação e no /auth/me.
import type { Permissao } from '@/lib/api/tipos'
import { useSessao } from '@/stores/sessao'
import { erros } from './rede'

export interface Contexto {
  usuarioId: number
  permissoes: Permissao[]
  /** null = todos os setores */
  setorIds: number[] | null
}

/**
 * As permissões e os setores da sessão real. Os ids dos setores são os da API: os setores simulados com o
 * mesmo id ficam visíveis para quem não enxerga todos.
 */
export function autenticar(_token: string): Contexto {
  const sessao = useSessao.getState().sessao
  if (!sessao) throw erros.naoAutenticado()
  return {
    usuarioId: sessao.usuario.id,
    permissoes: sessao.permissoes,
    setorIds: sessao.todosSetores ? null : sessao.setores.map((s) => s.id),
  }
}

export function exigir(contexto: Contexto, permissao: Permissao) {
  if (!contexto.permissoes.includes(permissao)) throw erros.semPermissao()
}

export function exigirSetor(contexto: Contexto, setorId: number) {
  if (contexto.setorIds && !contexto.setorIds.includes(setorId)) throw erros.semPermissao()
}

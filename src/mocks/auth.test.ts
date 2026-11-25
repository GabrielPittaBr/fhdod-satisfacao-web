import { afterEach, describe, expect, it } from 'vitest'
import type { Sessao } from '@/lib/api/tipos'
import { useSessao } from '@/stores/sessao'
import { autenticar, exigir, exigirSetor } from './auth'

// Ajuste provisório do ticket 05: as telas ainda simuladas usam a sessão real, a do /auth/me.
const sessao = (parcial: Partial<Sessao>): Sessao => ({
  usuario: {
    id: 3,
    nome: 'Paulo Souza',
    email: 'paulo@exemplo.com.br',
    perfil: 'GESTOR',
    trocarSenha: false,
  },
  permissoes: ['dashboard:ver', 'perguntas:gerenciar'],
  setores: [
    { id: 2, nome: 'Internação' },
    { id: 5, nome: 'Pronto Atendimento' },
  ],
  todosSetores: false,
  ...parcial,
})

afterEach(() => useSessao.setState({ token: null, sessao: null }))

describe('acesso das telas simuladas', () => {
  it('usa as permissões, os setores e o usuário da sessão real', () => {
    useSessao.setState({ token: 'jwt-da-api', sessao: sessao({}) })
    const contexto = autenticar('jwt-da-api')
    expect(contexto).toEqual({
      usuarioId: 3,
      permissoes: ['dashboard:ver', 'perguntas:gerenciar'],
      setorIds: [2, 5],
    })
    expect(() => exigir(contexto, 'perguntas:gerenciar')).not.toThrow()
    expect(() => exigir(contexto, 'usuarios:gerenciar')).toThrow(expect.objectContaining({ status: 403 }))
    expect(() => exigirSetor(contexto, 5)).not.toThrow()
    expect(() => exigirSetor(contexto, 1)).toThrow(expect.objectContaining({ status: 403 }))
  })

  it('quem enxerga todos os setores não tem filtro de setor', () => {
    useSessao.setState({ token: 'jwt', sessao: sessao({ setores: [], todosSetores: true }) })
    const contexto = autenticar('jwt')
    expect(contexto.setorIds).toBeNull()
    expect(() => exigirSetor(contexto, 99)).not.toThrow()
  })

  it('sem sessão, responde 401 como a API', () => {
    expect(() => autenticar('')).toThrow(expect.objectContaining({ status: 401 }))
  })
})

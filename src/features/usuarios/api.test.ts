import { beforeAll, describe, expect, it } from 'vitest'
import type { Usuario } from '@/lib/api/tipos'
import { erroDaApi, json, semConteudo, usarApiFalsa } from '@/test/api-falsa'

const falsa = usarApiFalsa()
let usuarios: typeof import('./api')
beforeAll(async () => {
  usuarios = await import('./api')
})

const MARTA: Usuario = {
  id: 4,
  nome: 'Marta Exemplo',
  email: 'marta@exemplo.com.br',
  perfil: 'GESTOR',
  ativo: true,
  trocarSenha: true,
  setorIds: [],
  ultimoLoginEm: null,
}
// senha de mentira, só para o teste
const PROVISORIA = 'teste-provisoria-1'

describe('usuários na API', () => {
  it('cria e devolve a conta com a senha provisória', async () => {
    falsa.rotas.set('POST /api/v1/usuarios', () =>
      json(201, { data: { usuario: MARTA, senhaProvisoria: PROVISORIA } }),
    )
    const dados = { nome: 'Marta Exemplo', email: 'marta@exemplo.com.br', perfil: 'GESTOR' } as const
    await expect(usuarios.criarUsuario(dados)).resolves.toEqual({
      usuario: MARTA,
      senhaProvisoria: PROVISORIA,
    })
    await falsa.conferirChamada('POST /api/v1/usuarios', dados)
  })

  it('define os setores com a lista inteira', async () => {
    falsa.rotas.set('PUT /api/v1/usuarios/4/setores', semConteudo)
    await expect(usuarios.definirSetores(4, [1, 3])).resolves.toBeUndefined()
    await falsa.conferirChamada('PUT /api/v1/usuarios/4/setores', { setorIds: [1, 3] })
  })

  it('redefine a senha e devolve só a senha provisória nova', async () => {
    falsa.rotas.set('POST /api/v1/usuarios/4/redefinir-senha', () =>
      json(200, { data: { senhaProvisoria: PROVISORIA } }),
    )
    await expect(usuarios.redefinirSenha(4)).resolves.toBe(PROVISORIA)
    await falsa.conferirChamada('POST /api/v1/usuarios/4/redefinir-senha')
  })

  it('o e-mail repetido, o próprio perfil e a própria conta chegam com a mensagem da API', async () => {
    falsa.rotas.set('POST /api/v1/usuarios', () =>
      erroDaApi(409, 'CONFLITO', 'Já existe um usuário com este e-mail.'),
    )
    falsa.rotas.set('PATCH /api/v1/usuarios/1', () =>
      erroDaApi(409, 'CONFLITO', 'Você não pode mudar o próprio perfil.'),
    )
    falsa.rotas.set('PATCH /api/v1/usuarios/1/status', () =>
      erroDaApi(409, 'CONFLITO', 'Você não pode desativar a própria conta.'),
    )

    await expect(
      usuarios.criarUsuario({ nome: 'Marta Exemplo', email: 'marta@exemplo.com.br', perfil: 'GESTOR' }),
    ).rejects.toMatchObject({ status: 409, message: 'Já existe um usuário com este e-mail.' })
    await expect(usuarios.editarUsuario(1, { perfil: 'GESTOR' })).rejects.toMatchObject({
      status: 409,
      message: 'Você não pode mudar o próprio perfil.',
    })
    await expect(usuarios.alterarStatusUsuario(1, false)).rejects.toMatchObject({
      status: 409,
      message: 'Você não pode desativar a própria conta.',
    })
  })
})

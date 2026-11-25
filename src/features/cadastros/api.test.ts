import { beforeAll, describe, expect, it } from 'vitest'
import type { Categoria, Turno } from '@/lib/api/tipos'
import { erroDaApi, json, usarApiFalsa } from '@/test/api-falsa'

const falsa = usarApiFalsa()
let cadastros: typeof import('./api')
beforeAll(async () => {
  cadastros = await import('./api')
})

const RECEPCAO: Categoria = { id: 2, nome: 'Recepção', ordem: 2, ativa: true }
const NOITE: Turno = { id: 3, nome: 'Noite', horaInicio: '19:00', horaFim: '07:00', ordem: 3 }

describe('categorias na API', () => {
  it('lista na ordem que a API devolve', async () => {
    falsa.rotas.set('GET /api/v1/categorias', () => json(200, { data: [RECEPCAO] }))
    await expect(cadastros.listarCategorias()).resolves.toEqual([RECEPCAO])
  })

  it('cria só com o nome', async () => {
    falsa.rotas.set('POST /api/v1/categorias', () => json(201, { data: RECEPCAO }))
    await expect(cadastros.criarCategoria('Recepção')).resolves.toEqual(RECEPCAO)
    await falsa.conferirChamada('POST /api/v1/categorias', { nome: 'Recepção' })
  })

  it('desativa mandando só a situação', async () => {
    falsa.rotas.set('PATCH /api/v1/categorias/2', () => json(200, { data: { ...RECEPCAO, ativa: false } }))
    await expect(cadastros.editarCategoria(2, { ativa: false })).resolves.toMatchObject({ ativa: false })
    await falsa.conferirChamada('PATCH /api/v1/categorias/2', { ativa: false })
  })

  it('o nome repetido chega com o conflito e a mensagem da API', async () => {
    const mensagem = 'Já existe uma categoria com este nome.'
    falsa.rotas.set('PATCH /api/v1/categorias/2', () => erroDaApi(409, 'CONFLITO', mensagem))
    await expect(cadastros.editarCategoria(2, { nome: 'RECEPÇÃO' })).rejects.toMatchObject({
      status: 409,
      message: mensagem,
    })
  })
})

describe('turnos na API', () => {
  it('cria e edita com o turno inteiro', async () => {
    const dados = { nome: 'Noite', horaInicio: '19:00', horaFim: '07:00' }
    falsa.rotas.set('PATCH /api/v1/turnos/3', () => json(200, { data: NOITE }))
    await expect(cadastros.editarTurno(3, dados)).resolves.toEqual(NOITE)
    await falsa.conferirChamada('PATCH /api/v1/turnos/3', dados)
  })

  it('o horário recusado volta com o campo, para o formulário', async () => {
    const detalhes = [{ campo: 'horaFim', mensagem: 'O fim precisa ser diferente do início' }]
    falsa.rotas.set('POST /api/v1/turnos', () => erroDaApi(400, 'VALIDACAO', 'Dados inválidos', detalhes))
    await expect(
      cadastros.criarTurno({ nome: 'Noite', horaInicio: '07:00', horaFim: '07:00' }),
    ).rejects.toMatchObject({ status: 400, detalhes })
  })
})

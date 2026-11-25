import { beforeAll, describe, expect, it } from 'vitest'
import type { Setor } from '@/lib/api/tipos'
import { erroDaApi, json, semConteudo, usarApiFalsa } from '@/test/api-falsa'

const falsa = usarApiFalsa()
let setores: typeof import('./api')
beforeAll(async () => {
  setores = await import('./api')
})

const RAIO_X: Setor = { id: 5, nome: 'Raio-X', slug: 'raio-x', descricao: null, ativo: true }

describe('setores na API', () => {
  it('lista os setores que a sessão enxerga, com o token', async () => {
    falsa.rotas.set('GET /api/v1/setores', () => json(200, { data: [RAIO_X] }))
    await expect(setores.listarSetores()).resolves.toEqual([RAIO_X])
    await falsa.conferirChamada('GET /api/v1/setores')
  })

  it('cria com o corpo do formulário e devolve o setor gravado', async () => {
    falsa.rotas.set('POST /api/v1/setores', () => json(201, { data: RAIO_X }))
    const dados = { nome: 'Raio-X', slug: 'raio-x', descricao: '' }
    await expect(setores.criarSetor(dados)).resolves.toEqual(RAIO_X)
    await falsa.conferirChamada('POST /api/v1/setores', dados)
  })

  it('edita pelo ID', async () => {
    falsa.rotas.set('PATCH /api/v1/setores/5', () =>
      json(200, { data: { ...RAIO_X, nome: 'Raio-X e Imagem' } }),
    )
    await expect(setores.editarSetor(5, { nome: 'Raio-X e Imagem' })).resolves.toMatchObject({
      nome: 'Raio-X e Imagem',
    })
    await falsa.conferirChamada('PATCH /api/v1/setores/5', { nome: 'Raio-X e Imagem' })
  })

  it('desativa com o 204 da API', async () => {
    falsa.rotas.set('PATCH /api/v1/setores/5/status', semConteudo)
    await expect(setores.alterarStatusSetor(5, false)).resolves.toBeUndefined()
    await falsa.conferirChamada('PATCH /api/v1/setores/5/status', { ativo: false })
  })

  it('o endereço repetido chega com o conflito e a mensagem da API', async () => {
    const mensagem = 'Já existe um setor com este endereço. Escolha outro.'
    falsa.rotas.set('POST /api/v1/setores', () => erroDaApi(409, 'CONFLITO', mensagem))
    await expect(setores.criarSetor({ nome: 'Raio-X', slug: 'raio-x' })).rejects.toMatchObject({
      status: 409,
      codigo: 'CONFLITO',
      message: mensagem,
    })
  })
})

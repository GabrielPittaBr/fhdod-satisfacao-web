import { beforeAll, describe, expect, it } from 'vitest'
import type { Pergunta } from '@/lib/api/tipos'
import { erroDaApi, json, semConteudo, usarApiFalsa } from '@/test/api-falsa'

const falsa = usarApiFalsa()
let perguntas: typeof import('./api')
beforeAll(async () => {
  perguntas = await import('./api')
})

const PERGUNTA: Pergunta = {
  id: 9,
  setorId: 3,
  categoriaId: 2,
  texto: 'Como foi o atendimento na recepção?',
  tipo: 'ESCALA_1_5',
  opcoes: null,
  ordem: 1,
  ativa: true,
  temRespostas: false,
}
const DADOS = { texto: PERGUNTA.texto, categoriaId: 2, tipo: 'ESCALA_1_5', opcoes: null } as const

describe('perguntas do setor na API', () => {
  it('lista as do setor pedido', async () => {
    falsa.rotas.set('GET /api/v1/setores/3/perguntas', () => json(200, { data: [PERGUNTA] }))
    await expect(perguntas.listarPerguntas(3)).resolves.toEqual([PERGUNTA])
  })

  it('cria no setor pedido', async () => {
    falsa.rotas.set('POST /api/v1/setores/3/perguntas', () => json(201, { data: PERGUNTA }))
    await expect(perguntas.criarPergunta(3, DADOS)).resolves.toEqual(PERGUNTA)
    await falsa.conferirChamada('POST /api/v1/setores/3/perguntas', DADOS)
  })

  it('salva a ordem com os IDs de todas as perguntas', async () => {
    falsa.rotas.set('PUT /api/v1/setores/3/perguntas/ordem', semConteudo)
    await expect(perguntas.salvarOrdem(3, [11, 9, 10])).resolves.toBeUndefined()
    await falsa.conferirChamada('PUT /api/v1/setores/3/perguntas/ordem', { ids: [11, 9, 10] })
  })

  it('ativa e desativa', async () => {
    falsa.rotas.set('PATCH /api/v1/perguntas/9/status', semConteudo)
    await expect(perguntas.alterarStatusPergunta(9, false)).resolves.toBeUndefined()
    await falsa.conferirChamada('PATCH /api/v1/perguntas/9/status', { ativa: false })
  })

  it('o tipo da pergunta com respostas chega com o conflito e a mensagem da API', async () => {
    const mensagem = 'Esta pergunta já tem respostas, então o tipo não pode mudar.'
    falsa.rotas.set('PATCH /api/v1/perguntas/9', () => erroDaApi(409, 'CONFLITO', mensagem))
    await expect(perguntas.editarPergunta(9, { ...DADOS, tipo: 'SIM_NAO' })).rejects.toMatchObject({
      status: 409,
      message: mensagem,
    })
  })

  it('o setor de fora chega como o 403 da API, sem renovar a sessão', async () => {
    const mensagem = 'Você não tem acesso a este setor.'
    falsa.rotas.set('GET /api/v1/setores/4/perguntas', () => erroDaApi(403, 'SEM_PERMISSAO', mensagem))
    await expect(perguntas.listarPerguntas(4)).rejects.toMatchObject({ status: 403, message: mensagem })
    await falsa.conferirChamada('GET /api/v1/setores/4/perguntas')
  })
})

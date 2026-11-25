import { describe, expect, it } from 'vitest'
import { ErroApi, MENSAGEM_SEM_CONEXAO, mensagemGeral } from './erro'

const PADRAO = 'Não deu para carregar estes dados.'

describe('mensagem geral de um erro', () => {
  it('na validação, a mensagem do primeiro campo, que diz o que fazer', () => {
    const erro = new ErroApi(400, 'VALIDACAO', 'Dados inválidos', [
      {
        campo: 'granularidade',
        mensagem: 'Escolha um período de até 366 dias ou veja por semana ou por mês',
      },
    ])
    expect(mensagemGeral(erro, PADRAO)).toBe(
      'Escolha um período de até 366 dias ou veja por semana ou por mês',
    )
  })

  it('nos outros erros da API, a mensagem dela', () => {
    const erro = new ErroApi(403, 'SEM_PERMISSAO', 'Você não tem permissão para isso.')
    expect(mensagemGeral(erro, PADRAO)).toBe('Você não tem permissão para isso.')
  })

  it('sem rede, a de sem conexão; no erro do servidor, o texto da tela', () => {
    expect(mensagemGeral(new ErroApi(0, 'SEM_CONEXAO', MENSAGEM_SEM_CONEXAO), PADRAO)).toBe(
      MENSAGEM_SEM_CONEXAO,
    )
    expect(mensagemGeral(new ErroApi(500, 'ERRO_INTERNO', 'Erro inesperado.'), PADRAO)).toBe(PADRAO)
  })
})

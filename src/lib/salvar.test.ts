import type { UseFormReturn } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import { ErroApi, MENSAGEM_SEM_CONEXAO } from '@/lib/api/erro'
import { aplicarErroDaApi } from './salvar'

/** Só o que o aplicarErroDaApi usa do formulário: os campos e o setError. */
function formulario(valores: Record<string, unknown>) {
  const erros: { campo: string; mensagem?: string; foco: boolean }[] = []
  const form = {
    getValues: () => valores,
    setError: (campo: string, erro: { message?: string }, opcoes?: { shouldFocus?: boolean }) =>
      erros.push({ campo, mensagem: erro.message, foco: opcoes?.shouldFocus ?? false }),
  } as unknown as UseFormReturn<Record<string, unknown>>
  return { form, erros }
}

const SETOR = { nome: '', slug: '', descricao: '' }

describe('erro da API no formulário', () => {
  it('a validação vai para o campo indicado, com o foco no primeiro', () => {
    const { form, erros } = formulario(SETOR)
    aplicarErroDaApi(
      form,
      new ErroApi(400, 'VALIDACAO', 'Dados inválidos', [
        { campo: 'nome', mensagem: 'Use no máximo 100 caracteres' },
        { campo: 'slug', mensagem: 'Use só letras minúsculas, números e hífen' },
      ]),
    )
    expect(erros).toEqual([
      { campo: 'nome', mensagem: 'Use no máximo 100 caracteres', foco: true },
      { campo: 'slug', mensagem: 'Use só letras minúsculas, números e hífen', foco: false },
    ])
  })

  it('o conflito vira a mensagem geral, com o texto da API', () => {
    const { form, erros } = formulario(SETOR)
    aplicarErroDaApi(
      form,
      new ErroApi(409, 'CONFLITO', 'Já existe um setor com este endereço. Escolha outro.'),
    )
    expect(erros).toEqual([
      { campo: 'root', mensagem: 'Já existe um setor com este endereço. Escolha outro.', foco: false },
    ])
  })

  it('a validação de um campo que não está na tela mostra a mensagem do campo, não "Dados inválidos"', () => {
    const { form, erros } = formulario(SETOR)
    aplicarErroDaApi(
      form,
      new ErroApi(400, 'VALIDACAO', 'Dados inválidos', [
        { campo: 'ids', mensagem: 'A lista precisa ter todas as perguntas do setor' },
      ]),
    )
    expect(erros).toEqual([
      { campo: 'root', mensagem: 'A lista precisa ter todas as perguntas do setor', foco: false },
    ])
  })

  it('sem rede ou com erro do servidor, a mensagem geral não traz detalhe técnico', () => {
    const semRede = formulario(SETOR)
    aplicarErroDaApi(semRede.form, new ErroApi(0, 'SEM_CONEXAO', MENSAGEM_SEM_CONEXAO))
    expect(semRede.erros[0]?.mensagem).toBe(MENSAGEM_SEM_CONEXAO)

    const servidor = formulario(SETOR)
    aplicarErroDaApi(
      servidor.form,
      new ErroApi(500, 'ERRO_INTERNO', 'Erro inesperado. Tente de novo em instantes.'),
    )
    expect(servidor.erros[0]?.mensagem).toBe('Não foi possível concluir. Tente de novo.')
  })
})

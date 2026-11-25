import type { components } from './schema'

type DetalheErro = components['schemas']['DetalheErro']

/** Os sete códigos do contrato e o da falta de rede, que não chega a ser uma resposta da API. */
export type CodigoErro = components['schemas']['CodigoDeErro'] | 'SEM_CONEXAO'

export const MENSAGEM_SEM_CONEXAO = 'Sem conexão. Confira a internet e tente de novo.'

/**
 * Erro no formato padrão da API: { erro: { codigo, mensagem, detalhes, requestId } } + status HTTP.
 * Sem rede, o status é 0 e não há `requestId`, porque a chamada não chegou à API.
 */
export class ErroApi extends Error {
  readonly status: number
  readonly codigo: CodigoErro
  readonly detalhes: DetalheErro[]
  /** O mesmo do cabeçalho `X-Request-Id` e do log da API; vazio quando a chamada não chegou lá. */
  readonly requestId: string

  constructor(
    status: number,
    codigo: CodigoErro,
    mensagem: string,
    detalhes: DetalheErro[] = [],
    requestId = '',
  ) {
    super(mensagem)
    this.name = 'ErroApi'
    this.status = status
    this.codigo = codigo
    this.detalhes = detalhes
    this.requestId = requestId
  }
}

/** Texto para mostrar ao usuário, sem detalhe técnico. */
export function mensagemDeErro(erro: unknown, padrao = 'Não foi possível concluir. Tente de novo.') {
  if (erro instanceof ErroApi && erro.status === 0) return MENSAGEM_SEM_CONEXAO
  // 5xx: erro do servidor ou do caminho até ele; a mensagem não diz nada de útil a quem está na tela
  if (erro instanceof ErroApi && erro.status < 500) return erro.message
  return padrao
}

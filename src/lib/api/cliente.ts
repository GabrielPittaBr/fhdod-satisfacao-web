// Cliente HTTP da API, tipado pelo contrato (schema.d.ts, gerado por `pnpm api:tipos`).
// Só os api.ts das features o usam: componentes, páginas e hooks nunca o chamam direto.
import createClient from 'openapi-fetch'
import { ErroApi, MENSAGEM_SEM_CONEXAO, type CodigoErro } from './erro'
import type { components, paths } from './schema'

type CorpoDeErro = components['schemas']['Erro']

/**
 * As rotas do contrato já começam com /api, e a API fica no mesmo domínio do site: o Caddy repassa o /api
 * em produção, e o servidor do Vite, ao desenvolver. Por isso o endereço base é a origem da própria página.
 */
export function criarCliente(opcoes: { baseUrl?: string; fetch?: typeof globalThis.fetch } = {}) {
  return createClient<paths>({
    baseUrl: opcoes.baseUrl ?? globalThis.location?.origin ?? '',
    fetch: opcoes.fetch,
  })
}

export const api = criarCliente()

/** O que toda chamada do openapi-fetch devolve: o corpo do sucesso ou o do erro, e a resposta. */
interface Resultado {
  data?: unknown
  error?: unknown
  response: Response
}

/**
 * Espera a chamada e devolve o corpo do sucesso. Qualquer falha vira o `ErroApi` que as telas já tratam:
 * o erro da API com o status, o código, a mensagem, os detalhes e o `requestId` dela; a falta de rede,
 * com status 0. Uso: `(await pedir(api.GET('/api/v1/...', {...}))).data`.
 */
export async function pedir<R extends Resultado>(chamada: Promise<R>): Promise<NonNullable<R['data']>> {
  let resultado: R
  try {
    resultado = await chamada
  } catch (erro) {
    throw erroDeRede(erro)
  }
  if (!resultado.response.ok) throw erroDaResposta(resultado.response, resultado.error)
  return resultado.data as NonNullable<R['data']>
}

/** O fetch rejeita só quando não há resposta: sem internet, DNS, servidor fora do ar ou CORS. */
function erroDeRede(erro: unknown): unknown {
  // cancelamento pedido pelo próprio front (TanStack Query): não é falha de rede
  if (erro instanceof DOMException && erro.name === 'AbortError') return erro
  return new ErroApi(0, 'SEM_CONEXAO', MENSAGEM_SEM_CONEXAO)
}

const CODIGOS_DO_CONTRATO: readonly CodigoErro[] = [
  'VALIDACAO',
  'NAO_AUTENTICADO',
  'SEM_PERMISSAO',
  'NAO_ENCONTRADO',
  'CONFLITO',
  'LIMITE_ATINGIDO',
  'ERRO_INTERNO',
]

function ehCorpoDeErro(corpo: unknown): corpo is CorpoDeErro {
  const erro = (corpo as Partial<CorpoDeErro> | null)?.erro
  return (
    typeof erro === 'object' &&
    erro !== null &&
    CODIGOS_DO_CONTRATO.includes(erro.codigo as CodigoErro) &&
    typeof erro.mensagem === 'string'
  )
}

/** Resposta de erro, da API ou de quem está no caminho (um proxy sem a API atrás devolve 502 sem JSON). */
export function erroDaResposta(resposta: Response, corpo: unknown): ErroApi {
  const requestIdDoCabecalho = resposta.headers.get('X-Request-Id') ?? ''
  if (ehCorpoDeErro(corpo)) {
    const { codigo, mensagem, detalhes, requestId } = corpo.erro
    return new ErroApi(
      resposta.status,
      codigo,
      mensagem,
      Array.isArray(detalhes) ? detalhes : [],
      requestId || requestIdDoCabecalho,
    )
  }
  return new ErroApi(
    resposta.status,
    'ERRO_INTERNO',
    'Erro inesperado. Tente de novo em instantes.',
    [],
    requestIdDoCabecalho,
  )
}

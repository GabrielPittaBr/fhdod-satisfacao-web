// Tipos do contrato da API: todos vêm do schema.d.ts, gerado do openapi.json por `pnpm api:tipos`. Aqui eles
// ganham os nomes que as telas usam; nenhum é escrito à mão.
import type { components, paths } from './schema'

type Contrato = components['schemas']

// Listas de valores que a pesquisa e a sessão usam: as mesmas do contrato, que o painel também lê.
export type Canal = Contrato['Canal']
export type Classificacao = Contrato['Classificacao']
export type TipoPergunta = Contrato['TipoPergunta']
export type TipoComentario = Contrato['TipoComentario']
export type Perfil = Contrato['Perfil']
export type Permissao = Contrato['Permissao']

export type BaseData = Contrato['BaseData']
export type Granularidade = Contrato['Granularidade']
export type StatusRetorno = Contrato['StatusRetorno']

/** O envelope das respostas de sucesso da API. Só os dados simulados da TV ainda o usam. */
export interface Envelope<T> {
  data: T
}

/** A página de uma lista: `meta.total` conta todas as páginas. */
export type Meta = Contrato['Meta']

export type DetalheErro = Contrato['DetalheErro']

/** O corpo JSON que uma rota do contrato recebe: `CorpoDe<'/api/v1/setores', 'post'>`. */
export type CorpoDe<Caminho extends keyof paths, Metodo extends 'post' | 'put' | 'patch'> =
  NonNullable<paths[Caminho][Metodo]> extends {
    requestBody?: { content: { 'application/json': infer Corpo } }
  }
    ? Corpo
    : never

/** Os filtros que uma rota GET do contrato aceita na query string: `ConsultaDe<'/api/v1/respostas'>`. */
export type ConsultaDe<Caminho extends keyof paths> =
  NonNullable<paths[Caminho]['get']> extends { parameters: { query?: infer Consulta } }
    ? NonNullable<Consulta>
    : never

// ---------- Cadastros: do contrato gerado ----------

export type Setor = Contrato['Setor']
export type Categoria = Contrato['Categoria']
/** `horaInicio` e `horaFim` em "HH:mm"; o fim é menor que o início quando o turno atravessa a meia-noite. */
export type Turno = Contrato['Turno']
/** Com `temRespostas`, o tipo não pode mais mudar. */
export type Pergunta = Contrato['Pergunta']
export type Usuario = Contrato['Usuario']

// ---------- Autenticação: do contrato gerado ----------

/** Quem está logado, o que o perfil permite e quais setores enxerga (`setores` vazio com `todosSetores`). */
export type Sessao = Contrato['Sessao']

// ---------- Pesquisa pública: do contrato gerado ----------

export type PerguntaPublica = Contrato['PerguntaPublica']
export type PesquisaPublica = Contrato['PesquisaPublica']
export type ItemEnvio = Contrato['ItemEnvio']
/** `site` é o campo isca: invisível para pessoas e sempre vazio quando quem envia é uma delas. */
export type EnvioResposta = Contrato['EnvioResposta']
export type RespostaCriada = Contrato['RespostaCriada']
export type Complemento = Contrato['Complemento']

// ---------- Painel: do contrato gerado ----------

/**
 * Os filtros de todos os blocos do dashboard: o período (`inicio` e `fim`, incluídos) comparado com a `base`
 * (o dia do atendimento ou o do envio), o setor, o turno e o canal.
 */
export type FiltrosDashboard = ConsultaDe<'/api/v1/dashboard/resumo'>
export type Resumo = Contrato['Resumo']
export type NpsSetor = Contrato['NpsSetor']
/** `periodo` é o primeiro dia: o próprio dia, a segunda-feira da semana ou o dia 1 do mês. */
export type PontoEvolucao = Contrato['PontoEvolucao']
export type IndicadorCategoria = Contrato['IndicadorCategoria']
export type ItemRanking = Contrato['ItemRanking']
export type Ranking = Contrato['Ranking']
export type ComentarioRecente = Contrato['ComentarioRecente']

/** Os filtros do dashboard, todos opcionais, mais a classificação, o comentário, o retorno, a página e a ordem. */
export type FiltrosRespostas = ConsultaDe<'/api/v1/respostas'>
export type RespostaResumo = Contrato['RespostaResumo']
/** A `classificacao` vem pronta da API, só nas notas de 1 a 5. */
export type ItemResposta = Contrato['ItemResposta']
/** O telefone do `contato` vem mascarado; o número completo, só no "Revelar telefone". */
export type RespostaDetalhe = Contrato['RespostaDetalhe']
export type PedidoRetorno = Contrato['PedidoRetorno']

// ---------- TV Wall: do contrato gerado ----------

/** Uma TV do hospital. O token do link não volta na lista: só aparece ao criar a tela. */
export type TelaTv = Contrato['TelaTv']
/** Os números gerais da TV, de todos os setores: só contagens e médias, sem comentário nem dado pessoal. */
export type IndicadoresTv = Contrato['IndicadoresTv']
